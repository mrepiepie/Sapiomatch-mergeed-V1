"use client";

import React, { useState, useRef, useEffect } from 'react';
import Home from '../views/Home';
import Explore from '../views/Explore';
import InstitutionDetail from '../views/InstitutionDetail';
import Questionnaire from '../views/Questionnaire';
import Results from '../views/Results';
import UserDashboard from '../views/UserDashboard';
import InstitutionDashboard from '../views/InstitutionDashboard';
import AdminDashboard from '../views/AdminDashboard';
import Auth from '../views/Auth';
import About from '../views/About';
import Contact from '../views/Contact';
import RoleSwitcher from '../components/RoleSwitcher';
import SapioVisualShell from '../components/SapioVisualShell';
import SapioLegacySections from '../components/SapioLegacySections';
import CheckoutModal from '../components/CheckoutModal';
import { mockInstitutions, mockQuestions } from '../mockData';
import { generateAiResponse } from '../services/aiEngine';
import { 
  Compass, Sparkles, GraduationCap, ArrowRight, MessageSquare, 
  Send, X, LogOut, LogIn, User, CheckCircle, ShieldAlert, 
  Settings, Bell, CheckSquare, Calendar, Phone, Mail, FileText, Check 
} from 'lucide-react';

// --- BROWSER LOCALSTORAGE MOCK DATABASE & FETCH INTERCEPTOR ---
const handleMockFetch = async (url, init) => {
  if (typeof window === 'undefined') return new Response(JSON.stringify({}), { status: 200 });

  if (!localStorage.getItem('sapio_db')) {
    localStorage.setItem('sapio_db', JSON.stringify({
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
      catalog: {
        countries: ["United States", "United Kingdom", "Canada", "Australia", "Germany", "United Arab Emirates"],
        subjects: ["Computer Science", "Business Administration", "Data Science", "Law & Public Policy", "Healthcare & Sciences", "Engineering"]
      }
    }));
  }

  const getDb = () => JSON.parse(localStorage.getItem('sapio_db'));
  const saveDb = (db) => localStorage.setItem('sapio_db', JSON.stringify(db));

  const makeResponse = (data, status = 200) => {
    return new Response(JSON.stringify(data), {
      status,
      headers: { 'Content-Type': 'application/json' }
    });
  };

  const db = getDb();
  const method = init?.method?.toUpperCase() || 'GET';
  const body = init?.body ? JSON.parse(init.body) : null;

  // Route: /api/auth/login
  if (url.includes('/api/auth/login')) {
    const { email, password } = body || {};
    const user = db.users.find(u => u.email.toLowerCase() === email?.toLowerCase());
    if (!user || user.password !== password) {
      return makeResponse({ error: 'Invalid email or password.' }, 401);
    }
    return makeResponse({
      name: user.name,
      email: user.email,
      role: user.role,
      contactNumber: user.contactNumber,
      plan: user.plan,
      credits: user.credits,
      universityName: user.universityName || ''
    });
  }

  // Route: /api/auth/register
  if (url.includes('/api/auth/register')) {
    const { name, email, password, contactNumber, role } = body || {};
    if (db.users.some(u => u.email.toLowerCase() === email?.toLowerCase())) {
      return makeResponse({ error: 'User already exists.' }, 400);
    }
    const newUser = {
      id: `usr_${Date.now()}`,
      name,
      email,
      password,
      contactNumber,
      role,
      plan: role === 'Student' ? 'Standard' : 'Premium',
      credits: role === 'Student' ? 10 : 0,
      status: "Active",
      universityName: role === 'University' ? 'University of Birmingham Dubai' : '' // fallback default
    };
    db.users.push(newUser);
    
    db.notifications.push({
      id: `not_${Date.now()}`,
      userEmail: email,
      text: "Welcome to SapioMatch! You have been allocated 10 Standard credits.",
      date: new Date().toISOString().split('T')[0],
      read: false,
      link: ""
    });

    saveDb(db);
    return makeResponse({
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      contactNumber: newUser.contactNumber,
      plan: newUser.plan,
      credits: newUser.credits,
      universityName: newUser.universityName || ''
    });
  }

  // Route: /api/applications/[id]/reply (POST)
  const replyMatch = url.match(/\/api\/applications\/([^/?#]+)\/reply/);
  if (replyMatch && method === 'POST') {
    const appId = replyMatch[1];
    const { replyText, meetingLink, meetingDate, status } = body || {};
    const appIdx = db.applications.findIndex(a => a.id === appId);
    if (appIdx === -1) {
      return makeResponse({ error: 'Application not found.' }, 404);
    }
    const app = db.applications[appIdx];
    
    if (replyText || meetingLink || meetingDate) {
      app.replyText = replyText || '';
      app.meetingLink = meetingLink || '';
      app.meetingDate = meetingDate || '';
    }
    if (status) {
      app.status = status;
    }

    const textStatus = status === 'Accepted' ? 'Approved' : (status === 'Cancelled' ? 'Cancelled' : status);
    
    // Add notification for the student
    const meetingType = app.counselorPreference || "Consultation";
    const text = `Your application for ${app.courseName} status updated: ${textStatus}. Reply: "${replyText || 'No custom notes'}" - Scheduled: ${meetingDate || 'N/A'} (${meetingType}).`;
    db.notifications.push({
      id: `not_${Date.now()}`,
      userEmail: app.studentEmail,
      text,
      date: new Date().toISOString().split('T')[0],
      read: false,
      link: meetingLink || ""
    });

    saveDb(db);
    return makeResponse({ success: true, application: app });
  }

  // Route: /api/applications (GET or POST)
  if (url.includes('/api/applications')) {
    if (method === 'GET') {
      const urlObj = new URL(url, window.location.origin);
      const role = urlObj.searchParams.get('role');
      const email = urlObj.searchParams.get('email');
      const universityName = urlObj.searchParams.get('universityName');

      if (role === 'Student') {
        const filtered = db.applications.filter(app => app.studentEmail?.toLowerCase() === email?.toLowerCase());
        return makeResponse(filtered);
      } else if (role === 'University') {
        if (!universityName || universityName.trim() === '') {
          return makeResponse([]);
        }
        const filtered = db.applications.filter(app => app.universityName?.toLowerCase() === universityName?.toLowerCase());
        return makeResponse(filtered);
      } else if (role === 'Admin') {
        return makeResponse(db.applications);
      }
      return makeResponse({ error: 'Unauthorized or missing role.' }, 401);
    }

    if (method === 'POST') {
      const {
        studentName,
        studentEmail,
        studentContact,
        cgpa,
        sop,
        universityName,
        courseName,
        counselorPreference,
        chatSlot
      } = body || {};

      const studentIdx = db.users.findIndex(u => u.email.toLowerCase() === studentEmail?.toLowerCase());
      if (studentIdx === -1) {
        return makeResponse({ error: 'Student account not found.' }, 404);
      }
      const student = db.users[studentIdx];
      if (student.role !== 'Admin' && student.credits < 2) {
        return makeResponse({ error: 'Insufficient credits.' }, 400);
      }

      if (student.role !== 'Admin') {
        student.credits = Math.max(0, student.credits - 2);
      }

      const newApp = {
        id: `app_${Date.now()}`,
        studentName: studentName || student.name,
        studentEmail,
        studentContact: studentContact || student.contactNumber,
        cgpa: cgpa || '1.0',
        sop: sop || '',
        universityName,
        courseName,
        counselorPreference: counselorPreference || 'No Counselor',
        chatSlot: chatSlot || '',
        status: 'Under Review',
        date: new Date().toISOString().split('T')[0],
        replyText: "",
        meetingLink: "",
        meetingDate: ""
      };
      db.applications.push(newApp);

      // Create notification for student
      db.notifications.push({
        id: `not_${Date.now()}`,
        userEmail: studentEmail,
        text: `Your application for "${courseName}" at ${universityName} has been submitted. Status: Waiting for Approval.`,
        date: new Date().toISOString().split('T')[0],
        read: false,
        link: ""
      });

      // Trigger standard Gmail Notification
      window.dispatchEvent(new CustomEvent('sapio_gmail_alert', {
        detail: {
          to: studentEmail,
          subject: `Application Submitted: ${courseName} - ${universityName}`,
          body: `Dear ${studentName || student.name},\n\nYour application has been received by ${universityName}.\n\nPrior CGPA: ${cgpa}\nPreference: ${counselorPreference}\n\nStatus: Waiting for Approval.\n\nThank you for using SapioMatch.`
        }
      }));

      saveDb(db);
      return makeResponse({
        success: true,
        application: newApp,
        creditsRemaining: student.credits
      });
    }
  }

  // Route: /api/notifications (GET or POST)
  if (url.includes('/api/notifications')) {
    if (method === 'GET') {
      const urlObj = new URL(url, window.location.origin);
      const email = urlObj.searchParams.get('email');
      const filtered = db.notifications.filter(n => n.userEmail.toLowerCase() === email?.toLowerCase());
      filtered.sort((a, b) => b.id.localeCompare(a.id));
      return makeResponse(filtered);
    }
    if (method === 'POST') {
      const { email } = body || {};
      db.notifications = db.notifications.map(n => {
        if (n.userEmail.toLowerCase() === email?.toLowerCase()) {
          return { ...n, read: true };
        }
        return n;
      });
      saveDb(db);
      return makeResponse({ success: true });
    }
  }

  // Route: /api/users (GET or DELETE)
  if (url.includes('/api/users')) {
    const urlObj = new URL(url, window.location.origin);
    const id = urlObj.searchParams.get('id');
    if (method === 'GET') {
      return makeResponse(db.users);
    }
    if (method === 'DELETE') {
      db.users = db.users.filter(u => u.id !== id);
      saveDb(db);
      return makeResponse({ success: true });
    }
  }

  // Route: /api/universities (POST)
  if (url.includes('/api/universities')) {
    if (method === 'POST') {
      const { name, email } = body || {};
      const newUni = { id: `uni_${Date.now()}`, name, email };
      db.universities.push(newUni);

      const uniUser = {
        id: `usr_${Date.now()}`,
        name: `${name} representative`,
        email,
        password: "password",
        role: "University",
        contactNumber: "",
        plan: "Premium",
        credits: 0,
        status: "Active",
        universityName: name
      };
      db.users.push(uniUser);

      saveDb(db);
      return makeResponse({ success: true, university: newUni });
    }
  }

  // Route: /api/catalog (GET or POST)
  if (url.includes('/api/catalog')) {
    if (!db.catalog) {
      db.catalog = {
        countries: ["United States", "United Kingdom", "Canada", "Australia", "Germany", "United Arab Emirates"],
        subjects: ["Computer Science", "Business Administration", "Data Science", "Law & Public Policy", "Healthcare & Sciences", "Engineering"]
      };
      saveDb(db);
    }
    if (method === 'GET') {
      return makeResponse(db.catalog);
    }
    if (method === 'POST') {
      const { countries, subjects } = body || {};
      db.catalog = { countries, subjects };
      saveDb(db);
      return makeResponse({ success: true, catalog: db.catalog });
    }
  }

  // Route: /api/contact (GET, POST, or DELETE)
  if (url.includes('/api/contact')) {
    const urlObj = new URL(url, typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
    const id = urlObj.searchParams.get('id');
    
    if (method === 'GET') {
      return makeResponse(db.contacts || []);
    }
    
    if (method === 'POST') {
      const { fullName, email, phone, inquiryType, message } = body || {};
      if (!fullName || !email || !inquiryType || !message) {
        return makeResponse({ error: 'Missing required fields.' }, 400);
      }
      const newContact = {
        id: `con_${Date.now()}`,
        fullName,
        email,
        phone: phone || '',
        inquiryType,
        message,
        status: "New",
        date: new Date().toISOString().split('T')[0]
      };
      if (!db.contacts) db.contacts = [];
      db.contacts.push(newContact);
      saveDb(db);
      return makeResponse({ success: true, contact: newContact }, 201);
    }
    
    if (method === 'DELETE') {
      if (!id) {
        return makeResponse({ error: 'Inquiry ID is required.' }, 400);
      }
      if (!db.contacts) db.contacts = [];
      db.contacts = db.contacts.filter(c => c.id !== id);
      saveDb(db);
      return makeResponse({ success: true });
    }
  }

  // Route: /api/activity (GET)
  if (url.includes('/api/activity')) {
    if (method === 'GET') {
      const users = db.users || [];
      const applications = db.applications || [];
      const contacts = db.contacts || [];
      const aiInteractions = db.aiInteractions || [];

      const userLogs = users.map(u => {
        const ts = u.id.startsWith('usr_') && !['usr_1', 'usr_2', 'usr_3', 'usr_4'].includes(u.id)
          ? parseInt(u.id.split('_')[1])
          : new Date("2026-06-13").getTime();
        return {
          id: u.id,
          type: 'auth',
          text: u.role === 'Student'
            ? `New student account registered: ${u.email}`
            : `New university partner portal registered: ${u.universityName || u.name} (${u.email})`,
          timestamp: ts
        };
      });

      const appLogs = applications.map(a => {
        const ts = a.id.startsWith('app_') && a.id !== 'app_1'
          ? parseInt(a.id.split('_')[1])
          : new Date(a.date || "2026-06-13").getTime();
        return {
          id: a.id,
          type: 'application',
          text: `${a.studentName} submitted application for ${a.courseName} at ${a.universityName}`,
          timestamp: ts
        };
      });

      const contactLogs = contacts.map(c => {
        const ts = c.id.startsWith('con_') && c.id !== 'con_1'
          ? parseInt(c.id.split('_')[1])
          : new Date(c.date || "2026-06-13").getTime();
        return {
          id: c.id,
          type: 'inquiry',
          text: `Partnership inquiry received from ${c.fullName} (${c.inquiryType})`,
          timestamp: ts
        };
      });

      const aiLogs = aiInteractions.map(ai => {
        const ts = ai.id.startsWith('ai_')
          ? parseInt(ai.id.split('_')[1])
          : new Date(ai.date || "2026-06-13").getTime();
        return {
          id: ai.id,
          type: 'match',
          text: `Gemini AI Chat: "${ai.prompt.substring(0, 60)}${ai.prompt.length > 60 ? '...' : ''}"`,
          timestamp: ts
        };
      });

      const allLogs = [...userLogs, ...appLogs, ...contactLogs, ...aiLogs];
      allLogs.sort((a, b) => b.timestamp - a.timestamp);

      const getTrafficValue = (hoursAgo) => {
        const timeMs = Date.now() - hoursAgo * 3600 * 1000;
        
        const countInHour = 
          users.filter(u => {
            const ts = u.id.startsWith('usr_') && !['usr_1', 'usr_2', 'usr_3', 'usr_4'].includes(u.id) ? parseInt(u.id.split('_')[1]) : 0;
            return ts > timeMs - 3600*1000 && ts <= timeMs;
          }).length +
          applications.filter(a => {
            const ts = a.id.startsWith('app_') && a.id !== 'app_1' ? parseInt(a.id.split('_')[1]) : 0;
            return ts > timeMs - 3600*1000 && ts <= timeMs;
          }).length +
          contacts.filter(c => {
            const ts = c.id.startsWith('con_') && c.id !== 'con_1' ? parseInt(c.id.split('_')[1]) : 0;
            return ts > timeMs - 3600*1000 && ts <= timeMs;
          }).length +
          aiInteractions.filter(ai => {
            const ts = ai.id.startsWith('ai_') ? parseInt(ai.id.split('_')[1]) : 0;
            return ts > timeMs - 3600*1000 && ts <= timeMs;
          }).length;
        
        const date = new Date(timeMs);
        const hour = date.getHours();
        const timeFactor = Math.sin(((hour - 8) / 24) * 2 * Math.PI); // -1 to 1
        const baseTraffic = Math.floor(130 + timeFactor * 45); // 85 to 175
        
        return Math.max(90, baseTraffic + countInHour * 15);
      };

      const trafficHistory = [6, 5, 4, 3, 2, 1, 0].map(h => getTrafficValue(h));
      const liveVisitors = trafficHistory[6];

      return makeResponse({
        logs: allLogs,
        liveVisitors,
        trafficHistory
      });
    }
  }

  return makeResponse({ error: 'Endpoint not mocked client-side.' }, 404);
};

if (typeof window !== 'undefined') {
  if (!window.originalFetch) {
    window.originalFetch = window.fetch;
    window.fetch = async function (input, init) {
      const url = typeof input === 'string' ? input : input.url;
      if (url.includes('/api/') && !url.includes('/api/chat') && !url.includes('/api/parse-resume')) {
        try {
          return await handleMockFetch(url, init);
        } catch (err) {
          console.error("Mock fetch intercept failed:", url, err);
        }
      }
      return window.originalFetch.apply(this, arguments);
    };
  }
}

export default function App() {
  const [gmailToast, setGmailToast] = useState(null);

  useEffect(() => {
    const handleGmailAlert = (e) => {
      setGmailToast(e.detail);
      // Auto close after 7 seconds
      const timer = setTimeout(() => {
        setGmailToast(null);
      }, 7000);
      return () => clearTimeout(timer);
    };
    window.addEventListener('sapio_gmail_alert', handleGmailAlert);
    return () => window.removeEventListener('sapio_gmail_alert', handleGmailAlert);
  }, []);

  const [view, setViewInternal] = useState('public-home');

  const setView = (newView) => {
    setViewInternal(newView);
    if (typeof window !== 'undefined') {
      if (window.location.hash !== `#${newView}`) {
        window.history.pushState({ view: newView }, '', `#${newView}`);
      }
    }
  };

  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state && event.state.view) {
        setViewInternal(event.state.view);
      } else if (window.location.hash) {
        const hashView = window.location.hash.replace('#', '');
        if (hashView) setViewInternal(hashView);
      } else {
        setViewInternal('public-home');
      }
    };

    window.addEventListener('popstate', handlePopState);

    if (typeof window !== 'undefined') {
      if (window.location.hash) {
        const hashView = window.location.hash.replace('#', '');
        if (hashView) {
          setViewInternal(hashView);
          window.history.replaceState({ view: hashView }, '', `#${hashView}`);
        }
      } else {
        window.history.replaceState({ view: 'public-home' }, '', '#public-home');
      }
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('sapio-home-snap', view === 'public-home');

    return () => root.classList.remove('sapio-home-snap');
  }, [view]);

  const [questions, setQuestions] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sapio_questions');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Error loading saved questions", e);
        }
      }
    }
    return mockQuestions;
  });

  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing AI Advisor Aria...');

  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 8) + 4;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setLoadingProgress(100);
        setLoadingText('Connection Established. Welcome!');
        
        setTimeout(() => {
          setLoading(false);
        }, 300);
      } else {
        setLoadingProgress(progress);
        if (progress < 25) {
          setLoadingText('Initializing SapioMatch AI Advisor...');
        } else if (progress < 50) {
          setLoadingText('Loading verified global institution templates...');
        } else if (progress < 75) {
          setLoadingText('Connecting to persistent database ledger...');
        } else {
          setLoadingText('Optimizing Next.js recommendation models...');
        }
      }
    }, 40);

    return () => clearInterval(interval);
  }, []);

  const [selectedInstId, setSelectedInstId] = useState('university-birmingham-dubai');
  const [exploreSearchTerm, setExploreSearchTerm] = useState('');
  const [pendingGlobeInstId, setPendingGlobeInstId] = useState(null);
  const [bookmarks, setBookmarks] = useState([1]);
  const [completedQuiz, setCompletedQuiz] = useState(false);
  const [answers, setAnswers] = useState({
    name: 'Sanji',
    age: '',
    education: '',
    field: '',
    goal: '',
    region: '',
    format: '',
    budget: '',
    timeline: '',
    experience: ''
  });

  // Global Auth State
  const [currentUser, setCurrentUser] = useState(null); // null means logged out

  const resolveInstitutionId = (detail = {}) => {
    const normalize = (value) => String(value || '')
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const slug = normalize(detail.slug);
    const name = normalize(detail.name);
    const aliases = {
      'university-of-birmingham-dubai': 'university-birmingham-dubai',
      'birmingham-dubai': 'university-birmingham-dubai',
      'american-university-of-sharjah': 'american-university-sharjah',
      'aus': 'american-university-sharjah',
      'middlesex-university-dubai': 'middlesex-university-dubai',
      'astrolabs': 'astrolabs-academy',
      'astrolabs-academy': 'astrolabs-academy',
      'coursera': 'coursera',
      'udemy': 'udemy'
    };

    const aliasMatch = aliases[slug] || aliases[name];
    if (aliasMatch && mockInstitutions.some(inst => inst.id === aliasMatch)) return aliasMatch;

    const institutionMatch = mockInstitutions.find(inst => {
      const instId = normalize(inst.id);
      const instName = normalize(inst.name);
      return instId === slug || instName === slug || instName === name || instName.includes(name) || name.includes(instName);
    });

    return institutionMatch?.id || null;
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const dbStr = localStorage.getItem('sapio_db');
    if (!dbStr) return;
    try {
      const db = JSON.parse(dbStr);
      if (view === 'institution-dashboard' && currentUser?.role !== 'University') {
        const birmUser = db.users.find(u => u.email === 'birmingham@sapiomatch.ai');
        if (birmUser) {
          setCurrentUser(birmUser);
        }
      } else if (view === 'admin-dashboard' && currentUser?.role !== 'Admin') {
        const adminUser = db.users.find(u => u.email === 'operator@sapiomatch.ai');
        if (adminUser) {
          setCurrentUser(adminUser);
        }
      } else if (view === 'user-dashboard' && currentUser?.role !== 'Student') {
        const studentUser = db.users.find(u => u.email === 'sanji@example.com');
        if (studentUser) {
          setCurrentUser(studentUser);
        }
      }
    } catch (e) {
      console.error("Auto session switcher failed:", e);
    }
  }, [view]);

  // Monetization & Credit System States
  const [credits, setCredits] = useState(10); // Default standard = 10 (reduced from 100)
  const [plan, setPlan] = useState('Standard');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleCheckoutSuccess = async () => {
    const nextPlan = 'Premium';
    const nextCredits = (currentUser ? currentUser.credits : credits) + 700;

    setPlan(nextPlan);
    setCredits(nextCredits);

    const updates = { plan: nextPlan, credits: nextCredits };

    if (currentUser) {
      setCurrentUser(prev => (prev ? { ...prev, ...updates } : prev));

      // Update in backend database
      try {
        await fetch('/api/users', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: currentUser.email,
            updates
          })
        });
      } catch (err) {
        console.error("Failed to sync membership update to backend:", err);
      }

      // Update in client local storage
      try {
        const dbStr = localStorage.getItem('sapio_db');
        if (dbStr) {
          const localDb = JSON.parse(dbStr);
          localDb.users = (localDb.users || []).map(user => (
            user.email?.toLowerCase() === currentUser.email.toLowerCase()
              ? { ...user, ...updates }
              : user
          ));
          localStorage.setItem('sapio_db', JSON.stringify(localDb));
        }
      } catch (err) {
        console.error("Failed to persist membership update locally:", err);
      }
      
      triggerAlert("Successfully upgraded to Premium! 700 credits added to your balance.", "Upgrade Successful", "success");
    } else {
      triggerAlert("Successfully upgraded to Premium! 700 credits added to guest balance.", "Upgrade Successful", "success");
    }
  };

  const updateCurrentUserMembership = ({ plan: nextPlan, credits: nextCredits }) => {
    // If they want to upgrade to Premium, open the CheckoutModal!
    if (nextPlan === 'Premium') {
      setIsCheckoutOpen(true);
      return;
    }

    const updates = {};
    if (nextPlan !== undefined) {
      updates.plan = nextPlan;
      setPlan(nextPlan);
    }
    if (nextCredits !== undefined) {
      updates.credits = nextCredits;
      setCredits(nextCredits);
    }

    if (!currentUser?.email || Object.keys(updates).length === 0) return;

    setCurrentUser(prev => (prev ? { ...prev, ...updates } : prev));

    if (typeof window === 'undefined') return;
    try {
      const dbStr = localStorage.getItem('sapio_db');
      if (!dbStr) return;

      const db = JSON.parse(dbStr);
      db.users = (db.users || []).map(user => (
        user.email?.toLowerCase() === currentUser.email.toLowerCase()
          ? { ...user, ...updates }
          : user
      ));
      localStorage.setItem('sapio_db', JSON.stringify(db));
    } catch (err) {
      console.error("Failed to persist membership update:", err);
    }
  };

  // Notifications state
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [navMenuOpen, setNavMenuOpen] = useState(false);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setNavMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Counselor chat slots & queries counts
  const [chatQueryCount, setChatQueryCount] = useState(0);

  // Application Modal states
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [activeApplyCourse, setActiveApplyCourse] = useState(null); // { institution, courseName, requestAiRecommend }
  const [applyForm, setApplyForm] = useState({
    email: '',
    contact: '',
    cgpa: '',
    sop: '',
    counselorPreference: 'No Counselor',
    chatSlot: ''
  });

  // Global custom alert popup state
  const [customAlert, setCustomAlert] = useState({
    isOpen: false,
    title: 'Notification',
    message: '',
    type: 'success'
  });

  const triggerAlert = (message, title = 'Notification', type = 'success') => {
    setCustomAlert({
      isOpen: true,
      title,
      message,
      type
    });
  };

  // Local alert shadowing to handle all standard alert() calls in-app
  const alert = (msg) => {
    let title = 'Notification';
    let type = 'success';
    const m = msg.toLowerCase();
    
    if (m.includes('already') || m.includes('limit') || m.includes('fail') || m.includes('reject') || m.includes('error')) {
      type = 'warning';
      title = 'Attention Required';
    } else if (m.includes('connect') || m.includes('reviewing') || m.includes('partnership') || m.includes('callback') || m.includes('requested') || m.includes('scheduled')) {
      type = 'info';
      title = 'Advisor Center';
    } else if (m.includes('sign out') || m.includes('success') || m.includes('applied') || m.includes('sent') || m.includes('added') || m.includes('deleted') || m.includes('cancelled') || m.includes('approved') || m.includes('complete')) {
      type = 'success';
      title = 'Action Completed';
    }
    
    triggerAlert(msg, title, type);
  };

  useEffect(() => {
    const handleGlobeInstitutionNavigation = (event) => {
      const institutionId = resolveInstitutionId(event.detail || {});

      if (currentUser?.role === 'Student') {
        if (!institutionId) {
          triggerAlert(
            "This university is listed in the globe directory, but a full profile page has not been added yet. Please browse the Explore page for available profiles.",
            "Profile Coming Soon",
            "info"
          );
          setView('public-explore');
          return;
        }

        setSelectedInstId(institutionId);
        setPendingGlobeInstId(null);
        setView('institution-detail');
        return;
      }

      setPendingGlobeInstId(institutionId || 'public-explore');
      triggerAlert(
        "Please sign in with a learner account to view this university profile.",
        "Learner Sign-In Required",
        "warning"
      );
      setView('auth');
    };

    window.addEventListener('sapio:navigate-institution', handleGlobeInstitutionNavigation);
    return () => window.removeEventListener('sapio:navigate-institution', handleGlobeInstitutionNavigation);
  }, [currentUser]);

  useEffect(() => {
    if (!pendingGlobeInstId || currentUser?.role !== 'Student') return;

    if (pendingGlobeInstId === 'public-explore') {
      setPendingGlobeInstId(null);
      triggerAlert(
        "This university is listed in the globe directory, but a full profile page has not been added yet. Please browse the Explore page for available profiles.",
        "Profile Coming Soon",
        "info"
      );
      setView('public-explore');
      return;
    }

    setSelectedInstId(pendingGlobeInstId);
    setPendingGlobeInstId(null);
    setView('institution-detail');
  }, [currentUser, pendingGlobeInstId]);

  useEffect(() => {
    // Hijack browser native alert globally as a fallback
    window.alert = alert;
  }, []);

  // Sync state to current logged in user details
  useEffect(() => {
    // Clear old state immediately to prevent leakage during transition
    setNotifications([]);
    setAppliedCourses([]);

    if (currentUser) {
      setPlan(currentUser.plan || 'Standard');
      setCredits(currentUser.credits ?? 10);
      setAnswers(prev => ({
        ...prev,
        name: currentUser.name || prev.name
      }));
      setApplyForm(prev => ({
        ...prev,
        email: currentUser.email,
        contact: currentUser.contactNumber || ''
      }));
      
      // Fetch initial notifications and applications
      fetchNotifications();
      fetchAppliedCourses();

      // Set up real-time polling every 5 seconds for notifications
      const notifInterval = setInterval(() => {
        fetchNotifications();
        fetchAppliedCourses();
      }, 5000);

      return () => clearInterval(notifInterval);
    }
  }, [currentUser]);

  const fetchNotifications = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/notifications?email=${encodeURIComponent(currentUser.email)}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.warn("Failed to fetch notifications:", err);
    }
  };

  const fetchAppliedCourses = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/applications?role=${currentUser.role}&email=${encodeURIComponent(currentUser.email)}&universityName=${encodeURIComponent(currentUser.universityName || '')}`);
      if (res.ok) {
        const data = await res.json();
        setAppliedCourses(data);
      }
    } catch (err) {
      console.warn("Failed to fetch applied courses:", err);
    }
  };

  const markAllNotificationsRead = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentUser.email })
      });
      if (res.ok) {
        fetchNotifications();
      }
    } catch (err) {
      console.error("Failed to mark notifications read:", err);
    }
  };

  const handleModalMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cardX = rect.left + rect.width / 2;
    const cardY = rect.top + rect.height / 2;
    const offsetX = e.clientX - cardX;
    const offsetY = e.clientY - cardY;
    
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;
    
    e.currentTarget.style.setProperty('--mouse-x', `${localX}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${localY}px`);
    e.currentTarget.style.setProperty('--tilt-x', `${offsetX}px`);
    e.currentTarget.style.setProperty('--tilt-y', `${offsetY}px`);
  };

  const handleModalMouseLeave = (e) => {
    e.currentTarget.style.setProperty('--tilt-x', '0px');
    e.currentTarget.style.setProperty('--tilt-y', '0px');
  };

  // Global Stateful Database (read from mock but synced to backend)
  const [institutions, setInstitutions] = useState(mockInstitutions);
  const [appliedCourses, setAppliedCourses] = useState([]);

  // Live Chat Widget States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [counselorName, setCounselorName] = useState('AI Advisor: Aria');
  const [isHumanConnected, setIsHumanConnected] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [showChatSettings, setShowChatSettings] = useState(false);
  const [tempApiKeyInput, setTempApiKeyInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: "Hello! I'm Aria, your AI educational advisor. Ask me anything about programs, tuition fees, or study formats at our partner institutions." }
  ]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('sapio_gemini_api_key') || '';
      setGeminiApiKey(savedKey);
      setTempApiKeyInput(savedKey);
    }
  }, []);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatOpen]);

  // Toggle bookmark function
  const toggleBookmark = (matchId) => {
    if (bookmarks.includes(matchId)) {
      setBookmarks(prev => prev.filter(id => id !== matchId));
    } else {
      setBookmarks(prev => [...prev, matchId]);
    }
  };

  // Initial trigger for applying to a course (opens application form modal)
  const applyForCourse = (institution, courseName, requestAiRecommend = false) => {
    // Check duplicate if logged in
    if (currentUser) {
      const isAlreadyApplied = appliedCourses.some(app => app.courseName === courseName && app.universityName === institution);
      if (isAlreadyApplied) {
        alert("You have already applied for this course.");
        return;
      }
    }

    if ((currentUser ? currentUser.credits : credits) < 2) {
      alert("Insufficient credits! You need 2 credits to apply. Upgrade to Premium in your dashboard to get more.");
      return;
    }

    setActiveApplyCourse({ institution, courseName, requestAiRecommend });
    setApplyForm(prev => ({
      ...prev,
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      contact: currentUser?.contactNumber || '',
      cgpa: '',
      sop: '',
      counselorPreference: 'No Counselor',
      chatSlot: ''
    }));
    setShowApplyModal(true);
  };

  // Submit the formal application to the backend API
  const handleApplyFormSubmit = async (e) => {
    e.preventDefault();
    if (!activeApplyCourse) return;

    let targetUser = currentUser;

    // Guest auto-provisioning
    if (!targetUser) {
      try {
        const registerRes = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: applyForm.name || 'Guest Candidate',
            email: applyForm.email,
            password: 'password',
            contactNumber: applyForm.contact,
            role: 'Student'
          })
        });

        if (registerRes.ok) {
          const registeredUser = await registerRes.json();
          setCurrentUser(registeredUser);
          targetUser = registeredUser;
          alert(`Account auto-provisioned successfully for ${applyForm.email}! (Default password is "password").`);
        } else {
          // Attempt login if user already exists
          const loginRes = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: applyForm.email,
              password: 'password'
            })
          });

          if (loginRes.ok) {
            const loggedInUser = await loginRes.json();
            setCurrentUser(loggedInUser);
            targetUser = loggedInUser;
          } else {
            alert("An account with this email already exists. Please close this modal and sign in first.");
            setShowApplyModal(false);
            setView('auth');
            return;
          }
        }
      } catch (err) {
        console.error("Auto-provision error:", err);
        alert("Failed to auto-provision account.");
        return;
      }
    }

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: targetUser.name,
          studentEmail: targetUser.email,
          studentContact: applyForm.contact,
          cgpa: applyForm.cgpa,
          sop: applyForm.sop,
          universityName: activeApplyCourse.institution,
          courseName: activeApplyCourse.courseName,
          counselorPreference: applyForm.counselorPreference,
          chatSlot: applyForm.counselorPreference === '15-Min Live Chat' ? applyForm.chatSlot : ''
        })
      });

      if (res.ok) {
        const data = await res.json();
        
        // Update local credits
        setCredits(data.creditsRemaining);
        if (targetUser) {
          targetUser.credits = data.creditsRemaining;
          setCurrentUser({ ...targetUser });
        }

        // Close modal & refresh lists
        setShowApplyModal(false);
        fetchAppliedCourses();
        fetchNotifications();

        let successMsg = `Application for "${activeApplyCourse.courseName}" submitted to ${activeApplyCourse.institution}!`;
        if (applyForm.counselorPreference === '15-Min Live Chat') {
          successMsg += ` Your 15-minute chat slot (${applyForm.chatSlot}) has been booked.`;
        } else if (applyForm.counselorPreference === 'Video Meeting') {
          successMsg += " Counseling video meeting requested. The university will reply with a Zoom link.";
        }
        alert(successMsg);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to submit application.");
      }
    } catch (err) {
      console.error("Application submission error:", err);
      alert("Connection error. Could not connect to database.");
    }
  };

  // Handle live advisor chat message submission
  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    // Counselor chat limit checks for Free/Standard tier users (max 3 queries)
    if (plan === 'Standard' && chatQueryCount >= 3) {
      setChatMessages(prev => [...prev, 
        { sender: 'user', text: chatInput.trim() },
        { sender: 'ai', text: "⚠️ **System Overcrowding Limit:** You have reached your limit of 3 free counselor queries for this session to ensure a fair chance for all users. Please upgrade to **Premium Plan** in your dashboard to unlock unlimited live advisor consultations!" }
      ]);
      setChatInput('');
      return;
    }

    const userText = chatInput.trim();
    setChatQueryCount(prev => prev + 1);
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');
 
    const q = userText.toLowerCase();
    const asksForHuman = q.includes('counselor') || q.includes('consultee') || q.includes('real person') || q.includes('human') || q.includes('talk to someone');

    if (asksForHuman && !isHumanConnected) {
      // Connect to Counselor
      setChatMessages(prev => [...prev, { sender: 'ai', text: "Connecting you to an available human advisor... Please hold." }]);
      setCounselorName('Connecting...');
      
      setTimeout(() => {
        setIsHumanConnected(true);
        setCounselorName('Advisor: David (Admissions)');
        setChatMessages(prev => [...prev, { 
          sender: 'ai', 
          text: `Hi ${currentUser ? currentUser.name : 'Candidate'}, this is David from the admissions support desk. I see you want to speak with one of our counselors. How can I assist you with your course selection or application requirements today?` 
        }]);
      }, 1500);
      return;
    }

    // Try calling backend API first
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, history: chatMessages, apiKey: geminiApiKey })
      });

      if (response.ok) {
        const data = await response.json();
        setChatMessages(prev => [...prev, { sender: 'ai', text: data.text }]);
        
        // Log AI interaction to client-side localStorage db
        try {
          const lDb = JSON.parse(localStorage.getItem('sapio_db') || '{}');
          if (lDb) {
            if (!lDb.aiInteractions) lDb.aiInteractions = [];
            lDb.aiInteractions.push({
              id: `ai_${Date.now()}`,
              date: new Date().toISOString(),
              prompt: userText,
              response: data.text,
              model: 'gemini'
            });
            localStorage.setItem('sapio_db', JSON.stringify(lDb));
          }
        } catch (dbErr) {
          console.warn("Failed to log client-side AI interaction:", dbErr);
        }

        if (data.action === 'connect_human' && !isHumanConnected) {
          setCounselorName('Connecting...');
          setTimeout(() => {
            setIsHumanConnected(true);
            setCounselorName('Advisor: David (Admissions)');
            setChatMessages(prev => [...prev, { 
              sender: 'ai', 
              text: `Hi ${currentUser ? currentUser.name : 'Candidate'}, this is David from the admissions support desk. I see you want to speak with one of our counselors. How can I assist you with your course selection or application requirements today?` 
            }]);
          }, 1500);
        }
        return;
      }
    } catch (err) {
      console.warn("Backend API offline. Using client engine.");
    }

    // Fallback to local AI Engine
    const localResult = generateAiResponse(userText, chatMessages);
    
    // Log local fallback AI interaction to client-side localStorage db
    try {
      const lDb = JSON.parse(localStorage.getItem('sapio_db') || '{}');
      if (lDb) {
        if (!lDb.aiInteractions) lDb.aiInteractions = [];
        lDb.aiInteractions.push({
          id: `ai_${Date.now()}`,
          date: new Date().toISOString(),
          prompt: userText,
          response: localResult.text,
          model: 'local-semantic-engine'
        });
        localStorage.setItem('sapio_db', JSON.stringify(lDb));
      }
    } catch (dbErr) {
      console.warn("Failed to log client-side AI interaction:", dbErr);
    }

    setTimeout(() => {
      setChatMessages(prev => [...prev, { sender: 'ai', text: localResult.text }]);
      if (localResult.action === 'connect_human' && !isHumanConnected) {
        setCounselorName('Connecting...');
        setTimeout(() => {
          setIsHumanConnected(true);
          setCounselorName('Advisor: David (Admissions)');
          setChatMessages(prev => [...prev, { 
            sender: 'ai', 
            text: `Hi ${currentUser ? currentUser.name : 'Candidate'}, this is David from the admissions support desk. I see you want to speak with one of our counselors. How can I assist you today?` 
          }]);
        }, 1500);
      }
    }, 600);
  };

  // Sign out helper
  const handleSignOut = () => {
    setCurrentUser(null);
    alert("Signed out successfully.");
    setView('public-home');
  };

  // Render content according to the active view
  const renderView = () => {
    // Route guard: Questionnaire and Results are restricted to student accounts (or guests)
    if (view === 'questionnaire' || view === 'results') {
      if (currentUser && currentUser.role !== 'Student') {
        if (currentUser.role === 'Admin' && view === 'questionnaire') {
          // Allow Super Admin to access AI Match configurator in 'questionnaire' view
        } else {
          const destView = currentUser.role === 'Admin' ? 'admin-dashboard' : 'institution-dashboard';
          setTimeout(() => {
            triggerAlert(`Access Restricted: Only Student accounts can perform the AI Match consultation. As a ${currentUser.role} user, you cannot access this tool.`, "Access Restricted", "warning");
            setView(destView);
          }, 0);
          
          if (destView === 'admin-dashboard') {
            return (
              <AdminDashboard 
                currentUser={currentUser}
                appliedCourses={appliedCourses}
                setAppliedCourses={setAppliedCourses}
                institutions={institutions}
                setInstitutions={setInstitutions}
                alert={alert}
                onRefreshApplications={fetchAppliedCourses}
              />
            );
          } else {
            return (
              <InstitutionDashboard 
                currentUser={currentUser} 
                alert={alert} 
                appliedCourses={appliedCourses}
                onRefreshApplications={fetchAppliedCourses}
              />
            );
          }
        }
      }
    }

    switch (view) {
      case 'public-home':
        return (
          <Home 
            setView={setView} 
            setExploreSearchTerm={setExploreSearchTerm} 
            onUpgradePremium={() => setIsCheckoutOpen(true)} 
            isPageReady={!loading}
          />
        );
      case 'public-explore':
        return (
          <Explore 
            setView={setView} 
            setSelectedInstId={setSelectedInstId} 
            institutions={institutions} 
            searchTerm={exploreSearchTerm}
            setSearchTerm={setExploreSearchTerm}
          />
        );
      case 'institution-detail':
        return (
          <InstitutionDetail 
            instId={selectedInstId} 
            setView={setView} 
            applyForCourse={applyForCourse} 
            appliedCourses={appliedCourses}
            institutions={institutions}
          />
        );
      case 'questionnaire':
        return (
          <Questionnaire 
            setView={setView} 
            answers={answers} 
            setAnswers={setAnswers} 
            completedQuiz={completedQuiz}
            setCompletedQuiz={setCompletedQuiz}
            currentUser={currentUser}
            questions={questions}
            setQuestions={setQuestions}
          />
        );
      case 'results':
        return (
          <Results 
            setView={setView} 
            answers={answers} 
            bookmarks={bookmarks} 
            toggleBookmark={toggleBookmark}
            applyForCourse={applyForCourse}
            appliedCourses={appliedCourses}
            alert={alert}
            currentUser={currentUser}
            questions={questions}
          />
        );
      case 'user-dashboard':
        return (
          <UserDashboard 
            setView={setView} 
            answers={answers} 
            bookmarks={bookmarks} 
            toggleBookmark={toggleBookmark}
            appliedCourses={appliedCourses}
            credits={credits}
            setCredits={setCredits}
            plan={plan}
            setPlan={setPlan}
            onUpdateMembership={updateCurrentUserMembership}
            triggerAlert={triggerAlert}
            currentUser={currentUser}
            onRefreshApplications={fetchAppliedCourses}
          />
        );
      case 'institution-dashboard':
        return (
          <InstitutionDashboard 
            currentUser={currentUser} 
            alert={alert} 
            appliedCourses={appliedCourses}
            onRefreshApplications={fetchAppliedCourses}
          />
        );
      case 'admin-dashboard':
        return (
          <AdminDashboard 
            currentUser={currentUser}
            appliedCourses={appliedCourses}
            setAppliedCourses={setAppliedCourses}
            institutions={institutions}
            setInstitutions={setInstitutions}
            alert={alert}
            onRefreshApplications={fetchAppliedCourses}
          />
        );
      case 'auth':
        return <Auth setCurrentUser={setCurrentUser} setView={setView} alert={alert} />;
      case 'about':
        return <About setView={setView} />;
      case 'contact':
        return <Contact setView={setView} alert={alert} />;
      default:
        return (
          <Home 
            setView={setView} 
            setExploreSearchTerm={setExploreSearchTerm} 
            onUpgradePremium={() => setIsCheckoutOpen(true)} 
            isPageReady={!loading}
          />
        );
    }
  };

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  return (
    <div className="app-container">
      <SapioVisualShell />


      {/* Loading Overlay */}
      {loading && (
        <div id="site-loading-overlay" className="loading-overlay">
          <div className="loading-logo-container">
            <div className="loading-logo-glow" />
            <div className="loading-logo">
              <Sparkles size={32} style={{ color: 'white' }} />
            </div>
          </div>
          <h2 style={{ fontSize: '24px', fontFamily: 'var(--font-display)', marginBottom: '8px', color: 'white', fontWeight: 700 }}>
            SapioMatch AI
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '32px', textAlign: 'center', maxWidth: '300px' }}>
            A smarter bridge to trusted education
          </p>
          <div className="loading-progress-track">
            <div className="loading-progress-bar" style={{ width: `${loadingProgress}%` }} />
          </div>
          <div className="loading-status-text">
            {loadingProgress}% — {loadingText}
          </div>
        </div>
      )}

      {/* Header / Navigation bar */}
      <header className={`sapio-nav-island ${navMenuOpen ? 'is-open' : ''}`} style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '80px',
        background: 'var(--header-bg)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--card-border)',
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px'
      }}>
        {/* Logo */}
        <div 
          onClick={() => {
            setView('public-home');
            setNavMenuOpen(false);
          }} 
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              setView('public-home');
              setNavMenuOpen(false);
            }
          }}
          aria-label="Go to SapioMatch AI home"
          className="sapio-island-brand"
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <div style={{
            background: 'var(--primary)',
            width: '36px',
            height: '36px',
            borderRadius: 'var(--border-radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sparkles size={18} style={{ color: 'white' }} />
          </div>
          <span style={{
            fontSize: '18px',
            fontWeight: 700,
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.01em',
            color: 'white'
          }}>
            SapioMatch AI
          </span>
        </div>

        {/* Right Nav Action */}
        <div className="sapio-island-actions" style={{ display: 'flex', gap: '12px', alignItems: 'center', position: 'relative' }}>
          
          {/* Notification Center (Only visible when logged in) */}
          {currentUser && (
            <div style={{ position: 'relative', width: '100%' }}>
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (!showNotifications) {
                    markAllNotificationsRead();
                  }
                }}
                className="btn-premium-outline btn-notification-bell"
                style={{ 
                  padding: '8px 14px', 
                  fontSize: '13px',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: '8px',
                  position: 'relative',
                  width: '100%'
                }}
                title="Notifications"
              >
                <Bell size={16} strokeWidth={2.5} style={{ color: unreadNotifCount > 0 ? 'var(--secondary)' : 'var(--text-muted)' }} />
                <span>Notifications</span>
                {unreadNotifCount > 0 && (
                  <span className="notif-badge-pill">
                    {unreadNotifCount} New
                  </span>
                )}
              </button>

              {/* Dropdown panel */}
              {showNotifications && (
                <div className="glass-card" style={{
                  position: 'relative',
                  width: '100%',
                  marginTop: '8px',
                  maxHeight: '280px',
                  overflowY: 'auto',
                  zIndex: 1000,
                  padding: '12px',
                  border: '1px solid var(--card-border)',
                  animation: 'fadeIn 0.2s ease-out',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--card-border)', paddingBottom: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'white' }}>Inbox Notifications</span>
                    <button 
                      onClick={() => setShowNotifications(false)} 
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {notifications.filter(n => n.userEmail?.toLowerCase() === currentUser?.email?.toLowerCase()).length > 0 ? (
                      notifications.filter(n => n.userEmail?.toLowerCase() === currentUser?.email?.toLowerCase()).map(n => (
                        <div key={n.id} style={{ 
                          padding: '10px', 
                          borderRadius: '6px', 
                          background: 'rgba(255,255,255,0.01)', 
                          border: '1px solid var(--card-border)',
                          fontSize: '11.5px',
                          lineHeight: '1.45'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '9px' }}>{n.date}</span>
                            {n.text.includes("Approved") || n.text.includes("status updated: Approved") ? (
                              <span style={{ padding: '2px 6px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontSize: '9px', fontWeight: 700 }}>Approved</span>
                            ) : n.text.includes("Waiting for Approval") || n.text.includes("Under Review") ? (
                              <span style={{ padding: '2px 6px', borderRadius: '4px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', fontSize: '9px', fontWeight: 700 }}>Waiting for Approval</span>
                            ) : n.text.includes("Cancelled") ? (
                              <span style={{ padding: '2px 6px', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', fontSize: '9px', fontWeight: 700 }}>Cancelled</span>
                            ) : null}
                          </div>
                          <div style={{ color: 'white' }}>{n.text}</div>
                          {n.link && (
                            <a 
                              href={n.link} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="btn-premium"
                              style={{ 
                                display: 'inline-flex', 
                                marginTop: '8px', 
                                padding: '4px 8px', 
                                fontSize: '10px', 
                                gap: '4px',
                                textDecoration: 'none'
                              }}
                            >
                              <Calendar size={10} />
                              Join Meeting
                            </a>
                          )}
                        </div>
                      ))
                    ) : (
                      <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)', fontSize: '12px' }}>
                        No notifications received.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Student ID Passport Badge (Only for Students) */}
          {currentUser && currentUser.role === 'Student' && (
            <button 
              onClick={() => {
                setView('user-dashboard');
                setNavMenuOpen(false);
              }}
              className={`btn-premium-outline btn-passport-badge ${plan === 'Premium' ? 'premium-plan' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                padding: '8px 14px',
                fontSize: '13px',
                position: 'relative'
              }}
              title={`Digital Student Passport: ${plan} Plan (${credits} Credits)`}
            >
              <GraduationCap size={16} strokeWidth={2.5} style={{ color: plan === 'Premium' ? 'var(--secondary)' : 'var(--primary)' }} />
              <span>{plan} Passport</span>
              <span className={`passport-credits-pill ${plan === 'Premium' ? 'premium' : ''}`}>
                {credits} Credits
              </span>
            </button>
          )}

          {/* User auth details / login */}
          {currentUser ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
              <button 
                className="btn-premium-outline btn-user-profile"
                onClick={() => {
                  setView(currentUser.role === 'Admin' ? 'admin-dashboard' : (currentUser.role === 'University' ? 'institution-dashboard' : 'user-dashboard'));
                  setNavMenuOpen(false);
                }}
                style={{ 
                  padding: '8px 14px', 
                  fontSize: '13px', 
                  gap: '6px', 
                  width: '100%', 
                  justifyContent: 'center',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <User size={14} strokeWidth={2.5} style={{ flexShrink: 0 }} />
                <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {currentUser.name} ({currentUser.role})
                </span>
              </button>
              <button 
                className="btn-premium-outline btn-signout"
                onClick={() => {
                  handleSignOut();
                  setNavMenuOpen(false);
                }}
                style={{ 
                  padding: '8px 14px', 
                  fontSize: '13px', 
                  gap: '6px', 
                  width: '100%', 
                  justifyContent: 'center',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <LogOut size={14} strokeWidth={2.5} style={{ flexShrink: 0 }} />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <button 
              className="btn-premium-outline"
              onClick={() => {
                setView('auth');
                setNavMenuOpen(false);
              }}
              style={{ padding: '8px 14px', fontSize: '13px', gap: '6px' }}
            >
              <LogIn size={14} />
              Sign In
            </button>
          )}

          <button
            type="button"
            className="sapio-island-menu-btn"
            aria-expanded={navMenuOpen}
            aria-controls="sapio-island-menu"
            aria-label={navMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setNavMenuOpen((open) => !open)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              width: '100%',
              padding: '0 14px',
              height: '42px',
              minHeight: '42px'
            }}
          >
            <span className="sapio-menu-bars" aria-hidden="true" style={{ position: 'relative', left: 'auto', top: 'auto', margin: 0 }}>
              <span />
              <span />
              <span />
            </span>
            <span style={{ fontSize: '13px', fontWeight: 700 }}>
              {navMenuOpen ? 'Close Menu' : 'Navigation Menu'}
            </span>
          </button>

          {/* Navigation links */}
          <nav id="sapio-island-menu" aria-hidden={!navMenuOpen} style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
            <button onClick={() => { setView('public-home'); setNavMenuOpen(false); }} className={`nav-link ${view === 'public-home' ? 'active' : ''}`}>
              <span>Home</span><span className="sapio-menu-num">01</span>
            </button>
            <button onClick={() => { setView('about'); setNavMenuOpen(false); }} className={`nav-link ${view === 'about' ? 'active' : ''}`}>
              <span>About Us</span><span className="sapio-menu-num">02</span>
            </button>
            <button onClick={() => { setView('contact'); setNavMenuOpen(false); }} className={`nav-link ${view === 'contact' ? 'active' : ''}`}>
              <span>Contact Us</span><span className="sapio-menu-num">03</span>
            </button>
            <button onClick={() => { setView('public-explore'); setNavMenuOpen(false); }} className={`nav-link ${(view === 'public-explore' || view === 'institution-detail') ? 'active' : ''}`}>
              <span>Explore Courses</span><span className="sapio-menu-num">04</span>
            </button>
            <button onClick={() => { setView('questionnaire'); setNavMenuOpen(false); }} className={`nav-link ${(view === 'questionnaire' || view === 'results') ? 'active' : ''}`}>
              <span>AI Matching</span><span className="sapio-menu-num">05</span>
            </button>
            {currentUser && currentUser.role === 'Admin' && (
              <button
                onClick={() => { setView('admin-dashboard'); setNavMenuOpen(false); }}
                style={{
                  color: view === 'admin-dashboard' ? 'white' : 'var(--text-muted)',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  border: '1px solid var(--accent)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  background: 'rgba(153, 27, 27, 0.05)'
                }}
              >
                Admin Controls
              </button>
            )}
            {currentUser && currentUser.role === 'University' && (
              <button
                onClick={() => { setView('institution-dashboard'); setNavMenuOpen(false); }}
                style={{
                  color: view === 'institution-dashboard' ? 'white' : 'var(--text-muted)',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  border: '1px solid var(--secondary)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  background: 'rgba(180, 83, 9, 0.05)'
                }}
              >
                University Panel
              </button>
            )}
          </nav>
          
          <button 
            className="btn-premium"
            onClick={() => {
              setView('questionnaire');
              setNavMenuOpen(false);
            }}
            style={{ padding: '8px 14px', fontSize: '13px' }}
          >
            Match Now
            <ArrowRight size={14} />
          </button>
        </div>
      </header>

      <button
        type="button"
        className={`sapio-island-backdrop ${navMenuOpen ? 'is-open' : ''}`}
        aria-label="Close navigation menu"
        onClick={() => setNavMenuOpen(false)}
      />

      {/* Main Viewport */}
      <main className="main-content">
        {renderView()}
      </main>

      {/* Footer */}
      <footer style={{
        background: 'var(--footer-bg)',
        borderTop: '1px solid var(--card-border)',
        padding: '30px 24px',
        textAlign: 'center',
        marginTop: '60px'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} style={{ color: 'var(--secondary)' }} />
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'white' }}>SapioMatch AI</span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '500px' }}>
            Transforming educational search into structured, personalized fits for ambitious candidates.
          </p>
          <div style={{ display: 'flex', gap: '20px', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            <span>© 2026 SapioMatch AI. All rights reserved.</span>
            <a href="#about" onClick={(e) => { e.preventDefault(); setView('about'); }}>About Us</a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); setView('contact'); }}>Contact Us</a>
          </div>
        </div>
      </footer>

      {/* Counselor Booking / Course Application Form Modal */}
      {showApplyModal && activeApplyCourse && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(5, 8, 16, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100000,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div 
            className="glass-card" 
            onMouseMove={handleModalMouseMove}
            onMouseLeave={handleModalMouseLeave}
            style={{
              width: '90%',
              maxWidth: '550px',
              padding: '32px',
              border: '1px solid var(--card-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              position: 'relative'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--secondary)', fontWeight: 700, letterSpacing: '0.05em' }}>Submit Application</span>
                <h3 style={{ fontSize: '20px', color: 'white', fontWeight: 700, marginTop: '2px' }}>{activeApplyCourse.courseName}</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{activeApplyCourse.institution}</p>
              </div>
              <button 
                onClick={() => setShowApplyModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleApplyFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Full Name for Guest Mode */}
              {!currentUser && (
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="text" 
                      className="custom-input"
                      placeholder="Enter your full name"
                      value={applyForm.name || ''}
                      onChange={(e) => setApplyForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                    <User size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  </div>
                </div>
              )}

              {/* Row 1: Email and Contact */}
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="email" 
                      className="custom-input"
                      value={applyForm.email}
                      onChange={(e) => setApplyForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                    <Mail size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>Contact Number</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="tel" 
                      className="custom-input"
                      placeholder="+971 50..."
                      value={applyForm.contact}
                      onChange={(e) => setApplyForm(prev => ({ ...prev, contact: e.target.value }))}
                      required
                    />
                    <Phone size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  </div>
                </div>
              </div>

              {/* Row 2: CGPA / Qualification */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>CGPA or Prior Qualification (e.g. 3.7 Bachelor's)</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    className="custom-input"
                    placeholder="e.g. 3.8 / 4.0 or Grade A"
                    value={applyForm.cgpa}
                    onChange={(e) => setApplyForm(prev => ({ ...prev, cgpa: e.target.value }))}
                    required
                  />
                  <GraduationCap size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </div>

              {/* Row 3: SOP */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>Statement of Purpose (Why join this program?)</label>
                <div style={{ position: 'relative' }}>
                  <textarea 
                    className="custom-input"
                    rows="3"
                    placeholder="Write a brief summary of your goals..."
                    value={applyForm.sop}
                    onChange={(e) => setApplyForm(prev => ({ ...prev, sop: e.target.value }))}
                    style={{ resize: 'none', paddingRight: '36px' }}
                    required
                  />
                  <FileText size={14} style={{ position: 'absolute', right: '12px', top: '16px', color: 'var(--text-muted)' }} />
                </div>
              </div>

              {/* Row 4: Counselor Selection */}
              <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>
                  Counseling Request Preference (Free Tier)
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  
                  {/* Option 1: No counselor */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <input 
                      type="radio" 
                      name="counselorPref"
                      value="No Counselor"
                      checked={applyForm.counselorPreference === 'No Counselor'}
                      onChange={(e) => setApplyForm(prev => ({ ...prev, counselorPreference: e.target.value }))}
                    />
                    Submit application only (no counseling)
                  </label>

                  {/* Option 2: Live Chat */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <input 
                      type="radio" 
                      name="counselorPref"
                      value="15-Min Live Chat"
                      checked={applyForm.counselorPreference === '15-Min Live Chat'}
                      onChange={(e) => setApplyForm(prev => ({ ...prev, counselorPreference: e.target.value }))}
                    />
                    Request Live Chat (Max 15 minutes slot)
                  </label>

                  {applyForm.counselorPreference === '15-Min Live Chat' && (
                    <div style={{ marginLeft: '24px', animation: 'slideDown 0.2s ease-out' }}>
                      <label style={{ display: 'block', fontSize: '10px', color: 'var(--secondary)', marginBottom: '4px' }}>Select 15-Minute Slot Time</label>
                      <select 
                        className="custom-select"
                        value={applyForm.chatSlot}
                        onChange={(e) => setApplyForm(prev => ({ ...prev, chatSlot: e.target.value }))}
                        required
                        style={{ padding: '6px 12px', fontSize: '11.5px' }}
                      >
                        <option value="">-- Choose time slot --</option>
                        <option value="Today: 2:00 PM - 2:15 PM">Today: 2:00 PM - 2:15 PM</option>
                        <option value="Today: 2:15 PM - 2:30 PM">Today: 2:15 PM - 2:30 PM</option>
                        <option value="Today: 3:00 PM - 3:15 PM">Today: 3:00 PM - 3:15 PM</option>
                        <option value="Today: 3:30 PM - 3:45 PM">Today: 3:30 PM - 3:45 PM</option>
                      </select>
                    </div>
                  )}

                  {/* Option 3: Video meeting */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <input 
                      type="radio" 
                      name="counselorPref"
                      value="Video Meeting"
                      checked={applyForm.counselorPreference === 'Video Meeting'}
                      onChange={(e) => setApplyForm(prev => ({ ...prev, counselorPreference: e.target.value }))}
                    />
                    Request counseling Video Meeting (University will email a Zoom/Teams link)
                  </label>

                </div>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid var(--card-border)', paddingTop: '16px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', alignSelf: 'center', marginRight: 'auto' }}>
                  Cost: <strong style={{ color: 'white' }}>2 Credits</strong> (Remaining: {credits})
                </span>
                <button 
                  type="button" 
                  className="btn-premium-outline" 
                  onClick={() => setShowApplyModal(false)}
                  style={{ padding: '8px 16px', fontSize: '12px' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-premium"
                  style={{ padding: '8px 20px', fontSize: '12px' }}
                >
                  Submit Application
                  <ArrowRight size={14} />
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Interactive Live Counselor Chat Widget (Aria) */}
      <div className="live-chat-widget">
        <button className="live-chat-toggle" onClick={() => setIsChatOpen(!isChatOpen)}>
          <MessageSquare size={16} />
          {isChatOpen ? 'Close Counselor' : 'Live Advisor Chat'}
        </button>

        {isChatOpen && (
          <div className="live-chat-window">
            <div className="live-chat-header">
              <span style={{ fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {isHumanConnected 
                  ? 'Advisor: David (Admissions)' 
                  : (counselorName === 'Connecting...' ? 'Connecting...' : (geminiApiKey ? 'Aria (Gemini AI Active) ⚡' : 'AI Advisor: Aria 🤖'))}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {!isHumanConnected && (
                  <button 
                    type="button"
                    className={`live-chat-settings-toggle ${showChatSettings ? 'active' : ''}`}
                    onClick={() => {
                      setShowChatSettings(!showChatSettings);
                      setTempApiKeyInput(geminiApiKey);
                    }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
                    title="Configure Gemini API Key"
                  >
                    <Settings size={15} />
                  </button>
                )}
                <button onClick={() => setIsChatOpen(false)} style={{ cursor: 'pointer', color: 'var(--text-muted)', background: 'none', border: 'none', display: 'flex', alignItems: 'center' }}>
                  <X size={16} />
                </button>
              </div>
            </div>
            
            {showChatSettings && (
              <div className="live-chat-settings-pane">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                  <h4 style={{ margin: 0, fontSize: '12.5px', color: 'white', fontWeight: 600 }}>Gemini Key Configuration</h4>
                  <span className={`live-chat-status-badge ${geminiApiKey ? 'live' : 'local'}`}>
                    {geminiApiKey ? 'Live LLM' : 'Local NLP'}
                  </span>
                </div>
                
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.45', margin: 0 }}>
                  Enter a Gemini API Key to connect Aria to a live ChatGPT-style model. Your key is saved locally in your browser.
                </p>
                
                <a 
                  href="https://aistudio.google.com/" 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ fontSize: '11px', color: '#22d3ee', textDecoration: 'underline', width: 'fit-content' }}
                >
                  Get free API key ↗
                </a>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '2px' }}>
                  <label style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Gemini API Key</label>
                  <input
                    type="password"
                    className="custom-input"
                    placeholder="AIzaSy..."
                    value={tempApiKeyInput}
                    onChange={(e) => setTempApiKeyInput(e.target.value)}
                    style={{ padding: '6px 10px', fontSize: '11px' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                  <button 
                    type="button" 
                    className="btn-premium" 
                    style={{ padding: '6px 12px', fontSize: '11px', flexGrow: 1, boxShadow: 'none' }}
                    onClick={() => {
                      const key = tempApiKeyInput.trim();
                      setGeminiApiKey(key);
                      localStorage.setItem('sapio_gemini_api_key', key);
                      setShowChatSettings(false);
                      alert(key ? "Gemini API key saved! Aria is now live." : "API key cleared. Switched to local NLP mode.");
                    }}
                  >
                    Save Key
                  </button>
                  {geminiApiKey && (
                    <button 
                      type="button" 
                      className="btn-premium-outline" 
                      style={{ padding: '6px 12px', fontSize: '11px', color: 'var(--accent)', borderColor: 'rgba(153, 27, 27,0.3)', boxShadow: 'none' }}
                      onClick={() => {
                        setGeminiApiKey('');
                        setTempApiKeyInput('');
                        localStorage.removeItem('sapio_gemini_api_key');
                        setShowChatSettings(false);
                        alert("Gemini API key cleared. Running in local NLP mode.");
                      }}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="live-chat-messages">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`live-chat-bubble ${msg.sender}`}>
                  {msg.text.split('\n').map((line, i) => <div key={i}>{line}</div>)}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendChatMessage} className="live-chat-input-area">
              <input
                type="text"
                className="custom-input"
                placeholder={plan === 'Standard' && chatQueryCount >= 3 ? "Query limit reached (3 max)" : "Ask Aria or request a real advisor..."}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={plan === 'Standard' && chatQueryCount >= 3}
                style={{ padding: '8px 12px', fontSize: '12px', flexGrow: 1 }}
              />
              <button 
                type="submit" 
                className="btn-premium" 
                disabled={plan === 'Standard' && chatQueryCount >= 3}
                style={{ padding: '8px 12px', borderRadius: '4px' }}
              >
                <Send size={12} />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Floating Demo View Switcher */}
      <RoleSwitcher currentView={view} setView={setView} />

      {/* Custom Global Alert Dialog */}
      {customAlert.isOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(5, 8, 16, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100001,
          animation: 'fadeIn 0.25s ease-out'
        }} onClick={() => setCustomAlert(prev => ({ ...prev, isOpen: false }))}>
          <div className="custom-alert-wrapper">
            <div 
              className="custom-alert-card"
              onMouseMove={handleModalMouseMove}
              onMouseLeave={handleModalMouseLeave}
              onClick={(e) => e.stopPropagation()}
              style={{
                '--alert-spotlight': customAlert.type === 'success' ? 'rgba(180, 83, 9, 0.15)' : customAlert.type === 'warning' ? 'rgba(153, 27, 27, 0.15)' : 'rgba(43, 92, 70, 0.15)',
                borderLeft: `4px solid ${customAlert.type === 'success' ? 'var(--secondary)' : customAlert.type === 'warning' ? 'var(--accent)' : 'var(--primary)'}`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', position: 'relative', zIndex: 2 }}>
                <div style={{
                  color: customAlert.type === 'success' ? 'var(--secondary)' : customAlert.type === 'warning' ? 'var(--accent)' : 'var(--primary)'
                }}>
                  {customAlert.type === 'success' && <CheckCircle size={22} />}
                  {customAlert.type === 'warning' && <ShieldAlert size={22} className="alert-icon-pulse" />}
                  {customAlert.type === 'info' && <Compass size={22} />}
                </div>
                <h3 style={{ fontSize: '17px', color: 'white', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                  {customAlert.title}
                </h3>
              </div>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: 1.5, position: 'relative', zIndex: 2 }}>
                {customAlert.message}
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'relative', zIndex: 2 }}>
                <button 
                  className="btn-premium"
                  style={{ 
                    padding: '8px 20px', 
                    fontSize: '13px', 
                    background: customAlert.type === 'success' ? 'var(--primary)' : customAlert.type === 'warning' ? 'var(--accent)' : 'var(--primary)',
                    borderRadius: 'var(--border-radius-sm)',
                    boxShadow: 'none'
                  }}
                  onClick={() => setCustomAlert(prev => ({ ...prev, isOpen: false }))}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {gmailToast && (
        <div className="gmail-notification-alert">
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(234, 67, 53, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Mail size={18} style={{ color: '#ea4335' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flexGrow: 1, overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 800, color: 'white', fontFamily: 'var(--font-display)' }}>Gmail Alert</span>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Just now</span>
            </div>
            <div style={{ fontSize: '10.5px', color: '#e5e7eb', fontWeight: 600 }}>
              To: {gmailToast.to}
            </div>
            <div style={{ fontSize: '10.5px', color: 'var(--secondary)', fontWeight: 600 }}>
              Subject: {gmailToast.subject}
            </div>
            <div style={{ 
              fontSize: '11px', 
              color: 'var(--text-muted)', 
              whiteSpace: 'pre-line',
              marginTop: '4px',
              borderTop: '1px solid rgba(255,255,255,0.05)',
              paddingTop: '6px',
              lineHeight: '1.4'
            }}>
              {gmailToast.body}
            </div>
          </div>
        </div>
      )}
      {isCheckoutOpen && (
        <CheckoutModal 
          isOpen={isCheckoutOpen} 
          onClose={() => setIsCheckoutOpen(false)} 
          onSuccess={handleCheckoutSuccess} 
        />
      )}
    </div>
  );
}
