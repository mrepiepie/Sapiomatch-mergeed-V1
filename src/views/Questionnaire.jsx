import React, { useState, useEffect } from 'react';
import { mockQuestions } from '../mockData';
import { UploadCloud, ChevronRight, FileText, Check, Sparkles, Award, Settings, Plus, Trash2, Edit, RotateCcw, Eye, ArrowLeft } from 'lucide-react';

const mapSubjectToOption = (selectedSubject, options) => {
  if (!selectedSubject || !options || options.length === 0) return '';
  const cleanSelected = selectedSubject.toLowerCase().trim();
  
  // 1. Direct exact or partial match
  const exactMatch = options.find(opt => opt.toLowerCase().trim() === cleanSelected);
  if (exactMatch) return exactMatch;
  
  const partialMatch = options.find(opt => {
    const cleanOpt = opt.toLowerCase().trim();
    return cleanOpt.includes(cleanSelected) || cleanSelected.includes(cleanOpt);
  });
  if (partialMatch) return partialMatch;

  // 2. Keyword mapping
  if (cleanSelected.includes('computer') || cleanSelected.includes('science') || cleanSelected.includes('data') || cleanSelected.includes('engineering') || cleanSelected.includes('tech') || cleanSelected.includes('ai')) {
    const techOpt = options.find(opt => opt.toLowerCase().includes('tech') || opt.toLowerCase().includes('ai') || opt.toLowerCase().includes('science'));
    if (techOpt) return techOpt;
  }
  if (cleanSelected.includes('business') || cleanSelected.includes('admin') || cleanSelected.includes('management') || cleanSelected.includes('strategy') || cleanSelected.includes('marketing') || cleanSelected.includes('finance')) {
    const bizOpt = options.find(opt => opt.toLowerCase().includes('business') || opt.toLowerCase().includes('management') || opt.toLowerCase().includes('admin'));
    if (bizOpt) return bizOpt;
  }
  if (cleanSelected.includes('law') || cleanSelected.includes('policy') || cleanSelected.includes('governance') || cleanSelected.includes('public')) {
    const lawOpt = options.find(opt => opt.toLowerCase().includes('law') || opt.toLowerCase().includes('policy') || opt.toLowerCase().includes('public'));
    if (lawOpt) return lawOpt;
  }
  if (cleanSelected.includes('health') || cleanSelected.includes('medicine') || cleanSelected.includes('clinical') || cleanSelected.includes('nursing')) {
    const healthOpt = options.find(opt => opt.toLowerCase().includes('health') || opt.toLowerCase().includes('science') || opt.toLowerCase().includes('medicine'));
    if (healthOpt) return healthOpt;
  }

  // 3. Fallback to first option
  return options[0];
};

export default function Questionnaire({ setView, answers, setAnswers, completedQuiz, setCompletedQuiz, currentUser, questions, setQuestions }) {
  const activeQuestions = questions || mockQuestions;
  const [currentStep, setCurrentStep] = useState(0); // 0 = welcome/start
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [extractedData, setExtractedData] = useState(null);
  const [aiState, setAiState] = useState('idle'); // 'idle', 'thinking'
  const [isCalculating, setIsCalculating] = useState(false);
  const [matchProgress, setMatchProgress] = useState(0);
  const [statusText, setStatusText] = useState("Initializing matchmaking engines...");

  // Client-side local route guard (allows guest view)
  useEffect(() => {
    if (currentUser && currentUser.role !== 'Student' && currentUser.role !== 'Admin') {
      setView('institution-dashboard');
    }
  }, [currentUser, setView]);

  // Pre-fill study field from home page selection on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedSubject = localStorage.getItem('sapio_selected_subject');
      if (storedSubject && storedSubject !== 'Subject of study') {
        const fieldQuestion = activeQuestions.find(q => q.key === 'field');
        if (fieldQuestion && fieldQuestion.options) {
          const prefilled = mapSubjectToOption(storedSubject, fieldQuestion.options);
          if (prefilled) {
            setAnswers(prev => ({ ...prev, field: prefilled }));
          }
        }
      }
    }
  }, [activeQuestions, setAnswers]);

  const [isAdminPreview, setIsAdminPreview] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [formQuestion, setFormQuestion] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formOptions, setFormOptions] = useState('');
  const [formDefault, setFormDefault] = useState('');
  const [formAiFollowup, setFormAiFollowup] = useState('');
  const [formKey, setFormKey] = useState('');
  const [formProcessingMessage, setFormProcessingMessage] = useState('');

  const handleResetQuestions = () => {
    if (window.confirm("Are you sure you want to reset all questions to the default template?")) {
      setQuestions(mockQuestions);
      localStorage.removeItem('sapio_questions');
      alert("Questions reset to default template.");
    }
  };

  const handleDeleteQuestion = (idx) => {
    if (activeQuestions.length <= 1) {
      alert("You must keep at least one question in the AI Matching test.");
      return;
    }
    if (window.confirm(`Are you sure you want to delete Step ${idx + 1}?`)) {
      const updated = activeQuestions.filter((_, i) => i !== idx);
      // Re-index steps
      const reindexed = updated.map((q, i) => ({ ...q, step: i + 1 }));
      setQuestions(reindexed);
      localStorage.setItem('sapio_questions', JSON.stringify(reindexed));
      alert(`Step ${idx + 1} deleted successfully.`);
    }
  };

  const handleOpenAddModal = () => {
    setIsAdding(true);
    setEditingIndex(-1);
    setFormQuestion('');
    setFormCategory('');
    setFormOptions('');
    setFormDefault('');
    setFormAiFollowup('');
    setFormKey('');
    setFormProcessingMessage('');
    setEditingQuestion({});
  };

  const handleOpenEditModal = (q, idx) => {
    setIsAdding(false);
    setEditingIndex(idx);
    setFormQuestion(q.question || '');
    setFormCategory(q.category || getCategoryLabel(idx + 1));
    setFormOptions(q.options ? q.options.join(', ') : '');
    setFormDefault(q.defaultValue || '');
    setFormAiFollowup(q.aiFollowup || '');
    setFormKey(q.key || getAnswerKey(idx + 1));
    setFormProcessingMessage(q.processingMessage || getProcessingMessage(idx + 1));
    setEditingQuestion(q);
  };

  const handleSaveQuestion = () => {
    if (!formQuestion.trim() || !formCategory.trim() || !formOptions.trim() || !formKey.trim()) {
      alert("Please fill in Question text, Category label, Profile key, and Options.");
      return;
    }

    const parsedOptions = formOptions.split(',').map(o => o.trim()).filter(o => o.length > 0);
    if (parsedOptions.length === 0) {
      alert("Please provide at least one option.");
      return;
    }

    let defaultVal = formDefault.trim();
    if (defaultVal && !parsedOptions.includes(defaultVal)) {
      alert(`Default value must match one of the options: ${parsedOptions.join(', ')}`);
      return;
    }
    if (!defaultVal) {
      defaultVal = parsedOptions[0]; // fallback to first option
    }

    const newQuestion = {
      step: isAdding ? activeQuestions.length + 1 : editingIndex + 1,
      question: formQuestion.trim(),
      category: formCategory.trim(),
      options: parsedOptions,
      defaultValue: defaultVal,
      aiFollowup: formAiFollowup.trim() || `Excellent choice. Let's customize matches for your ${formCategory.toLowerCase()}.`,
      key: formKey.trim().toLowerCase(),
      processingMessage: formProcessingMessage.trim() || `Analyzing ${formCategory.toLowerCase()} alignment...`
    };

    let updatedList;
    if (isAdding) {
      updatedList = [...activeQuestions, newQuestion];
    } else {
      updatedList = activeQuestions.map((q, i) => i === editingIndex ? newQuestion : q);
    }

    setQuestions(updatedList);
    localStorage.setItem('sapio_questions', JSON.stringify(updatedList));
    setEditingQuestion(null);
    alert(isAdding ? "New question step added successfully!" : "Question step updated successfully!");
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);

    const cardX = rect.left + rect.width / 2;
    const cardY = rect.top + rect.height / 2;
    const offsetX = e.clientX - cardX;
    const offsetY = e.clientY - cardY;
    e.currentTarget.style.setProperty('--tilt-x', `${offsetX}px`);
    e.currentTarget.style.setProperty('--tilt-y', `${offsetY}px`);
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.setProperty('--tilt-x', '0px');
    e.currentTarget.style.setProperty('--tilt-y', '0px');
  };

  const handleStart = () => {
    let prefilledField = '';
    if (typeof window !== 'undefined') {
      const storedSubject = localStorage.getItem('sapio_selected_subject');
      if (storedSubject && storedSubject !== 'Subject of study') {
        const fieldQuestion = activeQuestions.find(q => q.key === 'field');
        if (fieldQuestion && fieldQuestion.options) {
          prefilledField = mapSubjectToOption(storedSubject, fieldQuestion.options);
        }
      }
    }

    // Reset answers back to empty when a new test begins
    setAnswers(prev => ({
      ...prev,
      age: '',
      education: '',
      field: prefilledField,
      goal: '',
      format: '',
      budget: '',
      experience: ''
    }));
    
    // Reset match progress states
    setIsCalculating(false);
    setMatchProgress(0);
    setStatusText("Initializing matchmaking engines...");
    setCurrentStep(1);
    setAiState('idle');
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      setCurrentStep(0);
    }
  };

  const handleOptionSelect = (option) => {
    const key = getAnswerKey(currentStep);
    
    // Save answer
    setAnswers(prev => ({ ...prev, [key]: option }));
    setAiState('thinking');

    // Simulate AI thinking and transition to next step or complete
    setTimeout(() => {
      if (currentStep < activeQuestions.length) {
        setCurrentStep(prev => prev + 1);
        setAiState('idle');
      } else {
        // Last step complete, initiate full calculation screen
        setIsCalculating(true);
      }
    }, 750); // Balanced transition time (normal pace)
  };

  const getAnswerKey = (step) => {
    if (activeQuestions[step - 1]?.key) {
      return activeQuestions[step - 1].key;
    }
    const keys = ['age', 'education', 'field', 'goal', 'format', 'budget', 'experience'];
    return keys[step - 1] || `custom_key_${step}`;
  };

  const getCategoryLabel = (step) => {
    if (activeQuestions[step - 1]?.category) {
      return activeQuestions[step - 1].category;
    }
    const labels = [
      "Age Bracket",
      "Education",
      "Study Field",
      "Primary Goal",
      "Study Format",
      "Annual Budget",
      "Experience"
    ];
    return labels[step - 1] || `Question ${step}`;
  };

  const getProcessingMessage = (step) => {
    if (activeQuestions[step - 1]?.processingMessage) {
      return activeQuestions[step - 1].processingMessage;
    }
    const messages = [
      "Analyzing age bracket compatibility...",
      "Mapping educational prerequisites...",
      "Correlating subject area categories...",
      "Aligning candidate goal trajectories...",
      "Matching schedule format patterns...",
      "Sifting budget structures...",
      "Synthesizing matches and calculating final fit..."
    ];
    return messages[step - 1] || "Analyzing profile alignment...";
  };

  // Match Engine Count-Up Simulation Effect (Counts up to 100% progress, then displays compatibility score)
  useEffect(() => {
    if (!isCalculating) return;

    let current = 0;
    const duration = 2500; // 2.5 seconds count-up to 100% progress
    const stepTime = duration / 100;

    const timer = setInterval(() => {
      current += 1;
      if (current >= 100) {
        setMatchProgress(100);
        setStatusText("Calculation complete! Matches identified.");
        clearInterval(timer);

        // Pause for 1.8 seconds to display final compatibility score before redirect
        setTimeout(() => {
          setCompletedQuiz(true);
          setView('results');
        }, 1800);
      } else {
        setMatchProgress(current);
        
        // Dynamic status updates based on progress percentage
        if (current < 25) {
          setStatusText("Analyzing candidate profile criteria...");
        } else if (current < 50) {
          setStatusText("Scanning global university catalogs...");
        } else if (current < 75) {
          setStatusText("Correlating tuition and format compatibilities...");
        } else {
          setStatusText("Optimizing match affinity metrics...");
        }
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isCalculating, setCompletedQuiz, setView]);

  // Mock Resume Scanner
  const handleResumeDrop = async () => {
    setIsScanning(true);
    setScanProgress(0);
    
    const interval = setInterval(() => {
      setScanProgress(p => {
        if (p >= 90) return 90;
        return p + 15;
      });
    }, 120);

    try {
      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: 'resume.pdf' })
      });

      if (response.ok) {
        const data = await response.json();
        clearInterval(interval);
        setScanProgress(100);
        setTimeout(() => {
          setExtractedData(data);
          setIsScanning(false);
        }, 300);
        return;
      }
    } catch (err) {
      console.warn("Backend parse-resume failed, running client simulation.");
    }

    // Fallback if backend is occupied or offline
    setTimeout(() => {
      clearInterval(interval);
      setScanProgress(100);
      setTimeout(() => {
        setExtractedData({
          name: "Sanji",
          age: "21-30",
          education: "Bachelor's degree",
          field: "Law & Public Policy",
          goal: "Get promoted",
          format: "Hybrid",
          budget: "Low budget / affordable options only",
          experience: "3–5 years"
        });
        setIsScanning(false);
      }, 300);
    }, 1000);
  };

  const confirmExtractedData = () => {
    setAnswers(prev => ({ ...prev, ...extractedData }));
    setCompletedQuiz(true);
    setView('results');
  };

  return (
    <div 
      style={{ 
        maxWidth: '1000px', 
        margin: '0 auto', 
        padding: '40px 24px', 
        minHeight: '70vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1
      }} 
      className="page-fade-enter"
    >
      
      {/* Guest Mode Active Banner */}
      {!currentUser && (
        <div 
          className="glass-card" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            gap: '16px', 
            padding: '12px 20px', 
            borderLeft: '4px solid var(--primary)', 
            marginBottom: '20px',
            background: 'linear-gradient(90deg, rgba(52, 211, 153, 0.05) 0%, rgba(0,0,0,0) 100%)',
            position: 'relative',
            zIndex: 10
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--primary)',
              boxShadow: '0 0 6px var(--primary)',
              animation: 'pulse 1.5s infinite alternate'
            }} />
            <div style={{ fontSize: '13px', color: '#e5e7eb' }}>
              <strong>Guest Mode Active:</strong> You are exploring and consulting anonymously. <span style={{ color: 'var(--secondary)' }}>Sign in or create an account</span> to save your recommendations and bookmarks.
            </div>
          </div>
          <button 
            className="btn-premium-outline" 
            onClick={() => setView('auth')} 
            style={{ padding: '4px 12px', fontSize: '12px' }}
          >
            Sign In / Register
          </button>
        </div>
      )}

      {/* Dynamic Ambient Background Design & Keyframes */}
      <style>{`
        @keyframes floatGlow1 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -40px) scale(1.1); }
          100% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes floatGlow2 {
          0% { transform: translate(0, 0) scale(1.1); }
          50% { transform: translate(-40px, 30px) scale(0.9); }
          100% { transform: translate(20px, -20px) scale(1); }
        }
      `}</style>
      
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        overflow: 'hidden'
      }}>
        {/* Glow Orb 1 (Teal/Green) */}
        <div style={{
          position: 'absolute',
          top: '25%',
          left: '10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.06) 0%, rgba(16, 185, 129, 0) 70%)',
          filter: 'blur(60px)',
          animation: 'floatGlow1 12s infinite alternate ease-in-out'
        }} />

        {/* Glow Orb 2 (Amber/Orange) */}
        <div style={{
          position: 'absolute',
          bottom: '20%',
          right: '10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(251, 146, 60, 0.05) 0%, rgba(251, 146, 60, 0) 70%)',
          filter: 'blur(80px)',
          animation: 'floatGlow2 16s infinite alternate ease-in-out'
        }} />

        {/* Tech Dot Grid Backdrop */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.015) 1.2px, transparent 1.2px)',
          backgroundSize: '30px 30px',
          opacity: 0.8
        }} />
      </div>

      {/* Resume Scan Loader */}
      {isScanning && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(27, 21, 37, 0.95)',
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px'
        }}>
          <div style={{ 
            width: '180px', 
            height: '240px', 
            border: '1px solid var(--secondary)', 
            borderRadius: '8px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            background: 'rgba(255, 255, 255, 0.02)',
            position: 'relative' 
          }}>
            <FileText size={64} style={{ color: 'var(--secondary)' }} />
            <div className="scan-laser"></div>
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'white' }}>Analyzing Resume Structure...</h3>
          <div style={{ width: '250px', height: '4px', background: 'var(--card-border)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ width: `${scanProgress}%`, height: '100%', background: 'var(--secondary)', transition: 'width 0.15s' }}></div>
          </div>
        </div>
      )}

      {/* Extracted Profile Modal Preview */}
      {extractedData && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(4, 6, 15, 0.8)',
          backdropFilter: 'blur(10px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '500px', textAlign: 'center', border: '1px solid var(--secondary)' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              color: '#34d399'
            }}>
              <Check size={30} />
            </div>
            <h2 style={{ fontSize: '22px', fontFamily: 'var(--font-display)', marginBottom: '8px', color: 'white' }}>Resume Extracted!</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '24px' }}>
              Our parser identified your profile data. Verify the details below before matching.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left', marginBottom: '30px', background: 'rgba(255, 255, 255, 0.01)', padding: '16px', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
              {Object.entries(extractedData).map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-muted)', textTransform: 'capitalize' }}>{k === 'age' ? 'Age Bracket' : k}:</span>
                  <span style={{ fontWeight: 600, color: 'white' }}>{v}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-premium" onClick={confirmExtractedData} style={{ flex: 1, justifyContent: 'center' }}>
                Confirm & Match
              </button>
              <button className="btn-premium-outline" onClick={() => setExtractedData(null)} style={{ flex: 1 }}>
                Start Over
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Exit Preview Button for Super Admin */}
      {currentUser?.role === 'Admin' && isAdminPreview && (
        <button 
          onClick={() => {
            setIsAdminPreview(false);
            setCurrentStep(0);
          }} 
          className="btn-premium"
          style={{ 
            position: 'absolute', 
            top: '20px', 
            right: '24px', 
            zIndex: 1000, 
            gap: '6px', 
            background: 'var(--accent)',
            boxShadow: 'none'
          }}
          title="Exit Preview and return to Configurator"
        >
          <ArrowLeft size={14} />
          Exit Config Preview
        </button>
      )}

      {currentUser?.role === 'Admin' && !isAdminPreview ? (
        // Super Admin Configurator Console
        <div style={{ width: '100%', position: 'relative', zIndex: 2 }} className="page-fade-enter">
          {/* Configurator Header Glass Card */}
          <div className="glass-card" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '24px', 
            background: 'rgba(52, 211, 153, 0.01)',
            borderColor: 'rgba(52, 211, 153, 0.15)'
          }}>
            <div>
              <h2 style={{ fontSize: '24px', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '10px', color: 'white' }}>
                <Settings size={22} className="alert-icon-pulse" style={{ color: 'var(--primary)' }} />
                AI Match Question Configurator Console
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '6px' }}>
                You are logged in as a Super Admin. Modify steps, categories, choices, and follow-up prompts for candidate matching.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-premium-outline" onClick={() => { setIsAdminPreview(true); setCurrentStep(0); }} style={{ padding: '8px 16px', gap: '6px' }}>
                <Eye size={14} />
                Preview Mode
              </button>
              <button className="btn-premium-outline" onClick={handleResetQuestions} style={{ padding: '8px 16px', gap: '6px', color: 'var(--accent)', borderColor: 'rgba(248, 113, 113, 0.2)' }}>
                <RotateCcw size={14} />
                Reset Defaults
              </button>
              <button className="btn-premium" onClick={handleOpenAddModal} style={{ padding: '8px 16px', gap: '6px' }}>
                <Plus size={14} />
                Add Question
              </button>
            </div>
          </div>

          {/* List of Questions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {activeQuestions.map((q, idx) => (
              <div key={q.step || idx + 1} className="glass-card hoverable" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '20px' }}>
                <div style={{ flexGrow: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', padding: '2px 6px', background: 'rgba(52, 211, 153, 0.1)', color: 'var(--primary)', borderRadius: '4px' }}>
                      Step {idx + 1}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                      Category: {q.category || getCategoryLabel(idx + 1)}
                    </span>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      (Key: {q.key || getAnswerKey(idx + 1)})
                    </span>
                  </div>
                  
                  <h3 style={{ fontSize: '17px', color: 'white', marginBottom: '12px', fontWeight: 600 }}>
                    "{q.question}"
                  </h3>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                    {q.options.map((opt, oIdx) => (
                      <span key={oIdx} style={{
                        fontSize: '11px',
                        padding: '4px 10px',
                        background: 'rgba(255, 255, 255, 0.01)',
                        border: q.defaultValue === opt ? '1px solid var(--secondary)' : '1px solid var(--card-border)',
                        color: q.defaultValue === opt ? 'var(--secondary)' : 'var(--text-muted)',
                        borderRadius: '6px',
                        fontWeight: q.defaultValue === opt ? 600 : 400
                      }}>
                        {opt} {q.defaultValue === opt && ' (Default)'}
                      </span>
                    ))}
                  </div>

                  <div style={{ fontSize: '12px', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>AI Follow-up:</span>
                      <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>"{q.aiFollowup}"</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Loader Info:</span>
                      <span style={{ color: '#94a3b8' }}>"{q.processingMessage || getProcessingMessage(idx + 1)}"</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginLeft: '20px' }}>
                  <button className="btn-premium-outline" onClick={() => handleOpenEditModal(q, idx)} style={{ padding: '6px 12px', fontSize: '11.5px' }} title="Edit Step">
                    <Edit size={13} />
                  </button>
                  <button className="btn-premium-outline" onClick={() => handleDeleteQuestion(idx)} style={{ padding: '6px 12px', fontSize: '11.5px', color: 'var(--accent)', borderColor: 'rgba(248,113,113,0.2)' }} title="Delete Step">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Configurator Editor Modal */}
          {editingQuestion !== null && (
            <div style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(5, 8, 16, 0.8)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100005,
              animation: 'fadeIn 0.25s ease-out'
            }}>
              <div className="custom-alert-card" style={{ width: '500px', borderLeft: '4px solid var(--primary)' }}>
                <h3 style={{ fontSize: '18px', color: 'white', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {isAdding ? <Plus size={18} style={{ color: 'var(--primary)' }} /> : <Edit size={18} style={{ color: 'var(--primary)' }} />}
                  {isAdding ? 'Add Questionnaire Step' : 'Edit Questionnaire Step'}
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '380px', overflowY: 'auto', paddingRight: '4px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Question Text</label>
                    <input className="custom-input" value={formQuestion} onChange={(e) => setFormQuestion(e.target.value)} placeholder="e.g. What field are you interested in studying?" />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Category Label</label>
                      <input className="custom-input" value={formCategory} onChange={(e) => setFormCategory(e.target.value)} placeholder="e.g. Study Field" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Profile Key</label>
                      <input className="custom-input" value={formKey} onChange={(e) => setFormKey(e.target.value)} placeholder="e.g. field" />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>MCQ Options (Comma Separated)</label>
                    <input className="custom-input" value={formOptions} onChange={(e) => setFormOptions(e.target.value)} placeholder="Option A, Option B, Option C" />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Default Value (Must match an option)</label>
                    <input className="custom-input" value={formDefault} onChange={(e) => setFormDefault(e.target.value)} placeholder="e.g. Option A" />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>AI Follow-up Prompt</label>
                    <input className="custom-input" value={formAiFollowup} onChange={(e) => setFormAiFollowup(e.target.value)} placeholder="e.g. Perfect. We will prioritize programs in this category." />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Processing Loader Message</label>
                    <input className="custom-input" value={formProcessingMessage} onChange={(e) => setFormProcessingMessage(e.target.value)} placeholder="e.g. Correlating subject area categories..." />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px', borderTop: '1px solid var(--card-border)', paddingTop: '16px' }}>
                  <button className="btn-premium-outline" onClick={() => setEditingQuestion(null)} style={{ padding: '8px 16px' }}>
                    Cancel
                  </button>
                  <button className="btn-premium" onClick={handleSaveQuestion} style={{ padding: '8px 16px' }}>
                    Save Step
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : currentStep === 0 ? (
        // Welcome Screen (Centered, Premium Design)
        <div style={{ maxWidth: '650px', margin: '0 auto' }} className="page-fade-enter">
          <div className="glass-card anim-glow" style={{ padding: '40px', textAlign: 'center', border: '1px solid var(--card-border)', background: 'rgba(255, 255, 255, 0.01)' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(180, 83, 9, 0.08)',
              border: '1px solid var(--secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px auto',
              boxShadow: '0 0 20px rgba(180, 83, 9, 0.15)'
            }}>
              <Sparkles size={28} style={{ color: 'var(--secondary)' }} />
            </div>
            <h2 style={{ fontSize: '28px', fontFamily: 'var(--font-display)', marginBottom: '12px', color: 'white' }}>
              Academic Consultation
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '500px', margin: '0 auto 32px auto', lineHeight: '1.6' }}>
              Find your ideal postgraduate programs, university courses, and professional credentials. Complete {activeQuestions.length} simple, professional questions to generate your match results.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '380px', margin: '0 auto' }}>
              <button className="btn-premium" onClick={handleStart} style={{ justifyContent: 'center', padding: '14px 24px' }}>
                Begin Consultation
                <ChevronRight size={18} />
              </button>
              
              <button className="btn-premium-outline" onClick={() => setView('public-home')} style={{ justifyContent: 'center', padding: '12px 24px', gap: '8px' }}>
                <ArrowLeft size={16} />
                Back to Home
              </button>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '8px 0' }}>
                <hr style={{ flex: 1, borderColor: 'var(--card-border)', opacity: 0.15 }} />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>OR</span>
                <hr style={{ flex: 1, borderColor: 'var(--card-border)', opacity: 0.15 }} />
              </div>

              <div 
                className="spotlight-card"
                onClick={handleResumeDrop}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                  border: '1px dashed var(--secondary)',
                  borderRadius: '12px',
                  padding: '24px 16px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: 'rgba(180, 83, 9, 0.02)',
                  '--spotlight-color': 'rgba(180, 83, 9, 0.08)'
                }}
              >
                <UploadCloud size={32} style={{ color: 'var(--secondary)', marginBottom: '10px' }} />
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'white', marginBottom: '4px' }}>Fast-Track with Resume</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Upload PDF. AI instantly extracts your profile.</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Active Consultation / Match Calculating Wizard
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px', alignItems: 'center' }} className="page-fade-enter">
          
          {/* Left Sidebar: Structured match profile answers log */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
            <div className="spotlight-card" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ padding: '24px 20px', '--spotlight-color': 'rgba(43, 92, 70, 0.08)', minHeight: '380px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', borderBottom: '1px solid var(--card-border)', paddingBottom: '10px', position: 'relative', zIndex: 2 }}>
                <Award size={16} style={{ color: 'var(--secondary)' }} />
                <h4 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', margin: 0 }}>Your Profile</h4>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative', zIndex: 2, flexGrow: 1, justifyContent: 'center' }}>
                {activeQuestions.map((q, idx) => {
                  const key = getAnswerKey(idx + 1);
                  const val = answers[key];
                  return (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', opacity: val ? 1 : 0.25, transition: 'all 0.3s ease' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{getCategoryLabel(idx + 1)}:</span>
                      <span style={{ fontWeight: 600, color: val ? 'var(--secondary)' : 'var(--text-muted)', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {val || '—'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Unified Question Wizard Card OR Matching Loader */}
          {isCalculating ? (
            // Match Calculating Screen with Circle Progress Ring (counts to 100% progress, then displays compatibility score)
            <div className="glass-card anim-glow" style={{ 
              padding: '40px', 
              minHeight: '380px', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center',
              alignItems: 'center',
              border: '1px solid var(--card-border)',
              background: 'rgba(255, 255, 255, 0.01)',
              position: 'relative',
              zIndex: 2,
              textAlign: 'center'
            }}>
              {/* Circular Match Progress Ring (Top-Middle) */}
              <div style={{ position: 'relative', width: '150px', height: '150px', margin: '0 auto 28px auto' }}>
                <svg width="150" height="150" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                  {/* Outer Background Circle Track */}
                  <circle 
                    cx="60" 
                    cy="60" 
                    r="50" 
                    fill="none" 
                    stroke="rgba(255, 255, 255, 0.03)" 
                    strokeWidth="8" 
                  />
                  {/* Dynamic Progress Circle */}
                  <circle 
                    cx="60" 
                    cy="60" 
                    r="50" 
                    fill="none" 
                    stroke="var(--secondary)" 
                    strokeWidth="8" 
                    strokeDasharray="314.16"
                    strokeDashoffset={314.16 - (matchProgress / 100) * 314.16}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.08s linear', filter: 'drop-shadow(0 0 8px var(--secondary-glow))' }}
                  />
                </svg>
                
                {/* Centered Dynamic Score/Progress Display */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
                  <span style={{ 
                    fontSize: '32px', 
                    fontWeight: 800, 
                    fontFamily: 'var(--font-display)', 
                    color: matchProgress === 100 ? 'var(--secondary)' : 'white',
                    transition: 'color 0.3s ease'
                  }}>
                    {matchProgress === 100 ? (currentUser ? '100%' : '94%') : `${matchProgress}%`}
                  </span>
                  <span style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {matchProgress === 100 ? 'Compatibility' : 'Analyzing'}
                  </span>
                </div>
              </div>

              {/* Status Information (Bottom) */}
              <div>
                <h3 style={{ fontSize: '18px', fontFamily: 'var(--font-display)', color: 'white', marginBottom: '8px' }}>
                  Calculating Matches
                </h3>
                <p style={{ color: 'var(--secondary)', fontSize: '14px', fontWeight: 500, minHeight: '20px' }}>
                  {statusText}
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '12px', maxWidth: '340px', margin: '12px auto 0 auto', lineHeight: '1.4' }}>
                  Analyzing profile compatibility logs to discover and rank optimal global education matches...
                </p>
              </div>
            </div>
          ) : (
            // Unified Question Wizard Card
            <div className="glass-card anim-glow" style={{ 
              padding: '40px', 
              minHeight: '380px', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              border: '1px solid var(--card-border)',
              background: 'rgba(255, 255, 255, 0.01)',
              position: 'relative',
              zIndex: 2
            }}>
              {/* Progress Header & Bar inside card */}
              <div style={{ marginBottom: '32px', borderBottom: '1px solid var(--card-border)', paddingBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  <button 
                    onClick={handleBack} 
                    className="btn-premium-outline"
                    style={{ 
                      padding: '4px 10px', 
                      fontSize: '11px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '4px',
                      height: 'auto',
                      border: '1px solid rgba(255,255,255,0.1)',
                      background: 'transparent',
                      cursor: 'pointer'
                    }}
                  >
                    <ArrowLeft size={12} />
                    Back
                  </button>
                  <span style={{ color: 'var(--secondary)', fontWeight: 600 }}>Step {currentStep} of {activeQuestions.length}</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      width: `${(currentStep / activeQuestions.length) * 100}%`, 
                      height: '100%', 
                      background: 'linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%)', 
                      transition: 'width 0.4s ease' 
                    }} 
                  />
                </div>
              </div>

              {/* Question Body */}
              <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                {aiState === 'thinking' ? (
                  // Shimmer / Custom Transition Template
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', textAlign: 'center', margin: '20px 0' }} className="page-fade-enter">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.05)" strokeWidth="3"/>
                      <path d="M12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.0434 16.4523" stroke="var(--secondary)" strokeWidth="3" strokeLinecap="round">
                        <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/>
                      </path>
                    </svg>
                    <div>
                      <h3 style={{ fontSize: '18px', fontFamily: 'var(--font-display)', color: 'white', marginBottom: '8px' }}>
                        {getProcessingMessage(currentStep)}
                      </h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                        Mapping compatibility filters...
                      </p>
                    </div>
                  </div>
                ) : (
                  // Question text and multiple choice options (renders only if step <= total questions)
                  currentStep <= activeQuestions.length && (
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px' }} className="page-fade-enter">
                      <div style={{ textAlign: 'center' }}>
                        <h3 style={{ fontSize: '22px', fontFamily: 'var(--font-display)', color: 'white', lineHeight: '1.4' }}>
                          {activeQuestions[currentStep - 1].question}
                        </h3>
                      </div>
                      
                      {/* MCQ Options Container */}
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                        gap: '12px', 
                        width: '100%', 
                        maxWidth: '550px' 
                      }}>
                        {activeQuestions[currentStep - 1].options.map((opt, idx) => {
                          const key = getAnswerKey(currentStep);
                          const isSelected = answers[key] === opt;
                          return (
                            <button
                              key={idx}
                              onClick={() => handleOptionSelect(opt)}
                              className={`btn-premium-outline ${isSelected ? 'active-selection' : ''}`}
                              style={{
                                padding: '16px 20px',
                                fontSize: '14px',
                                fontWeight: 500,
                                justifyContent: 'center',
                                background: isSelected ? 'rgba(180, 83, 9, 0.08)' : 'rgba(255, 255, 255, 0.01)',
                                borderColor: isSelected ? 'var(--secondary)' : 'var(--card-border)',
                                borderRadius: '8px',
                                color: isSelected ? 'var(--secondary)' : 'var(--text-primary)',
                                transition: 'all 0.2s ease',
                                textAlign: 'center',
                                boxShadow: isSelected ? '0 0 10px rgba(180, 83, 9, 0.15)' : 'none'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'var(--secondary)';
                                e.currentTarget.style.background = 'rgba(180, 83, 9, 0.04)';
                                e.currentTarget.style.boxShadow = '0 0 10px rgba(180, 83, 9, 0.15)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = isSelected ? 'var(--secondary)' : 'var(--card-border)';
                                e.currentTarget.style.background = isSelected ? 'rgba(180, 83, 9, 0.08)' : 'rgba(255, 255, 255, 0.01)';
                                e.currentTarget.style.boxShadow = isSelected ? '0 0 10px rgba(180, 83, 9, 0.15)' : 'none';
                                e.currentTarget.style.transform = 'translateY(0)';
                              }}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
