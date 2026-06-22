import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, Shield, GraduationCap, ArrowRight, Phone, X, Sparkles, Settings, Globe, ChevronDown } from 'lucide-react';


export default function Auth({ setCurrentUser, setView, alert }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [role, setRole] = useState('Student');

  // OAuth Simulated States
  const [activeOAuth, setActiveOAuth] = useState(null); // 'google' or 'apple' or null
  const [oauthStep, setOauthStep] = useState('email'); // 'email' or 'roleCheck' or 'noAccess'
  const [oauthEmail, setOauthEmail] = useState('');
  const [oauthPassword, setOauthPassword] = useState('password');
  const [oauthName, setOauthName] = useState('');
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [googleAccessToken, setGoogleAccessToken] = useState('');

  // Load Google Identity Services client script dynamically
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (!script) {
        script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
      }
    }
  }, []);

  const getGoogleClientId = () => {
    return process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '910117365682-l96gic1k55o43rf3ml6oof93dqp3ikj8.apps.googleusercontent.com';
  };

  const handleRealGoogleLogin = () => {
    const clientId = getGoogleClientId();
    if (!clientId) return;

    if (window.google) {
      try {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'email profile openid',
          callback: async (tokenResponse) => {
            if (tokenResponse && tokenResponse.access_token) {
              setGoogleAccessToken(tokenResponse.access_token);
              try {
                // Fetch profile info from Google API
                const res = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenResponse.access_token}`);
                if (res.ok) {
                  const userInfo = await res.json();
                  const googleEmail = userInfo.email;
                  const googleName = userInfo.name || userInfo.given_name || googleEmail.split('@')[0];
                  
                  // Run our standard registration/login flow with this real Google email
                  await processOAuthUser(googleEmail, googleName);
                } else {
                  alert('Failed to retrieve profile information from Google.');
                }
              } catch (err) {
                console.error('Error fetching Google user profile:', err);
                alert('Error connecting to Google API.');
              }
            }
          },
          error_callback: (err) => {
            console.error('Google token client error:', err);
            alert(`Google login error: ${err.message || 'Check your Client ID and Authorized Origins'}`);
          }
        });
        client.requestAccessToken();
      } catch (err) {
        console.error('Google accounts error:', err);
        alert('Failed to initialize Google Login Client. Check if the Client ID is correct.');
      }
    } else {
      alert('Google Identity Services SDK is not loaded. Please try again in a moment.');
    }
  };

  const processOAuthUser = async (emailToProcess, nameToProcess) => {
    try {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('Database connection failed.');
      const users = await res.json();
      
      const existingUser = users.find(u => u.email.toLowerCase() === emailToProcess.toLowerCase());
      
      if (existingUser) {
        // Log in directly
        const loginRes = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailToProcess, password: existingUser.password || 'password' })
        });
        
        if (loginRes.ok) {
          const user = await loginRes.json();
          setCurrentUser(user);
          alert(`Success! Logged in via Google: ${user.name} (${user.role})`);
          setActiveOAuth(null);
          
          if (user.role === 'Admin') {
            setView('admin-dashboard');
          } else if (user.role === 'University') {
            setView('institution-dashboard');
          } else {
            setView('user-dashboard');
          }
        } else {
          alert('OAuth Login failed.');
        }
      } else {
        // User does not exist, ask if student
        setOauthEmail(emailToProcess);
        setOauthName(nameToProcess || emailToProcess.split('@')[0]);
        setOauthStep('roleCheck');
        setActiveOAuth('google'); // Ensure Google modal is active for roleCheck step
      }
    } catch (err) {
      console.error('OAuth error:', err);
      alert('Social authentication service error.');
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLogin) {
      // API call to login
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        
        if (res.ok) {
          const user = await res.json();
          setCurrentUser(user);
          alert(`Success! Logged in as ${user.name} (${user.role})`);
          
          if (user.role === 'Admin') {
            setView('admin-dashboard');
          } else if (user.role === 'University') {
            setView('institution-dashboard');
          } else {
            setView('user-dashboard');
          }
        } else {
          const err = await res.json();
          alert(err.error || 'Login failed. Please check your credentials.');
        }
      } catch (err) {
        console.error("Login request error:", err);
        alert('Server database connection offline.');
      }
    } else {
      // API call to signup
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            password,
            contactNumber,
            role
          })
        });

        if (res.ok) {
          const user = await res.json();
          setCurrentUser(user);
          alert(`Success! Account created for ${user.name}. Allocated 10 Standard credits.`);
          setView(user.role === 'Admin' ? 'admin-dashboard' : (user.role === 'University' ? 'institution-dashboard' : 'user-dashboard'));
        } else {
          const err = await res.json();
          alert(err.error || 'Registration failed.');
        }
      } catch (err) {
        console.error("Registration request error:", err);
        alert('Server database connection offline.');
      }
    }
  };

  // Helper logins for presentations
  const quickLogin = async (emailAddr) => {
    setEmail(emailAddr);
    setPassword('password');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailAddr, password: 'password' })
      });
      if (res.ok) {
        const user = await res.json();
        setCurrentUser(user);
        alert(`Success! Demo Login as ${user.name} (${user.role})`);
        if (user.role === 'Admin') {
          setView('admin-dashboard');
        } else if (user.role === 'University') {
          setView('institution-dashboard');
        } else {
          setView('user-dashboard');
        }
      } else {
        alert("Credentials check failed in persistent DB. Resetting mock database now.");
      }
    } catch (err) {
      alert("Database error: Ensure server is running.");
    }
  };

  const handleOAuthClick = (type) => {
    if (type === 'google') {
      const clientId = getGoogleClientId();
      if (clientId) {
        handleRealGoogleLogin();
        return;
      }
    }
    setActiveOAuth(type);
    setOauthStep('email');
    setOauthEmail('');
    setOauthPassword('password');
    setOauthName('');
  };

  const handleOAuthSubmit = async (e) => {
    e.preventDefault();
    if (!oauthEmail || !oauthEmail.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }
    await processOAuthUser(oauthEmail, oauthName);
  };


  const handleOAuthConfirmRegister = async () => {
    try {
      const registerRes = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: oauthName,
          email: oauthEmail,
          password: oauthPassword,
          contactNumber: '',
          role: 'Student'
        })
      });

      if (registerRes.ok) {
        const user = await registerRes.json();
        setCurrentUser(user);
        alert(`Account created via ${activeOAuth === 'google' ? 'Google' : 'Apple'}! Welcome ${user.name}. Allocated 10 Standard credits.`);
        setActiveOAuth(null);
        setView('user-dashboard');
      } else {
        const err = await registerRes.json();
        alert(err.error || 'Failed to create student account.');
      }
    } catch (err) {
      console.error('OAuth Register error:', err);
      alert('Server registration error.');
    }
  };

  const closeOAuthModal = () => {
    if (googleAccessToken && window.google) {
      try {
        window.google.accounts.oauth2.revoke(googleAccessToken, () => {
          console.log('Google OAuth token revoked successfully on modal close.');
        });
      } catch (err) {
        console.error('Failed to revoke Google token on close:', err);
      }
    }
    setGoogleAccessToken('');
    setActiveOAuth(null);
  };

  const handleOAuthRejectRegister = () => {
    if (googleAccessToken && window.google) {
      try {
        window.google.accounts.oauth2.revoke(googleAccessToken, () => {
          console.log('Google OAuth token revoked successfully on reject.');
        });
      } catch (err) {
        console.error('Failed to revoke Google token on reject:', err);
      }
    }
    setGoogleAccessToken('');
    setOauthStep('noAccess');
  };

  return (
    <div style={{ maxWidth: '450px', margin: '60px auto', padding: '0 24px' }}>
      <div className="glass-card" style={{ padding: '32px' }}>

        <h2 style={{ fontSize: '24px', fontFamily: 'var(--font-display)', marginBottom: '8px', textAlign: 'center' }}>
          {isLogin ? 'Log In to SapioMatch' : 'Create an Account'}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', marginBottom: '24px' }}>
          {isLogin ? 'Access your matched courses & credentials portal' : 'Get matched and access premium counselor support'}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {!isLogin && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    className="custom-input" 
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ paddingLeft: '40px' }}
                    required
                  />
                  <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>Contact Number</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="tel" 
                    className="custom-input" 
                    placeholder="+971 50 123 4567"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    style={{ paddingLeft: '40px' }}
                    required
                  />
                  <Phone size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </div>
            </>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="email" 
                className="custom-input" 
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '40px' }}
                required
              />
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="password" 
                className="custom-input" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '40px' }}
                required
              />
              <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Select Account Type</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  className="btn-premium-outline"
                  onClick={() => setRole('Student')}
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    background: role === 'Student' ? 'rgba(43, 92, 70, 0.1)' : 'transparent',
                    borderColor: role === 'Student' ? 'var(--primary)' : 'var(--card-border)'
                  }}
                >
                  <GraduationCap size={16} />
                  Student
                </button>
                <button
                  type="button"
                  className="btn-premium-outline"
                  onClick={() => setRole('Admin')}
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    background: role === 'Admin' ? 'rgba(43, 92, 70, 0.1)' : 'transparent',
                    borderColor: role === 'Admin' ? 'var(--primary)' : 'var(--card-border)'
                  }}
                >
                  <Shield size={16} />
                  Operator
                </button>
              </div>
            </div>
          )}

          <button type="submit" className="btn-premium" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}>
            {isLogin ? 'Log In' : 'Create Account'}
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            style={{ color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </div>

        {/* Social OAuth logins */}
        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <hr style={{ flex: 1, borderColor: 'var(--card-border)', opacity: 0.2 }} />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Or continue with</span>
            <hr style={{ flex: 1, borderColor: 'var(--card-border)', opacity: 0.2 }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              type="button"
              onClick={() => handleOAuthClick('google')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '12px',
                borderRadius: '100px',
                background: '#ffffff',
                color: '#1f2937',
                border: '1px solid #dadce0',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '14.5px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="18" height="18">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.5 24.5c0-1.61-.15-3.16-.41-4.67H24v8.83h12.7c-.55 2.87-2.17 5.3-4.61 6.94l7.19 5.57c4.21-3.88 6.63-9.59 6.63-16.67z"/>
                <path fill="#FBBC05" d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.98-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.19-5.57c-1.99 1.33-4.55 2.13-7.7 2.13-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Sign in with Google Account
            </button>
          </div>
        </div>

        {/* Demo Fast Login Buttons */}
        <div style={{ borderTop: '1px solid var(--card-border)', marginTop: '24px', paddingTop: '20px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', textAlign: 'center' }}>
            Fast Demo Login Options
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button className="btn-premium-outline" onClick={() => quickLogin('sanji@example.com')} style={{ fontSize: '12.5px', justifyContent: 'center' }}>
              Student Account (Sanji - 10 Credits)
            </button>
            <button className="btn-premium-outline" onClick={() => quickLogin('aus@sapiomatch.ai')} style={{ fontSize: '12.5px', justifyContent: 'center' }}>
              University Account (AUS Representative)
            </button>
            <button className="btn-premium-outline" onClick={() => quickLogin('birmingham@sapiomatch.ai')} style={{ fontSize: '12.5px', justifyContent: 'center' }}>
              University Account (Birmingham Representative)
            </button>
            <button className="btn-premium-outline" onClick={() => quickLogin('operator@sapiomatch.ai')} style={{ fontSize: '12.5px', justifyContent: 'center' }}>
              Super Administrator Account
            </button>
          </div>
        </div>
      </div>

      {/* Simulated OAuth Overlay Modal */}
      {activeOAuth && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(5, 8, 16, 0.9)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100002,
          padding: '24px',
          overflowY: 'auto'
        }}>
          
          {activeOAuth === 'google' ? (
            /* Redesigned Horizontal Google Sign-In Card */
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '740px', alignItems: 'center' }}>
              <div style={{
                width: '100%',
                background: '#131314',
                color: '#e3e3e3',
                borderRadius: '28px',
                border: '1px solid #303030',
                padding: '40px',
                boxShadow: '0 24px 64px rgba(0, 0, 0, 0.6)',
                position: 'relative',
                boxSizing: 'border-box'
              }}>
                {/* Close Button */}
                <button 
                  onClick={closeOAuthModal}
                  style={{ 

                    position: 'absolute', 
                    right: '24px', 
                    top: '24px', 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer',
                    color: '#9ca3af',
                    transition: 'color 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '6px',
                    borderRadius: '50%',
                    zIndex: 2
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <X size={18} />
                </button>



                {/* Card Top Header (G Logo + Title) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="22" height="22">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.5 24.5c0-1.61-.15-3.16-.41-4.67H24v8.83h12.7c-.55 2.87-2.17 5.3-4.61 6.94l7.19 5.57c4.21-3.88 6.63-9.59 6.63-16.67z"/>
                    <path fill="#FBBC05" d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.98-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.19-5.57c-1.99 1.33-4.55 2.13-7.7 2.13-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                  <span style={{ fontSize: '14px', fontWeight: '400', color: '#c4c7c5' }}>Sign in with Google</span>
                </div>

                {/* 2-Column Main Content Container */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'row',
                  width: '100%',
                  gap: '40px',
                  flexWrap: 'wrap'
                }}>
                  {/* Left Column (Logo & Description) */}
                  <div style={{ flex: 1, minWidth: '240px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                    <div style={{ color: '#8e918f', marginBottom: '24px', display: 'flex', alignItems: 'center' }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: 'rgba(52, 211, 153, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(52, 211, 153, 0.2)'
                      }}>
                        <Sparkles size={22} style={{ color: '#34d399' }} />
                      </div>
                    </div>
                    
                    <h2 style={{ fontSize: '36px', fontWeight: '400', color: '#e3e3e3', margin: 0, fontFamily: 'var(--font-display)' }}>
                      Sign in
                    </h2>
                    <p style={{ fontSize: '16px', color: '#e3e3e3', marginTop: '12px', fontWeight: '300', lineHeight: '1.4' }}>
                      to continue to <span style={{ color: '#34d399', fontWeight: '500' }}>SapioMatch AI</span>
                    </p>
                  </div>

                  {/* Right Column (Form or Action details) */}
                  <div style={{ flex: 1.2, minWidth: '280px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '220px' }}>
                    {/* Step 1: Simulated Email form */}
                    {oauthStep === 'email' && (() => {
                      const clientId = getGoogleClientId();
                      return (
                        <form onSubmit={handleOAuthSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', gap: '20px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            

                            {/* Floating Outline Input */}
                            <div style={{ position: 'relative', height: '56px', width: '100%' }}>
                              <input 
                                type="email" 
                                value={oauthEmail}
                                onChange={(e) => setOauthEmail(e.target.value)}
                                onFocus={() => setIsEmailFocused(true)}
                                onBlur={() => setIsEmailFocused(false)}
                                required
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  padding: '16px 14px',
                                  borderRadius: '4px',
                                  border: isEmailFocused ? '2px solid #a8c7fa' : '1px solid #8e918f',
                                  background: 'transparent',
                                  color: '#e3e3e3',
                                  fontSize: '16px',
                                  outline: 'none',
                                  boxSizing: 'border-box',
                                  transition: 'border-color 0.15s ease'
                                }}
                              />
                              <label style={{
                                position: 'absolute',
                                left: '12px',
                                top: (oauthEmail || isEmailFocused) ? '0' : '50%',
                                transform: 'translateY(-50%)',
                                fontSize: (oauthEmail || isEmailFocused) ? '12px' : '16px',
                                color: isEmailFocused ? '#a8c7fa' : '#c4c7c5',
                                backgroundColor: '#131314',
                                padding: '0 6px',
                                transition: 'all 0.15s ease',
                                pointerEvents: 'none'
                              }}>
                                Email or phone
                              </label>
                            </div>

                            {/* Forgot Email Link */}
                            <div style={{ textAlign: 'left' }}>
                              <button 
                                type="button"
                                onClick={() => alert('Forgot email? Standard Google Sign-In helper: please enter your email address in the field.')}
                                style={{ color: '#a8c7fa', fontSize: '14px', fontWeight: 500, cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
                              >
                                Forgot email?
                              </button>
                            </div>

                            {/* Terms & Privacy disclaimer */}
                            <p style={{ fontSize: '12px', color: '#c4c7c5', lineHeight: '1.5', margin: '8px 0 0 0' }}>
                              Before using this app, you can review SapioMatch's{' '}
                              <a href="#privacy" onClick={(e) => {e.preventDefault(); alert('Redirecting to Privacy Policy...');}} style={{ color: '#a8c7fa', textDecoration: 'none' }}>Privacy Policy</a> and{' '}
                              <a href="#terms" onClick={(e) => {e.preventDefault(); alert('Redirecting to Terms of Service...');}} style={{ color: '#a8c7fa', textDecoration: 'none' }}>Terms of Service</a>.
                            </p>
                          </div>

                          {/* Action buttons row */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
                            <button 
                              type="button"
                              onClick={() => alert('To create a student account, please type your email address in the box and click Next.')}
                              style={{ color: '#a8c7fa', fontSize: '14px', fontWeight: 500, cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
                            >
                              Create account
                            </button>
                            
                            <button 
                              type="submit"
                              style={{
                                background: '#a8c7fa',
                                color: '#001d35',
                                border: 'none',
                                borderRadius: '100px',
                                padding: '10px 24px',
                                fontSize: '14px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'background-color 0.2s',
                                outline: 'none'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c2dbff'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#a8c7fa'}
                            >
                              Next
                            </button>
                          </div>
                        </form>
                      );
                    })()}

                    {/* Step 2: Role check prompt */}
                    {oauthStep === 'roleCheck' && (
                      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', gap: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {/* Active User Email Pill */}
                          <div style={{
                            display: 'inline-flex',
                            alignSelf: 'flex-start',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '6px 12px',
                            borderRadius: '100px',
                            border: '1px solid #303030',
                            background: 'rgba(255, 255, 255, 0.02)',
                            color: '#e3e3e3',
                            fontSize: '13.5px',
                            marginBottom: '4px'
                          }}>
                            <div style={{ 
                              width: '18px', 
                              height: '18px', 
                              borderRadius: '50%', 
                              background: '#34d399', 
                              color: '#0b0e0c', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                              fontSize: '11px', 
                              fontWeight: 'bold' 
                            }}>
                              {oauthEmail.charAt(0).toUpperCase()}
                            </div>
                            <span>{oauthEmail}</span>
                          </div>

                          <h3 style={{ fontSize: '18px', fontWeight: '500', color: '#e3e3e3', margin: '0 0 4px 0', lineHeight: '1.4' }}>
                            We detected that this Google account does not have an active profile.
                          </h3>
                          <p style={{ fontSize: '14.5px', color: '#c4c7c5', margin: 0, lineHeight: '1.4' }}>
                            Are you registering as a student?
                          </p>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                          <button 
                            onClick={handleOAuthConfirmRegister}
                            style={{
                              flex: 1,
                              padding: '12px',
                              borderRadius: '100px',
                              background: '#34d399',
                              color: '#0b0e0c',
                              border: 'none',
                              fontWeight: '600',
                              cursor: 'pointer',
                              fontSize: '14px',
                              transition: 'opacity 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                          >
                            Yes, I am a Student
                          </button>
                          <button 
                            onClick={handleOAuthRejectRegister}
                            style={{
                              flex: 1,
                              padding: '12px',
                              borderRadius: '100px',
                              background: 'rgba(248, 113, 113, 0.1)',
                              border: '1px solid #f87171',
                              color: '#f87171',
                              fontWeight: '600',
                              cursor: 'pointer',
                              fontSize: '14px',
                              transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(248, 113, 113, 0.2)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(248, 113, 113, 0.1)'}
                          >
                            No
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Blocked non-student message */}
                    {oauthStep === 'noAccess' && (
                      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', gap: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div style={{ color: '#f87171', fontSize: '28px', marginBottom: '4px' }}>⚠️</div>
                          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#e3e3e3', margin: 0 }}>
                            Registration Restricted
                          </h3>
                          <p style={{ fontSize: '13.5px', lineHeight: '1.5', color: '#c4c7c5', margin: 0, textAlign: 'justify' }}>
                            Self-service registration via social sign-in is exclusively reserved for student candidates. For institutional partnership access or operator credentials, please submit a formal inquiry to our administration desk.
                          </p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                          <div style={{
                            padding: '10px 12px',
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid #303030',
                            borderRadius: '6px',
                            fontSize: '12.5px',
                            color: '#e3e3e3'
                          }}>
                            Support: <strong>operator@sapiomatch.ai</strong>
                          </div>
                          
                          <button 
                            onClick={closeOAuthModal}
                            style={{
                              width: '100%',
                              padding: '11px',
                              borderRadius: '100px',
                              background: '#374151',
                              color: '#ffffff',
                              border: 'none',
                              fontWeight: '600',
                              cursor: 'pointer',
                              fontSize: '13.5px',
                              transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4b5563'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#374151'}
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom External Footer Row */}
              <div style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '16px',
                padding: '0 8px',
                boxSizing: 'border-box'
              }}>
                {/* Left Side: Mock Language Dropdown */}
                <div 
                  onClick={() => alert('Language selection is locked to English (United States) for this regional portal.')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px',
                    color: '#c4c7c5',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                >
                  <span>English (United States)</span>
                  <ChevronDown size={14} style={{ color: '#c4c7c5' }} />
                </div>

                {/* Right Side: Google Footer Links */}
                <div style={{ display: 'flex', gap: '24px' }}>
                  <a 
                    href="#help" 
                    onClick={(e) => { e.preventDefault(); alert('Google sign-in help center. For app queries, contact operator@sapiomatch.ai'); }}
                    style={{ fontSize: '12px', color: '#c4c7c5', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#c4c7c5'}
                  >
                    Help
                  </a>
                  <a 
                    href="#privacy" 
                    onClick={(e) => { e.preventDefault(); alert('Reviewing Google and SapioMatch privacy guidelines.'); }}
                    style={{ fontSize: '12px', color: '#c4c7c5', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#c4c7c5'}
                  >
                    Privacy
                  </a>
                  <a 
                    href="#terms" 
                    onClick={(e) => { e.preventDefault(); alert('Reviewing Google and SapioMatch terms of use.'); }}
                    style={{ fontSize: '12px', color: '#c4c7c5', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#c4c7c5'}
                  >
                    Terms
                  </a>
                </div>
              </div>
            </div>
          ) : (
            /* Apple Compact OAuth Card (Keep original style but cleaner) */
            <div className="glass-card" style={{ 
              width: '95%', 
              maxWidth: '400px', 
              padding: '32px', 
              border: '1px solid var(--card-border)',
              background: '#111827',
              color: '#f9fafb',
              boxShadow: '0 24px 64px rgba(0, 0, 0, 0.5)',
              position: 'relative'
            }}>
              
              {/* Header / Brand Logo */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
                <button 
                  onClick={() => setActiveOAuth(null)}
                  style={{ 
                    position: 'absolute', 
                    right: '16px', 
                    top: '16px', 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer',
                    color: '#9ca3af',
                    padding: '4px'
                  }}
                >
                  <X size={20} />
                </button>
                
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="36" height="36" fill="currentColor" style={{ marginBottom: '12px', color: '#ffffff' }}>
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 47.5-24.4 76.5 26.9 2.4 51.2-16 68.3-38.9z"/>
                </svg>
                <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#ffffff', margin: 0 }}>Sign in with Apple ID</h3>
                <span style={{ fontSize: '13px', color: '#9ca3af', marginTop: '6px' }}>to continue to SapioMatch AI</span>
              </div>

              {/* Step 1: Email Input Form */}
              {oauthStep === 'email' && (
                <form onSubmit={handleOAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '12px', 
                      fontWeight: 600, 
                      color: '#9ca3af',
                      marginBottom: '6px' 
                    }}>
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      placeholder="name@example.com"
                      value={oauthEmail}
                      onChange={(e) => setOauthEmail(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '4px',
                        border: '1px solid #374151',
                        background: '#1f2937',
                        color: '#f9fafb',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <button 
                    type="submit"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '4px',
                      background: '#ffffff',
                      color: '#000000',
                      border: 'none',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '14px',
                      textAlign: 'center',
                      marginTop: '8px'
                    }}
                  >
                    Continue
                  </button>
                </form>
              )}

              {/* Step 2: Role check prompt */}
              {oauthStep === 'roleCheck' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', textAlign: 'center' }}>
                  <p style={{ 
                    fontSize: '14.5px', 
                    lineHeight: '1.6', 
                    color: '#d1d5db',
                    margin: '0 0 8px 0'
                  }}>
                    We detected that <strong>{oauthEmail}</strong> does not have an active profile.
                    <br /><br />
                    <strong>Are you registering as a student?</strong>
                  </p>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                      onClick={handleOAuthConfirmRegister}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '4px',
                        background: '#10b981',
                        color: '#ffffff',
                        border: 'none',
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      Yes, I am a Student
                    </button>
                    <button 
                      onClick={handleOAuthRejectRegister}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '4px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid #ef4444',
                        color: '#ef4444',
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      No
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Blocked non-student message */}
              {oauthStep === 'noAccess' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', textAlign: 'center' }}>
                  <div style={{ color: '#ef4444', fontSize: '32px', marginBottom: '4px' }}>⚠️</div>
                  <h4 style={{ 
                    fontSize: '16px', 
                    fontWeight: 700, 
                    color: '#ffffff',
                    margin: 0
                  }}>
                    Registration Restricted
                  </h4>
                  <p style={{ 
                    fontSize: '13.5px', 
                    lineHeight: '1.6', 
                    color: '#9ca3af',
                    textAlign: 'justify',
                    margin: 0
                  }}>
                    Self-service registration via social sign-in is exclusively reserved for student candidates. For institutional partnership access or operator credentials, please submit a formal inquiry to our administration desk.
                  </p>
                  <div style={{
                    padding: '10px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid #374151',
                    borderRadius: '4px',
                    fontSize: '12px',
                    color: '#e5e7eb'
                  }}>
                    Support: <strong>operator@sapiomatch.ai</strong>
                  </div>
                  <button 
                    onClick={() => setActiveOAuth(null)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '4px',
                      background: '#374151',
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '14px',
                      marginTop: '8px'
                    }}
                  >
                    Close
                  </button>
                </div>
              )}

            </div>
          )}
        </div>
      )}
    </div>
  );
}
