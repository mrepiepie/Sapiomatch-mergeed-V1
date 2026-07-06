import fs from 'fs';
import path from 'path';

const DB_PATH = path.resolve(process.cwd(), 'database.json');

// Helper to get raw data
function readData() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const defaultDb = getInitialData();
      fs.writeFileSync(DB_PATH, JSON.stringify(defaultDb, null, 2), 'utf-8');
      return defaultDb;
    }
    const content = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error("Error reading database file:", err);
    return getInitialData();
  }
}

// Helper to save data
function writeData(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error("Error writing database file:", err);
    return false;
  }
}

// Default records for grading/testing out-of-the-box
function getInitialData() {
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

export const db = {
  // --- USERS ---
  getUsers: () => readData().users,
  getUserByEmail: (email) => readData().users.find(u => u.email.toLowerCase() === email.toLowerCase()),
  addUser: (user) => {
    const data = readData();
    const newUser = {
      id: `usr_${Date.now()}`,
      status: "Active",
      plan: user.role === 'Student' ? 'Standard' : 'Premium',
      credits: user.role === 'Student' ? 10 : 0,
      ...user
    };
    data.users.push(newUser);
    writeData(data);
    return newUser;
  },
  updateUser: (email, updates) => {
    const data = readData();
    const idx = data.users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (idx === -1) return null;
    data.users[idx] = { ...data.users[idx], ...updates };
    writeData(data);
    return data.users[idx];
  },
  deleteUser: (id) => {
    const data = readData();
    data.users = data.users.filter(u => u.id !== id);
    writeData(data);
    return true;
  },

  // --- UNIVERSITIES ---
  getUniversities: () => readData().universities,
  addUniversity: (uni) => {
    const data = readData();
    const newUni = {
      id: `uni_${Date.now()}`,
      ...uni
    };
    data.universities.push(newUni);
    
    // Also auto-create a University user account
    const uniUser = {
      id: `usr_${Date.now()}`,
      name: `${uni.name} representative`,
      email: uni.email,
      password: "password", // default password
      role: "University",
      contactNumber: "",
      plan: "Premium",
      credits: 0,
      status: "Active",
      universityName: uni.name
    };
    data.users.push(uniUser);
    
    writeData(data);
    return newUni;
  },

  // --- APPLICATIONS ---
  getApplications: () => readData().applications,
  addApplication: (app) => {
    const data = readData();
    const newApp = {
      id: `app_${Date.now()}`,
      status: "Under Review",
      date: new Date().toISOString().split('T')[0],
      replyText: "",
      meetingLink: "",
      meetingDate: "",
      ...app
    };
    data.applications.push(newApp);
    
    // Create notification for student
    const newNotif = {
      id: `not_${Date.now()}`,
      userEmail: app.studentEmail,
      text: `Your application for ${app.courseName} at ${app.universityName} has been submitted successfully.`,
      date: new Date().toISOString().split('T')[0],
      read: false,
      link: ""
    };
    data.notifications.push(newNotif);

    writeData(data);
    return newApp;
  },
  updateApplicationReply: (id, replyText, meetingLink, meetingDate) => {
    const data = readData();
    const idx = data.applications.findIndex(a => a.id === id);
    if (idx === -1) return null;
    
    const app = data.applications[idx];
    app.replyText = replyText;
    app.meetingLink = meetingLink;
    app.meetingDate = meetingDate;
    app.status = "Contacted";
    
    // Add notification for the student
    const meetingType = app.counselorPreference || "Consultation";
    const text = `${app.universityName} representative replied: "${replyText}". scheduled: ${meetingDate} (${meetingType})`;
    
    const newNotif = {
      id: `not_${Date.now()}`,
      userEmail: app.studentEmail,
      text,
      date: new Date().toISOString().split('T')[0],
      read: false,
      link: meetingLink
    };
    data.notifications.push(newNotif);
    
    writeData(data);
    return app;
  },
  updateApplicationStatus: (id, status) => {
    const data = readData();
    const idx = data.applications.findIndex(a => a.id === id);
    if (idx === -1) return null;
    
    data.applications[idx].status = status;
    
    // Add notification for student
    const newNotif = {
      id: `not_${Date.now()}`,
      userEmail: data.applications[idx].studentEmail,
      text: `Your application for ${data.applications[idx].courseName} status updated to: ${status}`,
      date: new Date().toISOString().split('T')[0],
      read: false,
      link: ""
    };
    data.notifications.push(newNotif);

    writeData(data);
    return data.applications[idx];
  },
  deleteApplication: (id) => {
    const data = readData();
    data.applications = data.applications.filter(a => a.id !== id);
    writeData(data);
    return true;
  },

  // --- NOTIFICATIONS ---
  getNotifications: (email) => {
    const data = readData();
    return data.notifications.filter(n => n.userEmail.toLowerCase() === email.toLowerCase());
  },
  addNotification: (notif) => {
    const data = readData();
    const newNotif = {
      id: `not_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      read: false,
      link: "",
      ...notif
    };
    data.notifications.push(newNotif);
    writeData(data);
    return newNotif;
  },
  markNotificationsAsRead: (email) => {
    const data = readData();
    data.notifications = data.notifications.map(n => {
      if (n.userEmail.toLowerCase() === email.toLowerCase()) {
        return { ...n, read: true };
      }
      return n;
    });
    writeData(data);
    return true;
  },

  // --- CONTACTS ---
  getContacts: () => readData().contacts || [],
  addContact: (contact) => {
    const data = readData();
    if (!data.contacts) data.contacts = [];
    const newContact = {
      id: `con_${Date.now()}`,
      status: "New",
      date: new Date().toISOString().split('T')[0],
      ...contact
    };
    data.contacts.push(newContact);
    writeData(data);
    return newContact;
  },
  deleteContact: (id) => {
    const data = readData();
    if (!data.contacts) return false;
    data.contacts = data.contacts.filter(c => c.id !== id);
    writeData(data);
    return true;
  },

  // --- FORM TEMPLATES ---
  getFormTemplate: (institutionId) => {
    const data = readData();
    if (!data.formTemplates) data.formTemplates = [];
    
    // Support numeric index mapping or string IDs
    let lookupId = String(institutionId);
    if (lookupId === "1") lookupId = "uni_1";
    if (lookupId === "2") lookupId = "uni_2";

    let ft = data.formTemplates.find(t => String(t.institutionId) === lookupId);
    if (!ft) {
      const fixedSects = [
        { name: "Personal Information", fields: ["Full name", "Date of birth", "Nationality", "Email", "Phone number", "Current country of residence"] },
        { name: "Academic Background", fields: ["Highest qualification", "Institution attended", "Graduation year", "GPA / grade", "Field of study"] },
        { name: "Programme Selection", fields: ["Preferred programme", "Study mode", "Intake / start date", "Campus / online preference"] },
        { name: "Work Experience", fields: ["Current job title", "Employer", "Years of experience", "Industry"] },
        { name: "Declaration and Consent", fields: ["Confirmation checkbox"] }
      ];
      ft = {
        institutionId: lookupId,
        fixed_sections: fixedSects,
        optional_sections: []
      };
      data.formTemplates.push(ft);
      writeData(data);
    }
    return ft;
  },
  updateFormTemplate: (institutionId, optionalSections) => {
    const data = readData();
    if (!data.formTemplates) data.formTemplates = [];
    
    let lookupId = String(institutionId);
    if (lookupId === "1") lookupId = "uni_1";
    if (lookupId === "2") lookupId = "uni_2";

    let idx = data.formTemplates.findIndex(t => String(t.institutionId) === lookupId);
    if (idx === -1) {
      const fixedSects = [
        { name: "Personal Information", fields: ["Full name", "Date of birth", "Nationality", "Email", "Phone number", "Current country of residence"] },
        { name: "Academic Background", fields: ["Highest qualification", "Institution attended", "Graduation year", "GPA / grade", "Field of study"] },
        { name: "Programme Selection", fields: ["Preferred programme", "Study mode", "Intake / start date", "Campus / online preference"] },
        { name: "Work Experience", fields: ["Current job title", "Employer", "Years of experience", "Industry"] },
        { name: "Declaration and Consent", fields: ["Confirmation checkbox"] }
      ];
      const ft = {
        institutionId: lookupId,
        fixed_sections: fixedSects,
        optional_sections: optionalSections
      };
      data.formTemplates.push(ft);
    } else {
      data.formTemplates[idx].optional_sections = optionalSections;
    }
    writeData(data);
    return true;
  },

  // --- PLATFORM TELEMETRY STATS ---
  getPlatformStats: () => {
    const data = readData();
    if (!data.platformStats) {
      data.platformStats = {
        total_visitors: 14205,
        total_clicks: 9842,
        completed_matches: 2431,
        confirmed_enrollments: 342,
        chatbot_started_journeys: 624
      };
      writeData(data);
    }
    return data.platformStats;
  },
  incrementStat: (key, amount = 1) => {
    const data = readData();
    if (!data.platformStats) {
      data.platformStats = {
        total_visitors: 14205,
        total_clicks: 9842,
        completed_matches: 2431,
        confirmed_enrollments: 342,
        chatbot_started_journeys: 624
      };
    }
    if (data.platformStats[key] === undefined) {
      data.platformStats[key] = 0;
    }
    data.platformStats[key] += amount;
    writeData(data);
    return data.platformStats[key];
  },
  getStatValue: (key, defaultValue = 0) => {
    const data = readData();
    if (!data.platformStats || data.platformStats[key] === undefined) {
      return defaultValue;
    }
    return data.platformStats[key];
  },
  updateInstitutionCredits: (institutionId, amount) => {
    const data = readData();
    let lookupId = String(institutionId);
    if (lookupId === "1") lookupId = "uni_1";
    if (lookupId === "2") lookupId = "uni_2";

    let uniName = "";
    if (lookupId.startsWith("uni_")) {
      const uni = data.universities.find(u => String(u.id) === lookupId);
      if (uni) {
        uniName = uni.name;
      }
    } else if (lookupId.startsWith("usr_")) {
      const user = data.users.find(u => String(u.id) === lookupId);
      if (user && user.role === 'University') {
        uniName = user.universityName;
      }
    } else {
      // Fallback: search if lookupId is actually a name
      const uni = data.universities.find(u => u.name.toLowerCase().includes(lookupId.toLowerCase()));
      if (uni) {
        uniName = uni.name;
      }
    }

    if (!uniName) {
      // Try resolving directly by user email or name
      const user = data.users.find(u => String(u.id) === lookupId || u.email?.toLowerCase() === lookupId.toLowerCase());
      if (user && user.role === 'University') {
        user.credits = (user.credits || 0) + amount;
        writeData(data);
        return user.credits;
      }
      return false;
    }

    const userIdx = data.users.findIndex(u => u.role === 'University' && u.universityName === uniName);
    if (userIdx !== -1) {
      data.users[userIdx].credits = (data.users[userIdx].credits || 0) + amount;
      writeData(data);
      return data.users[userIdx].credits;
    }
    return false;
  }
};

