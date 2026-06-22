import { NextResponse } from 'next/server';
import { generateAiResponse } from '../../../services/aiEngine';
import { db } from '../../../services/db';
import { promises as fs } from 'fs';
import path from 'path';

async function getLiveCourses() {
  try {
    const filePath = path.join(process.cwd(), 'courses_db.json');
    const fileContent = await fs.readFile(filePath, 'utf8');
    const institutions = JSON.parse(fileContent);
    
    let formattedText = "";
    institutions.forEach(inst => {
      formattedText += `- ${inst.institution}: `;
      const coursesStr = inst.courses.map(c => `${c.name} (${c.fee}, ${c.mode})`).join(', ');
      formattedText += coursesStr + ".\n";
    });
    return formattedText;
  } catch (err) {
    console.error("[SapioMatch API Route] Error reading courses database, using fallback:", err);
    return `- University of Birmingham Dubai: Public Policy Master's (AED 95k, Hybrid), Global Executive MBA (AED 115k, Hybrid), Data Science MSc (AED 90k, On-Campus).
- Middlesex University Dubai: MBA General (AED 75k, Hybrid), MA International Relations (AED 62k, Hybrid), MSc Cyber Security (AED 68k, Hybrid).
- American University of Sharjah: Master of Public Policy (AED 88k, Hybrid), MBA (AED 95k, Hybrid), MSc Engineering Systems (AED 92k, On-Campus).
- AstroLabs Academy: Data Science Bootcamp (AED 9.5k, Hybrid), Digital Marketing Specialist (AED 5.2k, Hybrid), Full Stack Web Dev (AED 11k, Live Online).`;
  }
}

export async function POST(request) {
  try {
    const { message, history, apiKey: clientApiKey } = await request.body ? await request.json() : {};
    
    if (!message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    let apiKey = clientApiKey;
    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '' || apiKey.includes('placeholder') || apiKey.includes('your_') || apiKey.includes('AIzaSy...')) {
      apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    }
    
    if (apiKey) {
      console.log(`[SapioMatch API Route] Querying Gemini 1.5 Flash API...`);
      
      const contents = [];
      if (history && history.length > 0) {
        history.slice(-6).forEach(msg => {
          contents.push({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
          });
        });
      }
      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const liveCoursesText = await getLiveCourses();

      const systemInstruction = {
        parts: [{
          text: `You are Aria, the premium AI Academic Advisor for SapioMatch. Your goal is to guide students and working professionals to find their best-fit programs.
You must be conversational, warm, friendly, empathetic, and extremely helpful. Stick strictly to topics related to education, universities, vocational bootcamps, tuition fees, career upgrades, promotions, and study formats.
Use the following partner database to suggest matches when asked:
${liveCoursesText}

If the user asks questions unrelated to education or careers, politely guide them back to academic topics.
If the user is unsatisfied or asks to speak to a real person, output a response suggesting they speak with a counselor (include the phrase "connect to counselor" in your response or trigger the handoff).
Keep your responses concise, user-friendly, and formatted in markdown.`
        }]
      };

      try {
        const modelsToTry = [
          'gemini-2.5-flash',
          'gemini-2.0-flash',
          'gemini-flash-latest',
          'gemini-1.5-flash'
        ];

        let response = null;
        let success = false;
        let modelUsed = 'local-semantic-engine';

        for (const model of modelsToTry) {
          console.log(`[SapioMatch API Route] Trying Gemini model: ${model}...`);
          response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents, systemInstruction })
          });

          if (response.ok) {
            success = true;
            modelUsed = model;
            break;
          } else if (response.status !== 404) {
            // If it's a non-404 error (e.g. 400, 403), log it and break to fallback to avoid multiple failed requests
            const errText = await response.text();
            console.error(`[SapioMatch API Route] Gemini API returned error for model ${model}:`, response.status, errText);
            break;
          } else {
            console.log(`[SapioMatch API Route] Model ${model} not available (404). Trying next...`);
          }
        }

        if (success && response) {
          const data = await response.json();
          const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (responseText) {
            let action = null;
            const q = message.toLowerCase();
            if (q.includes('counselor') || q.includes('consultee') || q.includes('real person') || q.includes('talk to someone')) {
              action = 'connect_human';
            }
            try {
              db.addAiInteraction({
                prompt: message,
                response: responseText,
                model: modelUsed
              });
            } catch (dbErr) {
              console.warn("Failed to log interaction to db:", dbErr);
            }
            return NextResponse.json({ text: responseText, action });
          }
        }
      } catch (geminiErr) {
        console.error("Gemini API connection error:", geminiErr);
      }
    }

    // Fallback to local AI Engine
    console.log(`[SapioMatch API Route] Falling back to local semantic AI Engine...`);
    const aiResult = generateAiResponse(message, history);
    try {
      db.addAiInteraction({
        prompt: message,
        response: aiResult.text,
        model: 'local-semantic-engine'
      });
    } catch (dbErr) {
      console.warn("Failed to log interaction to db:", dbErr);
    }
    return NextResponse.json(aiResult);
  } catch (err) {
    console.error("Error in /api/chat route:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
