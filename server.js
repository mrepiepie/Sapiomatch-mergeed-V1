import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { generateAiResponse } from './src/services/aiEngine.js';
import { db } from './src/services/db.js';
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
    console.error("[SapioMatch Server] Error reading courses database, using fallback:", err);
    return `- University of Birmingham Dubai: Public Policy Master's (AED 95k, Hybrid), Global Executive MBA (AED 115k, Hybrid), Data Science MSc (AED 90k, On-Campus).
- Middlesex University Dubai: MBA General (AED 75k, Hybrid), MA International Relations (AED 62k, Hybrid), MSc Cyber Security (AED 68k, Hybrid).
- American University of Sharjah: Master of Public Policy (AED 88k, Hybrid), MBA (AED 95k, Hybrid), MSc Engineering Systems (AED 92k, On-Campus).
- AstroLabs Academy: Data Science Bootcamp (AED 9.5k, Hybrid), Digital Marketing Specialist (AED 5.2k, Hybrid), Full Stack Web Dev (AED 11k, Live Online).`;
  }
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Log incoming requests for dev visibility
app.use((req, res, next) => {
  console.log(`[SapioMatch Server] ${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

// Endpoint for chat processing
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history, apiKey: clientApiKey } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    // Prioritize user-provided key from client, fallback to environment keys
    let apiKey = clientApiKey;
    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '' || apiKey.includes('placeholder') || apiKey.includes('your_') || apiKey.includes('AIzaSy...')) {
      apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    }
    if (apiKey) {
      console.log(`[SapioMatch Server] Querying Gemini API...`);
      
      // Map history to Gemini API format
      const contents = [];
      if (history && history.length > 0) {
        history.slice(-6).forEach(msg => {
          contents.push({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
          });
        });
      }
      // Add current message
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

        for (const model of modelsToTry) {
          console.log(`[SapioMatch Server] Trying Gemini model: ${model}...`);
          response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents, systemInstruction })
          });

          if (response.ok) {
            success = true;
            break;
          } else if (response.status !== 404) {
            const errText = await response.text();
            console.error(`[SapioMatch Server] Gemini API returned error for model ${model}:`, response.status, errText);
            break;
          } else {
            console.log(`[SapioMatch Server] Model ${model} not available (404). Trying next...`);
          }
        }

        // Standard legacy fallback if all newer models return 404
        if (!success) {
          console.log(`[SapioMatch Server] Newer models not available. Trying legacy gemini-pro...`);
          const contentsWithSystem = [
            {
              role: 'user',
              parts: [{ text: `System Instructions: ${systemInstruction.parts[0].text}` }]
            },
            ...contents
          ];
          response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: contentsWithSystem })
          });
          if (response.ok) {
            success = true;
          }
        }

        if (response.ok) {
          const data = await response.json();
          const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (responseText) {
            let action = null;
            const q = message.toLowerCase();
            const asksForHuman = q.includes('counselor') || 
                                 q.includes('consultee') || 
                                 q.includes('real person') || 
                                 q.includes('human') || 
                                 q.includes('counsellor') || 
                                 q.includes('unsatisfied') || 
                                 q.includes('talk to someone');
            if (asksForHuman) {
              action = 'connect_human';
            }
            try {
              db.addAiInteraction({
                prompt: message,
                response: responseText,
                model: 'gemini-api'
              });
            } catch (dbErr) {
              console.warn("Failed to log interaction to db:", dbErr);
            }
            return res.json({ text: responseText, action });
          }
        } else {
          const errText = await response.text();
          console.error("Gemini API returned error:", errText);
          if (clientApiKey) {
            console.log(`[SapioMatch Server] Client API Key authentication error. Falling back to local AI...`);
            const aiResult = generateAiResponse(message, history);
            return res.json({
              text: `⚠️ **Note: The Gemini API Key you provided returned an authentication error.**\n\n*Error details: ${errText.substring(0, 80)}...*\n\n${aiResult.text}`,
              action: aiResult.action
            });
          }
        }
      } catch (geminiErr) {
        console.error("Failed to query Gemini API:", geminiErr);
        if (clientApiKey) {
          const aiResult = generateAiResponse(message, history);
          return res.json({
            text: `⚠️ **Note: Connection to Gemini API failed.**\n\n*Error: ${geminiErr.message}*\n\n${aiResult.text}`,
            action: aiResult.action
          });
        }
      }
    }

    // Fallback to local NLP if API key is not configured or fails
    console.log(`[SapioMatch Server] Falling back to local semantic AI Engine...`);
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
    res.json(aiResult);
  } catch (err) {
    console.error("Error in /api/chat:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Endpoint for resume parsing simulation
app.post('/api/parse-resume', (req, res) => {
  try {
    // Simulating resume parsing after file upload
    setTimeout(() => {
      res.json({
        name: "Sanji",
        age: "21-30",
        education: "Bachelor's degree",
        field: "Law & Public Policy",
        goal: "Get promoted",
        format: "Hybrid",
        budget: "Low budget / affordable options only",
        experience: "3–5 years"
      });
    }, 1500);
  } catch (err) {
    console.error("Error in /api/parse-resume:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Simple health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: "healthy", service: "SapioMatch AI Engine", timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 SapioMatch AI Backend Server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`======================================================\n`);
});
