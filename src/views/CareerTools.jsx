"use client";

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Map, FileText, Search, Calculator, PiggyBank, BookOpen,
  X, Sparkles, ArrowRight, CheckCircle, AlertTriangle, TrendingUp
} from 'lucide-react';

const ROADMAPS = {
  "Management / Leadership": [
    { phase: "Assess your profile", detail: "Complete the AI matching assessment to baseline your strengths", dur: "Week 1" },
    { phase: "Foundation", detail: "Executive Diploma in Business Management or a Hybrid BBA", dur: "3-9 months" },
    { phase: "Core skills", detail: "Strategy, people management, and financial literacy", dur: "3-6 months" },
    { phase: "Certification", detail: "PMP / Agile, or an MBA leadership module", dur: "3-12 months" },
    { phase: "Target role", detail: "Team Lead to Manager to Senior Manager", dur: "12-24 months" }
  ],
  "Data & Analytics": [
    { phase: "Assess your profile", detail: "Baseline your maths and tools comfort via the assessment", dur: "Week 1" },
    { phase: "Foundation", detail: "Data analytics bootcamp (Excel, SQL, statistics)", dur: "2-4 months" },
    { phase: "Core skills", detail: "Python, data visualisation, and dashboarding", dur: "3-6 months" },
    { phase: "Certification", detail: "Google/IBM Data Analytics, or an MSc Data Science module", dur: "3-9 months" },
    { phase: "Target role", detail: "Data Analyst to Senior Analyst to Data Scientist", dur: "12-24 months" }
  ],
  "Tech / Software": [
    { phase: "Assess your profile", detail: "Identify your starting point with the assessment", dur: "Week 1" },
    { phase: "Foundation", detail: "Full-stack coding bootcamp (HTML, JS, one framework)", dur: "3-4 months" },
    { phase: "Core skills", detail: "APIs, databases, version control, and testing", dur: "3-6 months" },
    { phase: "Certification", detail: "Cloud (AWS/Azure), or an MSc Computer Science module", dur: "3-9 months" },
    { phase: "Target role", detail: "Junior Developer to Developer to Senior Engineer", dur: "12-24 months" }
  ],
  "Finance": [
    { phase: "Assess your profile", detail: "Map your numeracy and goals via the assessment", dur: "Week 1" },
    { phase: "Foundation", detail: "Professional Accounting & Tax, or a Finance diploma", dur: "2-6 months" },
    { phase: "Core skills", detail: "Financial modelling, forecasting, and Excel mastery", dur: "3-6 months" },
    { phase: "Certification", detail: "CFA Level I / ACCA module, or an MBA Finance track", dur: "6-18 months" },
    { phase: "Target role", detail: "Analyst to Finance Manager to Controller", dur: "12-36 months" }
  ]
};

const SKILL_MAP = {
  "Team Manager": { have: ["Communication", "Teamwork", "Time management"], gaps: ["Strategic management", "Data-driven decision making", "Financial forecasting"] },
  "Data Analyst": { have: ["Excel", "Reporting", "Attention to detail"], gaps: ["SQL & databases", "Python", "Data visualisation (Power BI / Tableau)"] },
  "Product Manager": { have: ["Communication", "Organisation", "Customer empathy"], gaps: ["Roadmapping & prioritisation", "Basic analytics", "Stakeholder management"] },
  "Software Engineer": { have: ["Problem solving", "Logic", "Curiosity"], gaps: ["A core language (JS / Python)", "Data structures & algorithms", "Version control (Git)"] }
};

const FUNDING = [
  { label: "Merit scholarship - up to 30% off", tiers: ["low", "mid", "high"], note: "Awarded on strong academic results or test scores." },
  { label: "Interest-free 12-month EMI", tiers: ["low", "mid", "high"], note: "Split tuition into monthly payments with no interest." },
  { label: "Early-bird discount - 10%", tiers: ["mid", "high"], note: "Enrol before the intake deadline to lock in a discount." },
  { label: "Employer sponsorship pathway", tiers: ["mid", "high"], note: "We can help prepare a sponsorship case for your employer." },
  { label: "Need-based aid (partial)", tiers: ["low"], note: "Income-assessed support for eligible learners." },
  { label: "Free / low-cost platform courses", tiers: ["low"], note: "Coursera & Udemy options starting under AED 1,000." }
];

const LIBRARY = {
  "Business & Management": [
    { title: "Good to Great - Jim Collins", note: "Why some companies make the leap" },
    { title: "The Lean Startup - Eric Ries", note: "Build-measure-learn for new ventures" },
    { title: "HBR's 10 Must Reads on Leadership", note: "Core leadership essays" },
    { title: "Coursera: Strategic Leadership specialisation", note: "Structured online track" }
  ],
  "Technology & AI": [
    { title: "Automate the Boring Stuff with Python", note: "Practical beginner programming" },
    { title: "Designing Data-Intensive Applications", note: "How modern data systems work" },
    { title: "AI for Everyone - Andrew Ng (Coursera)", note: "Non-technical AI foundations" },
    { title: "The Pragmatic Programmer", note: "Timeless software craft" }
  ],
  "Law & Public Policy": [
    { title: "Thinking, Fast and Slow - Kahneman", note: "Judgement & decision-making" },
    { title: "The Rule of Law - Tom Bingham", note: "Foundations of legal systems" },
    { title: "Coursera: International Law in Action", note: "How global law works in practice" },
    { title: "Policy Paradox - Deborah Stone", note: "The art of political decision-making" }
  ],
  "Career & Soft Skills": [
    { title: "Atomic Habits - James Clear", note: "Build systems that stick" },
    { title: "Never Split the Difference - Chris Voss", note: "Practical negotiation skills" },
    { title: "Deep Work - Cal Newport", note: "Focus in a distracted world" },
    { title: "LinkedIn Learning: Communication Foundations", note: "Workplace communication" }
  ]
};

export default function CareerTools({ setView }) {
  const [openTool, setOpenTool] = useState(null);

  // ROI Calculator state
  const [roiFee, setRoiFee] = useState(40000);
  const [roiCurrent, setRoiCurrent] = useState(60000);
  const [roiExpected, setRoiExpected] = useState(90000);
  const [roiResult, setRoiResult] = useState(null);

  // Resume Analyzer state
  const [resumeAnalyzed, setResumeAnalyzed] = useState(false);

  // Roadmap / Skill-gap / Scholarship / Library tool state
  const [roadmapGoal, setRoadmapGoal] = useState('Management / Leadership');
  const [roadmapShown, setRoadmapShown] = useState(false);
  const [skillRole, setSkillRole] = useState('Team Manager');
  const [skillShown, setSkillShown] = useState(false);
  const [budget, setBudget] = useState('AED 20k - 50k');
  const [budgetShown, setBudgetShown] = useState(false);
  const [libTopic, setLibTopic] = useState('Business & Management');
  const [libShown, setLibShown] = useState(false);
  const budgetTier = budget.includes('< ') ? 'low' : budget.includes('50k+') ? 'high' : 'mid';

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  const calculateRoi = () => {
    const increase = Number(roiExpected) - Number(roiCurrent);
    if (!increase || increase <= 0) {
      setRoiResult({ increase: 0, months: null });
      return;
    }
    const months = Math.max(1, Math.round((Number(roiFee) / increase) * 12));
    setRoiResult({ increase, months });
  };

  const tools = [
    {
      key: 'roadmap',
      title: 'Career Roadmap Generator',
      tagline: 'See your career path before you apply',
      desc: 'Get a step-by-step timeline of degrees, skills, and roles to reach your goal.',
      cta: 'Generate My Roadmap',
      icon: Map,
      color: 'var(--primary)', bg: 'rgba(43, 92, 70, 0.08)', border: 'rgba(43, 92, 70, 0.2)'
    },
    {
      key: 'resume',
      title: 'Resume Analyzer',
      tagline: 'Upload your resume, get smarter recommendations',
      desc: 'We score your resume and find the skill gaps holding you back.',
      cta: 'Analyze My Resume',
      icon: FileText,
      color: 'var(--secondary)', bg: 'rgba(180, 83, 9, 0.08)', border: 'rgba(180, 83, 9, 0.2)'
    },
    {
      key: 'skillgap',
      title: 'Skill Gap Detection',
      tagline: 'Know what skills you need next',
      desc: 'Identify missing competencies for your target role, like Agile or SQL.',
      cta: 'Find My Skill Gaps',
      icon: Search,
      color: 'var(--accent)', bg: 'rgba(153, 27, 27, 0.08)', border: 'rgba(153, 27, 27, 0.2)'
    },
    {
      key: 'roi',
      title: 'ROI Calculator',
      tagline: 'Is your course worth it?',
      desc: 'Estimate your payback period based on course fee, salary, and expected growth.',
      cta: 'Calculate My ROI',
      icon: Calculator,
      color: 'var(--primary)', bg: 'rgba(43, 92, 70, 0.08)', border: 'rgba(43, 92, 70, 0.2)'
    },
    {
      key: 'scholarship',
      title: 'Scholarship & EMI Finder',
      tagline: 'Make it affordable',
      desc: 'Filter courses by scholarships, installments, early-bird discounts, and sponsorships.',
      cta: 'Find Budget Options',
      icon: PiggyBank,
      color: 'var(--secondary)', bg: 'rgba(180, 83, 9, 0.08)', border: 'rgba(180, 83, 9, 0.2)'
    },
    {
      key: 'library',
      title: 'Online Library',
      tagline: 'Learn before you enrol',
      desc: 'Recommended books and resources for your course. Access study materials instantly.',
      cta: 'Explore Library',
      icon: BookOpen,
      color: 'var(--accent)', bg: 'rgba(153, 27, 27, 0.08)', border: 'rgba(153, 27, 27, 0.2)'
    }
  ];

  const activeTool = tools.find(t => t.key === openTool);

  const closeModal = () => {
    setOpenTool(null);
    setResumeAnalyzed(false);
    setRoiResult(null);
    setRoadmapShown(false);
    setSkillShown(false);
    setBudgetShown(false);
    setLibShown(false);
  };

  const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--card-border)',
    borderRadius: '8px',
    color: 'white',
    fontSize: '15px',
    fontFamily: 'inherit'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-muted)'
  };

  return (
    <div className="page-fade-enter" style={{ minHeight: '100vh', paddingBottom: '60px' }}>

      {/* Hero */}
      <section style={{
        position: 'relative',
        padding: '100px 24px 60px 24px',
        textAlign: 'center',
        borderBottom: '1px solid var(--card-border)',
        background: 'linear-gradient(180deg, rgba(180, 83, 9, 0.05) 0%, transparent 100%)'
      }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 14px', borderRadius: '999px', marginBottom: '20px',
            background: 'rgba(180, 83, 9, 0.08)', border: '1px solid rgba(180, 83, 9, 0.2)',
            color: 'var(--secondary)', fontSize: '13px', fontWeight: 600
          }}>
            <Sparkles size={14} /> Advanced Career &amp; Learning Tools
          </div>
          <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.4rem)', fontFamily: 'var(--font-display)', lineHeight: 1.15, marginBottom: '18px' }}>
            Unlock the full potential of your <span className="gradient-text">educational journey</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '17px', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto' }}>
            A suite of AI-powered tools to plan your path, sharpen your profile, and make confident, financially-smart decisions.
          </p>
        </div>
      </section>

      {/* Tools grid */}
      <section style={{ padding: '60px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.key}
                className="spotlight-card"
                onMouseMove={handleMouseMove}
                style={{
                  '--spotlight-color': tool.bg.replace('0.08', '0.14'),
                  display: 'flex', flexDirection: 'column', gap: '16px',
                  position: 'relative', zIndex: 2
                }}
              >
                <div className="icon-container" style={{
                  width: '46px', height: '46px', borderRadius: '10px',
                  background: tool.bg, border: `1px solid ${tool.border}`, color: tool.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Icon size={22} />
                </div>
                <div style={{ flexGrow: 1 }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'white', marginBottom: '6px', fontFamily: 'var(--font-display)' }}>
                    {tool.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: tool.color, fontWeight: 600, marginBottom: '8px' }}>{tool.tagline}</p>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.55 }}>{tool.desc}</p>
                </div>
                <button
                  className="btn-premium-outline"
                  onClick={() => setOpenTool(tool.key)}
                  style={{ padding: '10px 18px', fontSize: '13.5px', alignSelf: 'flex-start' }}
                >
                  {tool.cta}
                  <ArrowRight size={15} />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Modal */}
      {activeTool && typeof document !== 'undefined' && createPortal((
        <div
          onClick={closeModal}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
          }}
        >
          <div
            className="glass-card"
            onClick={(e) => e.stopPropagation()}
            style={{ width: '100%', maxWidth: '560px', maxHeight: '88vh', overflowY: 'auto', padding: '32px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="icon-container" style={{
                  width: '42px', height: '42px', borderRadius: '9px',
                  background: activeTool.bg, border: `1px solid ${activeTool.border}`, color: activeTool.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <activeTool.icon size={20} />
                </div>
                <h2 style={{ fontSize: '22px', fontFamily: 'var(--font-display)' }}>{activeTool.title}</h2>
              </div>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
                <X size={22} />
              </button>
            </div>

            {/* ROI Calculator */}
            {openTool === 'roi' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6 }}>
                  Estimate how quickly a course pays for itself through higher earnings.
                </p>
                <div>
                  <label style={labelStyle}>Total Course Fee (AED)</label>
                  <input type="number" style={inputStyle} value={roiFee} onChange={(e) => setRoiFee(e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Current Annual Salary (AED)</label>
                  <input type="number" style={inputStyle} value={roiCurrent} onChange={(e) => setRoiCurrent(e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Expected Salary After Course (AED)</label>
                  <input type="number" style={inputStyle} value={roiExpected} onChange={(e) => setRoiExpected(e.target.value)} />
                </div>
                <button className="btn-premium" onClick={calculateRoi} style={{ padding: '12px', fontSize: '14px', justifyContent: 'center' }}>
                  Calculate Payback Period
                </button>
                {roiResult && (
                  <div style={{ marginTop: '4px', padding: '20px', borderRadius: '10px', background: 'rgba(43, 92, 70, 0.06)', border: '1px solid rgba(43, 92, 70, 0.18)' }}>
                    {roiResult.months === null ? (
                      <p style={{ color: 'var(--text-muted)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertTriangle size={16} style={{ color: 'var(--secondary)' }} />
                        Your expected salary should be higher than your current salary to calculate a return.
                      </p>
                    ) : (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', marginBottom: '12px', borderBottom: '1px solid var(--card-border)' }}>
                          <span style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: 600 }}>Annual Salary Increase</span>
                          <strong style={{ color: 'var(--primary)', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <TrendingUp size={16} /> +AED {roiResult.increase.toLocaleString()}
                          </strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: 600 }}>Estimated Payback Period</span>
                          <strong style={{ color: 'white', fontSize: '20px' }}>{roiResult.months} months</strong>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Resume Analyzer */}
            {openTool === 'resume' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {!resumeAnalyzed ? (
                  <>
                    <div style={{
                      textAlign: 'center', padding: '40px 24px', borderRadius: '12px',
                      border: '2px dashed var(--card-border)', background: 'rgba(255,255,255,0.02)'
                    }}>
                      <FileText size={40} style={{ color: 'var(--secondary)', marginBottom: '12px' }} />
                      <h4 style={{ fontSize: '16px', color: 'white', marginBottom: '6px' }}>Upload your resume</h4>
                      <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '20px' }}>PDF, DOCX, or PNG (max 5MB)</p>
                      <button className="btn-premium" onClick={() => setResumeAnalyzed(true)} style={{ padding: '10px 22px', fontSize: '13.5px' }}>
                        Browse Files
                      </button>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '12.5px', textAlign: 'center' }}>
                      Demo: clicking “Browse Files” shows a sample analysis.
                    </p>
                  </>
                ) : (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                      <div style={{ padding: '18px', borderRadius: '10px', background: 'rgba(43, 92, 70, 0.08)', border: '1px solid rgba(43, 92, 70, 0.2)' }}>
                        <h4 style={{ color: 'var(--primary)', fontSize: '13px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CheckCircle size={15} /> Profile Score
                        </h4>
                        <div style={{ fontSize: '32px', fontWeight: 800, color: 'white' }}>72<span style={{ fontSize: '15px', color: 'var(--text-muted)' }}>/100</span></div>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px', lineHeight: 1.4 }}>Strong basics, but missing advanced skills for leadership roles.</p>
                      </div>
                      <div style={{ padding: '18px', borderRadius: '10px', background: 'rgba(153, 27, 27, 0.08)', border: '1px solid rgba(153, 27, 27, 0.2)' }}>
                        <h4 style={{ color: 'var(--accent)', fontSize: '13px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <AlertTriangle size={15} /> Skill Gaps
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.9 }}>
                          <li>✕ Strategic Management</li>
                          <li>✕ Data Analytics</li>
                          <li>✕ Financial Forecasting</li>
                        </ul>
                      </div>
                    </div>
                    <div style={{ padding: '18px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--card-border)' }}>
                      <h4 style={{ color: 'white', fontSize: '14px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Sparkles size={15} style={{ color: 'var(--secondary)' }} /> Recommended Action
                      </h4>
                      <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', lineHeight: 1.6, marginBottom: '16px' }}>
                        A short Executive Diploma or Hybrid MBA would bridge your skill gaps and position you for a Senior Manager role within 12 months.
                      </p>
                      <button className="btn-premium" onClick={() => { closeModal(); setView('questionnaire'); }} style={{ padding: '10px 20px', fontSize: '13.5px' }}>
                        Find Matching Courses <ArrowRight size={15} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Career Roadmap Generator */}
            {openTool === 'roadmap' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6 }}>Pick a direction and we&apos;ll map a step-by-step path of courses, skills, and roles.</p>
                <div>
                  <label style={labelStyle}>Your target direction</label>
                  <select style={inputStyle} value={roadmapGoal} onChange={(e) => { setRoadmapGoal(e.target.value); setRoadmapShown(false); }}>
                    {Object.keys(ROADMAPS).map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <button className="btn-premium" onClick={() => setRoadmapShown(true)} style={{ padding: '12px', fontSize: '14px', justifyContent: 'center' }}>
                  <Map size={16} /> Generate My Roadmap
                </button>
                {roadmapShown && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
                    {ROADMAPS[roadmapGoal].map((s, i) => (
                      <div key={i} style={{ display: 'flex', gap: '12px', padding: '12px 14px', borderRadius: '10px', background: 'rgba(43, 92, 70, 0.06)', border: '1px solid rgba(43, 92, 70, 0.18)' }}>
                        <div style={{ flexShrink: 0, width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>{i + 1}</div>
                        <div style={{ flexGrow: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                            <strong style={{ color: 'white', fontSize: '14px' }}>{s.phase}</strong>
                            <span style={{ color: 'var(--secondary)', fontSize: '12px', fontWeight: 600 }}>{s.dur}</span>
                          </div>
                          <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.45, marginTop: '2px' }}>{s.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Skill-Gap Detection */}
            {openTool === 'skillgap' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6 }}>Choose a target role to see your likely strengths and the skills to build next.</p>
                <div>
                  <label style={labelStyle}>Target role</label>
                  <select style={inputStyle} value={skillRole} onChange={(e) => { setSkillRole(e.target.value); setSkillShown(false); }}>
                    {Object.keys(SKILL_MAP).map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <button className="btn-premium" onClick={() => setSkillShown(true)} style={{ padding: '12px', fontSize: '14px', justifyContent: 'center' }}>
                  <Search size={16} /> Find My Skill Gaps
                </button>
                {skillShown && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginTop: '4px' }}>
                    <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(43, 92, 70, 0.08)', border: '1px solid rgba(43, 92, 70, 0.2)' }}>
                      <h4 style={{ color: 'var(--primary)', fontSize: '13px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle size={15} /> Likely strengths</h4>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.9 }}>
                        {SKILL_MAP[skillRole].have.map((s, i) => <li key={i}>✓ {s}</li>)}
                      </ul>
                    </div>
                    <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(153, 27, 27, 0.08)', border: '1px solid rgba(153, 27, 27, 0.2)' }}>
                      <h4 style={{ color: 'var(--accent)', fontSize: '13px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}><AlertTriangle size={15} /> Skills to build</h4>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.9 }}>
                        {SKILL_MAP[skillRole].gaps.map((s, i) => <li key={i}>✕ {s}</li>)}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Scholarship & EMI Finder */}
            {openTool === 'scholarship' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6 }}>Tell us your budget and we&apos;ll surface scholarships and flexible-payment options that fit.</p>
                <div>
                  <label style={labelStyle}>Your budget</label>
                  <select style={inputStyle} value={budget} onChange={(e) => { setBudget(e.target.value); setBudgetShown(false); }}>
                    <option value="< AED 20k">{"< AED 20k"}</option>
                    <option value="AED 20k - 50k">AED 20k - 50k</option>
                    <option value="AED 50k+">AED 50k+</option>
                  </select>
                </div>
                <button className="btn-premium" onClick={() => setBudgetShown(true)} style={{ padding: '12px', fontSize: '14px', justifyContent: 'center' }}>
                  <PiggyBank size={16} /> Find Budget Options
                </button>
                {budgetShown && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
                    {FUNDING.filter((f) => f.tiers.includes(budgetTier)).map((f, i) => (
                      <div key={i} style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(180, 83, 9, 0.06)', border: '1px solid rgba(180, 83, 9, 0.2)' }}>
                        <strong style={{ color: 'white', fontSize: '13.5px' }}>{f.label}</strong>
                        <p style={{ color: 'var(--text-muted)', fontSize: '12.5px', lineHeight: 1.4, marginTop: '2px' }}>{f.note}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Online Library */}
            {openTool === 'library' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6 }}>Pick a subject and we&apos;ll recommend books and resources to learn before or during your course.</p>
                <div>
                  <label style={labelStyle}>Subject area</label>
                  <select style={inputStyle} value={libTopic} onChange={(e) => { setLibTopic(e.target.value); setLibShown(false); }}>
                    {Object.keys(LIBRARY).map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <button className="btn-premium" onClick={() => setLibShown(true)} style={{ padding: '12px', fontSize: '14px', justifyContent: 'center' }}>
                  <BookOpen size={16} /> Explore Library
                </button>
                {libShown && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
                    {LIBRARY[libTopic].map((b, i) => (
                      <div key={i} style={{ display: 'flex', gap: '12px', padding: '12px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--card-border)' }}>
                        <BookOpen size={16} style={{ color: 'var(--secondary)', flexShrink: 0, marginTop: '2px' }} />
                        <div style={{ flexGrow: 1 }}>
                          <strong style={{ color: 'white', fontSize: '13.5px' }}>{b.title}</strong>
                          <p style={{ color: 'var(--text-muted)', fontSize: '12.5px', lineHeight: 1.4, marginTop: '2px' }}>{b.note}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ), document.body)}

      {/* CTA */}
      <section style={{ padding: '20px 24px 60px 24px', textAlign: 'center' }}>
        <div className="glass-card" style={{ maxWidth: '760px', margin: '0 auto', padding: '44px 36px', background: 'radial-gradient(circle at center, rgba(180, 83, 9, 0.05) 0%, var(--card-bg) 100%)' }}>
          <h2 style={{ fontSize: '26px', marginBottom: '14px', fontFamily: 'var(--font-display)' }}>Not sure where to start?</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '28px', maxWidth: '520px', margin: '0 auto 28px auto', lineHeight: 1.6 }}>
            Take the AI matching assessment and we&apos;ll recommend the right tools and programs for your goals.
          </p>
          <button className="btn-premium" onClick={() => setView('questionnaire')} style={{ padding: '12px 28px', fontSize: '14px' }}>
            Start AI Matching <ArrowRight size={16} />
          </button>
        </div>
      </section>

    </div>
  );
}
