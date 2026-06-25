import React, { useState, useEffect } from 'react';
import { mockMatches, mockInstitutions } from '../mockData';
import { Award, Check, ArrowRight, Bookmark, BookmarkCheck, PhoneCall, HelpCircle, AlertCircle, X, Microscope } from 'lucide-react';

export default function Results({ setView, answers, bookmarks = [], toggleBookmark, applyForCourse, appliedCourses = [], alert, currentUser }) {
  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Client-side local route guard
  useEffect(() => {
    if (currentUser && currentUser.role !== 'Student') {
      const destView = currentUser.role === 'Admin' ? 'admin-dashboard' : 'institution-dashboard';
      setView(destView);
    }
  }, [currentUser, setView]);

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

  // Toggle course in comparison list
  const handleToggleCompare = (matchId) => {
    if (compareList.includes(matchId)) {
      setCompareList(prev => prev.filter(id => id !== matchId));
    } else {
      if (compareList.length >= 3) {
        alert("You can compare up to 3 programs side-by-side.");
        return;
      }
      setCompareList(prev => [...prev, matchId]);
    }
  };

  const getInstitutionName = (instId) => {
    const inst = mockInstitutions.find(i => i.id === instId);
    return inst ? inst.name : "Partner Institution";
  };

  const selectedMatches = mockMatches.filter(m => compareList.includes(m.id));

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }} className="page-fade-enter">
      
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
            marginBottom: '30px',
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
              <strong>Guest Mode Active:</strong> You are exploring and consulting anonymously. <span style={{ color: 'var(--secondary)' }}>Sign in or create an account</span> to save your recommendations, bookmarks, and apply to programs.
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

      {/* Header Banner */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '8px', 
          padding: '6px 16px', 
          borderRadius: 'var(--border-radius-full)', 
          background: 'rgba(180, 83, 9, 0.1)', 
          border: '1px solid rgba(180, 83, 9, 0.2)',
          color: 'var(--secondary)',
          fontSize: '14px',
          fontWeight: 600,
          marginBottom: '16px'
        }}>
          <Award size={14} />
          Match Complete
        </div>
        <h1 style={{ fontSize: '36px', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
          Your <span className="gradient-text">AI Match results</span> are ready
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '750px', margin: '0 auto' }}>
          Based on your profile, SapioMatch AI has found these programs matching a {answers.age || '29'}-year-old working professional with a {answers.education || "Bachelor's degree"} background and {answers.experience || "3-5 years"} of experience.
        </p>
      </div>

      {/* Floating compare banner */}
      {compareList.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--card-bg)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--secondary)',
          borderRadius: 'var(--border-radius-md)',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 9999
        }}>
          <div style={{ fontSize: '14px', fontWeight: 600 }}>
            Compare selected programs ({compareList.length} / 3)
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-premium" onClick={() => setShowCompareModal(true)} style={{ padding: '8px 16px', fontSize: '13px' }}>
              Compare Side-by-Side
            </button>
            <button className="btn-premium-outline" onClick={() => setCompareList([])} style={{ padding: '8px 16px', fontSize: '13px' }}>
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Comparison Modal */}
      {showCompareModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(4, 6, 15, 0.85)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', position: 'relative', border: '1px solid var(--secondary)' }}>
            <button 
              onClick={() => setShowCompareModal(false)}
              style={{ position: 'absolute', top: '20px', right: '20px', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>

            <h2 style={{ fontSize: '24px', fontFamily: 'var(--font-display)', marginBottom: '24px' }}>Side-by-Side Comparison</h2>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                    <th style={{ padding: '12px', color: 'var(--text-muted)' }}>Criteria</th>
                    {selectedMatches.map(match => (
                      <th key={match.id} style={{ padding: '12px', width: `${80 / selectedMatches.length}%` }}>
                        <div style={{ fontWeight: 700, color: 'white' }}>{match.title}</div>
                        <div style={{ fontSize: '12px', color: 'var(--secondary)', marginTop: '4px' }}>{getInstitutionName(match.institutionId)}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                    <td style={{ padding: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Match Accuracy</td>
                    {selectedMatches.map(match => (
                      <td key={match.id} style={{ padding: '12px', fontWeight: 700, color: 'var(--secondary)' }}>{currentUser && match.id === 1 ? 100 : match.matchScore}% Match</td>
                    ))}
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                    <td style={{ padding: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Annual Fee / Cost</td>
                    {selectedMatches.map(match => (
                      <td key={match.id} style={{ padding: '12px', color: 'var(--success)', fontWeight: 600 }}>{match.fee}</td>
                    ))}
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                    <td style={{ padding: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Study Format</td>
                    {selectedMatches.map(match => (
                      <td key={match.id} style={{ padding: '12px' }}>{match.format}</td>
                    ))}
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                    <td style={{ padding: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Duration</td>
                    {selectedMatches.map(match => (
                      <td key={match.id} style={{ padding: '12px' }}>{match.duration}</td>
                    ))}
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                    <td style={{ padding: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Curriculum/Region</td>
                    {selectedMatches.map(match => (
                      <td key={match.id} style={{ padding: '12px' }}>{match.region}</td>
                    ))}
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                    <td style={{ padding: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Key Advantages</td>
                    {selectedMatches.map(match => (
                      <td key={match.id} style={{ padding: '12px', verticalAlign: 'top' }}>
                        <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
                          {match.pros.map((pro, i) => <li key={i} style={{ marginBottom: '4px' }}>{pro}</li>)}
                        </ul>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td style={{ padding: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Cons / Limitations</td>
                    {selectedMatches.map(match => (
                      <td key={match.id} style={{ padding: '12px', verticalAlign: 'top' }}>
                        <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
                          {match.cons.map((con, i) => <li key={i} style={{ marginBottom: '4px' }}>{con}</li>)}
                        </ul>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Profile Summary Card */}
      <div className="spotlight-card" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ padding: '20px', marginBottom: '40px', '--spotlight-color': 'rgba(180, 83, 9, 0.08)' }}>
        <h3 style={{ fontSize: '16px', marginBottom: '16px', borderBottom: '1px solid var(--card-border)', paddingBottom: '10px', color: 'white', position: 'relative', zIndex: 2 }}>Your AI Search Profile</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', position: 'relative', zIndex: 2 }}>
          {Object.entries({
            age: answers.age || '29',
            education: answers.education || "Bachelor's",
            field: answers.field || 'Law & Policy',
            goal: answers.goal || 'Get Promoted',
            region: answers.region || 'Europe',
            format: answers.format || 'Hybrid',
            budget: answers.budget ? 'Low budget' : 'Affordable',
            experience: answers.experience || '3-5 years'
          }).map(([key, val]) => (
            <div key={key} style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>{key}</span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--secondary)' }}>{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Matches Listing */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {mockMatches.map(match => {
          const isBookmarked = bookmarks.includes(match.id);
          const isApplied = appliedCourses.some(app => app.courseName === match.title && (app.universityName === getInstitutionName(match.institutionId) || app.institution === getInstitutionName(match.institutionId)));
          const isSelectedForCompare = compareList.includes(match.id);

          // Course Compass features: 6-factor match breakdown + honest "AI Course Autopsy"
          const baseScore = (currentUser && match.id === 1) ? 100 : match.matchScore;
          const clampScore = (x) => Math.max(62, Math.min(100, x));
          const matchFactors = [
            { label: 'Eligibility', v: clampScore(baseScore + 3) },
            { label: 'Budget', v: clampScore(baseScore - 2) },
            { label: 'Study Mode', v: clampScore(baseScore + 5) },
            { label: 'Career Goal', v: clampScore(baseScore - 1) },
            { label: 'Field Interest', v: clampScore(baseScore + 1) },
            { label: 'Skill Gap', v: clampScore(baseScore - 4) }
          ];
          const autopsyCaution = (match.cons && match.cons[0]) ? match.cons[0] : 'the workload intensifies sharply around exam and project deadlines';

          return (
            <div key={match.id} className="spotlight-card" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ padding: '24px', position: 'relative', '--spotlight-color': 'rgba(43, 92, 70, 0.12)' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '20px', alignItems: 'flex-start', position: 'relative', zIndex: 2 }}>
                <div style={{ flex: '1 1 500px' }}>
                  {/* Match and Institution name */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: 'var(--border-radius-full)',
                      fontSize: '11px',
                      fontWeight: 700,
                      background: 'rgba(43, 92, 70, 0.15)',
                      color: '#a78bfa',
                      border: '1px solid rgba(43, 92, 70, 0.2)'
                    }}>
                      {getInstitutionName(match.institutionId)}
                    </span>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{match.region} · {match.format}</span>
                  </div>

                  <h3 style={{ fontSize: '22px', marginBottom: '16px', color: 'white', fontFamily: 'var(--font-display)' }}>{match.title}</h3>
                  
                  {/* Matching Reasons */}
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Why it matches your profile:</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '8px' }}>
                      {match.reasons.map((reason, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px' }}>
                          <span style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>✓</span>
                          <span style={{ color: 'var(--text-muted)' }}>{reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI match breakdown — 6 factors (Course Compass) */}
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px' }}>How well it fits, factor by factor:</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '10px 24px' }}>
                      {matchFactors.map((f) => (
                        <div key={f.label}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                            <span style={{ color: 'var(--text-muted)' }}>{f.label}</span>
                            <span style={{ color: 'white', fontWeight: 600 }}>{f.v}%</span>
                          </div>
                          <div style={{ height: '6px', borderRadius: '3px', background: 'var(--card-border)', overflow: 'hidden' }}>
                            <div style={{ width: `${f.v}%`, height: '100%', background: 'var(--secondary)' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Course Autopsy — honest alumni truth report (Course Compass) */}
                  <div style={{ marginBottom: '20px', padding: '14px 16px', borderRadius: '10px', background: 'rgba(153, 27, 27, 0.06)', border: '1px solid rgba(153, 27, 27, 0.2)' }}>
                    <h4 style={{ fontSize: '13px', color: 'var(--accent)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Microscope size={14} /> AI Course Autopsy — the honest truth
                    </h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                      Alumni rate this program highly for profile fit, but their most common honest caution is: <strong style={{ color: '#fca5a5' }}>{autopsyCaution}</strong>.
                    </p>
                  </div>

                  {/* Program stats summary line */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', fontSize: '13px', borderTop: '1px solid var(--card-border)', paddingTop: '16px' }}>
                    <div>Duration: <strong style={{ color: 'white' }}>{match.duration}</strong></div>
                    <div>Est. Tuition: <strong style={{ color: 'white' }}>{match.fee}</strong></div>
                  </div>
                </div>

                {/* Match score display panel */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '120px' }}>
                  <div style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: '50%',
                    border: '3px solid var(--card-border)',
                    borderTopColor: 'var(--secondary)',
                    borderRightColor: 'var(--secondary)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 15px var(--secondary-glow)'
                  }} className="icon-container">
                    <span style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--secondary)' }}>{currentUser && match.id === 1 ? 100 : match.matchScore}%</span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fit</span>
                  </div>
                  
                  {/* Compare Checkbox */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer', color: 'var(--text-muted)' }}>
                    <input 
                      type="checkbox" 
                      checked={isSelectedForCompare} 
                      onChange={() => handleToggleCompare(match.id)}
                      style={{ cursor: 'pointer' }}
                    />
                    Compare program
                  </label>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '24px', borderTop: '1px solid var(--card-border)', paddingTop: '20px', position: 'relative', zIndex: 2, alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    className={isApplied ? "btn-premium-outline" : "btn-premium"}
                    onClick={() => {
                      const checkbox = document.getElementById(`ai-rec-match-${match.id}`);
                      const reqRec = checkbox ? checkbox.checked : false;
                      applyForCourse(getInstitutionName(match.institutionId), match.title, reqRec);
                    }}
                    disabled={isApplied}
                    style={{ padding: '8px 20px', fontSize: '13px' }}
                  >
                    {isApplied ? "Applied Successfully" : "Apply to Program"}
                  </button>
                  <button 
                    className="btn-premium-outline" 
                    onClick={() => toggleBookmark(match.id)}
                    style={{ padding: '8px 16px', fontSize: '13px' }}
                  >
                    {isBookmarked ? <BookmarkCheck size={16} style={{ color: 'var(--secondary)' }} /> : <Bookmark size={16} />}
                    {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                  </button>
                  <button 
                    className="btn-premium-outline"
                    onClick={() => alert("Connecting you with an educational advisor. A call has been requested.")}
                    style={{ padding: '8px 16px', fontSize: '13px' }}
                  >
                    <PhoneCall size={16} />
                    Speak to Counselor
                  </button>
                </div>
                {!isApplied && (
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <input type="checkbox" id={`ai-rec-match-${match.id}`} style={{ cursor: 'pointer' }} />
                    Request AI Expert Recommendation
                  </label>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
