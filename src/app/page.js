"use client";

import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Questionnaire from '../views/Questionnaire';
import Results from '../views/Results';
import { mockQuestions } from '../data/mockQuestions';
import ViewLoader from '../components/ViewLoader';

import {
  Compass, Sparkles, GraduationCap, ArrowRight, MessageSquare,
  Send, X, LogOut, LogIn, User, CheckCircle, ShieldAlert,
  Settings, Bell, Calendar, Phone, Mail, FileText, Check,
  ArrowLeft
} from 'lucide-react';

const Home = dynamic(() => import('../views/Home'), { loading: () => <ViewLoader /> });
const Explore = dynamic(() => import('../views/Explore'), { loading: () => <ViewLoader /> });
const InstitutionDetail = dynamic(() => import('../views/InstitutionDetail'), { loading: () => <ViewLoader /> });
const UserDashboard = dynamic(() => import('../views/UserDashboard'), { loading: () => <ViewLoader /> });
const InstitutionDashboard = dynamic(() => import('../views/InstitutionDashboard'), { loading: () => <ViewLoader /> });
const AdminDashboard = dynamic(() => import('../views/AdminDashboard'), { loading: () => <ViewLoader /> });
const Auth = dynamic(() => import('../views/Auth'), { loading: () => <ViewLoader /> });
const About = dynamic(() => import('../views/About'), { loading: () => <ViewLoader /> });
const Contact = dynamic(() => import('../views/Contact'), { loading: () => <ViewLoader /> });
const DestinationDetail = dynamic(() => import('../views/DestinationDetail'), { loading: () => <ViewLoader /> });
const RoleSwitcher = dynamic(() => import('../components/RoleSwitcher'), { ssr: false });
const LearnovaVisualShell = dynamic(() => import('../components/LearnovaVisualShell'), { loading: () => <ViewLoader /> });
const LearnovaLegacySections = dynamic(() => import('../components/LearnovaLegacySections'), { loading: () => <ViewLoader /> });

export default function App() {
  const institutionsRef = useRef([]);
  const [institutions, setInstitutions] = useState([]);
  const [gmailToast, setGmailToast] = useState(null);

  useEffect(() => {
    const handleGmailAlert = (e) => {
      setGmailToast(e.detail);
      // Auto close after 2.5 seconds
      const timer = setTimeout(() => {
        setGmailToast(null);
      }, 2500);
      return () => clearTimeout(timer);
    };
    window.addEventListener('learnova_gmail_alert', handleGmailAlert);
    return () => window.removeEventListener('learnova_gmail_alert', handleGmailAlert);
  }, []);

  const [view, setViewInternal] = useState('public-home');

  // Sync view state to URL hash
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentHash = window.location.hash.replace('#', '');
      const validViews = [
        'public-home', 'public-explore', 'about', 'contact', 'questionnaire',
        'results', 'auth', 'user-dashboard', 'institution-dashboard',
        'admin-dashboard', 'destination-detail', 'institution-detail'
      ];
      const homeSubSections = [
        'study-destinations', 'visa-readiness',
        'worldwide-universities', 'hear-from-our-students'
      ];
      // If we are on public-home and hash is a sub-section of the homepage, keep it
      if (view === 'public-home' && homeSubSections.includes(currentHash)) {
        return;
      }
      if (view && validViews.includes(view) && view !== currentHash) {
        window.location.hash = `#${view}`;
      }
    }
  }, [view]);

  // Sync URL hash to view state
  useEffect(() => {
    const handleHashChange = () => {
      if (typeof window === 'undefined') return;
      const hash = window.location.hash.replace('#', '');
      
      // Redirect matching-connected hashes to questionnaire
      if (hash === 'tutoring-matching') {
        localStorage.setItem('learnova_auth_redirect', 'questionnaire');
        setViewInternal('questionnaire');
        window.location.hash = '#questionnaire';
        return;
      }

      const validViews = [
        'public-home', 'public-explore', 'about', 'contact', 'questionnaire',
        'results', 'auth', 'user-dashboard', 'institution-dashboard',
        'admin-dashboard', 'destination-detail', 'institution-detail'
      ];
      const homeSubSections = [
        'study-destinations', 'visa-readiness',
        'worldwide-universities', 'hear-from-our-students'
      ];

      if (hash && validViews.includes(hash)) {
        if (hash !== view) {
          if (hash === 'auth' && (view === 'questionnaire' || view === 'results')) {
            localStorage.setItem('learnova_auth_redirect', view);
          }
          setViewInternal(hash);
        }
      } else if (hash && homeSubSections.includes(hash)) {
        if (view !== 'public-home') {
          setViewInternal('public-home');
        }
        // Force scroll to the element
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 150);
      } else if (!hash) {
        setViewInternal('public-home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Handle initial load
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [view]);

  const [viewHistory, setViewHistory] = useState(['public-home']);

  const setView = (nextViewOrFunc) => {
    setViewInternal(prev => {
      const nextView = typeof nextViewOrFunc === 'function' ? nextViewOrFunc(prev) : nextViewOrFunc;
      setViewHistory(history => {
        if (history[history.length - 1] === nextView) return history;
        if (history.length > 1 && history[history.length - 2] === nextView) {
          return history.slice(0, -1);
        }
        return [...history, nextView];
      });
      return nextView;
    });
  };

  const navigateBack = () => {
    setViewHistory(history => {
      if (history.length <= 1) return history;
      const newHistory = history.slice(0, -1);
      const prevView = newHistory[newHistory.length - 1];
      setViewInternal(prevView);
      return newHistory;
    });
  };

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isRightSwipe = distance < -80; // horizontal swipe right (left to right) to go back
    if (isRightSwipe) {
      navigateBack();
    }
  };
  const [questions, setQuestions] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('learnova_questions');
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

  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing AI Advisor Aria...');

  useEffect(() => {
    import('../mockData').then((mod) => {
      institutionsRef.current = mod.mockInstitutions;
      setInstitutions(mod.mockInstitutions);
    });
  }, []);



  const [selectedInstId, setSelectedInstId] = useState('university-birmingham-dubai');
  const [pendingGlobeInstId, setPendingGlobeInstId] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('australia');
  const [exploreSearchTerm, setExploreSearchTerm] = useState('');
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
    const institutionList = institutionsRef.current;
    if (aliasMatch && institutionList.some(inst => inst.id === aliasMatch)) return aliasMatch;

    const institutionMatch = institutionList.find(inst => {
      const instId = normalize(inst.id);
      const instName = normalize(inst.name);
      return instId === slug || instName === slug || instName === name || instName.includes(name) || name.includes(instName);
    });

    return institutionMatch?.id || null;
  };

  useEffect(() => {
    fetch('/api/stats/track-visitor', { method: 'POST' })
      .catch(err => console.error("Failed to track visitor:", err));
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const dbStr = localStorage.getItem('learnova_db');
    if (!dbStr) return;
    try {
      const db = JSON.parse(dbStr);
      if (view === 'institution-dashboard' && currentUser?.role !== 'University') {
        const birmUser = db.users.find(u => u.email === 'birmingham@learnova.ai');
        if (birmUser) {
          setCurrentUser(birmUser);
        }
      } else if (view === 'admin-dashboard' && currentUser?.role !== 'Admin') {
        const adminUser = db.users.find(u => u.email === 'operator@learnova.ai');
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
  const [activeTemplateOptional, setActiveTemplateOptional] = useState([]);

  const updateCurrentUserMembership = async ({ plan: nextPlan, credits: nextCredits }) => {
    const updates = {};
    if (nextPlan !== undefined) {
      updates.plan = nextPlan;
      setPlan(nextPlan);
    }
    if (nextCredits !== undefined) {
      updates.credits = nextCredits;
      setCredits(nextCredits);
    }

    if (!currentUser?.id || Object.keys(updates).length === 0) return;

    setCurrentUser(prev => (prev ? { ...prev, ...updates } : prev));

    try {
      const res = await fetch('/api/users/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: currentUser.id, ...updates })
      });
      if (!res.ok) {
        console.error("Failed to persist membership update on server.");
      }
    } catch (err) {
      console.error("Failed to persist membership update:", err);
    }
  };

  // Notifications state
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

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

    window.addEventListener('learnova:navigate-institution', handleGlobeInstitutionNavigation);
    return () => window.removeEventListener('learnova:navigate-institution', handleGlobeInstitutionNavigation);
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
    const handleGlobeDestinationNavigation = (e) => {
      const country = e.detail?.country || 'australia';
      setSelectedCountry(country);
      setView('destination-detail');
    };

    window.addEventListener('learnova:navigate-destination', handleGlobeDestinationNavigation);
    return () => window.removeEventListener('learnova:navigate-destination', handleGlobeDestinationNavigation);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setCustomAlert(prev => prev.isOpen ? { ...prev, isOpen: false } : prev);
        setShowApplyModal(prev => prev ? false : prev);
      } else if (e.key === 'Enter') {
        setCustomAlert(prev => prev.isOpen ? { ...prev, isOpen: false } : prev);
        
        const isTyping = document.activeElement && (
          document.activeElement.tagName === 'INPUT' || 
          document.activeElement.tagName === 'TEXTAREA'
        );
        if (!isTyping) {
          setShowApplyModal(prev => prev ? false : prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
      const savedKey = localStorage.getItem('learnova_gemini_api_key') || '';
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
  const applyForCourse = async (institution, courseName, requestAiRecommend = false) => {
    if (!currentUser) {
      alert("Please sign in or register to submit an application.");
      setView('auth');
      return;
    }
    
    // Check duplicate
    const isAlreadyApplied = appliedCourses.some(app => app.courseName === courseName && app.universityName === institution);
    if (isAlreadyApplied) {
      alert("You have already applied for this course.");
      return;
    }

    if (credits < 2) {
      alert("Insufficient credits! You need 2 credits to apply. Upgrade to Premium in your dashboard to get more.");
      return;
    }

    // Track course click
    fetch('/api/stats/track-click', { method: 'POST' }).catch(err => console.error("Failed to track click:", err));

    // Map institution name to ID
    let instId = "uni_1";
    try {
      const uRes = await fetch('/api/universities');
      if (uRes.ok) {
        const uList = await uRes.json();
        const match = uList.find(u => u.name?.toLowerCase() === institution?.toLowerCase());
        if (match) instId = match.id;
      }
    } catch (err) {
      console.warn("Error fetching universities list:", err);
    }

    // Fetch template optional sections
    try {
      const tRes = await fetch(`/api/forms/templates/${instId}`);
      if (tRes.ok) {
        const data = await tRes.json();
        setActiveTemplateOptional(data.optional_sections || []);
      } else {
        setActiveTemplateOptional([]);
      }
    } catch (err) {
      console.warn("Failed to fetch template optional sections:", err);
      setActiveTemplateOptional([]);
    }

    setActiveApplyCourse({ institution, courseName, requestAiRecommend });
    setApplyForm(prev => ({
      ...prev,
      email: currentUser.email,
      contact: currentUser.contactNumber || '',
      cgpa: '',
      sop: '',
      ieltsScore: '',
      resumeFile: null,
      counselorPreference: 'No Counselor',
      chatSlot: ''
    }));
    setShowApplyModal(true);
  };

  // Submit the formal application to the backend API
  const handleApplyFormSubmit = async (e) => {
    e.preventDefault();
    if (!activeApplyCourse) return;

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: currentUser.name,
          studentEmail: applyForm.email,
          studentContact: applyForm.contact,
          cgpa: applyForm.cgpa,
          sop: activeTemplateOptional.includes("Personal Statement") ? applyForm.sop : 'N/A',
          ieltsScore: activeTemplateOptional.includes("English / Language Proficiency") ? applyForm.ieltsScore : 'N/A',
          resumeAttached: activeTemplateOptional.includes("Documents Upload") ? (applyForm.resumeFile ? applyForm.resumeFile.name : 'No file chosen') : 'N/A',
          universityName: activeApplyCourse.institution,
          courseName: activeApplyCourse.courseName,
          counselorPreference: applyForm.counselorPreference,
          chatSlot: applyForm.counselorPreference === '15-Min Live Chat' ? applyForm.chatSlot : '',
          isInternational: true,
          preferredDestination: "International",
          nationality: "International",
          countryOfResidence: "International"
        })
      });

      if (res.ok) {
        const data = await res.json();
        
        // Update local credits
        setCredits(data.creditsRemaining);
        if (currentUser) {
          setCurrentUser(prev => ({ ...prev, credits: data.creditsRemaining }));
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
      } else if (response.status === 429) {
        const data = await response.json();
        setChatMessages(prev => [...prev, { sender: 'ai', text: data.text || "⚠️ **Rate Limit Exceeded:** You are sending messages too quickly. Please wait a minute." }]);
        return;
      }
    } catch (err) {
      console.warn("Backend API offline. Using client engine.");
    }

    // Fallback to local AI Engine (lazy-loaded to keep initial bundle smaller)
    const { generateAiResponse } = await import('../services/aiEngine');
    const localResult = generateAiResponse(userText, chatMessages);
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
    // Route guard: Questionnaire and Results are restricted to student/guest accounts
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
          <Home setView={setView} />
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
      case 'destination-detail':
        if (!selectedCountry) {
          return (
            <Home setView={setView} />
          );
        }
        return (
          <DestinationDetail 
            countryCode={selectedCountry} 
            setView={setView} 
            setAnswers={setAnswers} 
            setExploreSearchTerm={setExploreSearchTerm}
          />
        );
      case 'institution-detail':
        if (!selectedInstId) {
          return (
            <Explore 
              setView={setView} 
              setSelectedInstId={setSelectedInstId} 
              institutions={institutions} 
              searchTerm={exploreSearchTerm}
              setSearchTerm={setExploreSearchTerm}
            />
          );
        }
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
            plan={plan}
            onUpdateMembership={updateCurrentUserMembership}
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
        return <Home setView={setView} />;
    }
  };

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  return (
    <div 
      className="app-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <LearnovaVisualShell />



      {/* Header / Navigation bar */}
      <header style={{
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
        {/* Logo & Back Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {view !== 'public-home' && viewHistory.length > 1 && (
            <button
              onClick={navigateBack}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--card-border)',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'var(--secondary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                e.currentTarget.style.borderColor = 'var(--card-border)';
              }}
              title="Go Back"
            >
              <ArrowLeft size={16} />
            </button>
          )}

          <div 
            onClick={() => setView('public-home')} 
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
              color: 'var(--text-primary)'
            }}>
              Learnova AI
            </span>
          </div>
        </div>

        {/* Navigation links */}
        <nav style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <a href="#public-home" className={`nav-link ${view === 'public-home' ? 'active' : ''}`}>
            Home
          </a>
          <a href="#about" className={`nav-link ${view === 'about' ? 'active' : ''}`}>
            About Us
          </a>
          <a href="#contact" className={`nav-link ${view === 'contact' ? 'active' : ''}`}>
            Contact Us
          </a>
          <a href="#public-explore" className={`nav-link ${(view === 'public-explore' || view === 'institution-detail') ? 'active' : ''}`}>
            Explore Courses
          </a>
          <a href="#questionnaire" className={`nav-link ${(view === 'questionnaire' || view === 'results') ? 'active' : ''}`}>
            AI Matching
          </a>
          {currentUser && currentUser.role === 'Admin' && (
            <a 
              href="#admin-dashboard" 
              style={{ 
                color: view === 'admin-dashboard' ? 'var(--text-primary)' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                border: '1px solid var(--accent)',
                padding: '4px 8px',
                borderRadius: '4px',
                background: 'rgba(153, 27, 27, 0.05)',
                textDecoration: 'none'
              }}
            >
              Admin Controls
            </a>
          )}
          {currentUser && currentUser.role === 'University' && (
            <a 
              href="#institution-dashboard" 
              style={{ 
                color: view === 'institution-dashboard' ? 'var(--text-primary)' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                border: '1px solid var(--secondary)',
                padding: '4px 8px',
                borderRadius: '4px',
                background: 'rgba(180, 83, 9, 0.05)',
                textDecoration: 'none'
              }}
            >
              University Panel
            </a>
          )}
        </nav>

        {/* Right Nav Action */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', position: 'relative' }}>


          {/* Notification Center (Only visible when logged in) */}
          {currentUser && (
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (!showNotifications) {
                    markAllNotificationsRead();
                  }
                }}
                className="btn-premium-outline"
                style={{ 
                  padding: '8px', 
                  borderRadius: '50%', 
                  position: 'relative', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  borderColor: unreadNotifCount > 0 ? 'var(--secondary)' : 'var(--card-border)',
                  overflow: 'visible'
                }}
                title="Notifications"
              >
                <Bell size={16} style={{ color: unreadNotifCount > 0 ? 'var(--secondary)' : 'var(--text-muted)' }} />
                {unreadNotifCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    minWidth: '16px',
                    height: '16px',
                    borderRadius: '9999px',
                    background: 'var(--secondary)',
                    boxShadow: '0 0 8px var(--secondary)',
                    color: 'white',
                    fontSize: '9px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 4px',
                    lineHeight: 1
                  }}>
                    {unreadNotifCount}
                  </span>
                )}
              </button>

              {/* Dropdown panel */}
              {showNotifications && (
                <div className="glass-card" style={{
                  position: 'absolute',
                  right: 0,
                  top: '48px',
                  width: '320px',
                  maxHeight: '380px',
                  overflowY: 'auto',
                  zIndex: 1000,
                  padding: '16px',
                  border: '1px solid var(--card-border)',
                  animation: 'fadeIn 0.2s ease-out',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--card-border)', paddingBottom: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Inbox Notifications</span>
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
                          <div style={{ color: 'var(--text-primary)' }}>{n.text}</div>
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
            <div 
              onClick={() => setView('user-dashboard')}
              className="anim-glow"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: plan === 'Premium'
                  ? 'linear-gradient(135deg, rgba(251, 146, 60, 0.2) 0%, rgba(217, 119, 6, 0.2) 100%)'
                  : 'rgba(52, 211, 153, 0.1)',
                border: plan === 'Premium'
                  ? '1px solid var(--secondary)'
                  : '1px solid rgba(52, 211, 153, 0.3)',
                cursor: 'pointer',
                color: plan === 'Premium' ? 'var(--secondary)' : 'var(--primary)',
                boxShadow: plan === 'Premium' ? '0 0 12px rgba(251, 146, 60, 0.3)' : '0 0 10px rgba(52, 211, 153, 0.15)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative'
              }}
              title={`Digital Student Passport: ${plan} Plan (${credits} Credits)`}
            >
              <GraduationCap size={18} style={{ color: plan === 'Premium' ? 'var(--secondary)' : 'var(--primary)' }} />
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: plan === 'Premium' ? 'var(--secondary)' : 'var(--primary)',
                color: '#0b0f19',
                fontSize: '9px',
                fontWeight: 800,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #0b0f19'
              }}>
                {credits}
              </span>
            </div>
          )}

          {/* User auth details / login */}
          {currentUser ? (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button 
                className="btn-premium-outline"
                onClick={() => setView(currentUser.role === 'Admin' ? 'admin-dashboard' : (currentUser.role === 'University' ? 'institution-dashboard' : 'user-dashboard'))}
                style={{ padding: '8px 14px', fontSize: '13px', gap: '6px' }}
              >
                <User size={14} />
                {currentUser.name} ({currentUser.role})
              </button>
              <button 
                className="btn-premium-outline"
                onClick={handleSignOut}
                style={{ padding: '8px 14px', fontSize: '13px', color: 'var(--accent)', borderColor: 'rgba(153, 27, 27, 0.2)' }}
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button 
              className="btn-premium-outline"
              onClick={() => {
                if (view === 'questionnaire' || view === 'results') {
                  localStorage.setItem('learnova_auth_redirect', view);
                }
                setView('auth');
              }}
              style={{ padding: '8px 14px', fontSize: '13px', gap: '6px' }}
            >
              <LogIn size={14} />
              Sign In
            </button>
          )}
          
          <button 
            className="btn-premium"
            onClick={() => {
              localStorage.setItem('learnova_auth_redirect', 'questionnaire');
              setView('questionnaire');
            }}
            style={{ padding: '8px 14px', fontSize: '13px' }}
          >
            Match Now
            <ArrowRight size={14} />
          </button>
        </div>
      </header>

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
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Learnova AI</span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '500px' }}>
            Transforming educational search into structured, personalized fits for ambitious candidates.
          </p>
          <div style={{ display: 'flex', gap: '20px', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            <span>{"\u00A9"} 2026 Learnova AI. All rights reserved.</span>
            <a href="#about">About Us</a>
            <a href="#contact">Contact Us</a>
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
                <h3 style={{ fontSize: '20px', color: 'var(--text-primary)', fontWeight: 700, marginTop: '2px' }}>{activeApplyCourse.courseName}</h3>
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
              {activeTemplateOptional.includes("Personal Statement") && (
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
              )}

              {/* Conditional Row: English Proficiency */}
              {activeTemplateOptional.includes("English / Language Proficiency") && (
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    English Proficiency score (IELTS / TOEFL / Duolingo)
                  </label>
                  <input
                    type="text"
                    className="custom-input"
                    placeholder="e.g. IELTS 7.5 or TOEFL 100"
                    value={applyForm.ieltsScore || ''}
                    onChange={(e) => setApplyForm(prev => ({ ...prev, ieltsScore: e.target.value }))}
                    required
                  />
                </div>
              )}

              {/* Conditional Row: Documents Upload */}
              {activeTemplateOptional.includes("Documents Upload") && (
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Upload CV / Resume
                  </label>
                  <input
                    type="file"
                    className="custom-input"
                    accept=".pdf,.docx,.doc"
                    onChange={(e) => setApplyForm(prev => ({ ...prev, resumeFile: e.target.files?.[0] || null }))}
                    required
                  />
                </div>
              )}

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
                  Get free API key {"\u2197"}
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
                      localStorage.setItem('learnova_gemini_api_key', key);
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
                        localStorage.removeItem('learnova_gemini_api_key');
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
        <div className="gmail-notification-alert" style={{ 
          borderLeft: '4px solid var(--primary)',
          borderColor: 'rgba(43, 92, 70, 0.25)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6), 0 0 15px rgba(43, 92, 70, 0.15)',
          background: '#0a0d0b',
          width: '360px',
          padding: '12px 16px',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(43, 92, 70, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Check size={16} style={{ color: 'var(--primary)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flexGrow: 1, overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'white', fontFamily: 'var(--font-display)' }}>Message Sent</span>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Just now</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Email confirmation routed to: <strong style={{ color: 'white' }}>{gmailToast.to}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
