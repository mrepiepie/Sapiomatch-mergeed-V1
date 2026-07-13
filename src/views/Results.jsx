import React, { useState, useEffect } from 'react';
import { mockInstitutions } from '../mockData';
import { Award, Check, ArrowRight, Bookmark, BookmarkCheck, PhoneCall, HelpCircle, AlertCircle, X, Download } from 'lucide-react';

export default function Results({ setView, answers, bookmarks = [], toggleBookmark, applyForCourse, appliedCourses = [], alert, currentUser, plan = 'Standard', onUpdateMembership }) {
  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [isProcessingUpgrade, setIsProcessingUpgrade] = useState(false);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const printReport = () => {
    window.print();
  };

  useEffect(() => {
    let active = true;
    async function fetchMatches() {
      try {
        setLoading(true);
        const res = await fetch('/api/match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers })
        });
        if (res.ok && active) {
          const data = await res.json();
          setMatches(data.matches || []);
        }
      } catch (err) {
        console.error("Failed to load live matches from API:", err);
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchMatches();
    return () => { active = false; };
  }, [answers]);

  const handleUpgradeClick = () => {
    if (!currentUser) {
      localStorage.setItem('learnova_auth_redirect', 'results');
      setView('auth');
    } else {
      setIsProcessingUpgrade(true);
      setTimeout(() => {
        setIsProcessingUpgrade(false);
        if (onUpdateMembership) {
          onUpdateMembership({ plan: 'Premium', addedCredits: 700 });
          alert("Payment Successful! You have upgraded to Premium and unlocked all recommendations.");
        }
      }, 1500);
    }
  };

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

  const selectedMatches = matches.filter(m => compareList.includes(m.id));

  if (loading) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', textAlign: 'center' }} className="page-fade-enter">
        <h1 style={{ fontSize: '32px', fontFamily: 'var(--font-display)', marginBottom: '8px', color: 'white' }}>
          Calculating your matches...
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
          Our AI engine is scanning partner university databases to identify your top fits.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-card" style={{ padding: '24px', height: '180px', display: 'flex', flexDirection: 'column', gap: '16px', opacity: 0.7 - i * 0.15, animation: 'pulse 1.8s infinite ease-in-out', border: '1px solid var(--card-border)' }}>
              <div style={{ width: '40%', height: '16px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px' }} />
              <div style={{ width: '70%', height: '24px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px' }} />
              <div style={{ width: '90%', height: '14px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', marginTop: '12px' }} />
              <div style={{ width: '50%', height: '14px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }} className="page-fade-enter">
      
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
          Based on your profile, Learnova AI has found these programs matching a {answers.age || '29'}-year-old working professional with a {answers.education || "Bachelor's degree"} background and {answers.experience || "3-5 years"} of experience.
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--card-border)', paddingBottom: '10px', position: 'relative', zIndex: 2 }}>
          <h3 style={{ fontSize: '16px', color: 'white', margin: 0 }}>Your AI Search Profile</h3>
          <button onClick={printReport} className="btn-premium" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', fontSize: '12px' }}>
            <Download size={13} /> Download PDF Report
          </button>
        </div>
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
        {matches.map((match, index) => {
          const isBookmarked = bookmarks.includes(match.id);
          const isApplied = appliedCourses.some(app => app.courseName === match.title && (app.universityName === getInstitutionName(match.institutionId) || app.institution === getInstitutionName(match.institutionId)));
          const isSelectedForCompare = compareList.includes(match.id);
          const isBlurred = plan !== 'Premium' && index >= 3;

          return (
            <React.Fragment key={match.id}>
              {/* Payment Area Card: rendered right before card 4 (index === 3) for standard/guest users */}
              {plan !== 'Premium' && index === 3 && (
                <div style={{
                  padding: '30px 40px',
                  background: 'linear-gradient(135deg, rgba(180, 83, 9, 0.12) 0%, rgba(124, 58, 237, 0.12) 100%)',
                  border: '1px solid rgba(180, 83, 9, 0.5)',
                  borderRadius: '16px',
                  textAlign: 'center',
                  margin: '20px 0',
                  boxShadow: '0 8px 32px rgba(180, 83, 9, 0.25)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {/* Decorative glowing backdrops */}
                  <div style={{
                    position: 'absolute',
                    top: '-50%',
                    left: '-20%',
                    width: '300px',
                    height: '300px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(180, 83, 9, 0.12) 0%, rgba(180, 83, 9, 0) 70%)',
                    filter: 'blur(40px)',
                    pointerEvents: 'none'
                  }} />
                  <div style={{
                    position: 'absolute',
                    bottom: '-50%',
                    right: '-20%',
                    width: '300px',
                    height: '300px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(124, 58, 237, 0.12) 0%, rgba(124, 58, 237, 0) 70%)',
                    filter: 'blur(40px)',
                    pointerEvents: 'none'
                  }} />

                  <h3 style={{ fontSize: '22px', fontFamily: 'var(--font-display)', color: 'white', margin: 0, fontWeight: 700, letterSpacing: '0.02em', position: 'relative', zIndex: 1 }}>
                    Want to refine further?
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '600px', lineHeight: '1.6', margin: '0 0 10px 0', position: 'relative', zIndex: 1 }}>
                    Unlock 3+ more premium university matches tailored to your profile, access detailed matching analytics, and speak directly to our educational advisors.
                  </p>
                  
                  <button 
                    id="amtpy" 
                    className="btn-premium" 
                    onClick={handleUpgradeClick}
                    disabled={isProcessingUpgrade}
                    style={{ padding: '12px 28px', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '8px', position: 'relative', zIndex: 1, fontWeight: 700 }}
                  >
                    {isProcessingUpgrade ? (
                      <>Processing Payment...</>
                    ) : (
                      <>
                        {currentUser ? 'Unlock Premium Recommendations (30 AED)' : 'Login / Register to Unlock Premium'}
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* The Recommendation Card */}
              <div className="spotlight-card" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ padding: '24px', position: 'relative', '--spotlight-color': 'rgba(43, 92, 70, 0.12)' }}>
                
                {/* Wrapped content that gets blurred */}
                <div style={{
                  filter: isBlurred ? 'blur(8px)' : 'none',
                  pointerEvents: isBlurred ? 'none' : 'auto',
                  userSelect: isBlurred ? 'none' : 'auto',
                  transition: 'filter 0.3s ease'
                }}>
                  {/* Header info */}
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
                    </div>
                  </div>

                  {/* Details section */}
                  <div style={{ position: 'relative', marginTop: '16px', zIndex: 1 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '20px', alignItems: 'flex-start' }}>
                      <div style={{ flex: '1 1 500px' }}>
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

                        {/* Program stats summary line */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', fontSize: '13px', borderTop: '1px solid var(--card-border)', paddingTop: '16px' }}>
                          <div>Duration: <strong style={{ color: 'white' }}>{match.duration}</strong></div>
                          <div>Est. Tuition: <strong style={{ color: 'white' }}>{match.fee}</strong></div>
                        </div>
                      </div>
                      
                      {/* Compare checkbox wrapper */}
                      <div style={{ width: '120px', display: 'flex', justifyContent: 'center' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer', color: 'var(--text-muted)' }}>
                          <input 
                            type="checkbox" 
                            checked={isSelectedForCompare} 
                            onChange={() => !isBlurred && handleToggleCompare(match.id)}
                            disabled={isBlurred}
                            style={{ cursor: 'pointer' }}
                          />
                          Compare program
                        </label>
                      </div>
                    </div>

                    {/* Action Buttons Row */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '24px', borderTop: '1px solid var(--card-border)', paddingTop: '20px', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button 
                          className={isApplied ? "btn-premium-outline" : "btn-premium"}
                          onClick={() => {
                            const checkbox = document.getElementById(`ai-rec-match-${match.id}`);
                            const reqRec = checkbox ? checkbox.checked : false;
                            applyForCourse(getInstitutionName(match.institutionId), match.title, reqRec);
                          }}
                          disabled={isApplied || isBlurred}
                          style={{ padding: '8px 20px', fontSize: '13px' }}
                        >
                          {isApplied ? "Applied Successfully" : "Apply to Program"}
                        </button>
                        <button 
                          className="btn-premium-outline" 
                          onClick={() => !isBlurred && toggleBookmark(match.id)}
                          disabled={isBlurred}
                          style={{ padding: '8px 16px', fontSize: '13px' }}
                        >
                          {isBookmarked ? <BookmarkCheck size={16} style={{ color: 'var(--secondary)' }} /> : <Bookmark size={16} />}
                          {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                        </button>
                        <button 
                          className="btn-premium-outline"
                          onClick={() => !isBlurred && alert("Connecting you with an educational advisor. A call has been requested.")}
                          disabled={isBlurred}
                          style={{ padding: '8px 16px', fontSize: '13px' }}
                        >
                          <PhoneCall size={16} />
                          Speak to Counselor
                        </button>
                      </div>
                      {!isApplied && (
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)', cursor: 'pointer' }}>
                          <input type="checkbox" id={`ai-rec-match-${match.id}`} disabled={isBlurred} style={{ cursor: 'pointer' }} />
                          Request AI Expert Recommendation
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                {/* Glassmorphic paywall card overlay for guest users */}
                {isBlurred && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(11, 15, 25, 0.65)',
                    backdropFilter: 'blur(3px)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '24px',
                    borderRadius: 'var(--border-radius-md)',
                    zIndex: 10,
                    textAlign: 'center'
                  }}>
                    <div style={{
                      background: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid rgba(16, 185, 129, 0.35)',
                      borderRadius: '12px',
                      padding: '20px 30px',
                      maxWidth: '420px',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
                      backdropFilter: 'blur(10px)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <h4 style={{ fontSize: '18px', fontWeight: 800, color: 'white', margin: 0, letterSpacing: '0.05em', textShadow: '0 0 10px rgba(16, 185, 129, 0.5)' }}>
                        <span>🔒 Unlock Premium Matches</span>
                      </h4>
                      <p style={{ fontSize: '12.5px', color: '#ffffff', lineHeight: '1.55', marginBottom: '14px' }}>
                        To access detailed match reasons, annual tuition fees, course durations, and apply or speak to an advisor, upgrade to premium.
                      </p>
                      <button 
                        className="btn-premium" 
                        onClick={handleUpgradeClick}
                        style={{ padding: '8px 18px', fontSize: '12px', margin: '0 auto', display: 'inline-flex' }}
                      >
                        {currentUser ? 'Upgrade Now' : 'Login / Register to Upgrade'}
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Hidden print container only visible when printing */}
      <div id="print-report-container" style={{ display: 'none', position: 'absolute', top: 0, left: 0, width: '100%', padding: '40px', background: 'white', color: 'black', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div style={{ borderBottom: '2px solid #10b981', paddingBottom: '20px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, margin: 0, color: '#10b981' }}>LEARNOVA AI</h1>
            <p style={{ fontSize: '14px', margin: '4px 0 0 0', color: '#666' }}>Academic Recommendation Report</p>
          </div>
          <div style={{ textAlign: 'right', fontSize: '12px', color: '#666' }}>
            <div>Date: {new Date().toLocaleDateString()}</div>
            <div>Candidate: {currentUser?.name || 'Verified Candidate'}</div>
          </div>
        </div>

        <div style={{ marginBottom: '30px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#111827' }}>Candidate Search Profile</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px 24px', fontSize: '14px' }}>
            <div><strong>Age:</strong> {answers.age || '29'}</div>
            <div><strong>Target Goal:</strong> {answers.goal || 'Get Promoted'}</div>
            <div><strong>Education Background:</strong> {answers.education || "Bachelor's"}</div>
            <div><strong>Study Format:</strong> {answers.format || 'Hybrid'}</div>
            <div><strong>Field of Interest:</strong> {answers.field || 'Law & Policy'}</div>
            <div><strong>Experience Level:</strong> {answers.experience || '3-5 years'}</div>
          </div>
        </div>

        <h3 style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', marginBottom: '16px', fontSize: '18px', color: '#111827' }}>Top Academic Program Matches</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {matches.slice(0, 3).map((match, idx) => (
            <div key={match.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '16px', color: '#111827' }}>{idx + 1}. {match.title}</h4>
                  <span style={{ fontSize: '13px', color: '#6b7280' }}>{getInstitutionName(match.institutionId)}</span>
                </div>
                <div style={{ padding: '4px 8px', background: '#ecfdf5', color: '#047857', borderRadius: '4px', fontSize: '13px', fontWeight: 700 }}>
                  {currentUser && match.id === 1 ? 100 : match.matchScore}% Match
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', fontSize: '13px', background: '#f9fafb', padding: '8px 12px', borderRadius: '6px', marginBottom: '12px' }}>
                <div><strong>Annual Fee:</strong> {match.fee}</div>
                <div><strong>Format:</strong> {match.format}</div>
                <div><strong>Duration:</strong> {match.duration}</div>
              </div>
              <div style={{ fontSize: '13px', color: '#374151' }}>
                <strong>Key Advantages:</strong>
                <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px' }}>
                  {match.pros.map((pro, i) => <li key={i}>{pro}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '50px', borderTop: '1px solid #e5e7eb', paddingTop: '20px', textAlign: 'center', fontSize: '12px', color: '#9ca3af' }}>
          Report generated securely by Learnova AI matchmaking platform.
        </div>
      </div>
    </div>
  );
}
