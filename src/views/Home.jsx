import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, ArrowRight, Shield, Award, BookOpen, Clock, Play, Check } from 'lucide-react';
import SapioEarthGlobe from '../components/SapioEarthGlobe';

export default function Home({ setView, setExploreSearchTerm, onUpgradePremium }) {
  const handleProgramClick = (categorySearch) => {
    if (setExploreSearchTerm) {
      setExploreSearchTerm(categorySearch);
    }
    setView('public-explore');
  };

  const [scrollY, setScrollY] = useState(0);
  const [mouseCoords, setMouseCoords] = useState({ x: 540, y: 260 });

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    const handleMouseMove = (e) => {
      if (window.scrollY < 600) {
        setMouseCoords({ x: e.clientX, y: e.clientY });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

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

  // Parallax offsets for background stars and hero text (guarded against Next.js SSR window checks)
  const winWidth = typeof window !== 'undefined' ? window.innerWidth : 1080;
  const winHeight = typeof window !== 'undefined' ? window.innerHeight : 600;

  const starOffsetX = (mouseCoords.x - winWidth / 2) * -0.06;
  const starOffsetY = (mouseCoords.y - winHeight / 2) * -0.06;

  const heroOffsetX = (mouseCoords.x - winWidth / 2) * 0.012;
  const heroOffsetY = (mouseCoords.y - winHeight / 2) * 0.012;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Hero Section with Parallax Background stars and 3D Globe */}
      <section style={{ 
        position: 'relative', 
        padding: '120px 24px 80px 24px', 
        background: 'radial-gradient(circle at top left, rgba(52, 211, 153, 0.08) 0%, transparent 50%), radial-gradient(circle at bottom right, rgba(52, 211, 153, 0.04) 0%, transparent 50%)',
        overflow: 'hidden'
      }}>
        {/* Background Parallax Stars */}
        <div style={{
          position: 'absolute',
          inset: 0,
          height: '200%',
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          opacity: 0.6,
          pointerEvents: 'none',
          transform: `translate(${starOffsetX}px, ${scrollY * 0.3 + starOffsetY}px)`,
          zIndex: 0
        }} />

        {/* 3D WebGL Globe Background (click-through overlay) */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          pointerEvents: 'auto'
        }}>
          <SapioEarthGlobe />
        </div>

        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          display: 'flex', 
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          gap: '40px',
          flexWrap: 'wrap-reverse',
          position: 'relative',
          zIndex: 2
        }}>
          {/* Left Column: Text & Actions (follows mouse for 3D depth) */}
          <div style={{ 
            flex: 1.2, 
            minWidth: '320px', 
            textAlign: 'left',
            transform: `translate(${heroOffsetX}px, ${scrollY * -0.15 + heroOffsetY}px)`,
            transition: 'transform 0.08s ease-out'
          }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '6px 16px', 
              borderRadius: 'var(--border-radius-full)', 
              background: 'rgba(52, 211, 153, 0.08)', 
              border: '1px solid rgba(52, 211, 153, 0.15)',
              color: 'var(--primary)',
              fontSize: '14px',
              fontWeight: 600,
              marginBottom: '24px'
            }}>
              <Sparkles size={14} />
              Next-Gen AI Recommendation System
            </div>
            
            <h1 style={{ 
              fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', 
              fontFamily: 'var(--font-display)', 
              lineHeight: 1.1,
              marginBottom: '24px',
              color: '#ffffff'
            }}>
              Find Your Best-Fit Program with <span className="gradient-text">SapioMatch AI</span>
            </h1>
            
            <p style={{ 
              color: 'var(--text-muted)', 
              fontSize: '17px', 
              marginBottom: '40px',
              lineHeight: 1.6
            }}>
              An intelligent advisor analyzing your career goals, academic background, and budget to connect you with leading global institutions.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '16px', flexWrap: 'wrap', marginBottom: '40px' }}>
              <button className="btn-premium" onClick={() => setView('questionnaire')} style={{ padding: '12px 26px' }}>
                Start AI Matching
                <ArrowRight size={18} />
              </button>
              <button className="btn-premium-outline" onClick={() => setView('public-explore')} style={{ padding: '12px 26px' }}>
                Explore Institutions
              </button>
            </div>
          </div>

          {/* Right Column: Spacer to frame the globe behind it */}
          <div style={{ 
            flex: 1, 
            minWidth: '320px', 
            height: '420px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            position: 'relative',
            pointerEvents: 'none'
          }}>
            {/* Soft Ambient Radial Glow Behind Globe */}
            <div style={{
              position: 'absolute',
              width: '280px',
              height: '280px',
              background: 'radial-gradient(circle, rgba(52, 211, 153, 0.12) 0%, transparent 70%)',
              borderRadius: '50%',
              zIndex: 0
            }} />
          </div>
        </div>

        {/* Three Spotlight Indicator Cards (floats slightly faster on scroll) */}
        <div style={{ 
          maxWidth: '1200px',
          margin: '40px auto 0 auto',
          transform: `translateY(${scrollY * -0.05}px)`,
          transition: 'transform 0.08s ease-out',
          position: 'relative',
          zIndex: 5
        }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
            gap: '20px'
          }}>
            {/* Card 1: Knowledge Database */}
            <div className="spotlight-card flex-row-center" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ gap: '16px', padding: '20px', '--spotlight-color': 'rgba(52, 211, 153, 0.12)' }}>
              <div style={{ background: 'rgba(52, 211, 153, 0.1)', padding: '12px', borderRadius: 'var(--border-radius-sm)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="icon-container">
                <Brain size={24} />
              </div>
              <div style={{ textAlign: 'left', position: 'relative', zIndex: 2 }}>
                <h4 style={{ fontSize: '15px', fontWeight: 600 }}>Knowledge Database</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Tailored institutional data</p>
              </div>
            </div>

            {/* Card 2: 94% Match Score */}
            <div className="spotlight-card flex-row-center" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ gap: '16px', padding: '20px', '--spotlight-color': 'rgba(251, 146, 60, 0.12)' }}>
              <div style={{ background: 'rgba(251, 146, 60, 0.1)', padding: '12px', borderRadius: 'var(--border-radius-sm)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="icon-container">
                <Award size={24} />
              </div>
              <div style={{ textAlign: 'left', position: 'relative', zIndex: 2 }}>
                <h4 style={{ fontSize: '15px', fontWeight: 600 }}>94% Match Score</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>High accuracy mapping</p>
              </div>
            </div>

            {/* Card 3: Secure Entitlement */}
            <div className="spotlight-card flex-row-center" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ gap: '16px', padding: '20px', '--spotlight-color': 'rgba(248, 113, 113, 0.12)' }}>
              <div style={{ background: 'rgba(248, 113, 113, 0.1)', padding: '12px', borderRadius: 'var(--border-radius-sm)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="icon-container">
                <Shield size={24} />
              </div>
              <div style={{ textAlign: 'left', position: 'relative', zIndex: 2 }}>
                <h4 style={{ fontSize: '15px', fontWeight: 600 }}>Secure Entitlement</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Safe library & credentials</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Mission Summary & Degree Program Navigator Section */}
      <section style={{ padding: '60px 24px', position: 'relative', borderTop: '1px solid var(--card-border)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          
          {/* Mission Statement */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center', marginBottom: '60px', flexWrap: 'wrap' }} className="analytics-grid">
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Our Core Vision</span>
              <h2 style={{ fontSize: '28px', fontFamily: 'var(--font-display)', color: 'white', marginTop: '8px', marginBottom: '16px' }}>
                Democratizing Academic Matches with <span className="gradient-text">Empathetic AI</span>
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', lineHeight: '1.6', marginBottom: '20px' }}>
                We believe that choosing an education path is one of the most critical decisions of a lifetime. SapioMatch bypasses traditional marketing directories to connect students and professionals directly to courses based on budget, values, and career goals.
              </p>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Check size={16} style={{ color: 'var(--primary)' }} />
                <span style={{ fontSize: '13.5px', color: '#e5e7eb', fontWeight: 500 }}>No hidden agency sponsorships or biased rankings.</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="glass-card" style={{ padding: '16px 20px', textAlign: 'left' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)', marginBottom: '4px' }}>100%</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'white' }}>Honest Compatibility</div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>AI suggestions based strictly on your input params.</div>
              </div>
              <div className="glass-card" style={{ padding: '16px 20px', textAlign: 'left' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--secondary)', marginBottom: '4px' }}>Direct</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'white' }}>Portal Connection</div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>Submit applications directly to admissions.</div>
              </div>
            </div>
          </div>

          {/* Degree Program Navigator */}
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '22px', fontFamily: 'var(--font-display)', marginBottom: '12px', color: 'white' }}>
              Select a Program to <span className="gradient-text">Explore</span>
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '32px' }}>
              Jump straight to our catalog of courses, pre-filtered for your choice.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
              {/* Card 1: Technology & AI */}
              <div 
                className="spotlight-card" 
                onClick={() => handleProgramClick('technology')}
                onMouseMove={handleMouseMove} 
                onMouseLeave={handleMouseLeave} 
                style={{ cursor: 'pointer', padding: '24px 20px', '--spotlight-color': 'rgba(16, 185, 129, 0.12)' }}
              >
                <div style={{ background: 'rgba(16, 185, 129, 0.08)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: 'var(--primary)' }}>
                  <Brain size={24} />
                </div>
                <h4 style={{ fontSize: '15.5px', fontWeight: 600, color: 'white', marginBottom: '6px' }}>Technology & AI</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>MSc Data Science, Cybersecurity, Coding Bootcamps...</p>
              </div>

              {/* Card 2: Business & MBA */}
              <div 
                className="spotlight-card" 
                onClick={() => handleProgramClick('mba')}
                onMouseMove={handleMouseMove} 
                onMouseLeave={handleMouseLeave} 
                style={{ cursor: 'pointer', padding: '24px 20px', '--spotlight-color': 'rgba(251, 146, 60, 0.12)' }}
              >
                <div style={{ background: 'rgba(251, 146, 60, 0.08)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: 'var(--secondary)' }}>
                  <Award size={24} />
                </div>
                <h4 style={{ fontSize: '15.5px', fontWeight: 600, color: 'white', marginBottom: '6px' }}>Business & MBA</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Global Executive MBA, Strategic Management...</p>
              </div>

              {/* Card 3: Law & Public Policy */}
              <div 
                className="spotlight-card" 
                onClick={() => handleProgramClick('policy')}
                onMouseMove={handleMouseMove} 
                onMouseLeave={handleMouseLeave} 
                style={{ cursor: 'pointer', padding: '24px 20px', '--spotlight-color': 'rgba(236, 72, 153, 0.12)' }}
              >
                <div style={{ background: 'rgba(236, 72, 153, 0.08)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: 'var(--accent)' }}>
                  <BookOpen size={24} />
                </div>
                <h4 style={{ fontSize: '15.5px', fontWeight: 600, color: 'white', marginBottom: '6px' }}>Law & Policy</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Public Policy, International Relations, Regulation...</p>
              </div>

              {/* Card 4: Healthcare & Sciences */}
              <div 
                className="spotlight-card" 
                onClick={() => handleProgramClick('health')}
                onMouseMove={handleMouseMove} 
                onMouseLeave={handleMouseLeave} 
                style={{ cursor: 'pointer', padding: '24px 20px', '--spotlight-color': 'rgba(59, 130, 246, 0.12)' }}
              >
                <div style={{ background: 'rgba(59, 130, 246, 0.08)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: '#60a5fa' }}>
                  <Clock size={24} />
                </div>
                <h4 style={{ fontSize: '15.5px', fontWeight: 600, color: 'white', marginBottom: '6px' }}>Healthcare & Sciences</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Clinical Medicine, Bioscience, Healthcare Systems...</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* How it Works Section */}
      <section style={{ padding: '60px 24px', background: 'rgba(255, 255, 255, 0.01)', borderTop: '1px solid var(--card-border)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '32px' }}>
            How <span className="gradient-text">SapioMatch</span> Guides You
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
            <div className="spotlight-card" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ position: 'relative', '--spotlight-color': 'rgba(43, 92, 70, 0.12)' }}>
              <span style={{ position: 'absolute', top: '20px', right: '24px', fontSize: '48px', fontWeight: 800, color: 'rgba(43, 92, 70, 0.06)', fontFamily: 'var(--font-display)', zIndex: 2 }}>01</span>
              <div style={{ background: 'rgba(43, 92, 70, 0.1)', padding: '10px', borderRadius: 'var(--border-radius-sm)', width: 'fit-content', color: 'var(--primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="icon-container">
                <BookOpen size={20} />
              </div>
              <h3 style={{ fontSize: '18px', marginBottom: '10px', position: 'relative', zIndex: 2 }}>Tell Us Your Goals</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', position: 'relative', zIndex: 2 }}>
                Upload your resume or chat with our humanized AI mascot. Share your career targets, budget, and learning format.
              </p>
            </div>

            <div className="spotlight-card" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ position: 'relative', '--spotlight-color': 'rgba(180, 83, 9, 0.12)' }}>
              <span style={{ position: 'absolute', top: '20px', right: '24px', fontSize: '48px', fontWeight: 800, color: 'rgba(180, 83, 9, 0.06)', fontFamily: 'var(--font-display)', zIndex: 2 }}>02</span>
              <div style={{ background: 'rgba(180, 83, 9, 0.1)', padding: '10px', borderRadius: 'var(--border-radius-sm)', width: 'fit-content', color: 'var(--secondary)', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="icon-container">
                <Brain size={20} />
              </div>
              <h3 style={{ fontSize: '18px', marginBottom: '10px', position: 'relative', zIndex: 2 }}>AI Match Algorithm</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', position: 'relative', zIndex: 2 }}>
                Our proprietary engine cross-references your profile with our verified knowledge base of global universities and courses.
              </p>
            </div>

            <div className="spotlight-card" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ position: 'relative', '--spotlight-color': 'rgba(153, 27, 27, 0.12)' }}>
              <span style={{ position: 'absolute', top: '20px', right: '24px', fontSize: '48px', fontWeight: 800, color: 'rgba(236, 72, 153, 0.06)', fontFamily: 'var(--font-display)', zIndex: 2 }}>03</span>
              <div style={{ background: 'rgba(236, 72, 153, 0.1)', padding: '10px', borderRadius: 'var(--border-radius-sm)', width: 'fit-content', color: 'var(--accent)', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="icon-container">
                <Award size={20} />
              </div>
              <h3 style={{ fontSize: '18px', marginBottom: '10px', position: 'relative', zIndex: 2 }}>Apply & Connect</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', position: 'relative', zIndex: 2 }}>
                Review matches side-by-side, check your match breakdown, generate your digital Student ID Passport, and apply directly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audiences Section */}
      <section style={{ padding: '60px 24px', borderTop: '1px solid var(--card-border)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>
          <div>
            <h2 style={{ fontSize: '30px', marginBottom: '16px' }}>Designed for Career Upgrades</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
              Unlike generic AI chat tools, SapioMatch is explicitly built around career progression metrics for students and working professionals.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ background: 'rgba(180, 83, 9, 0.1)', color: 'var(--secondary)', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>✓</div>
                <div>
                  <h4 style={{ fontSize: '16px' }}>Working Professionals</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Executive MBAs, specialized digital certificates, and evening hybrid programs that don't interrupt your job.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ background: 'rgba(180, 83, 9, 0.1)', color: 'var(--secondary)', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>✓</div>
                <div>
                  <h4 style={{ fontSize: '16px' }}>Students to UG/PG</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Full-degree matching, structural budgeting calculations, and local/global campus transitions.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="spotlight-card flex-center anim-glow" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ position: 'relative', overflow: 'hidden', padding: '40px', minHeight: '300px', '--spotlight-color': 'rgba(43, 92, 70, 0.12)' }}>
            <div style={{ textAlign: 'center', zIndex: 2 }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
                boxShadow: '0 0 20px var(--primary-glow)'
              }} className="icon-container">
                <Brain size={40} style={{ color: 'white' }} />
              </div>
              <h3 style={{ fontSize: '22px', marginBottom: '8px' }}>Launch AI Match</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>Takes less than 3 minutes to match.</p>
              <button className="btn-premium" onClick={() => setView('questionnaire')}>
                Get Recommendations
                <ArrowRight size={16} />
              </button>
            </div>
            <div style={{ 
              position: 'absolute', 
              width: '150px', 
              height: '150px', 
              background: 'var(--secondary-glow)', 
              borderRadius: '50%', 
              bottom: '-50px', 
              right: '-50px', 
              filter: 'blur(40px)',
              zIndex: 1
            }}></div>
          </div>
        </div>
      </section>

      {/* Monetization & Plans Pricing Section */}
      <section style={{ padding: '60px 24px', borderTop: '1px solid var(--card-border)', background: 'linear-gradient(180deg, transparent 0%, rgba(52, 211, 153, 0.02) 100%)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '32px', fontFamily: 'var(--font-display)', marginBottom: '12px' }}>
              Choose Your <span className="gradient-text">Academic Advantage</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '600px', margin: '0 auto' }}>
              Access AI matches, resume parsing, and consult expert advisors with flexible plans designed for you.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', alignItems: 'stretch' }}>
            {/* Standard Card */}
            <div 
              className="spotlight-card" 
              onMouseMove={handleMouseMove} 
              onMouseLeave={handleMouseLeave} 
              style={{ 
                padding: '40px 30px', 
                '--spotlight-color': 'rgba(52, 211, 153, 0.1)', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                border: '1px solid var(--card-border)',
                background: 'rgba(17, 24, 39, 0.4)',
                borderRadius: 'var(--border-radius-md)'
              }}
            >
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Standard Plan</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '24px' }}>
                  <span style={{ fontSize: '36px', fontWeight: 800, color: 'white', fontFamily: 'var(--font-display)' }}>Free</span>
                  <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>default allowance</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
                  {[
                    "100 initial advisor credits",
                    "AI matching questionnaire access",
                    "Course catalog search & filters",
                    "Digital Academic Passport (Standard ID)",
                    "Course application submissions"
                  ].map((benefit, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '14px', color: '#cbd5e1' }}>
                      <Check size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button className="btn-premium-outline" onClick={() => setView('questionnaire')} style={{ width: '100%', justifyContent: 'center' }}>
                Get Started Free
              </button>
            </div>

            {/* Premium Card */}
            <div 
              className="spotlight-card anim-glow" 
              onMouseMove={handleMouseMove} 
              onMouseLeave={handleMouseLeave} 
              style={{ 
                padding: '40px 30px', 
                '--spotlight-color': 'rgba(251, 146, 60, 0.15)', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                border: '1px solid var(--secondary)',
                background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.05) 0%, rgba(17, 24, 39, 0.8) 100%), var(--card-bg)',
                borderRadius: 'var(--border-radius-md)',
                position: 'relative'
              }}
            >
              <div style={{ position: 'absolute', top: '20px', right: '24px', background: 'var(--secondary)', color: '#0b0f19', fontSize: '10px', fontWeight: 800, padding: '4px 10px', borderRadius: 'var(--border-radius-sm)', letterSpacing: '0.05em' }}>POPULAR UPGRADE</div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--secondary)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Premium Membership</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '24px' }}>
                  <span style={{ fontSize: '36px', fontWeight: 800, color: 'white', fontFamily: 'var(--font-display)' }}>30 AED</span>
                  <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>/ month</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
                  {[
                    "Adds 700 extra advisor credits (800 total)",
                    "Golden holographic premium passport",
                    "AI Expert recommendation options on apply",
                    "Admissions specialist callbacks (David)",
                    "Prioritized application reviews"
                  ].map((benefit, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '14px', color: '#cbd5e1' }}>
                      <Check size={16} style={{ color: 'var(--secondary)', flexShrink: 0 }} />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button className="btn-premium" onClick={onUpgradePremium ? onUpgradePremium : () => setView('auth')} style={{ width: '100%', justifyContent: 'center' }}>
                Upgrade to Premium
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
