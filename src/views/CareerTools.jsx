"use client";

import React, { useState } from 'react';
import {
  Map, FileText, Search, Calculator, PiggyBank, BookOpen,
  X, Sparkles, ArrowRight, CheckCircle, AlertTriangle, TrendingUp, Wand2
} from 'lucide-react';

export default function CareerTools({ setView }) {
  const [openTool, setOpenTool] = useState(null);

  // ROI Calculator state
  const [roiFee, setRoiFee] = useState(40000);
  const [roiCurrent, setRoiCurrent] = useState(60000);
  const [roiExpected, setRoiExpected] = useState(90000);
  const [roiResult, setRoiResult] = useState(null);

  // Resume Analyzer state
  const [resumeAnalyzed, setResumeAnalyzed] = useState(false);

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
      {activeTool && (
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

            {/* Informational tools (roadmap, skillgap, scholarship, library) */}
            {!['roi', 'resume'].includes(openTool) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.65 }}>{activeTool.desc}</p>
                <div style={{ padding: '18px', borderRadius: '10px', background: activeTool.bg, border: `1px solid ${activeTool.border}` }}>
                  <p style={{ color: 'white', fontSize: '14px', fontWeight: 600, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Wand2 size={16} style={{ color: activeTool.color }} /> Personalised for you
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', lineHeight: 1.6 }}>
                    Complete your AI matching profile and we&apos;ll tailor this tool to your goals, budget, and background.
                  </p>
                </div>
                <button className="btn-premium" onClick={() => { closeModal(); setView('questionnaire'); }} style={{ padding: '12px 22px', fontSize: '14px', alignSelf: 'flex-start' }}>
                  Start AI Matching <ArrowRight size={15} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

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
