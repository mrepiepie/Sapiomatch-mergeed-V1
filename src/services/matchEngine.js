import mockInstitutions from '../data/universities_db.json';

const defaultAnswers = {
  age: "21-30",
  education: "Bachelor's degree",
  field: "Technology & AI",
  goal: "Get promoted",
  format: "Hybrid",
  budget: "Moderate budget (AED 30k - 60k)",
  experience: "3–5 years"
};

/**
 * Calculates a match percentage and lists contextual reasons for matching 
 * a course and its parent institution to the candidate's questionnaire answers.
 */
export function getDynamicMatches(userAnswers = {}) {
  // Merge user answers with defaults in case of incomplete profiles
  const answers = { ...defaultAnswers };
  for (const [key, value] of Object.entries(userAnswers)) {
    if (value !== undefined && value !== null && value !== '') {
      answers[key] = value;
    }
  }

  const allCourses = [];
  mockInstitutions.forEach(inst => {
    inst.courses.forEach((course, courseIndex) => {
      allCourses.push({
        ...course,
        institution: inst,
        courseIndex
      });
    });
  });

  const scoredMatches = allCourses.map((item, index) => {
    const course = item;
    const inst = item.institution;
    let score = 50; // baseline
    const reasons = [];

    // 1. Field of Study Matching (Weight: 35%)
    const field = answers.field.toLowerCase();
    const courseName = course.name.toLowerCase();
    
    let fieldMatched = false;
    if (field.includes("tech") || field.includes("computer") || field.includes("ai") || field.includes("software")) {
      if (
        courseName.includes("artificial intelligence") || 
        courseName.includes("data science") || 
        courseName.includes("cybersecurity") || 
        courseName.includes("software") || 
        courseName.includes("computer") || 
        courseName.includes("tech") ||
        courseName.includes("programming") ||
        courseName.includes("developer") ||
        courseName.includes("coding")
      ) {
        fieldMatched = true;
      }
    } else if (field.includes("business") || field.includes("management") || field.includes("mba") || field.includes("marketing") || field.includes("finance")) {
      if (
        courseName.includes("mba") || 
        courseName.includes("business") || 
        courseName.includes("management") || 
        courseName.includes("marketing") || 
        courseName.includes("finance") || 
        courseName.includes("accounting") || 
        courseName.includes("banking")
      ) {
        fieldMatched = true;
      }
    } else if (field.includes("law") || field.includes("policy") || field.includes("governance") || field.includes("relations")) {
      if (
        courseName.includes("law") || 
        courseName.includes("policy") || 
        courseName.includes("governance") || 
        courseName.includes("regulation") || 
        courseName.includes("relations") ||
        courseName.includes("public")
      ) {
        fieldMatched = true;
      }
    } else if (field.includes("health") || field.includes("science") || field.includes("medicine")) {
      if (
        courseName.includes("health") || 
        courseName.includes("medicine") || 
        courseName.includes("clinical") || 
        courseName.includes("science") || 
        courseName.includes("nursing") ||
        courseName.includes("pharmacy")
      ) {
        fieldMatched = true;
      }
    }

    if (fieldMatched) {
      score += 30;
      reasons.push(`Direct fit for your interest in ${answers.field}`);
    } else {
      score -= 10;
    }

    // 2. Study Format Matching (Weight: 20%)
    const preferredFormat = answers.format.toLowerCase();
    const courseMode = course.mode.toLowerCase();
    
    let formatMatched = false;
    if (preferredFormat.includes("online") && courseMode.includes("online")) {
      formatMatched = true;
    } else if (preferredFormat.includes("hybrid") && courseMode.includes("hybrid")) {
      formatMatched = true;
    } else if ((preferredFormat.includes("campus") || preferredFormat.includes("full-time")) && 
               (courseMode.includes("campus") || courseMode.includes("on-campus"))) {
      formatMatched = true;
    } else if (preferredFormat.includes("weekend") || preferredFormat.includes("evening")) {
      if (courseMode.includes("weekend") || courseMode.includes("evening") || courseMode.includes("hybrid") || courseMode.includes("flexible")) {
        formatMatched = true;
      }
    }

    if (formatMatched) {
      score += 15;
      reasons.push(`Matches your preferred format: ${answers.format}`);
    } else {
      score -= 5;
    }

    // 3. Approximate Budget Range (Weight: 25%)
    const budget = answers.budget.toLowerCase();
    let numericFee = 0;
    const feeClean = course.fee.replace(/[^0-9]/g, '');
    if (feeClean) {
      numericFee = parseInt(feeClean, 10);
    }
    
    let budgetMatched = false;
    if (budget.includes("low budget") || budget.includes("affordable")) {
      if (numericFee < 15000) {
        budgetMatched = true;
      }
    } else if (budget.includes("moderate")) {
      if (numericFee >= 15000 && numericFee <= 60000) {
        budgetMatched = true;
      }
    } else if (budget.includes("premium")) {
      if (numericFee > 60000) {
        budgetMatched = true;
      }
    } else if (budget.includes("open") || budget.includes("corporate")) {
      budgetMatched = true;
    }

    if (budgetMatched) {
      score += 15;
      reasons.push(`Tuition fee (${course.fee}) fits your budget range`);
    } else {
      score -= 10;
      if (numericFee > 0) {
        reasons.push(`Fee: ${course.fee} (Adjusted for budget differences)`);
      }
    }

    // 4. Experience & Education Suitability (Weight: 20%)
    const exp = answers.experience.toLowerCase();
    const edu = answers.education.toLowerCase();
    
    let suitabilityMatched = false;
    const isPostgradOrExec = courseName.includes("master") || courseName.includes("mba") || courseName.includes("post-graduate") || courseName.includes("executive");
    
    if (exp.includes("5+") || exp.includes("3-5") || exp.includes("3–5")) {
      if (isPostgradOrExec) {
        suitabilityMatched = true;
      }
    } else if (exp.includes("no experience") || exp.includes("student")) {
      if (!isPostgradOrExec) {
        suitabilityMatched = true; // bootcamps/bachelors fit candidates without experience
      }
    } else {
      suitabilityMatched = true;
    }

    if (suitabilityMatched) {
      score += 10;
      reasons.push(`Tailored to candidates with ${answers.experience} experience`);
    }

    // 5. Goal Alignment
    const goal = answers.goal.toLowerCase();
    if (goal.includes("promoted") || goal.includes("lead")) {
      if (isPostgradOrExec) {
        score += 5;
        reasons.push("Geared towards organizational leadership & promotion paths");
      }
    } else if (goal.includes("start a business") || goal.includes("entrepreneur")) {
      if (courseName.includes("mba") || courseName.includes("business") || courseName.includes("management")) {
        score += 5;
        reasons.push("Focuses on global startup venture building");
      }
    }

    // Bound final score between 60% and 98% for realistic layout
    const finalScore = Math.min(98, Math.max(60, score));

    // Map location and accreditation description
    let regionDesc = inst.location;
    if (inst.recognition && inst.recognition.toLowerCase().includes("khda")) {
      regionDesc = `${inst.location} (KHDA Approved)`;
    }

    // Build standard pros and cons lists
    const satisfaction = inst.satisfaction || "85%";
    const reputation = inst.reputation || "4.0 / 5";
    const pros = [
      inst.recognition || "Approved Higher Education Provider",
      `Student satisfaction rating: ${satisfaction}`,
      `Practicality focus rating: ${inst.practicality || "80%"}`
    ];
    
    const cons = [];
    if (numericFee > 60000) {
      cons.push("Higher tuition fees per year");
    } else {
      cons.push("Fewer on-campus campus resources");
    }
    if (course.mode.toLowerCase().includes("online")) {
      cons.push("No face-to-face networking elements");
    } else {
      cons.push("Requires fixed travel & attendance in Academic City");
    }

    return {
      id: index + 1, // incremental ID
      title: course.name,
      institutionId: inst.id,
      matchScore: finalScore,
      reasons: reasons.slice(0, 4),
      region: regionDesc,
      format: course.mode,
      duration: course.duration,
      fee: course.fee,
      pros,
      cons
    };
  });

  // Sort matched courses by matchScore in descending order
  return scoredMatches.sort((a, b) => b.matchScore - a.matchScore);
}
