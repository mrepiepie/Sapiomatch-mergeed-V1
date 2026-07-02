import React from 'react';
import { Target, HelpCircle, Compass, Award, ShieldAlert, Sparkles, Columns, Bookmark, MessageSquare, Building, Users, CheckCircle, Lock, Clock, FileText, Globe, ShieldCheck, ArrowRight, Eye, RefreshCw, AlertTriangle, GitCompare } from 'lucide-react';

export default function About({ setView }) {
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

  const problemItems = [
    { title: "Scattered information", desc: "Program details spread across hundreds of institution websites", icon: FileText, color: 'var(--primary)', bg: 'rgba(43, 92, 70, 0.06)', border: 'rgba(43, 92, 70, 0.15)' },
    { title: "Confusing program options", desc: "Similar-sounding programs with vastly different outcomes", icon: GitCompare, color: 'var(--secondary)', bg: 'rgba(180, 83, 9, 0.06)', border: 'rgba(180, 83, 9, 0.15)' },
    { title: "Unclear requirements", desc: "Hidden prerequisites and unstated expectations", icon: AlertTriangle, color: 'var(--accent)', bg: 'rgba(153, 27, 27, 0.06)', border: 'rgba(153, 27, 27, 0.15)' },
    { title: "Difficulty comparing", desc: "No standardized way to evaluate fit across multiple dimensions", icon: Columns, color: 'var(--primary)', bg: 'rgba(43, 92, 70, 0.06)', border: 'rgba(43, 92, 70, 0.15)' }
  ];

  const helperUsers = [
    { title: "Personalized Recommendations", desc: "AI analyzes your profile to suggest programs that genuinely fit your needs", icon: Compass, color: 'var(--secondary)', bg: 'rgba(180, 83, 9, 0.08)', border: 'rgba(180, 83, 9, 0.2)' },
    { title: "Program Comparison", desc: "Compare options side-by-side across fees, duration, location, and requirements", icon: Columns, color: 'var(--primary)', bg: 'rgba(43, 92, 70, 0.08)', border: 'rgba(43, 92, 70, 0.2)' },
    { title: "Match Scores", desc: "Transparent scoring shows exactly why each program fits (or doesn't)", icon: Award, color: 'var(--accent)', bg: 'rgba(153, 27, 27, 0.08)', border: 'rgba(153, 27, 27, 0.2)' },
    { title: "Saved Results", desc: "Bookmark programs and revisit your matches anytime", icon: Bookmark, color: 'var(--secondary)', bg: 'rgba(180, 83, 9, 0.08)', border: 'rgba(180, 83, 9, 0.2)' },
    { title: "Guided Decision-Making", desc: "Clear insights help you choose confidently, not just quickly", icon: Sparkles, color: 'var(--primary)', bg: 'rgba(43, 92, 70, 0.08)', border: 'rgba(43, 92, 70, 0.2)' },
    { title: "Direct Connection", desc: "Reach out to institutions directly through the platform", icon: MessageSquare, color: 'var(--accent)', bg: 'rgba(153, 27, 27, 0.08)', border: 'rgba(153, 27, 27, 0.2)' }
  ];

  const helperInst = [
    { title: "Institution-Controlled Profiles", desc: "You own and maintain your data — admins validate, not create", icon: Building, color: 'var(--secondary)', bg: 'rgba(180, 83, 9, 0.08)', border: 'rgba(180, 83, 9, 0.2)' },
    { title: "Program Visibility", desc: "Reach learners actively searching for what you offer", icon: Eye, color: 'var(--primary)', bg: 'rgba(43, 92, 70, 0.08)', border: 'rgba(43, 92, 70, 0.2)' },
    { title: "Qualified Leads", desc: "Connect with students who already match your program criteria", icon: Users, color: 'var(--accent)', bg: 'rgba(153, 27, 27, 0.08)', border: 'rgba(153, 27, 27, 0.2)' },
    { title: "Admin-Validated Publication", desc: "Quality assurance without losing control of your content", icon: CheckCircle, color: 'var(--secondary)', bg: 'rgba(180, 83, 9, 0.08)', border: 'rgba(180, 83, 9, 0.2)' },
    { title: "Commercial Access Rules", desc: "Flexible lead access based on your subscription and permissions", icon: Lock, color: 'var(--primary)', bg: 'rgba(43, 92, 70, 0.08)', border: 'rgba(43, 92, 70, 0.2)' },
    { title: "Real-Time Updates", desc: "Change fees, requirements, or dates instantly", icon: RefreshCw, color: 'var(--accent)', bg: 'rgba(153, 27, 27, 0.08)', border: 'rgba(153, 27, 27, 0.2)' }
  ];

  const operatingSteps = [
    { label: "Data Submission", text: "Institution submits or updates program data through their portal", icon: FileText, color: 'var(--primary)', bg: 'rgba(43, 92, 70, 0.08)' },
    { label: "Admin Validation", text: "Platform admin reviews submission for completeness and quality", icon: ShieldCheck, color: 'var(--secondary)', bg: 'rgba(180, 83, 9, 0.08)' },
    { label: "Publication", text: "Approved data is published and becomes visible to learners", icon: Globe, color: 'var(--accent)', bg: 'rgba(153, 27, 27, 0.08)' },
    { label: "User Matching", text: "Learners see matching results based on validated program data", icon: Sparkles, color: 'var(--primary)', bg: 'rgba(43, 92, 70, 0.08)' },
    { label: "Lead Management", text: "Leads become visible to institutions based on permissions and credit rules", icon: Users, color: 'var(--secondary)', bg: 'rgba(180, 83, 9, 0.08)' },
    { label: "Governance", text: "Super Admin controls platform-wide commercial rules and access policies", icon: Lock, color: 'var(--accent)', bg: 'rgba(153, 27, 27, 0.08)' }
  ];

  return (
    <div className="page-fade-enter" style={{ minHeight: '100vh', paddingBottom: '60px' }}>
      
      {/* Hero Section */}
      <section style={{ 
        position: 'relative', 
        padding: '100px 24px 80px 24px', 
        borderBottom: '1px solid var(--card-border)',
        background: 'linear-gradient(180deg, rgba(43, 92, 70, 0.05) 0%, transparent 100%)'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '40px', alignItems: 'center' }}>
          <div style={{ textAlign: 'left' }}>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontFamily: 'var(--font-display)', marginBottom: '20px', lineHeight: 1.15 }}>
              A smarter bridge between learners and <span className="gradient-text">trusted education providers</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '17px', lineHeight: '1.7', maxWidth: '540px' }}>
              SapioMatch AI helps users make confident education decisions by matching them with suitable programs using AI, verified institution data, and transparent comparison logic.
            </p>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'var(--primary-glow)', borderRadius: '12px', filter: 'blur(40px)', opacity: 0.8 }}></div>
            <img 
              src="https://images.unsplash.com/photo-1572021335469-31706a17aaef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" 
              alt="Team collaborating" 
              style={{ width: '100%', height: '360px', objectFit: 'cover', borderRadius: '12px', border: '1px solid var(--card-border)', position: 'relative', zIndex: 2 }}
            />
          </div>
        </div>
      </section>

      {/* Problem We Solve */}
      <section style={{ padding: '80px 24px' }}>
        <div className="glass-card" style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '32px' }}>
            <div style={{ 
              background: 'rgba(43, 92, 70, 0.1)', 
              color: 'var(--primary)', 
              width: '44px', 
              height: '44px', 
              borderRadius: '8px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: '1px solid rgba(43, 92, 70, 0.2)'
            }}>
              <HelpCircle size={22} />
            </div>
            <h2 style={{ fontSize: '28px', fontFamily: 'var(--font-display)' }}>The Problem We Solve</h2>
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '16px', lineHeight: 1.6, maxWidth: '800px' }}>
            Finding the right educational program shouldn't feel overwhelming. Yet for millions of learners worldwide, the process is fragmented, confusing, and time-consuming.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {problemItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx} 
                  className="spotlight-card" 
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  style={{ 
                    padding: '24px', 
                    '--spotlight-color': item.bg.replace('0.06', '0.12'),
                    zIndex: 2
                  }}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: item.bg,
                    border: `1px solid ${item.border}`,
                    color: item.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px'
                  }} className="icon-container">
                    <Icon size={18} />
                  </div>
                  <h4 style={{ fontSize: '16px', color: 'white', marginBottom: '8px', fontFamily: 'var(--font-display)', fontWeight: 600 }}>{item.title}</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.4 }}>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Matching Matters */}
      <section style={{ padding: '0 24px 60px 24px' }}>
        <div className="glass-card" style={{ 
          maxWidth: '1100px', 
          margin: '0 auto', 
          padding: '40px',
          borderLeft: '4px solid var(--secondary)',
          background: 'linear-gradient(90deg, rgba(180, 83, 9, 0.02) 0%, var(--card-bg) 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
            <div style={{ 
              background: 'rgba(180, 83, 9, 0.1)', 
              color: 'var(--secondary)', 
              width: '44px', 
              height: '44px', 
              borderRadius: '8px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: '1px solid rgba(180, 83, 9, 0.2)'
            }}>
              <Target size={22} />
            </div>
            <h2 style={{ fontSize: '26px', fontFamily: 'var(--font-display)' }}>Why Matching Matters</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-muted)', fontSize: '16px', lineHeight: '1.6', maxWidth: '900px' }}>
            <p>The best program is not always the most famous one. It's the one that fits your background, budget, schedule, location, goals, and career direction.</p>
            <p>A working professional in Berlin looking for a part-time AI certification has entirely different needs than a recent graduate seeking a full-time MBA in Singapore. Generic search results fail both users.</p>
            <p style={{ color: 'white', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={16} style={{ color: 'var(--secondary)' }} />
              Our AI-powered matching considers your complete profile to surface opportunities you'd never find through traditional search.
            </p>
          </div>
        </div>
      </section>

      {/* How We Help Users */}
      <section style={{ padding: '60px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '32px', fontFamily: 'var(--font-display)', marginBottom: '12px' }}>How We Help Users</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '600px', margin: '0 auto' }}>
              We optimize the educational search process for learners, facilitating standard comparisons and matches.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {helperUsers.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx} 
                  className="spotlight-card"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    '--spotlight-color': item.bg.replace('0.08', '0.14'),
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    position: 'relative',
                    zIndex: 2
                  }}
                >
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    background: item.bg,
                    border: `1px solid ${item.border}`,
                    color: item.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'inset 0 0 12px rgba(255,255,255,0.02)'
                  }} className="icon-container">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'white', marginBottom: '8px', fontFamily: 'var(--font-display)' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: '1.55' }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How We Help Institutions */}
      <section style={{ padding: '60px 24px', borderTop: '1px solid var(--card-border)', background: 'rgba(255,255,255,0.005)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '32px', fontFamily: 'var(--font-display)', marginBottom: '12px' }}>How We Help Institutions</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '600px', margin: '0 auto' }}>
              We empower university desks to publish verified programs and connect directly with targeted candidates.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {helperInst.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx} 
                  className="spotlight-card"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    '--spotlight-color': item.bg.replace('0.08', '0.14'),
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    position: 'relative',
                    zIndex: 2
                  }}
                >
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    background: item.bg,
                    border: `1px solid ${item.border}`,
                    color: item.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'inset 0 0 12px rgba(255,255,255,0.02)'
                  }} className="icon-container">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'white', marginBottom: '8px', fontFamily: 'var(--font-display)' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: '1.55' }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Operating Model */}
      <section style={{ padding: '80px 24px', borderTop: '1px solid var(--card-border)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '32px', fontFamily: 'var(--font-display)', marginBottom: '12px' }}>Our Operating Model</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '600px', margin: '0 auto' }}>
              A transparent, collaborative system that ensures data accuracy while respecting institutional ownership.
            </p>
          </div>

          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Vertical Timeline line */}
            <div style={{ 
              position: 'absolute', 
              left: '32px', 
              top: '20px', 
              bottom: '20px', 
              width: '2px', 
              background: 'linear-gradient(to bottom, var(--primary) 0%, var(--secondary) 50%, var(--accent) 100%)',
              opacity: 0.25
            }} />

            {operatingSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div 
                  key={idx} 
                  className="spotlight-card" 
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  style={{ 
                    display: 'flex', 
                    gap: '24px', 
                    alignItems: 'center', 
                    padding: '22px 28px',
                    '--spotlight-color': step.bg.replace('0.08', '0.14'),
                    marginLeft: '64px',
                    position: 'relative',
                    zIndex: 2
                  }}
                >
                  {/* Timeline indicator node */}
                  <div style={{
                    position: 'absolute',
                    left: '-48px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'var(--bg-color)',
                    border: '2px solid var(--card-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                  }} className="timeline-node">
                    <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-muted)' }}>{idx + 1}</span>
                  </div>

                  {/* Icon */}
                  <div style={{ 
                    width: '42px', 
                    height: '42px', 
                    background: step.bg, 
                    border: '1px solid rgba(255,255,255,0.04)',
                    color: step.color, 
                    borderRadius: '8px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    flexShrink: 0 
                  }} className="icon-container">
                    <Icon size={18} />
                  </div>
                  
                  {/* Text details */}
                  <div style={{ flexGrow: 1 }}>
                    <h4 style={{ fontSize: '16px', color: 'white', fontWeight: 600, marginBottom: '4px', fontFamily: 'var(--font-display)' }}>
                      {step.label}
                    </h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.45' }}>
                      {step.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* CTA section */}
      <section style={{ padding: '60px 24px', textAlign: 'center' }}>
        <div className="glass-card" style={{ maxWidth: '850px', margin: '0 auto', padding: '50px 40px', background: 'radial-gradient(circle at center, rgba(43, 92, 70, 0.05) 0%, var(--card-bg) 100%)' }}>
          <h2 style={{ fontSize: '30px', marginBottom: '18px', fontFamily: 'var(--font-display)' }}>We believe education decisions should be informed, transparent, and empowering</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15.5px', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px auto', lineHeight: 1.6 }}>
            Whether you're a learner seeking your next step or an institution looking to reach the right students, SapioMatch AI is built to serve you better.
          </p>
          <button className="btn-premium" onClick={() => setView('questionnaire')} style={{ padding: '12px 28px', fontSize: '14px' }}>
            Get Started Today
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

    </div>
  );
}
