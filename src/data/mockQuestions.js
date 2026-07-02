export const mockQuestions = [
  {
    step: 1,
    question: "How old are you?",
    options: ["16-20", "21-30", "31-40", "41-50", "50+"],
    defaultValue: "21-30",
    aiFollowup: "Thank you. Let's customize programs matching your age bracket."
  },
  {
    step: 2,
    question: "What is your highest completed education level?",
    options: ["High School", "Bachelor's degree", "Master's degree", "Other / Professional"],
    defaultValue: "Bachelor's degree",
    aiFollowup: "Excellent. We'll look for courses matching your academic background."
  },
  {
    step: 3,
    question: "What field are you interested in studying?",
    options: ["Law & Public Policy", "Business & Management", "Technology & AI", "Healthcare & Sciences"],
    defaultValue: "Law & Public Policy",
    aiFollowup: "Perfect. We'll prioritize programs in this category."
  },
  {
    step: 4,
    question: "What is your main goal?",
    options: ["Get promoted", "Switch career path", "Start a business", "Academic research"],
    defaultValue: "Get promoted",
    aiFollowup: "Noted. We will focus on courses aligned with this career objective."
  },
  {
    step: 5,
    question: "Which study format works best for you?",
    options: ["Hybrid", "100% Online", "Full-time On-Campus", "Flexible Weekend/Evening"],
    defaultValue: "Hybrid",
    aiFollowup: "Got it. We will search for matching study schedules."
  },
  {
    step: 6,
    question: "What is your approximate budget range?",
    options: ["Low budget / affordable options only", "Moderate budget (AED 30k - 60k)", "Premium (AED 60k+)", "Open - corporate sponsored"],
    defaultValue: "Low budget / affordable options only",
    aiFollowup: "Got it. We will align programs with your tuition preference."
  },
  {
    step: 7,
    question: "How many years of work experience do you have?",
    options: ["No experience / student", "1–3 years", "3–5 years", "5+ years"],
    defaultValue: "3–5 years",
    aiFollowup: "Great. We are now processing your final program matches."
  }
];
