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
        email: "aus@sapiomatch.ai",
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
        email: "birmingham@sapiomatch.ai",
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
        email: "operator@sapiomatch.ai",
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
      { id: "uni_1", name: "American University of Sharjah", email: "aus@sapiomatch.ai" },
      { id: "uni_2", name: "University of Birmingham Dubai", email: "birmingham@sapiomatch.ai" }
    ],
    notifications: [
      {
        id: "not_1",
        userEmail: "sanji@example.com",
        text: "Welcome to SapioMatch! You have been allocated 10 Standard credits.",
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
    ]
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
  }
};
