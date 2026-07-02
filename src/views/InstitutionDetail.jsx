import React from 'react';
import { MapPin, DollarSign, Clock, Award, Star, ThumbsUp, CheckCircle, ArrowLeft, Send } from 'lucide-react';

export default function InstitutionDetail({ instId, setView, applyForCourse, appliedCourses = [], institutions = [] }) {
  const inst = institutions.find(i => i.id === instId) || institutions[0];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
      {/* Back button */}
      <button 
        onClick={() => setView('public-explore')}
        style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '8px', 
          color: 'var(--text-muted)', 
          cursor: 'pointer',
          marginBottom: '24px',
          fontWeight: 600,
          fontSize: '14px'
        }}
      >
        <ArrowLeft size={16} />
        Back to Explore
      </button>

      {/* Hero Header Card */}
      <div className="glass-card anim-glow" style={{ padding: '32px', marginBottom: '30px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '20px', alignItems: 'flex-start', position: 'relative', zIndex: 2 }}>
          <div>
            <span style={{
              padding: '4px 10px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              background: inst.type === 'University' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(180, 83, 9, 0.15)',
              color: inst.type === 'University' ? '#60a5fa' : '#22d3ee',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              display: 'inline-block',
              marginBottom: '12px'
            }}>
              {inst.type}
            </span>
            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: '8px' }}>{inst.name}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '16px', maxWidth: '800px' }}>
              {inst.tagline}
            </p>
          </div>
          <button className="btn-premium" onClick={() => setView('questionnaire')}>
            Check AI Match Fit
          </button>
        </div>
      </div>

      {/* Grid of details */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <MapPin size={24} style={{ color: 'var(--secondary)', marginBottom: '10px' }} />
          <h4 style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Location</h4>
          <p style={{ fontWeight: 600, fontSize: '15px' }}>{inst.location}</p>
        </div>
        
        <div className="glass-card" style={{ padding: '20px' }}>
          <DollarSign size={24} style={{ color: 'var(--success)', marginBottom: '10px' }} />
          <h4 style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Tuition / Fees</h4>
          <p style={{ fontWeight: 600, fontSize: '15px' }}>{inst.fee}</p>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <Clock size={24} style={{ color: 'var(--accent)', marginBottom: '10px' }} />
          <h4 style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Duration</h4>
          <p style={{ fontWeight: 600, fontSize: '15px' }}>{inst.duration}</p>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <Award size={24} style={{ color: 'var(--warning)', marginBottom: '10px' }} />
          <h4 style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Reputation Rating</h4>
          <p style={{ fontWeight: 600, fontSize: '15px' }}>{inst.reputation}</p>
        </div>
      </div>

      {/* Main split details content */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', alignItems: 'start' }}>
        {/* Left column: About & Courses */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {/* About */}
          <div className="glass-card">
            <h2 style={{ fontSize: '22px', marginBottom: '16px', borderBottom: '1px solid var(--card-border)', paddingBottom: '12px' }}>About</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7' }}>
              {inst.about}
            </p>
          </div>

          {/* Courses Offered */}
          <div className="glass-card">
            <h2 style={{ fontSize: '22px', marginBottom: '20px', borderBottom: '1px solid var(--card-border)', paddingBottom: '12px' }}>Courses Offered</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {inst.courses.map((course, idx) => {
                const isApplied = appliedCourses.some(app => app.courseName === course.name && (app.universityName === inst.name || app.institution === inst.name));
                return (
                  <div 
                    key={idx} 
                    style={{ 
                      padding: '16px', 
                      background: 'rgba(255, 255, 255, 0.02)', 
                      border: '1px solid var(--card-border)', 
                      borderRadius: 'var(--border-radius-sm)',
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '16px'
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: '16px', marginBottom: '8px', color: 'white' }}>{course.name}</h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} />
                          {course.duration}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Star size={12} />
                          {course.mode}
                        </span>
                        <span style={{ color: 'var(--success)', fontWeight: 600 }}>
                          {course.fee}
                        </span>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                      <button 
                        className={isApplied ? "btn-premium-outline" : "btn-premium"}
                        onClick={() => {
                          const checkbox = document.getElementById(`ai-rec-${idx}`);
                          const reqRec = checkbox ? checkbox.checked : false;
                          applyForCourse(inst.name, course.name, reqRec);
                        }}
                        disabled={isApplied}
                        style={{ fontSize: '13px', padding: '8px 16px' }}
                      >
                        {isApplied ? (
                          <>
                            <CheckCircle size={14} style={{ color: 'var(--success)' }} />
                            Applied
                          </>
                        ) : (
                          <>
                            <Send size={14} />
                            Apply Now
                          </>
                        )}
                      </button>
                      {!isApplied && (
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)', cursor: 'pointer' }}>
                          <input type="checkbox" id={`ai-rec-${idx}`} style={{ cursor: 'pointer' }} />
                          Request AI Expert Recommendation
                        </label>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column: Stats and Why Suit */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {/* Stats */}
          <div className="glass-card">
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Key Metrics</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Satisfaction</span>
                <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--secondary)' }}>{inst.satisfaction}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Practicality</span>
                <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--accent)' }}>{inst.practicality}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Recognition Level</span>
                <span style={{ fontSize: '14px', fontWeight: 600 }}>{inst.recognition}</span>
              </div>
            </div>
          </div>

          {/* Why Suit */}
          <div className="glass-card">
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Why It May Suit You</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {inst.whySuit.map((suit, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <ThumbsUp size={14} style={{ color: 'var(--secondary)', flexShrink: 0, marginTop: '3px' }} />
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{suit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
