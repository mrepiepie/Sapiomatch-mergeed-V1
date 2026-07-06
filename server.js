import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { generateAiResponse } from './src/services/aiEngine.js';
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
    console.error("[Learnova Server] Error reading courses database, using fallback:", err);
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
  console.log(`[Learnova Server] ${req.method} ${req.url} - ${new Date().toISOString()}`);
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
      console.log(`[Learnova Server] Querying Gemini API...`);
      
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
          text: `You are Aria, the premium AI Academic Advisor for Learnova. Your goal is to guide students and working professionals to find their best-fit programs.
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
          console.log(`[Learnova Server] Trying Gemini model: ${model}...`);
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
            console.error(`[Learnova Server] Gemini API returned error for model ${model}:`, response.status, errText);
            break;
          } else {
            console.log(`[Learnova Server] Model ${model} not available (404). Trying next...`);
          }
        }

        // Standard legacy fallback if all newer models return 404
        if (!success) {
          console.log(`[Learnova Server] Newer models not available. Trying legacy gemini-pro...`);
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
            return res.json({ text: responseText, action });
          }
        } else {
          const errText = await response.text();
          console.error("Gemini API returned error:", errText);
          if (clientApiKey) {
            console.log(`[Learnova Server] Client API Key authentication error. Falling back to local AI...`);
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
    console.log(`[Learnova Server] Falling back to local semantic AI Engine...`);
    const aiResult = generateAiResponse(message, history);
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


// Helper to read database.json
async function readDatabaseFile() {
  const filePath = path.join(process.cwd(), 'database.json');
  try {
    const fileContent = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (err) {
    console.error("[Learnova Server] Error reading database.json, using fallback/initial data:", err);
    // Initial data fallback matching db.js schema
    return {
      users: [
        {
          id: "usr_1",
          name: "Sanji",
          email: "sanji@example.com",
          password: "password",
          role: "Student",
          contactNumber: "+971 50 123 4567",
          plan: "Standard",
          credits: 10,
          status: "Active"
        },
        {
          id: "usr_2",
          name: "AUS admissions",
          email: "aus@learnova.ai",
          password: "password",
          role: "University",
          contactNumber: "+971 6 515 5555",
          plan: "Premium",
          credits: 0,
          status: "Active",
          universityName: "American University of Sharjah"
        },
        {
          id: "usr_3",
          name: "Birmingham admissions",
          email: "birmingham@learnova.ai",
          password: "password",
          role: "University",
          contactNumber: "+971 4 249 2300",
          plan: "Premium",
          credits: 0,
          status: "Active",
          universityName: "University of Birmingham Dubai"
        },
        {
          id: "usr_4",
          name: "Super Admin Operator",
          email: "operator@learnova.ai",
          password: "password",
          role: "Admin",
          contactNumber: "+971 4 111 2222",
          plan: "Premium",
          credits: 9999,
          status: "Active"
        }
      ],
      applications: [
        {
          id: "app_1",
          studentName: "Sanji",
          studentEmail: "sanji@example.com",
          studentContact: "+971 50 123 4567",
          cgpa: "3.75",
          sop: "I want to apply for Data Science because of career promotions and expanding my machine learning credentials.",
          universityName: "University of Birmingham Dubai",
          courseName: "Data Science MSc",
          counselorPreference: "Video Meeting",
          chatSlot: "",
          status: "Under Review",
          date: "2026-06-08",
          replyText: "",
          meetingLink: "",
          meetingDate: ""
        }
      ],
      universities: [
        { id: "uni_1", name: "American University of Sharjah", email: "aus@learnova.ai" },
        { id: "uni_2", name: "University of Birmingham Dubai", email: "birmingham@learnova.ai" }
      ],
      notifications: [
        {
          id: "not_1",
          userEmail: "sanji@example.com",
          text: "Welcome to Learnova! You have been allocated 10 Standard credits.",
          date: "2026-06-13",
          read: false,
          link: ""
        }
      ],
      contacts: [
        {
          id: "con_1",
          fullName: "John Doe",
          email: "john@example.com",
          phone: "+971 50 999 8888",
          inquiryType: "student",
          message: "Hi, I need assistance matching with a hybrid master's program.",
          status: "New",
          date: "2026-06-15"
        }
      ],
      formTemplates: [
        {
          institutionId: "uni_1",
          fixed_sections: [
            { name: "Personal Information", fields: ["Full name", "Date of birth", "Nationality", "Email", "Phone number", "Current country of residence"] },
            { name: "Academic Background", fields: ["Highest qualification", "Institution attended", "Graduation year", "GPA / grade", "Field of study"] },
            { name: "Programme Selection", fields: ["Preferred programme", "Study mode", "Intake / start date", "Campus / online preference"] },
            { name: "Work Experience", fields: ["Current job title", "Employer", "Years of experience", "Industry"] },
            { name: "Declaration and Consent", fields: ["Confirmation checkbox"] }
          ],
          optional_sections: []
        },
        {
          institutionId: "uni_2",
          fixed_sections: [
            { name: "Personal Information", fields: ["Full name", "Date of birth", "Nationality", "Email", "Phone number", "Current country of residence"] },
            { name: "Academic Background", fields: ["Highest qualification", "Institution attended", "Graduation year", "GPA / grade", "Field of study"] },
            { name: "Programme Selection", fields: ["Preferred programme", "Study mode", "Intake / start date", "Campus / online preference"] },
            { name: "Work Experience", fields: ["Current job title", "Employer", "Years of experience", "Industry"] },
            { name: "Declaration and Consent", fields: ["Confirmation checkbox"] }
          ],
          optional_sections: []
        }
      ],
      platformStats: {
        total_visitors: 14205,
        total_clicks: 9842,
        completed_matches: 2431,
        confirmed_enrollments: 342,
        chatbot_started_journeys: 624
      }
    };
  }
}

// REST GET endpoints
app.get('/api/courses', async (req, res) => {
  try {
    const filePath = path.join(process.cwd(), 'courses_db.json');
    const fileContent = await fs.readFile(filePath, 'utf8');
    const institutions = JSON.parse(fileContent);

    // Flatten courses list to support query filters cleanly
    let allCourses = [];
    institutions.forEach(inst => {
      inst.courses.forEach(course => {
        allCourses.push({
          ...course,
          institution: inst.institution
        });
      });
    });

    const { mode, institution } = req.query;

    if (mode) {
      const targetMode = String(mode).toLowerCase();
      allCourses = allCourses.filter(c => c.mode.toLowerCase() === targetMode);
    }

    if (institution) {
      const targetInst = String(institution).toLowerCase();
      allCourses = allCourses.filter(c => c.institution.toLowerCase().includes(targetInst));
    }

    res.json(allCourses);
  } catch (err) {
    console.error("Error in GET /api/courses:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const data = await readDatabaseFile();
    res.json(data.users || []);
  } catch (err) {
    res.status(500).json({ error: "Internal server error." });
  }
});

app.get('/api/applications', async (req, res) => {
  try {
    const data = await readDatabaseFile();
    res.json(data.applications || []);
  } catch (err) {
    res.status(500).json({ error: "Internal server error." });
  }
});

app.get('/api/universities', async (req, res) => {
  try {
    const data = await readDatabaseFile();
    res.json(data.universities || []);
  } catch (err) {
    res.status(500).json({ error: "Internal server error." });
  }
});

app.get('/api/notifications', async (req, res) => {
  try {
    const data = await readDatabaseFile();
    res.json(data.notifications || []);
  } catch (err) {
    res.status(500).json({ error: "Internal server error." });
  }
});

app.get('/api/contacts', async (req, res) => {
  try {
    const data = await readDatabaseFile();
    res.json(data.contacts || []);
  } catch (err) {
    res.status(500).json({ error: "Internal server error." });
  }
});

app.get('/api/form-templates', async (req, res) => {
  try {
    const data = await readDatabaseFile();
    res.json(data.formTemplates || []);
  } catch (err) {
    res.status(500).json({ error: "Internal server error." });
  }
});

app.get('/api/platform-stats', async (req, res) => {
  try {
    const data = await readDatabaseFile();
    res.json(data.platformStats || {});
  } catch (err) {
    res.status(500).json({ error: "Internal server error." });
  }
});

// Simple health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: "healthy", service: "Learnova AI Engine", timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Learnova AI Backend Server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`======================================================\n`);
});
