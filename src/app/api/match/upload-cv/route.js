import { NextResponse } from 'next/server';
import { createRequire } from 'module';
import mammoth from 'mammoth';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

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

    // 1. Attempt to run ex.py Python extractor
    const tempDir = path.join(process.cwd(), 'temp_uploads');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    const tempFilePath = path.join(tempDir, `${Date.now()}_${filename}`);
    fs.writeFileSync(tempFilePath, buffer);

    try {
      const pythonPath = `c:\\Users\\iftkh\\Downloads\\Sapiomatch-mergeed-V1-main\\.venv\\Scripts\\python.exe`;
      const scriptPath = `c:\\Users\\iftkh\\Downloads\\Sapiomatch-mergeed-V1-main\\ex.py`;
      
      const { stdout } = await execAsync(`"${pythonPath}" "${scriptPath}" "${tempFilePath}"`);
      const parsedData = JSON.parse(stdout);
      if (parsedData.raw_text) {
        text = parsedData.raw_text;
        console.log("[SapioMatch API] Successfully extracted text using ex.py");
      }
    } catch (err) {
      console.error("[SapioMatch API] Python ex.py extractor error, falling back to node parsers:", err.message);
    } finally {
      try {
        if (fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
        }
      } catch (cleanupErr) {
        console.error("[SapioMatch API] Temp file cleanup error:", cleanupErr.message);
      }
    }

    // 2. Node-based Fallback if ex.py failed or returned empty text
    if (!text || !text.trim()) {
      if (filenameLower.endsWith(".pdf") || file.type === "application/pdf") {
        try {
          let pdfFn = pdfParse;
          if (pdfFn && typeof pdfFn.default === 'function') {
            pdfFn = pdfFn.default;
          }
          if (typeof pdfFn === 'function') {
            const result = await pdfFn(buffer);
            text = result.text;
          } else {
            throw new Error("pdf-parse is not loaded as a function");
          }
        } catch (err) {
          console.error("Standard PDF parse error:", err.message);
          try {
            const pdfParseModule = await import('pdf-parse');
            let pdfFn2 = pdfParseModule.default || pdfParseModule;
            if (typeof pdfFn2 === 'function') {
              const result = await pdfFn2(buffer);
              text = result.text;
            } else {
              throw new Error("Dynamic import of pdf-parse is not a function");
            }
          } catch (innerErr) {
            console.error("Secondary PDF parse error:", innerErr.message);
          }
        }
      } else if (
        filenameLower.endsWith(".docx") || 
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        try {
          const result = await mammoth.extractRawText({ buffer: buffer });
          text = result.value;
        } catch (err) {
          console.error("Error parsing DOCX:", err.message);
        }
      }

      if (!text || !text.trim()) {
        text = buffer.toString("utf8");
      }
    }

    // Clean up binary characters
    text = text.replace(/[^\x20-\x7E\s]/g, " ");
    const textLower = text.toLowerCase();

    // 0. Name Detection
    let name = "Verified Candidate"; // Default fallback
    const rawLines = text.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);
    
    // Look at first few lines (up to 8 lines) to find a candidate name
    for (let i = 0; i < Math.min(rawLines.length, 8); i++) {
      const line = rawLines[i];
      // Skip if line has email, phone, website, or common section headers
      if (
        line.includes("@") ||
        line.includes(".com") ||
        line.includes("http") ||
        line.includes("|") ||
        line.match(/\d{4,}/) || // Skip lines with long numbers (like phone numbers or zip codes)
        /^(resume|cv|curriculum|vitae|contact|profile|summary|education|experience|skills|about|projects|languages|objectives)/i.test(line) ||
        line.length < 3 ||
        line.length > 40
      ) {
        continue;
      }
      // First line that matches basic name criteria (usually 2 or 3 words, letters, spaces, dots, hyphens only)
      if (/^[a-zA-Z\s.-]+$/.test(line)) {
        name = line;
        break;
      }
    }

    // Default parsed candidate profile mapping to mockQuestions options
    const profile = {
      name: name,
      age: "21-30",
      education: "Bachelor's degree",
      field: "Technology & AI"
    };

    // 1. Age Detection
    const ageMatch = textLower.match(/(?:age|dob|born|birth)[\s:-]*(\d{2})/i) || textLower.match(/\b(1[89]|[2345]\d)\b/);
    if (ageMatch) {
      const ageNum = parseInt(ageMatch[1]);
      if (ageNum >= 16 && ageNum <= 20) profile.age = "16-20";
      else if (ageNum >= 21 && ageNum <= 30) profile.age = "21-30";
      else if (ageNum >= 31 && ageNum <= 40) profile.age = "31-40";
      else if (ageNum >= 41 && ageNum <= 50) profile.age = "41-50";
      else if (ageNum > 50) profile.age = "50+";
    }

    // 2. Education Detection
    if (textLower.includes("phd") || textLower.includes("doctorate") || textLower.includes("ph.d")) {
      profile.education = "Other / Professional";
    } else if (textLower.includes("master") || textLower.includes("msc") || textLower.includes("mba") || textLower.includes("m.s") || textLower.includes("postgraduate")) {
      profile.education = "Master's degree";
    } else if (textLower.includes("bachelor") || textLower.includes("bsc") || textLower.includes("b.a") || textLower.includes("b.s") || textLower.includes("undergraduate")) {
      profile.education = "Bachelor's degree";
    } else if (textLower.includes("high school") || textLower.includes("diploma") || textLower.includes("secondary")) {
      profile.education = "High School";
    }

    // 3. Field of Interest Detection
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
    console.error('[SapioMatch API] CV parse error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
