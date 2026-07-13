import { NextResponse } from 'next/server';
import mammoth from 'mammoth';
import { extractText, getDocumentProxy } from 'unpdf';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ success: false, error: "No file received" }, { status: 400 });
    }

    const filename = file.name || "resume.pdf";
    const filenameLower = filename.toLowerCase();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let text = "";

    // Parse file based on type
    if (filenameLower.endsWith(".pdf") || file.type === "application/pdf") {
      try {
        const uint8Array = new Uint8Array(arrayBuffer);
        const pdf = await getDocumentProxy(uint8Array);
        const { text: pdfText } = await extractText(pdf, { mergePages: true });
        text = pdfText || "";
        console.log("[Learnova API] Successfully extracted text using unpdf");
      } catch (err) {
        console.error("[Learnova API] unpdf PDF parse error:", err.message);
      }
    } else if (
      filenameLower.endsWith(".docx") ||
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      try {
        const result = await mammoth.extractRawText({ buffer: buffer });
        text = result.value || "";
        console.log("[Learnova API] Successfully extracted text using mammoth");
      } catch (err) {
        console.error("[Learnova API] mammoth DOCX parse error:", err.message);
      }
    }

    // Last resort: try reading raw UTF-8 text (e.g. plain text CVs)
    if (!text || !text.trim()) {
      text = buffer.toString("utf8");
    }

    // Clean up binary/non-printable characters
    text = text.replace(/[^\x20-\x7E\s]/g, " ");
    const textLower = text.toLowerCase();

    // Check for Gemini API key to run LLM-powered resume parsing
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (apiKey && text.trim().length > 100) {
      console.log("[Learnova API] Using Gemini LLM to parse resume text...");
      const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
      
      const prompt = `Analyze the following resume text and extract a candidate academic profile. 
You must output a raw JSON object with the following keys and exact value formats. Do not wrap in markdown \`\`\`json blocks.
{
  "name": "Candidate's Full Name (or 'Verified Candidate' if missing)",
  "age": "One of: '16-20', '21-30', '31-40', '41-50', '50+' (educated guess based on experience/graduation years)",
  "education": "One of: 'High School', 'Bachelor\\'s degree', 'Master\\'s degree', 'Other / Professional'",
  "field": "One of: 'Technology & AI', 'Business & Management', 'Law & Public Policy', 'Healthcare & Sciences', 'Creative Design & UX'",
  "experience": "One of: 'No experience', '1–2 years', '3–5 years', '5+ years'",
  "goal": "One of: 'Get promoted', 'Switch careers', 'Start a business', 'Academic upgrade'",
  "format": "One of: 'On-campus', 'Hybrid', 'Online', 'Weekend / Evening'",
  "budget": "One of: 'Low budget / affordable options only', 'Moderate budget (AED 30k - 60k)', 'Premium / international options', 'Open / corporate sponsored'"
}

Resume Text:
${text}`;

      for (const model of modelsToTry) {
        try {
          const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: prompt }] }]
            })
          });
          if (res.ok) {
            const data = await res.json();
            let parsedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
            parsedText = parsedText.replace(/```json/g, '').replace(/```/g, '').trim();
            const profile = JSON.parse(parsedText);
            
            // Format check defaults
            if (!profile.name) profile.name = "Verified Candidate";
            if (!profile.age) profile.age = "21-30";
            if (!profile.education) profile.education = "Bachelor's degree";
            if (!profile.field) profile.field = "Technology & AI";
            
            return NextResponse.json({
              success: true,
              profile: profile
            });
          }
        } catch (err) {
          console.warn(`[Learnova API] Failed parsing with ${model}:`, err.message);
        }
      }
    }

    // --- Fallback Heuristic Parser ---
    // --- Name Detection ---
    let name = "Verified Candidate";
    const rawLines = text.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);

    for (let i = 0; i < Math.min(rawLines.length, 8); i++) {
      const line = rawLines[i];
      if (
        line.includes("@") ||
        line.includes(".com") ||
        line.includes("http") ||
        line.includes("|") ||
        line.match(/\d{4,}/) ||
        /^(resume|cv|curriculum|vitae|contact|profile|summary|education|experience|skills|about|projects|languages|objectives)/i.test(line) ||
        line.length < 3 ||
        line.length > 40
      ) {
        continue;
      }
      if (/^[a-zA-Z\s.-]+$/.test(line)) {
        name = line;
        break;
      }
    }

    // --- Build Profile ---
    const profile = {
      name: name,
      age: "21-30",
      education: "Bachelor's degree",
      field: "Technology & AI"
    };

    // Age Detection
    const ageMatch = textLower.match(/(?:age|dob|born|birth)[\s:-]*(\d{2})/i) || textLower.match(/\b(1[89]|[2345]\d)\b/);
    if (ageMatch) {
      const ageNum = parseInt(ageMatch[1]);
      if (ageNum >= 16 && ageNum <= 20) profile.age = "16-20";
      else if (ageNum >= 21 && ageNum <= 30) profile.age = "21-30";
      else if (ageNum >= 31 && ageNum <= 40) profile.age = "31-40";
      else if (ageNum >= 41 && ageNum <= 50) profile.age = "41-50";
      else if (ageNum > 50) profile.age = "50+";
    }

    // Education Detection
    if (textLower.includes("phd") || textLower.includes("doctorate") || textLower.includes("ph.d")) {
      profile.education = "Other / Professional";
    } else if (textLower.includes("master") || textLower.includes("msc") || textLower.includes("mba") || textLower.includes("m.s") || textLower.includes("postgraduate")) {
      profile.education = "Master's degree";
    } else if (textLower.includes("bachelor") || textLower.includes("bsc") || textLower.includes("b.a") || textLower.includes("b.s") || textLower.includes("undergraduate")) {
      profile.education = "Bachelor's degree";
    } else if (textLower.includes("high school") || textLower.includes("diploma") || textLower.includes("secondary")) {
      profile.education = "High School";
    }

    // Field of Interest Detection
    if (textLower.includes("computer") || textLower.includes("software") || textLower.includes("tech") || textLower.includes("data science") || textLower.includes("artificial intelligence") || textLower.includes("developer")) {
      profile.field = "Technology & AI";
    } else if (textLower.includes("business") || textLower.includes("mba") || textLower.includes("finance") || textLower.includes("economics") || textLower.includes("accounting") || textLower.includes("management")) {
      profile.field = "Business & Management";
    } else if (textLower.includes("law") || textLower.includes("legal") || textLower.includes("policy") || textLower.includes("public sector") || textLower.includes("governance")) {
      profile.field = "Law & Public Policy";
    } else if (textLower.includes("health") || textLower.includes("medicine") || textLower.includes("clinic") || textLower.includes("doctor") || textLower.includes("science")) {
      profile.field = "Healthcare & Sciences";
    }

    return NextResponse.json({
      success: true,
      profile: profile
    });

  } catch (err) {
    console.error('[Learnova API] CV parse error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
