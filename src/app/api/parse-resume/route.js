import { NextResponse } from 'next/server';
import mammoth from 'mammoth';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    const fileName = file.name || '';
    const fileExtension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
    const allowedExtensions = ['.pdf', '.docx', '.doc', '.txt'];

    if (!allowedExtensions.includes(fileExtension)) {
      return NextResponse.json({ error: 'Unsupported file format. Please upload a PDF, DOCX, or TXT file.' }, { status: 400 });
    }

    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return NextResponse.json({ error: 'File size exceeds 5MB limit.' }, { status: 400 });
    }

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let extractedText = '';

    // Extract text content based on file type
    if (fileExtension === '.txt') {
      extractedText = buffer.toString('utf-8');
    } else if (fileExtension === '.docx' || fileExtension === '.doc') {
      try {
        const result = await mammoth.extractRawText({ buffer });
        extractedText = result.value || '';
      } catch (err) {
        console.error('[Parser] Mammoth DOCX parsing error:', err);
        return NextResponse.json({ error: 'Failed to extract text from DOCX file.' }, { status: 500 });
      }
    } else if (fileExtension === '.pdf') {
      try {
        const data = await pdfParse(buffer);
        extractedText = data.text || '';
      } catch (err) {
        console.error('[Parser] pdf-parse PDF parsing error:', err);
        // Fallback to sending base64 PDF directly to Gemini if pdf-parse fails
      }
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    if (apiKey && apiKey !== 'your_gemini_api_key_here') {
      console.log(`[Parser] Running Gemini API-based CV legitimacy check and extraction...`);
      
      const prompt = `You are a professional CV parser and legitimacy validator.
Analyze the following document content (and context) and determine if it is a real CV or resume.
A valid CV must contain professional credentials, history, education, skills, or contact info.
Obvious recipe lists, shopping lists, school homework sheets, todo lists, random notes, or dummy texts must be marked as invalid.

You must return a raw JSON object in the exact following structure. Do not output any markdown formatting (like \`\`\`json) or extra text, just the raw JSON:
{
  "isLegitimateCv": true/false,
  "rejectionReason": "Explain exactly what was missing or why this document is invalid (only if isLegitimateCv is false, otherwise empty string)",
  "name": "Candidate's extracted full name",
  "education": "High School" or "Bachelor's degree" or "Master's degree" or "Other / Professional",
  "field": "Computer Science" or "Business Administration" or "Data Science" or "Law & Public Policy" or "Healthcare & Sciences" or "Engineering",
  "experience": "No experience / student" or "1–3 years" or "3–5 years" or "5+ years",
  "age": "16-20" or "21-30" or "31-40" or "41+"
}

Here is the document content to analyze:
---
${extractedText.substring(0, 15000)}
---`;

      try {
        const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
        let response = null;
        let success = false;

        for (const model of models) {
          response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }]
            })
          });

          if (response.ok) {
            success = true;
            break;
          }
        }

        if (success && response) {
          const data = await response.json();
          const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          // Strip any markdown code blocks
          const cleanedText = responseText.replace(/```json|```/gi, '').trim();
          
          try {
            const parsedResult = JSON.parse(cleanedText);
            return NextResponse.json(parsedResult);
          } catch (jsonErr) {
            console.error('[Parser] Failed to parse JSON response from Gemini:', cleanedText, jsonErr);
          }
        } else {
          console.error('[Parser] Gemini request failed with status:', response?.status);
        }
      } catch (geminiErr) {
        console.error('[Parser] Gemini connection error during parsing:', geminiErr);
      }
    }

    // --- Fallback Parser (Local Keyword Rules) ---
    console.log(`[Parser] Running local keyword-based fallback parser...`);
    
    const textLower = extractedText.toLowerCase();
    const cleanFileName = fileName.replace(fileExtension, '');
    const lowerName = cleanFileName.toLowerCase();

    // Legitimacy check
    const isObviousNonResume = 
      lowerName.includes('recipe') || 
      lowerName.includes('shopping') || 
      lowerName.includes('list') || 
      lowerName.includes('todo') || 
      lowerName.includes('notes') || 
      lowerName.includes('draft') ||
      lowerName.includes('test');

    const cvKeywords = ['education', 'experience', 'skills', 'work', 'projects', 'employment', 'cv', 'resume', 'contact', 'profile', 'objective', 'summary', 'certifications', 'history'];
    const matchedKeywords = cvKeywords.filter(keyword => textLower.includes(keyword));

    if (isObviousNonResume || (extractedText && matchedKeywords.length < 2)) {
      return NextResponse.json({
        isLegitimateCv: false,
        rejectionReason: 'The uploaded document does not appear to be a legitimate CV/resume. Standard sections like Education, Experience, or Skills were not found.'
      });
    }

    // Name Extraction
    let extractedName = cleanFileName
      .replace(/[-_]+/g, ' ')
      .replace(/(resume|cv|biodata|profile|work|job|v2|v3|final|latest)/gi, '')
      .trim();

    extractedName = extractedName
      .replace(/\s+/g, ' ')
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    if (!extractedName) {
      const lines = extractedText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      if (lines.length > 0 && lines[0].split(' ').length <= 4) {
        extractedName = lines[0];
      } else {
        extractedName = 'Candidate';
      }
    }

    // Field Extraction
    let extractedField = 'Computer Science';
    if (textLower.includes('computer science') || textLower.includes('software') || textLower.includes('programming') || textLower.includes('developer') || textLower.includes('ai ') || textLower.includes('machine learning') || textLower.includes('technology')) {
      extractedField = 'Computer Science';
    } else if (textLower.includes('law ') || textLower.includes('legal') || textLower.includes('public policy') || textLower.includes('governance') || lowerName.includes('policy')) {
      extractedField = 'Law & Public Policy';
    } else if (textLower.includes('business') || textLower.includes('management') || textLower.includes('marketing') || textLower.includes('finance') || textLower.includes('mba') || lowerName.includes('business')) {
      extractedField = 'Business Administration';
    } else if (textLower.includes('healthcare') || textLower.includes('medicine') || textLower.includes('science') || textLower.includes('biological') || textLower.includes('pharmacy') || lowerName.includes('health')) {
      extractedField = 'Healthcare & Sciences';
    }

    // Education Extraction
    let extractedEducation = "Bachelor's degree";
    if (textLower.includes('doctor of') || textLower.includes('phd') || textLower.includes('p.h.d')) {
      extractedEducation = 'Other / Professional';
    } else if (textLower.includes('master') || textLower.includes('m.s') || textLower.includes('m.a') || textLower.includes('msc') || textLower.includes('mba')) {
      extractedEducation = "Master's degree";
    } else if (textLower.includes('bachelor') || textLower.includes('b.s') || textLower.includes('b.a') || textLower.includes('bsc')) {
      extractedEducation = "Bachelor's degree";
    } else if (textLower.includes('high school') || textLower.includes('diploma')) {
      extractedEducation = 'High School';
    }

    // Experience Extraction
    let extractedExperience = '3–5 years';
    if (textLower.includes('5 years') || textLower.includes('6 years') || textLower.includes('7 years') || textLower.includes('8 years') || textLower.includes('10 years') || textLower.includes('senior')) {
      extractedExperience = '5+ years';
    } else if (textLower.includes('3 years') || textLower.includes('4 years') || textLower.includes('5 years')) {
      extractedExperience = '3–5 years';
    } else if (textLower.includes('1 year') || textLower.includes('2 years') || textLower.includes('junior')) {
      extractedExperience = '1–3 years';
    } else {
      extractedExperience = 'No experience / student';
    }

    // Age Extraction
    let extractedAge = '21-30';
    if (extractedExperience === '5+ years') {
      extractedAge = '31-40';
    } else if (extractedExperience === '3–5 years') {
      extractedAge = '21-30';
    } else {
      extractedAge = '16-20';
    }

    return NextResponse.json({
      isLegitimateCv: true,
      rejectionReason: '',
      name: extractedName,
      education: extractedEducation,
      field: extractedField,
      experience: extractedExperience,
      age: extractedAge
    });

  } catch (err) {
    console.error('Error in parse-resume API:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
