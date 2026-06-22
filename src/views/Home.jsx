import React, { useState, useEffect, useRef } from 'react';
import { Brain, Sparkles, ArrowRight, Shield, Award, BookOpen, Clock, Play, Check } from 'lucide-react';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import SapioEarthGlobe from '../components/SapioEarthGlobe';

export default function Home({ setView }) {
  const [scrollY, setScrollY] = useState(0);
  const [mouseCoords, setMouseCoords] = useState({ x: 540, y: 260 });
  const heroGlobeSlotRef = useRef(null);
  const focusGlobeSlotRef = useRef(null);
  const globeFocusSectionRef = useRef(null);
  const movingGlobeShellRef = useRef(null);
  const targetGlobeFrameRef = useRef(null);
  const currentGlobeFrameRef = useRef(null);
  const hasMountedMovingGlobeRef = useRef(false);
  const globeTypewriterRef = useRef(null);
  const globeCursorRef = useRef(null);
  const typewriterTweenRef = useRef(null);
  const heroCardsRef = useRef(null);
  const [movingGlobeFrame, setMovingGlobeFrame] = useState(null);
  const globeTitleText = 'Explore universities around the globe';

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

  useEffect(() => {
    let measureFrameId = 0;
    let animationFrameId = 0;

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
    const lerp = (from, to, amount) => from + (to - from) * amount;
    const smootherStep = (value) => value * value * value * (value * (value * 6 - 15) + 10);

    const applyGlobeFrame = (frame) => {
      const shell = movingGlobeShellRef.current;
      if (!shell) return;

      shell.style.transform = `translate3d(${Math.round(frame.left)}px, ${Math.round(frame.top)}px, 0)`;
      shell.style.width = `${Math.round(frame.width)}px`;
      shell.style.height = `${Math.round(frame.height)}px`;
      shell.style.setProperty('--globe-dock-progress', frame.progress);
      shell.classList.toggle('is-docked', frame.progress > 0.78);
    };

    const updateMovingGlobe = () => {
      const heroSlot = heroGlobeSlotRef.current;
      const focusSlot = focusGlobeSlotRef.current;
      if (!heroSlot || !focusSlot) return;

      const heroRect = heroSlot.getBoundingClientRect();
      const focusRect = focusSlot.getBoundingClientRect();
      const scrollTop = window.scrollY || window.pageYOffset || 0;
      const heroPageTop = heroRect.top + scrollTop;
      const focusPageTop = focusRect.top + scrollTop;
      const startScroll = heroPageTop + heroRect.height * 0.18;
      const endScroll = focusPageTop - window.innerHeight * 0.28;
      const progress = clamp((scrollTop - startScroll) / Math.max(1, endScroll - startScroll), 0, 1);
      const eased = smootherStep(progress);

      const targetFrame = {
        left: lerp(heroRect.left, focusRect.left, eased),
        top: lerp(heroRect.top, focusRect.top, eased),
        width: lerp(heroRect.width, focusRect.width, eased),
        height: lerp(heroRect.height, focusRect.height, eased),
        progress: eased
      };

      targetGlobeFrameRef.current = targetFrame;

      if (!currentGlobeFrameRef.current) {
        currentGlobeFrameRef.current = targetFrame;
      }

      if (!hasMountedMovingGlobeRef.current) {
        hasMountedMovingGlobeRef.current = true;
        setMovingGlobeFrame(targetFrame);
      }
    };

    const requestUpdate = () => {
      cancelAnimationFrame(measureFrameId);
      measureFrameId = requestAnimationFrame(updateMovingGlobe);
    };

    const animateGlobe = () => {
      const targetFrame = targetGlobeFrameRef.current;
      const currentFrame = currentGlobeFrameRef.current;

      if (targetFrame && currentFrame) {
        const smoothing = targetFrame.progress > 0.96 || targetFrame.progress < 0.04 ? 0.2 : 0.115;
        const nextFrame = {
          left: lerp(currentFrame.left, targetFrame.left, smoothing),
          top: lerp(currentFrame.top, targetFrame.top, smoothing),
          width: lerp(currentFrame.width, targetFrame.width, smoothing),
          height: lerp(currentFrame.height, targetFrame.height, smoothing),
          progress: lerp(currentFrame.progress, targetFrame.progress, smoothing)
        };

        if (
          Math.abs(nextFrame.left - targetFrame.left) < 0.35 &&
          Math.abs(nextFrame.top - targetFrame.top) < 0.35 &&
          Math.abs(nextFrame.width - targetFrame.width) < 0.35 &&
          Math.abs(nextFrame.height - targetFrame.height) < 0.35
        ) {
          currentGlobeFrameRef.current = targetFrame;
          applyGlobeFrame(targetFrame);
        } else {
          currentGlobeFrameRef.current = nextFrame;
          applyGlobeFrame(nextFrame);
        }
      }

      animationFrameId = requestAnimationFrame(animateGlobe);
    };

    requestUpdate();
    animationFrameId = requestAnimationFrame(animateGlobe);
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      cancelAnimationFrame(measureFrameId);
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };
  }, []);

  useEffect(() => {
    const section = globeFocusSectionRef.current;
    const title = globeTypewriterRef.current;
    const cursor = globeCursorRef.current;
    if (!section || !title || !cursor) return;

    gsap.registerPlugin(TextPlugin);
    title.textContent = '';

    const context = gsap.context(() => {
      gsap.fromTo(
        cursor,
        { opacity: 0 },
        { opacity: 1, duration: 0.42, repeat: -1, yoyo: true, ease: 'power1.inOut' }
      );
    });

    const playTypewriter = () => {
      typewriterTweenRef.current?.kill();
      title.textContent = '';
      typewriterTweenRef.current = gsap.to(title, {
        text: globeTitleText,
        duration: 2.15,
        ease: 'none'
      });
    };

    let wasVisible = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting && entry.intersectionRatio >= 0.32;
        if (isVisible && !wasVisible) {
          wasVisible = true;
          playTypewriter();
        }
        if (!isVisible) {
          wasVisible = false;
        }
      },
      {
        threshold: [0, 0.32],
        rootMargin: '-14% 0px -18% 0px'
      }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      typewriterTweenRef.current?.kill();
      context.revert();
    };
  }, []);

  useEffect(() => {
    const row = heroCardsRef.current;
    if (!row) return;

    const cards = row.querySelectorAll('.sapio-hero-feature-card');
    const cardTextNodes = row.querySelectorAll('.sapio-hero-feature-card h4, .sapio-hero-feature-card p');
    let cardTimeline = null;
    let wasVisible = false;

    const playCards = () => {
      gsap.registerPlugin(TextPlugin);
      cardTimeline?.kill();
      gsap.killTweensOf([cards, cardTextNodes]);

      cards.forEach((card) => {
        const heading = card.querySelector('h4');
        const subtitle = card.querySelector('p');
        if (heading && !heading.dataset.fullText) heading.dataset.fullText = heading.textContent;
        if (subtitle && !subtitle.dataset.fullText) subtitle.dataset.fullText = subtitle.textContent;
        if (heading) heading.textContent = '';
        if (subtitle) subtitle.textContent = '';
      });

      gsap.set(cards, { opacity: 0, y: 42, scale: 0.955, filter: 'blur(10px)' });
      gsap.set(row.querySelectorAll('.sapio-hero-feature-card .icon-container'), {
        opacity: 0,
        scale: 0.74,
        rotate: -10
      });

      cardTimeline = gsap.timeline();

      cardTimeline.to(
        cards,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1.05,
          ease: 'power3.out',
          stagger: 0.46
        }
      );

      cards.forEach((card, index) => {
        const heading = card.querySelector('h4');
        const subtitle = card.querySelector('p');
        const icon = card.querySelector('.icon-container');
        const startAt = index * 0.46 + 0.34;

        if (icon) {
          cardTimeline.to(
            icon,
            {
              opacity: 1,
              scale: 1,
              rotate: 0,
              duration: 0.62,
              ease: 'back.out(1.7)'
            },
            startAt
          );
        }

        if (heading?.dataset.fullText?.startsWith('94%')) {
          const score = { value: 0 };
          cardTimeline.to(
            score,
            {
              value: 94,
              duration: 0.95,
              ease: 'power2.out',
              onUpdate: () => {
                heading.textContent = `${Math.round(score.value)}% Match Score`;
              }
            },
            startAt + 0.12
          );
        } else if (heading) {
          cardTimeline.to(
            heading,
            {
              text: heading.dataset.fullText,
              duration: 0.72,
              ease: 'none'
            },
            startAt + 0.12
          );
        }

        if (subtitle) {
          cardTimeline.to(
            subtitle,
            {
              text: subtitle.dataset.fullText,
              duration: 0.78,
              ease: 'none'
            },
            startAt + 0.42
          );
        }
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting && entry.intersectionRatio >= 0.28;
        if (visible && !wasVisible) {
          wasVisible = true;
          playCards();
        }
        if (!visible) {
          wasVisible = false;
        }
      },
      { threshold: [0, 0.28], rootMargin: '-8% 0px -12% 0px' }
    );

    observer.observe(row);
    return () => {
      observer.disconnect();
      cardTimeline?.kill();
      gsap.killTweensOf([cards, cardTextNodes]);
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
      {movingGlobeFrame && (
        <div
          ref={movingGlobeShellRef}
          className="sapio-moving-globe-shell"
          style={{
            transform: `translate3d(${Math.round(movingGlobeFrame.left)}px, ${Math.round(movingGlobeFrame.top)}px, 0)`,
            width: `${Math.round(movingGlobeFrame.width)}px`,
            height: `${Math.round(movingGlobeFrame.height)}px`,
            '--globe-dock-progress': movingGlobeFrame.progress
          }}
        >
          <SapioEarthGlobe instanceId="sapio-moving-globe" variant="moving" />
        </div>
      )}

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

        {/* The real globe is mounted once in a moving shell; this slot marks its hero position. */}
        <div ref={heroGlobeSlotRef} className="sapio-globe-hero-slot" aria-hidden="true" />

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
          zIndex: 3
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
        }} ref={heroCardsRef}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
            gap: '20px'
          }}>
            {/* Card 1: Knowledge Database */}
            <div className="spotlight-card flex-row-center sapio-hero-feature-card" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ gap: '16px', padding: '20px', '--spotlight-color': 'rgba(52, 211, 153, 0.12)' }}>
              <div style={{ background: 'rgba(52, 211, 153, 0.1)', padding: '12px', borderRadius: 'var(--border-radius-sm)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="icon-container">
                <Brain size={24} />
              </div>
              <div style={{ textAlign: 'left', position: 'relative', zIndex: 2 }}>
                <h4 style={{ fontSize: '15px', fontWeight: 600 }}>Knowledge Database</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Tailored institutional data</p>
              </div>
            </div>

            {/* Card 2: 94% Match Score */}
            <div className="spotlight-card flex-row-center sapio-hero-feature-card" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ gap: '16px', padding: '20px', '--spotlight-color': 'rgba(251, 146, 60, 0.12)' }}>
              <div style={{ background: 'rgba(251, 146, 60, 0.1)', padding: '12px', borderRadius: 'var(--border-radius-sm)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="icon-container">
                <Award size={24} />
              </div>
              <div style={{ textAlign: 'left', position: 'relative', zIndex: 2 }}>
                <h4 style={{ fontSize: '15px', fontWeight: 600 }}>94% Match Score</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>High accuracy mapping</p>
              </div>
            </div>

            {/* Card 3: Secure Entitlement */}
            <div className="spotlight-card flex-row-center sapio-hero-feature-card" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ gap: '16px', padding: '20px', '--spotlight-color': 'rgba(248, 113, 113, 0.12)' }}>
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

      {/* Scroll-isolated interactive globe section */}
      <section ref={globeFocusSectionRef} className="sapio-globe-focus-section">
        <div className="sapio-globe-focus-copy">
          <span className="sapio-globe-focus-kicker">Interactive university map</span>
          <h2 className="sapio-globe-typewriter-heading" aria-label={globeTitleText}>
            <span ref={globeTypewriterRef} className="sapio-globe-typewriter-text" />
            <span ref={globeCursorRef} className="sapio-typewriter-cursor" aria-hidden="true">|</span>
          </h2>
          <p className="sapio-globe-focus-instructions">
            Drag the globe, then click a glowing country marker to view partner universities and destination details.
          </p>
        </div>

        <div className="sapio-globe-focus-panel">
          <div ref={focusGlobeSlotRef} className="sapio-globe-focus-slot" aria-label="Interactive globe destination" />
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

              <button className="btn-premium" onClick={() => setView('auth')} style={{ width: '100%', justifyContent: 'center' }}>
                Upgrade to Premium
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
