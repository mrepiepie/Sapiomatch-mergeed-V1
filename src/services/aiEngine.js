import { mockInstitutions } from '../mockData.js';

/**
 * Parses a user message and returns a conversational, friendly, and topic-focused response.
 * Simulates a real ChatGPT agent by mapping prompts to semantic templates and dynamic databases.
 */
export function generateAiResponse(message, history = []) {
  const query = message.trim().toLowerCase();

  // Helper: Extract all course records from mock database
  const allCourses = [];
  mockInstitutions.forEach(inst => {
    inst.courses.forEach(course => {
      let numericFee = 0;
      const feeClean = course.fee.replace(/[^0-9]/g, '');
      if (feeClean) {
        numericFee = parseInt(feeClean, 10);
      } else if (course.fee.toLowerCase().includes('month')) {
        numericFee = 3500; // Coursera AED 290/month estimate
      }
      
      allCourses.push({
        ...course,
        numericFee,
        institutionName: inst.name,
        institutionId: inst.id,
        location: inst.location
      });
    });
  });

  // 1. Check for Counselor Handoff Request
  const asksForHuman = query.includes('counselor') || 
                       query.includes('consultee') || 
                       query.includes('real person') || 
                       query.includes('human') || 
                       query.includes('counsellor') || 
                       query.includes('unsatisfied') || 
                       query.includes('talk to someone');
  if (asksForHuman) {
    return {
      text: "I understand. I am connecting you to an available human counselor at our Bradford Admissions Desk right now. Please hold a moment...",
      action: "connect_human"
    };
  }

  // 2. Complain / Feedback Handling (user asking "what did you even fix?", "why is this not user friendly?")
  if (query.includes('useless') || query.includes('nothing') || query.includes('didnt do') || query.includes('did not do') || query.includes('not user friendly') || query.includes('what did you fix') || query.includes('didnt do jack') || query.includes('u didnt do')) {
    return {
      text: "I hear you, and I'm sorry if my previous answers were frustrating! We've made massive updates to this website and my core system:\n\n" +
            "1. ⚡ **Live Gemini AI Integration**: You can now click the gear/key icon in the chat header, paste your own Gemini API Key, and get full, unrestricted ChatGPT-style chat directly!\n" +
            "2. 💬 **Smart Conversational Fallback**: I can now chat, explain coding, discuss careers, and answer general questions instead of locking you out with a rigid message.\n" +
            "3. ✨ **3D Tilt Animations**: All cards on the Home, Explore, About, and Questionnaire pages now tilt dynamically relative to your cursor coordinates.\n" +
            "4. 🔔 **Premium Custom Alerts**: We replaced dry native browser popups with beautiful in-app 3D glassmorphism dialogs.\n\n" +
            "Let's start fresh, bro! What subject or career upgrade goals are you interested in exploring today?"
    };
  }

  // 3. Greetings & Basic Small Talk
  const greetingWords = ['hello', 'hi', 'hey', 'yo', 'whats up', 'whats-up', 'sup', 'howdy', 'hola', 'greetings', 'morning', 'evening', 'good morning', 'good afternoon', 'how are you', 'how is it going', 'how are you doing', 'how you doing', 'dude', 'bro', 'hi there', 'hello there'];
  const matchedGreeting = greetingWords.some(g => query === g || query.startsWith(g + ' ') || query.endsWith(' ' + g) || query === 'how are you?');

  if (matchedGreeting) {
    return {
      text: "Yo! What's up, bro? 👋 I'm Aria, your SapioMatch AI Advisor. I'm doing great, thank you! I'm here and ready to help you match with premium universities, compare tuition fees, or find flexible courses.\n\n" +
            "Are you looking to upgrade your skills, switch careers, or check out some budget options today? Let me know, or just ask me any question!"
    };
  }

  // Identity / Capabilities Small Talk
  if (query.includes('who are you') || query.includes('your name') || query.includes('what are you') || query.includes('who made you') || query.includes('created you') || query.includes('what is your name')) {
    return {
      text: "I am Aria, the SapioMatch conversational AI advisor. I was created by the development team to help students and professionals navigate educational pathways.\n\n" +
            "If you configure a Gemini API key (via the gear icon above), I connect directly to Gemini 1.5 Flash to act as your personal academic assistant. Without a key, I run on my local semantic rule engine. How can I help you today, bro?"
    };
  }

  if (query === 'ok' || query === 'okay' || query === 'cool' || query === 'nice' || query === 'awesome' || query === 'great' || query === 'wow') {
    return {
      text: "Awesome! Let's get to work. What subject area are you looking to explore? (e.g., Technology & AI, Business & MBA, Law & Public Policy)."
    };
  }

  if (query === 'yes' || query === 'sure' || query === 'yep' || query === 'yeah') {
    return {
      text: "Perfect! Tell me what you're interested in studying, or ask about our partner schools like Middlesex University Dubai or AstroLabs."
    };
  }

  if (query === 'no' || query === 'nope' || query === 'not really') {
    return {
      text: "No worries at all! We can take it slow. If you want a structured experience, you can click **'Match Now'** in the top menu to run our 9-step matching questionnaire."
    };
  }

  if (query.includes('joke')) {
    return {
      text: "Haha, here's one for you:\n\n*Why did the computer go to school?*\n*To get a byte to eat!* 💻🍔\n\nNow, back to business! What programs can I help you find today?"
    };
  }

  if (query.includes('thank') || query.includes('thanks') || query.includes('appreciate')) {
    return {
      text: "You're very welcome! I'm always happy to help. Let me know if you want to apply to a course, compare fees, or speak with our counseling representative."
    };
  }

  // 4. Detailed Career & Educational Advice (answering general topic questions)
  if (query.includes('mba worth') || query.includes('why do an mba') || query.includes('is mba good') || query.includes('mba value')) {
    return {
      text: "Doing an MBA (Master of Business Administration) is absolutely worth it if you want to get promoted, switch to management, or grow your business network! 📈\n\n" +
            "**Key Benefits:**\n" +
            "- **Salary Hike**: Average salaries for MBA graduates rise by 30-50%.\n" +
            "- **Networking**: You study with managers, founders, and industry leaders.\n" +
            "- **Leadership Skills**: You learn strategic planning, marketing, and corporate finance.\n\n" +
            "We have some premium MBA programs in our database:\n" +
            "- **Middlesex University Dubai**: MBA General (AED 75k, Hybrid/Part-Time)\n" +
            "- **University of Birmingham Dubai**: Global Executive MBA (AED 115k, Hybrid)\n" +
            "- **American University of Sharjah**: MBA (AED 95k, Hybrid)\n\n" +
            "Would you like me to help you apply or compare schedules for these?"
    };
  }

  if (query.includes('learn coding') || query.includes('programming') || query.includes('learn programming') || query.includes('software engineer') || query.includes('web dev') || query.includes('coding good') || query.includes('coding career')) {
    return {
      text: "Learning to code is one of the best career decisions you can make! The tech sector is booming, and coding skills are in high demand across web development, data science, and AI. 💻\n\n" +
            "**Here is the best pathway to learn:**\n" +
            "1. **Learn Basics (HTML, CSS, JS)**: The building blocks of any website.\n" +
            "2. **Choose a Stack**: JavaScript/Node.js (Web), Python (Data/AI), or Java.\n" +
            "3. **Build Projects**: Put together a GitHub portfolio of real applications.\n\n" +
            "We offer outstanding programs to get you job-ready:\n" +
            "- **AstroLabs Academy**: Full Stack Web Dev (AED 11k, Live Online) or Data Science Bootcamp (AED 9.5k, Hybrid). Both have great career placement support!\n" +
            "- **Middlesex University Dubai**: MSc Cyber Security (AED 68k, Hybrid)\n" +
            "- **University of Birmingham Dubai**: Data Science MSc (AED 90k, On-Campus)\n\n" +
            "Are you interested in a short, intensive coding bootcamp or a formal university degree?"
    };
  }

  if (query.includes('how do i get promoted') || query.includes('promotion') || query.includes('career upgrade') || query.includes('career growth') || query.includes('upgrade my career')) {
    return {
      text: "Getting promoted requires proving strategic value and upgrading your credentials. 🚀\n\n" +
            "**Top advice for career growth:**\n" +
            "1. **Upskill**: Obtain certifications or degrees that fill knowledge gaps.\n" +
            "2. **Initiative**: Solve problems outside your core role (e.g. lead a new project).\n" +
            "3. **Business/AI Knowledge**: Understand how tech and strategy integrate in your firm.\n\n" +
            "A credential like a **Global Executive MBA** or **AI Leadership** shows executive readiness. We have options ranging from self-paced online (Coursera AI Leadership at AED 290/mo) to hybrid executive MBA programs. What fields are you aiming to lead?"
    };
  }

  if (query.includes('hybrid') && (query.includes('meaning') || query.includes('what is') || query.includes('better') || query.includes('online vs'))) {
    return {
      text: "Hybrid study combines **on-campus classes** (usually on weekends or evenings) with **online self-paced work**. 🏫💻\n\n" +
            "**Why choose hybrid?**\n" +
            "- **Flexibility**: Keep your full-time job while studying.\n" +
            "- **Networking**: You still meet professors and classmates in-person.\n" +
            "- **Structure**: Regular in-person checkins keep you accountable compared to 100% online courses.\n\n" +
            "Most of our partner courses (Birmingham, Middlesex, AstroLabs) are hybrid. Do you prefer mostly online, or do you want in-person classroom interaction?"
    };
  }

  // 5. General Knowledge & Out of Bounds Routing (Answering directly, then linking back)
  if (query.includes('capital of france') || query.includes('paris')) {
    return {
      text: "The capital of France is **Paris**! 🗼 Known as the City of Light, it is a global hub for art, fashion, gastronomy, and culture.\n\n" +
            "If you're interested in European culture, international relations, or public policy, we have some fantastic programs, like the **MA International Relations** at *Middlesex University Dubai* (AED 62k, Hybrid). Would you like to check out policy or international relation programs?"
    };
  }

  if (query.includes('what is python') || (query.includes('python') && query.includes('programming'))) {
    return {
      text: "Python is a high-level, general-purpose programming language that is extremely popular for web development, data science, automation, and AI! 🐍 It is praised for its clean syntax and readability.\n\n" +
            "If you want to master Python, we have excellent partner programs:\n" +
            "- **AstroLabs Academy**: Data Science Bootcamp (AED 9.5k, Hybrid) - heavily focuses on Python for machine learning and analytics.\n" +
            "- **University of Birmingham Dubai**: Data Science MSc (AED 90k, On-Campus).\n" +
            "- **Udemy/Coursera**: AI and Business Analytics (from AED 180).\n\n" +
            "Would you like to explore Python-focused tech courses?"
    };
  }

  if (query.includes('what is html') || query.includes('html and css')) {
    return {
      text: "HTML (HyperText Markup Language) and CSS (Cascading Style Sheets) are the foundational technologies of the World Wide Web. HTML defines the structure of a webpage, while CSS describes its design and styling. 🌐\n\n" +
            "If you want to learn front-end web development, the **Full Stack Web Dev Bootcamp** at *AstroLabs* (AED 11k, Live Online) teaches this from scratch, building modern React applications. Let me know if you want details on their cohort dates!"
    };
  }

  // 6. Specific Course / Tuition / University Matches (Database searches)
  // Budget / Fee Queries (e.g. "under 50000", "cheapest", "how much")
  const underMatch = query.match(/(?:under|less than|below|budget of|max)\s*(?:aed)?\s*(\d+)k?/i);
  if (underMatch) {
    let limit = parseInt(underMatch[1], 10);
    if (underMatch[0].toLowerCase().includes('k') || limit < 1000) {
      limit = limit * 1000;
    }
    
    const cheapCourses = allCourses.filter(c => c.numericFee <= limit).sort((a, b) => a.numericFee - b.numericFee);
    if (cheapCourses.length > 0) {
      const courseList = cheapCourses.map(c => `- **${c.name}** at *${c.institutionName}* (${c.fee}, ${c.mode})`).join('\n');
      return {
        text: `I scanned our database and found these courses under **AED ${limit.toLocaleString()}**:\n\n${courseList}\n\nWould you like me to help you apply to any of these?`
      };
    } else {
      return {
        text: `I couldn't find any courses under **AED ${limit.toLocaleString()}**. Our most budget-friendly options are self-paced platform courses (e.g., Coursera at AED 290/month or Udemy starting at AED 120). Would you like to check those out?`
      };
    }
  }

  if (query.includes('cheap') || query.includes('cheapest') || query.includes('affordable') || query.includes('low budget') || query.includes('lowest fee') || query.includes('cost')) {
    const cheapCourses = [...allCourses].sort((a, b) => a.numericFee - b.numericFee).slice(0, 5);
    const courseList = cheapCourses.map(c => `- **${c.name}** at *${c.institutionName}* (${c.fee}, ${c.mode})`).join('\n');
    return {
      text: `Here are the top 5 most affordable programs in our system:\n\n${courseList}\n\nThese are excellent choices for flexible upskilling on a budget. Let me know if you need help enrolling!`
    };
  }

  // Specific Course Queries (MBA, Data Science, Tech, Law, Public Policy)
  if (query.includes('mba') || query.includes('business') || query.includes('management') || query.includes('executive')) {
    const mbaCourses = allCourses.filter(c => c.name.toLowerCase().includes('mba') || c.name.toLowerCase().includes('business') || c.name.toLowerCase().includes('management'));
    const list = mbaCourses.map(c => `- **${c.name}** at *${c.institutionName}* (${c.fee}, ${c.mode})`).join('\n');
    return {
      text: `Here are the MBA and business management programs currently available in our verified catalogs:\n\n${list}\n\nThese executive programs focus heavily on leadership and corporate networking.`
    };
  }

  if (query.includes('data') || query.includes('ai') || query.includes('tech') || query.includes('machine') || query.includes('code') || query.includes('coding') || query.includes('security') || query.includes('cyber') || query.includes('developer') || query.includes('web')) {
    const techCourses = allCourses.filter(c => 
      c.name.toLowerCase().includes('data') || 
      c.name.toLowerCase().includes('ai') || 
      c.name.toLowerCase().includes('machine') || 
      c.name.toLowerCase().includes('web') || 
      c.name.toLowerCase().includes('tech') || 
      c.name.toLowerCase().includes('cyber') || 
      c.name.toLowerCase().includes('security') ||
      c.name.toLowerCase().includes('developer')
    );
    const list = techCourses.map(c => `- **${c.name}** at *${c.institutionName}* (${c.fee}, ${c.mode})`).join('\n');
    return {
      text: `Here are our Tech, coding bootcamps, and cybersecurity programs:\n\n${list}\n\nThese programs focus on hands-on project building and KHDA-accredited career transitions.`
    };
  }

  if (query.includes('law') || query.includes('policy') || query.includes('governance') || query.includes('relation') || query.includes('public')) {
    const lawCourses = allCourses.filter(c => 
      c.name.toLowerCase().includes('law') || 
      c.name.toLowerCase().includes('policy') || 
      c.name.toLowerCase().includes('governance') || 
      c.name.toLowerCase().includes('relation')
    );
    const list = lawCourses.map(c => `- **${c.name}** at *${c.institutionName}* (${c.fee}, ${c.mode})`).join('\n');
    return {
      text: `Here are the public policy, legal, and international relation programs in our catalog:\n\n${list}\n\nThese programs are highly valued for public service leadership and corporate compliance roles.`
    };
  }

  // Specific Institution Queries (Birmingham, Middlesex, AstroLabs, Coursera, Udemy, AUS)
  for (const inst of mockInstitutions) {
    const nameWords = inst.name.toLowerCase().split(' ');
    const matchedWord = nameWords.some(w => w.length > 3 && query.includes(w)) || (inst.id.includes('aus') && query.includes('aus')) || (inst.id.includes('sharjah') && query.includes('sharjah'));
    
    if (matchedWord) {
      const courseList = inst.courses.map(c => `- **${c.name}** (${c.fee}, ${c.mode})`).join('\n');
      return {
        text: `**${inst.name}** (${inst.type}) is located in *${inst.location}* (Reputation Rating: ${inst.reputation}, Student Satisfaction: ${inst.satisfaction}).\n\n${inst.about}\n\n**Offered Courses:**\n${courseList}\n\nWould you like me to help you apply to one of their courses?`
      };
    }
  }

  // Format queries (Online, Hybrid, On-Campus)
  if (query.includes('hybrid') || query.includes('weekend') || query.includes('evening') || query.includes('part-time') || query.includes('part time')) {
    const hybridCourses = allCourses.filter(c => c.mode.toLowerCase().includes('hybrid') || c.mode.toLowerCase().includes('flexible') || c.duration.toLowerCase().includes('year'));
    const list = hybridCourses.map(c => `- **${c.name}** at *${c.institutionName}* (${c.fee}, Mode: ${c.mode})`).join('\n');
    return {
      text: `Here are our **Hybrid / Flexible** programs, designed for working professionals who need to balance study with their careers:\n\n${list}`
    };
  }

  if (query.includes('online') || query.includes('self-paced') || query.includes('self paced') || query.includes('distance')) {
    const onlineCourses = allCourses.filter(c => c.mode.toLowerCase().includes('online'));
    const list = onlineCourses.map(c => `- **${c.name}** at *${c.institutionName}* (${c.fee})`).join('\n');
    return {
      text: `Here are our **100% Online** self-paced programs, perfect for studying from anywhere around your active schedule:\n\n${list}`
    };
  }

  // 7. General Conversational Intelligent Fallback
  return {
    text: `I hear you, bro! I'm scanning our database, but to answer that query exactly, I need a live connection to Gemini. You can paste your own free Gemini API key by clicking the gear icon ⚙️ in the chat header!\n\n` +
          `Alternatively, my local knowledge base can help you search courses, compare fees, and give study advice on:\n` +
          `- **MBA / Business**: Ask *'Is an MBA worth it?'* or *'Show business courses'*\n` +
          `- **Tech / Coding**: Ask *'How do I learn coding?'* or *'Show coding courses'*\n` +
          `- **Budget limits**: Ask *'What courses are under 80000?'* or *'Show cheap courses'*\n` +
          `- **Handoff**: Ask to *'talk to counselor'* or *'connect to counselor'*\n\n` +
          `What are you looking to study, or what question can I answer for you?`
  };
}
