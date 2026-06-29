import fs from 'fs';
import path from 'path';
import { MongoClient } from 'mongodb';

const DB_PATH = path.resolve(process.cwd(), 'database.json');

// --- MongoDB Client Configuration ---
const MONGODB_URI = process.env.MONGODB_URI;
let mongoClient = null;
let mongoDb = null;
let isConnected = false;

if (MONGODB_URI) {
  try {
    mongoClient = new MongoClient(MONGODB_URI);
  } catch (err) {
    console.error("[db.js] Failed to initialize MongoClient:", err);
  }
}

async function getMongoDb() {
  if (!mongoClient) return null;
  if (!isConnected) {
    try {
      await mongoClient.connect();
      mongoDb = mongoClient.db('sapiomatch');
      isConnected = true;
      console.log("[db.js] Connected to MongoDB database.");
    } catch (err) {
      console.error("[db.js] MongoDB connection error:", err);
      return null;
    }
  }
  return mongoDb;
}

// --- Local File Database Handlers (Fallback) ---
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

function writeData(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error("Error writing database file:", err);
    return false;
  }
}

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
    ],
    aiInteractions: [],
    catalog: {
      countries: ["United States", "United Kingdom", "Canada", "Australia", "Germany", "United Arab Emirates"],
      subjects: ["Computer Science", "Business Administration", "Data Science", "Law & Public Policy", "Healthcare & Sciences", "Engineering"]
    }
  };
}

// --- Unified Async Database Accessors ---
export const db = {
  // --- USERS ---
  getUsers: async () => {
    const mongo = await getMongoDb();
    if (mongo) {
      return await mongo.collection('users').find({}).toArray();
    }
    return readData().users;
  },

  getUserByEmail: async (email) => {
    const mongo = await getMongoDb();
    if (mongo) {
      return await mongo.collection('users').findOne({ email: { $regex: new RegExp('^' + email + '$', 'i') } });
    }
    return readData().users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  addUser: async (user) => {
    const newUser = {
      id: `usr_${Date.now()}`,
      status: "Active",
      plan: user.role === 'Student' ? 'Standard' : 'Premium',
      credits: user.role === 'Student' ? 10 : 0,
      ...user
    };

    const mongo = await getMongoDb();
    if (mongo) {
      await mongo.collection('users').insertOne(newUser);
      return newUser;
    }

    const data = readData();
    data.users.push(newUser);
    writeData(data);
    return newUser;
  },

  updateUser: async (email, updates) => {
    const mongo = await getMongoDb();
    if (mongo) {
      await mongo.collection('users').updateOne(
        { email: { $regex: new RegExp('^' + email + '$', 'i') } },
        { $set: updates }
      );
      return await mongo.collection('users').findOne({ email: { $regex: new RegExp('^' + email + '$', 'i') } });
    }

    const data = readData();
    const idx = data.users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (idx === -1) return null;
    data.users[idx] = { ...data.users[idx], ...updates };
    writeData(data);
    return data.users[idx];
  },

  deleteUser: async (id) => {
    const mongo = await getMongoDb();
    if (mongo) {
      await mongo.collection('users').deleteOne({ id });
      return true;
    }

    const data = readData();
    data.users = data.users.filter(u => u.id !== id);
    writeData(data);
    return true;
  },

  // --- UNIVERSITIES ---
  getUniversities: async () => {
    const mongo = await getMongoDb();
    if (mongo) {
      return await mongo.collection('universities').find({}).toArray();
    }
    return readData().universities;
  },

  addUniversity: async (uni) => {
    const newUni = {
      id: `uni_${Date.now()}`,
      ...uni
    };
    const uniUser = {
      id: `usr_${Date.now()}`,
      name: `${uni.name} representative`,
      email: uni.email,
      password: "password",
      role: "University",
      contactNumber: "",
      plan: "Premium",
      credits: 0,
      status: "Active",
      universityName: uni.name
    };

    const mongo = await getMongoDb();
    if (mongo) {
      await mongo.collection('universities').insertOne(newUni);
      await mongo.collection('users').insertOne(uniUser);
      return newUni;
    }

    const data = readData();
    data.universities.push(newUni);
    data.users.push(uniUser);
    writeData(data);
    return newUni;
  },

  // --- APPLICATIONS ---
  getApplications: async () => {
    const mongo = await getMongoDb();
    if (mongo) {
      return await mongo.collection('applications').find({}).toArray();
    }
    return readData().applications;
  },

  addApplication: async (app) => {
    const newApp = {
      id: `app_${Date.now()}`,
      status: "Under Review",
      date: new Date().toISOString().split('T')[0],
      replyText: "",
      meetingLink: "",
      meetingDate: "",
      ...app
    };
    const newNotif = {
      id: `not_${Date.now()}`,
      userEmail: app.studentEmail,
      text: `Your application for ${app.courseName} at ${app.universityName} has been submitted successfully.`,
      date: new Date().toISOString().split('T')[0],
      read: false,
      link: ""
    };

    const mongo = await getMongoDb();
    if (mongo) {
      await mongo.collection('applications').insertOne(newApp);
      await mongo.collection('notifications').insertOne(newNotif);
      return newApp;
    }

    const data = readData();
    data.applications.push(newApp);
    data.notifications.push(newNotif);
    writeData(data);
    return newApp;
  },

  updateApplicationReply: async (id, replyText, meetingLink, meetingDate) => {
    const mongo = await getMongoDb();
    if (mongo) {
      await mongo.collection('applications').updateOne(
        { id },
        { $set: { replyText, meetingLink, meetingDate, status: "Contacted" } }
      );
      const app = await mongo.collection('applications').findOne({ id });
      if (!app) return null;

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
      await mongo.collection('notifications').insertOne(newNotif);
      return app;
    }

    const data = readData();
    const idx = data.applications.findIndex(a => a.id === id);
    if (idx === -1) return null;

    const app = data.applications[idx];
    app.replyText = replyText;
    app.meetingLink = meetingLink;
    app.meetingDate = meetingDate;
    app.status = "Contacted";

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

  updateApplicationStatus: async (id, status) => {
    const mongo = await getMongoDb();
    if (mongo) {
      await mongo.collection('applications').updateOne({ id }, { $set: { status } });
      const app = await mongo.collection('applications').findOne({ id });
      if (!app) return null;

      const newNotif = {
        id: `not_${Date.now()}`,
        userEmail: app.studentEmail,
        text: `Your application for ${app.courseName} status updated to: ${status}`,
        date: new Date().toISOString().split('T')[0],
        read: false,
        link: ""
      };
      await mongo.collection('notifications').insertOne(newNotif);
      return app;
    }

    const data = readData();
    const idx = data.applications.findIndex(a => a.id === id);
    if (idx === -1) return null;

    data.applications[idx].status = status;
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

  deleteApplication: async (id) => {
    const mongo = await getMongoDb();
    if (mongo) {
      await mongo.collection('applications').deleteOne({ id });
      return true;
    }

    const data = readData();
    data.applications = data.applications.filter(a => a.id !== id);
    writeData(data);
    return true;
  },

  // --- NOTIFICATIONS ---
  getNotifications: async (email) => {
    const mongo = await getMongoDb();
    if (mongo) {
      return await mongo.collection('notifications').find({ userEmail: { $regex: new RegExp('^' + email + '$', 'i') } }).toArray();
    }
    return readData().notifications.filter(n => n.userEmail.toLowerCase() === email.toLowerCase());
  },

  addNotification: async (notif) => {
    const newNotif = {
      id: `not_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      read: false,
      link: "",
      ...notif
    };

    const mongo = await getMongoDb();
    if (mongo) {
      await mongo.collection('notifications').insertOne(newNotif);
      return newNotif;
    }

    const data = readData();
    data.notifications.push(newNotif);
    writeData(data);
    return newNotif;
  },

  markNotificationsAsRead: async (email) => {
    const mongo = await getMongoDb();
    if (mongo) {
      await mongo.collection('notifications').updateMany(
        { userEmail: { $regex: new RegExp('^' + email + '$', 'i') } },
        { $set: { read: true } }
      );
      return true;
    }

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
  getContacts: async () => {
    const mongo = await getMongoDb();
    if (mongo) {
      return await mongo.collection('contacts').find({}).toArray();
    }
    return readData().contacts || [];
  },

  addContact: async (contact) => {
    const newContact = {
      id: `con_${Date.now()}`,
      status: "New",
      date: new Date().toISOString().split('T')[0],
      ...contact
    };

    const mongo = await getMongoDb();
    if (mongo) {
      await mongo.collection('contacts').insertOne(newContact);
      return newContact;
    }

    const data = readData();
    if (!data.contacts) data.contacts = [];
    data.contacts.push(newContact);
    writeData(data);
    return newContact;
  },

  deleteContact: async (id) => {
    const mongo = await getMongoDb();
    if (mongo) {
      await mongo.collection('contacts').deleteOne({ id });
      return true;
    }

    const data = readData();
    if (!data.contacts) return false;
    data.contacts = data.contacts.filter(c => c.id !== id);
    writeData(data);
    return true;
  },

  // --- AI INTERACTIONS ---
  getAiInteractions: async () => {
    const mongo = await getMongoDb();
    if (mongo) {
      return await mongo.collection('ai_interactions').find({}).toArray();
    }
    return readData().aiInteractions || [];
  },

  addAiInteraction: async (interaction) => {
    const newInteraction = {
      id: `ai_${Date.now()}`,
      date: new Date().toISOString(),
      ...interaction
    };

    const mongo = await getMongoDb();
    if (mongo) {
      await mongo.collection('ai_interactions').insertOne(newInteraction);
      return newInteraction;
    }

    const data = readData();
    if (!data.aiInteractions) data.aiInteractions = [];
    data.aiInteractions.push(newInteraction);
    writeData(data);
    return newInteraction;
  },

  // --- CATALOG ---
  getCatalog: async () => {
    const mongo = await getMongoDb();
    if (mongo) {
      let cat = await mongo.collection('catalog').findOne({});
      if (!cat) {
        cat = {
          countries: ["United States", "United Kingdom", "Canada", "Australia", "Germany", "United Arab Emirates"],
          subjects: ["Computer Science", "Business Administration", "Data Science", "Law & Public Policy", "Healthcare & Sciences", "Engineering"]
        };
        await mongo.collection('catalog').insertOne(cat);
      }
      return cat;
    }

    const data = readData();
    if (!data.catalog) {
      data.catalog = {
        countries: ["United States", "United Kingdom", "Canada", "Australia", "Germany", "United Arab Emirates"],
        subjects: ["Computer Science", "Business Administration", "Data Science", "Law & Public Policy", "Healthcare & Sciences", "Engineering"]
      };
      writeData(data);
    }
    return data.catalog;
  },

  updateCatalog: async (catalog) => {
    const mongo = await getMongoDb();
    if (mongo) {
      await mongo.collection('catalog').deleteMany({});
      await mongo.collection('catalog').insertOne(catalog);
      return catalog;
    }

    const data = readData();
    data.catalog = catalog;
    writeData(data);
    return data.catalog;
  }
};
