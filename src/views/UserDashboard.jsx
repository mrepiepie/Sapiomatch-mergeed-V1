import React, { useState } from 'react';
import { mockMatches } from '../mockData';
import { Award, Landmark, User, FileText, CheckCircle, Clock, Calendar, ShieldAlert, RotateCw, Sparkles, X, Send } from 'lucide-react';

export default function UserDashboard({ 
  setView, 
  answers, 
  bookmarks = [], 
  toggleBookmark, 
  appliedCourses = [],
  credits = 100,
  setCredits,
  plan = 'Standard',
  setPlan,
  onUpdateMembership,
  triggerAlert,
  currentUser,
  onRefreshApplications
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentTab, setPaymentTab] = useState('upgrade'); // 'upgrade' or 'buy'
  const [selectedBundle, setSelectedBundle] = useState(null);

  const matchedBookmarks = mockMatches.filter(m => bookmarks.includes(m.id));

  const applyMembershipUpdate = ({ nextPlan = plan, addedCredits = 0 }) => {
    const nextCredits = credits + addedCredits;

    if (onUpdateMembership) {
      onUpdateMembership({ plan: nextPlan, credits: nextCredits });
      return;
    }

    setPlan(nextPlan);
    setCredits(nextCredits);
  };

  const handleCancelApplication = async (appId) => {
    if (window.confirm("Are you sure you want to cancel this application? It will be removed from your dashboard.")) {
      try {
        const res = await fetch(`/api/applications/${appId}/reply`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: 'Cancelled',
            replyText: 'Application cancelled by candidate.'
          })
        });
        if (res.ok) {
          if (triggerAlert) {
            triggerAlert("Your application has been cancelled and removed.", "Application Cancelled", "success");
          } else {
            alert("Your application has been cancelled.");
          }
          if (onRefreshApplications) {
            onRefreshApplications();
          }
        } else {
          alert("Failed to cancel application.");
        }
      } catch (e) {
        console.error("Error cancelling application:", e);
        alert("Network error.");
      }
    }
  };

  const handleCheckout = (type) => {
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      if (type === 'upgrade') {
        applyMembershipUpdate({ nextPlan: 'Premium', addedCredits: 700 });
        if (triggerAlert) {
          triggerAlert("Successfully upgraded to Premium! 700 credits added to your balance.", "Premium Membership Active ⚡", "success");
        } else {
          alert("Successfully upgraded to Premium! 700 credits added to your balance.");
        }
      } else {
        const addedCredits = selectedBundle ? selectedBundle.credits : 100;
        applyMembershipUpdate({ addedCredits });
        if (triggerAlert) {
          triggerAlert(`Successfully purchased ${addedCredits} credits!`, "Credits Added 🪙", "success");
        } else {
          alert(`Successfully purchased ${addedCredits} credits!`);
        }
        setSelectedBundle(null);
      }
    }, 1200);
  };

  const renderCheckoutForm = (checkoutType) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button 
          onClick={() => handleCheckout(checkoutType)} 
          className="btn-premium" 
          disabled={isProcessing}
          style={{ width: '100%', padding: '12px', fontSize: '13px', justifyContent: 'center', marginTop: '4px' }}
        >
          {isProcessing ? 'Processing Upgrade...' : (checkoutType === 'upgrade' ? 'Confirm Upgrade to Premium (30 AED)' : `Confirm Purchase (${selectedBundle?.price || 10} AED)`)}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0' }}>
          <hr style={{ flex: 1, borderColor: 'var(--border)', opacity: 0.15 }} />
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>OR</span>
          <hr style={{ flex: 1, borderColor: 'var(--border)', opacity: 0.15 }} />
        </div>

        <button 
          type="button" 
          onClick={() => {
            setIsProcessing(true);
            setTimeout(() => {
              setIsProcessing(false);
              if (checkoutType === 'upgrade') {
                applyMembershipUpdate({ nextPlan: 'Premium', addedCredits: 700 });
                if (triggerAlert) {
                  triggerAlert("Upgraded to Premium via Apple Pay! 700 credits added to your balance.", "Premium Active via Apple Pay 🍎", "success");
                } else {
                  alert("Upgraded to Premium via Apple Pay! 700 credits added to your balance.");
                }
              } else {
                const addedCredits = selectedBundle ? selectedBundle.credits : 100;
                applyMembershipUpdate({ addedCredits });
                if (triggerAlert) {
                  triggerAlert(`Purchased ${addedCredits} credits via Apple Pay!`, "Apple Pay Success 🍎", "success");
                } else {
                  alert(`Purchased ${addedCredits} credits via Apple Pay!`);
                }
                setSelectedBundle(null);
              }
            }, 1000);
          }}
          disabled={isProcessing}
          style={{
            background: '#ffffff',
            color: '#000000',
            fontWeight: 700,
            borderRadius: 'var(--border-radius-sm)',
            padding: '11px',
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            border: 'none',
            fontFamily: 'var(--font-sans)',
            width: '100%',
            transition: 'opacity 0.2s'
          }}
        >
           Pay with Apple Pay
        </button>
      </div>
    );
  };

  const visibleApps = appliedCourses.filter(app => app.status !== 'Cancelled');
  const pendingApps = visibleApps.filter(app => app.status !== 'Accepted' && app.status !== 'Approved');
  const approvedApps = visibleApps.filter(app => app.status === 'Accepted' || app.status === 'Approved');

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
          Welcome back, <span className="gradient-text">{currentUser?.name || answers.name || 'Sanji'}</span>
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Manage your AI matches, application workflows, and share your digital Student ID Passport.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '32px', alignItems: 'start' }}>
        
        {/* Left Column: Sapio Student ID Passport */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h3 style={{ fontSize: '18px', fontFamily: 'var(--font-display)' }}>Digital Student Passport</h3>
          
          {/* Flip Card Container */}
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            style={{ 
              perspective: '1000px', 
              width: '100%', 
              height: '240px', 
              cursor: 'pointer' 
            }}
          >
            <div style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              textAlign: 'center',
              transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'none'
            }}>
              
              {/* Front side */}
              <div className="glass-card anim-glow" style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                background: plan === 'Premium' 
                  ? 'linear-gradient(135deg, rgba(251, 146, 60, 0.18) 0%, rgba(17, 24, 39, 0.95) 70%, rgba(251, 146, 60, 0.18) 100%), var(--card-bg)'
                  : 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(17, 24, 39, 0.95) 100%), var(--card-bg)',
                border: plan === 'Premium' 
                  ? '2px solid var(--secondary)' 
                  : '1px solid var(--primary)',
                boxShadow: plan === 'Premium'
                  ? '0 0 25px rgba(251, 146, 60, 0.35)'
                  : '0 0 15px rgba(16, 185, 129, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '24px',
                borderRadius: 'var(--border-radius-md)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ 
                      fontSize: '11px', 
                      color: plan === 'Premium' ? 'var(--secondary)' : 'var(--primary)', 
                      fontWeight: 700, 
                      letterSpacing: '0.1em', 
                      textTransform: 'uppercase' 
                    }}>
                      SapioMatch {plan === 'Premium' ? 'Premium' : 'AI'}
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 700, marginTop: '4px' }}>Student Passport</div>
                  </div>
                  <div style={{ 
                    width: '36px', 
                    height: '36px', 
                    borderRadius: '50%', 
                    background: plan === 'Premium'
                      ? 'linear-gradient(135deg, var(--secondary) 0%, #d97706 100%)'
                      : 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: plan === 'Premium' ? '0 0 10px rgba(251, 146, 60, 0.5)' : 'none'
                  }}>
                    {plan === 'Premium' ? (
                      <Sparkles size={18} style={{ color: 'white' }} />
                    ) : (
                      <Award size={18} style={{ color: 'white' }} />
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', margin: '20px 0' }}>
                  {/* Mock Profile pic */}
                  <div style={{ 
                    width: '56px', 
                    height: '56px', 
                    borderRadius: '50%', 
                    background: 'rgba(255, 255, 255, 0.05)', 
                    border: plan === 'Premium' ? '1px solid var(--secondary)' : '1px solid var(--card-border)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <User size={28} style={{ color: plan === 'Premium' ? 'var(--secondary)' : 'var(--primary)' }} />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'white' }}>
                      {currentUser?.name || answers.name || 'Sanji'} {plan === 'Premium' && '👑'}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Target: {answers.field || 'Law & Public Policy'}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '11px' }}>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ color: 'var(--text-muted)' }}>Student ID</div>
                    <div style={{ fontWeight: 600, color: 'white', marginTop: '2px' }}>SM-2026-99201</div>
                  </div>
                  <div style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: plan === 'Premium' ? 'rgba(251, 146, 60, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                    color: plan === 'Premium' ? 'var(--secondary)' : '#34d399',
                    border: plan === 'Premium' ? '1px solid rgba(251, 146, 60, 0.3)' : '1px solid rgba(16, 185, 129, 0.2)',
                    fontWeight: 700,
                    textTransform: 'uppercase'
                  }}>
                    {plan === 'Premium' ? '★ Premium Candidate ★' : 'Verified Candidate'}
                  </div>
                </div>
              </div>

              {/* Back side */}
              <div className="glass-card" style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                background: 'var(--card-bg)',
                border: plan === 'Premium' ? '2px solid var(--secondary)' : '1px solid var(--primary)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '24px',
                borderRadius: 'var(--border-radius-md)'
              }}>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ 
                    fontSize: '12px', 
                    fontWeight: 700, 
                    color: plan === 'Premium' ? 'var(--secondary)' : 'var(--primary)', 
                    marginBottom: '8px' 
                  }}>
                    PASSPORT DATA LOG {plan === 'Premium' && ' (PREMIUM)'}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Education:</span>
                      <span style={{ color: 'white', fontWeight: 600 }}>{answers.education || "Bachelor's degree"}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Experience:</span>
                      <span style={{ color: 'white', fontWeight: 600 }}>{answers.experience || "3–5 years"}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Study Format:</span>
                      <span style={{ color: 'white', fontWeight: 600 }}>{answers.format || "Hybrid"}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Target Region:</span>
                      <span style={{ color: 'white', fontWeight: 600 }}>{answers.region || "Europe"}</span>
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', borderTop: '1px solid var(--card-border)', paddingTop: '10px' }}>
                  {/* Mock QR */}
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    background: 'white', 
                    padding: '4px', 
                    borderRadius: '4px',
                    border: plan === 'Premium' ? '1px solid var(--secondary)' : 'none'
                  }}>
                    <div style={{ width: '100%', height: '100%', background: 'var(--bg-color)', clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}></div>
                  </div>
                  <div style={{ textAlign: 'left', fontSize: '10px', color: 'var(--text-muted)' }}>
                    {plan === 'Premium' 
                      ? 'Scan to sync premium verified credentials directly to priority partner CRM systems.'
                      : 'Scan to sync credentials directly to partner university CRM systems.'
                    }
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <RotateCw size={12} />
            <span>Click card to flip and view academic credentials log</span>
          </div>

          {/* Membership & Credits Panel */}
          <div className="glass-card" style={{ marginTop: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--card-border)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '16px', fontFamily: 'var(--font-display)', margin: 0, color: 'white' }}>Membership & Credits</h3>
              <span style={{
                padding: '2px 8px',
                borderRadius: '4px',
                background: plan === 'Premium' ? 'rgba(251, 146, 60, 0.15)' : 'rgba(52, 211, 153, 0.15)',
                color: plan === 'Premium' ? 'var(--secondary)' : 'var(--primary)',
                fontWeight: 700,
                fontSize: '10px',
                textTransform: 'uppercase'
              }}>{plan} Plan</span>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Advisor Credits:</span>
                <strong style={{ color: 'white' }}>{credits} Credits</strong>
              </div>
              <div style={{ height: '8px', background: 'var(--card-border)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${Math.min(100, (credits / 800) * 100)}%`,
                  background: plan === 'Premium' ? 'linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%)' : 'var(--primary)',
                  transition: 'width 0.4s ease'
                }} />
              </div>
            </div>

            {/* Tabs for Upgrade / Buy Credits */}
            <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--card-border)', paddingBottom: '10px', marginBottom: '16px' }}>
              <button 
                onClick={() => setPaymentTab('upgrade')}
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: paymentTab === 'upgrade' ? 'var(--secondary)' : 'var(--text-muted)',
                  borderBottom: paymentTab === 'upgrade' ? '2px solid var(--secondary)' : 'none',
                  padding: '4px 0',
                  background: 'none',
                  border: 'none'
                }}
              >
                Upgrade Plan
              </button>
              <button 
                onClick={() => setPaymentTab('buy')}
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: paymentTab === 'buy' ? 'var(--secondary)' : 'var(--text-muted)',
                  borderBottom: paymentTab === 'buy' ? '2px solid var(--secondary)' : 'none',
                  padding: '4px 0',
                  background: 'none',
                  border: 'none'
                }}
              >
                Buy Credits
              </button>
            </div>

            {paymentTab === 'upgrade' ? (
              <div>
                {plan === 'Premium' ? (
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, textAlign: 'center', padding: '12px' }}>
                    🎉 You are enjoying <strong>Premium Membership</strong> benefits with a 700 credit bonus active!
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ background: 'rgba(251, 146, 60, 0.05)', border: '1px dashed rgba(251, 146, 60, 0.2)', padding: '12px', borderRadius: '8px', textAlign: 'left' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'white', marginBottom: '2px' }}>Premium Access — 30 AED / mo</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Get an immediate bonus of <strong>700 credits</strong> to consult advisor experts.</div>
                    </div>
                    
                    {renderCheckoutForm('upgrade')}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="btn-premium-outline"
                    onClick={() => { setSelectedBundle({ name: 'Starter Pack (+100 Credits)', price: 10, credits: 100 }); }}
                    style={{ flex: 1, padding: '8px', fontSize: '10px', justifyContent: 'center', background: selectedBundle?.price === 10 ? 'rgba(52, 211, 153, 0.05)' : 'transparent', borderColor: selectedBundle?.price === 10 ? 'var(--primary)' : 'var(--card-border)' }}
                  >
                    +100 Credits (10 AED)
                  </button>
                  <button 
                    className="btn-premium-outline"
                    onClick={() => { setSelectedBundle({ name: 'Pro Pack (+300 Credits)', price: 25, credits: 300 }); }}
                    style={{ flex: 1, padding: '8px', fontSize: '10px', justifyContent: 'center', background: selectedBundle?.price === 25 ? 'rgba(52, 211, 153, 0.05)' : 'transparent', borderColor: selectedBundle?.price === 25 ? 'var(--primary)' : 'var(--card-border)' }}
                  >
                    +300 Credits (25 AED)
                  </button>
                </div>
                
                {selectedBundle ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'left' }}>Selected: <strong>{selectedBundle.name}</strong></div>
                    {renderCheckoutForm('bundle')}
                  </div>
                ) : (
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', margin: 0 }}>Select a credit bundle to proceed with checkout.</p>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Applications tracker & bookmarks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Applications list */}
          <div className="glass-card">
            <h3 style={{ fontSize: '20px', fontFamily: 'var(--font-display)', marginBottom: '20px', borderBottom: '1px solid var(--card-border)', paddingBottom: '12px' }}>
              Your Course Applications ({visibleApps.length})
            </h3>
            
            {visibleApps.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Pending Applications Section */}
                {pendingApps.length > 0 && (
                  <div style={{ marginBottom: '12px' }}>
                    <h4 style={{ fontSize: '13px', color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', fontWeight: 700 }}>
                      Pending Approval ({pendingApps.length})
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {pendingApps.map((app, idx) => (
                        <div key={idx} style={{ 
                          padding: '16px', 
                          background: 'rgba(255,255,255,0.01)', 
                          border: '1px solid var(--card-border)', 
                          borderRadius: 'var(--border-radius-sm)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '12px'
                        }}>
                          <div>
                            <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'white', marginBottom: '4px' }}>{app.courseName}</h4>
                            <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Landmark size={12} />
                                {app.universityName}
                              </span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Calendar size={12} />
                                Applied: {app.date}
                              </span>
                            </div>
                          </div>
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{
                              padding: '4px 10px',
                              borderRadius: 'var(--border-radius-full)',
                              fontSize: '11px',
                              fontWeight: 700,
                              background: 'rgba(245, 158, 11, 0.1)',
                              color: '#f59e0b',
                              border: '1px solid rgba(245, 158, 11, 0.2)'
                            }}>
                              {app.status || 'Under Review'}
                            </span>
                            <button 
                              onClick={() => handleCancelApplication(app.id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--accent)',
                                cursor: 'pointer',
                                padding: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                              title="Cancel Request"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Approved Applications Section */}
                {approvedApps.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: '13px', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', fontWeight: 700 }}>
                      Approved Applications ({approvedApps.length})
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {approvedApps.map((app, idx) => (
                        <div key={idx} style={{ 
                          padding: '16px', 
                          background: 'rgba(16, 185, 129, 0.06)', 
                          border: '1px solid #10b981', 
                          borderRadius: 'var(--border-radius-sm)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'white', marginBottom: '4px' }}>{app.courseName}</h4>
                              <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <Landmark size={12} />
                                  {app.universityName}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <Calendar size={12} />
                                  Applied: {app.date}
                                </span>
                              </div>
                            </div>
                            
                            <span style={{
                              padding: '4px 10px',
                              borderRadius: 'var(--border-radius-full)',
                              fontSize: '11px',
                              fontWeight: 700,
                              background: 'rgba(16, 185, 129, 0.15)',
                              color: '#34d399',
                              border: '1px solid rgba(16, 185, 129, 0.3)'
                            }}>
                              Approved
                            </span>
                          </div>

                          {app.replyText && (
                            <div style={{ 
                              padding: '10px', 
                              background: 'rgba(255,255,255,0.02)', 
                              borderLeft: '3px solid #10b981', 
                              fontSize: '12px', 
                              color: '#e5e7eb',
                              lineHeight: '1.4'
                            }}>
                              <strong>Advisor note:</strong> "{app.replyText}"
                            </div>
                          )}

                          {(app.meetingDate || app.meetingLink) && (
                            <div style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center', 
                              borderTop: '1px solid rgba(255,255,255,0.05)', 
                              paddingTop: '10px',
                              fontSize: '12px' 
                            }}>
                              <div>
                                <span style={{ color: 'var(--text-muted)' }}>Scheduled:</span>{' '}
                                <strong style={{ color: 'white' }}>{app.meetingDate || 'Date pending'}</strong>
                              </div>
                              {app.meetingLink && (
                                <a 
                                  href={app.meetingLink} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="btn-premium"
                                  style={{ padding: '6px 12px', fontSize: '11px', gap: '4px' }}
                                >
                                  <Calendar size={12} />
                                  Join Meeting
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: '14px', marginBottom: '16px' }}>You haven't applied to any programs yet.</p>
                <button className="btn-premium" onClick={() => setView('public-explore')} style={{ padding: '8px 16px', fontSize: '13px' }}>
                  Find Programs
                </button>
              </div>
            )}
          </div>

          {/* Bookmarks */}
          <div className="glass-card">
            <h3 style={{ fontSize: '20px', fontFamily: 'var(--font-display)', marginBottom: '20px', borderBottom: '1px solid var(--card-border)', paddingBottom: '12px' }}>
              Saved Programs ({matchedBookmarks.length})
            </h3>

            {matchedBookmarks.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {matchedBookmarks.map(match => (
                  <div 
                    key={match.id}
                    style={{ 
                      padding: '16px', 
                      background: 'rgba(255,255,255,0.02)', 
                      border: '1px solid var(--card-border)', 
                      borderRadius: 'var(--border-radius-sm)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '16px'
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'white', marginBottom: '4px' }}>{match.title}</h4>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {match.fee} · {match.format}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        className="btn-premium"
                        onClick={() => {
                          setView('results');
                        }}
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                      >
                        View Match Info
                      </button>
                      <button 
                        className="btn-premium-outline"
                        onClick={() => toggleBookmark(match.id)}
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', padding: '20px 0', fontSize: '14px', color: 'var(--text-muted)' }}>
                No saved courses. Save courses from your AI Match results to track them here.
              </p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
