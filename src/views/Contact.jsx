import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, GraduationCap, Building, Briefcase, User, Send, CheckCircle, Compass, ShieldAlert } from 'lucide-react';

export default function Contact({ setView, alert }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    inquiryType: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            fullName: '',
            email: '',
            phone: '',
            inquiryType: '',
            message: ''
          });
        }, 4000);
      } else {
        const errorData = await response.json();
        const triggerAlert = alert || window.alert;
        triggerAlert(errorData.error || 'Failed to submit message.');
      }
    } catch (err) {
      console.error('Submit contact error:', err);
      const triggerAlert = alert || window.alert;
      triggerAlert('An error occurred while sending your message. Please try again.');
    }
  };

  return (
    <div className="page-fade-enter" style={{ minHeight: '100vh', paddingBottom: '60px' }}>
      
      {/* Hero Section */}
      <section style={{ 
        position: 'relative', 
        padding: '80px 24px', 
        borderBottom: '1px solid var(--card-border)',
        background: 'linear-gradient(180deg, rgba(180, 83, 9, 0.05) 0%, transparent 100%)',
        textAlign: 'center'
      }}>
        <div style={{ absolute: 'inset-0', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontFamily: 'var(--font-display)', marginBottom: '20px', lineHeight: 1.15 }}>
            Let's connect <span className="gradient-text">users, institutions, and opportunities</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
            Whether you're a learner, institution, or partner, we're here to help you navigate your journey.
          </p>
        </div>
      </section>

      {/* Main Content Form & Contact Info */}
      <section style={{ padding: '60px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
          
          {/* Left Column: Form Card */}
          <div className="lg:col-span-2" style={{ gridColumn: 'span 2' }}>
            <div className="spotlight-card" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ padding: '40px', '--spotlight-color': 'rgba(43, 92, 70, 0.12)' }}>
              <h2 style={{ fontSize: '24px', marginBottom: '24px', fontFamily: 'var(--font-display)', position: 'relative', zIndex: 2 }}>Send us a message</h2>
              
              {isSubmitted ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '40px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '16px',
                  background: 'rgba(43, 92, 70, 0.05)',
                  border: '1px dashed var(--primary)',
                  borderRadius: 'var(--border-radius-md)',
                  position: 'relative',
                  zIndex: 2
                }}>
                  <CheckCircle size={48} style={{ color: 'var(--secondary)' }} className="pulse" />
                  <h3 style={{ fontSize: '20px', color: 'white' }}>Thank You!</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '400px' }}>
                    Your message has been logged. An academic counselor or partner representative will review your request and get back to you within 1–2 business days.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', zIndex: 2 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px', color: 'var(--text-primary)' }}>Full Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Enter your full name"
                      className="custom-input"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px', color: 'var(--text-primary)' }}>Email Address</label>
                      <input 
                        type="email" 
                        required
                        placeholder="your@email.com"
                        className="custom-input"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px', color: 'var(--text-primary)' }}>Phone Number</label>
                      <input 
                        type="tel" 
                        placeholder="+971 (55) 000-0000"
                        className="custom-input"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px', color: 'var(--text-primary)' }}>Inquiry Type</label>
                    <select 
                      required
                      className="custom-select"
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({...formData, inquiryType: e.target.value})}
                    >
                      <option value="">Select an option</option>
                      <option value="student">Student / Working Professional</option>
                      <option value="university">University / College Branch</option>
                      <option value="academy">Academy / Training Provider</option>
                      <option value="support">Technical Support</option>
                      <option value="partnership">Partnership Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px', color: 'var(--text-primary)' }}>Message</label>
                    <textarea 
                      required
                      rows={6}
                      placeholder="Tell us how we can help..."
                      className="custom-input"
                      style={{ resize: 'none', height: '140px' }}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    />
                  </div>

                  <button type="submit" className="btn-premium" style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
                    Send Message
                    <Send size={16} />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Contact info & Quick links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Info Box */}
            <div className="spotlight-card" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ padding: '24px', '--spotlight-color': 'rgba(180, 83, 9, 0.12)' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '24px', fontFamily: 'var(--font-display)', position: 'relative', zIndex: 2 }}>Contact Information</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', zIndex: 2 }}>
                
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ 
                    background: 'rgba(43, 92, 70, 0.1)', 
                    color: 'var(--primary)', 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '8px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexShrink: 0
                  }} className="icon-container">
                    <Mail size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Email</div>
                    <div style={{ fontSize: '14px', color: 'white', fontWeight: 500 }}>support@sapiomatch.ai</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ 
                    background: 'rgba(180, 83, 9, 0.1)', 
                    color: 'var(--secondary)', 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '8px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexShrink: 0
                  }} className="icon-container">
                    <Phone size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Phone</div>
                    <div style={{ fontSize: '14px', color: 'white', fontWeight: 500 }}>+971 4 555 0199</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ 
                    background: 'rgba(153, 27, 27, 0.1)', 
                    color: 'var(--accent)', 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '8px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexShrink: 0
                  }} className="icon-container">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Location</div>
                    <div style={{ fontSize: '14px', color: 'white', fontWeight: 500 }}>Dubai Internet City, UAE</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ 
                    background: 'rgba(43, 92, 70, 0.1)', 
                    color: 'var(--primary)', 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '8px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexShrink: 0
                  }} className="icon-container">
                    <Clock size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Response Time</div>
                    <div style={{ fontSize: '14px', color: 'white', fontWeight: 500 }}>1–2 business days</div>
                  </div>
                </div>

              </div>
            </div>

            {/* Quick Help Box */}
            <div className="spotlight-card" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ padding: '24px', '--spotlight-color': 'rgba(153, 27, 27, 0.12)' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '16px', fontFamily: 'var(--font-display)', position: 'relative', zIndex: 2 }}>Quick Help</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative', zIndex: 2 }}>
                <div className="spotlight-card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', background: 'rgba(255,255,255,0.01)', '--spotlight-color': 'rgba(43, 92, 70, 0.08)' }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} onClick={() => setView('questionnaire')}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'rgba(43, 92, 70, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} className="icon-container">
                    <GraduationCap size={16} />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 500 }}>Learner Support</span>
                </div>

                <div className="spotlight-card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', background: 'rgba(255,255,255,0.01)', '--spotlight-color': 'rgba(180, 83, 9, 0.08)' }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} onClick={() => setView('auth')}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'rgba(180, 83, 9, 0.1)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} className="icon-container">
                    <Building size={16} />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 500 }}>Institution Onboarding</span>
                </div>

                <div className="spotlight-card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', background: 'rgba(255,255,255,0.01)', '--spotlight-color': 'rgba(153, 27, 27, 0.08)' }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} onClick={() => alert('For corporate partnerships, please email partnerships@sapiomatch.ai')}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'rgba(153, 27, 27, 0.1)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} className="icon-container">
                    <Briefcase size={16} />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 500 }}>Partnership Inquiries</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Mid Banner Section */}
      <section style={{ padding: '0 24px 60px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', borderRadius: 'var(--border-radius-lg)', overflow: 'hidden', border: '1px solid var(--card-border)' }}>
          <img 
            src="https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" 
            alt="Office workspace collaborating" 
            style={{ width: '100%', height: '300px', objectFit: 'cover' }}
          />
          <div style={{ 
            position: 'absolute', 
            inset: 0, 
            background: 'linear-gradient(90deg, rgba(11, 15, 25, 0.95) 0%, rgba(11, 15, 25, 0.7) 50%, rgba(11, 15, 25, 0.3) 100%)',
            display: 'flex',
            alignItems: 'center',
            padding: '40px'
          }}>
            <div style={{ maxWidth: '600px' }}>
              <h2 style={{ fontSize: '32px', fontFamily: 'var(--font-display)', marginBottom: '12px' }}>
                We're here to <span className="gradient-text">help you succeed</span>
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.6 }}>
                Whether you're exploring career-focused degrees, setting up your university's program templates, or need tech support on the matching logs, our administrative and counseling desks are always ready.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Info Cards */}
      <section style={{ padding: '0 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          
          <div className="spotlight-card text-center" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ padding: '30px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', '--spotlight-color': 'rgba(43, 92, 70, 0.1)' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(43, 92, 70, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="icon-container">
              <User size={24} />
            </div>
            <h3 style={{ fontSize: '18px', color: 'white', position: 'relative', zIndex: 2 }}>For Learners</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, position: 'relative', zIndex: 2 }}>
              Questions about finding programs, using the platform, or understanding your match results? We're here to guide you.
            </p>
          </div>

          <div className="spotlight-card text-center" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ padding: '30px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', '--spotlight-color': 'rgba(180, 83, 9, 0.1)' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(180, 83, 9, 0.1)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="icon-container">
              <Building size={24} />
            </div>
            <h3 style={{ fontSize: '18px', color: 'white', position: 'relative', zIndex: 2 }}>For Institutions</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, position: 'relative', zIndex: 2 }}>
              Need help setting up your profile, managing programs, or understanding your lead dashboard? Connect with support.
            </p>
          </div>

          <div className="spotlight-card text-center" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ padding: '30px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', '--spotlight-color': 'rgba(153, 27, 27, 0.1)' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(153, 27, 27, 0.1)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="icon-container">
              <Briefcase size={24} />
            </div>
            <h3 style={{ fontSize: '18px', color: 'white', position: 'relative', zIndex: 2 }}>For Partners</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, position: 'relative', zIndex: 2 }}>
              Interested in technical integrations, custom marketing campaigns, or corporate sponsorships? Let's discuss.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
