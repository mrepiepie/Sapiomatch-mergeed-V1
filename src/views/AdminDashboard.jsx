import React, { useState, useEffect } from 'react';
import { 
  Shield, Users, CreditCard, Bell, Check, X, UserPlus, Trash, 
  Landmark, Edit, Trash2, ShieldAlert, Award,
  Activity, TrendingUp, Globe, BarChart3, PieChart, Zap
} from 'lucide-react';

function formatRelativeTime(timestamp) {
  const diff = Date.now() - timestamp;
  if (diff < 15000) return 'Just now';
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs === 1 ? '' : 's'} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

export default function AdminDashboard({ 
  currentUser,
  appliedCourses = [],
  institutions = [],
  setInstitutions,
  alert,
  onRefreshApplications
}) {
  const [activeTab, setActiveTab] = useState('analytics');
  const [usersList, setUsersList] = useState([]);
  const [inquiriesList, setInquiriesList] = useState([]);
  
  // Real-time Traffic States
  const [liveVisitors, setLiveVisitors] = useState(142);
  const [trafficHistory, setTrafficHistory] = useState([85, 95, 110, 140, 135, 120, 142]);
  
  // Real-time Activity Feed Logs
  const [activityLogs, setActivityLogs] = useState([
    { id: 1, type: 'visit', text: 'Guest user from Dubai matched 94% on questionnaire', time: '2 mins ago' },
    { id: 2, type: 'application', text: 'Sanji submitted application for Data Science MSc', time: '12 mins ago' },
    { id: 3, type: 'auth', text: 'New student account registered: sanji@example.com', time: '1 hr ago' },
    { id: 4, type: 'inquiry', text: 'Partnership inquiry received from John Doe', time: '3 hrs ago' }
  ]);
  
  // Create university states
  const [uniName, setUniName] = useState('');
  const [uniEmail, setUniEmail] = useState('');
  
  // Standard user signup states
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('Student');
  const [newUserPassword, setNewUserPassword] = useState('password');

  // Live simulation of traffic fluctuations, dynamic logging, and database polling
  useEffect(() => {
    // Initial load on mount or tab change
    fetchUsers();
    fetchInquiries();
    fetchActivity();
    if (onRefreshApplications) {
      onRefreshApplications();
    }

    const interval = setInterval(() => {
      // Keep database states fresh in real-time
      fetchUsers();
      fetchInquiries();
      fetchActivity();
      if (onRefreshApplications) {
        onRefreshApplications();
      }
    }, 4000);
    
    return () => clearInterval(interval);
  }, [activeTab, onRefreshApplications]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsersList(data);
      }
    } catch (err) {
      console.warn("Failed to fetch users database:", err);
    }
  };

  const fetchInquiries = async () => {
    try {
      const res = await fetch('/api/contact');
      if (res.ok) {
        const data = await res.json();
        setInquiriesList(data);
      }
    } catch (err) {
      console.warn("Failed to fetch contact inquiries:", err);
    }
  };

  const fetchActivity = async () => {
    try {
      const res = await fetch('/api/activity');
      if (res.ok) {
        const data = await res.json();
        
        // Process logs and format time
        let realLogs = data.logs.map(log => ({
          ...log,
          time: formatRelativeTime(log.timestamp)
        }));

        // Blend with simulated visitor activity if real logs are sparse (less than 6)
        if (realLogs.length < 6) {
          const simulatedLogs = [
            { id: 'sim_1', type: 'visit', text: 'Guest user from Dubai matched 94% on questionnaire', timestamp: Date.now() - 120000 },
            { id: 'sim_2', type: 'click', text: 'Visitor in Sharjah clicked "Apply Now" for Middlesex MBA', timestamp: Date.now() - 480000 },
            { id: 'sim_3', type: 'visit', text: 'Anonymous explorer from Abu Dhabi browsing universities', timestamp: Date.now() - 1200000 },
            { id: 'sim_4', type: 'click', text: 'User in Muscat compared computer science programs', timestamp: Date.now() - 7200000 },
            { id: 'sim_5', type: 'visit', text: 'Visitor in Riyadh exploring AstroLabs Academy courses', timestamp: Date.now() - 14400000 }
          ].map(log => ({
            ...log,
            time: formatRelativeTime(log.timestamp)
          }));
          
          // Merge and sort
          const blended = [...realLogs, ...simulatedLogs];
          blended.sort((a, b) => b.timestamp - a.timestamp);
          realLogs = blended.slice(0, 8); // Keep top 8 logs
        } else {
          realLogs = realLogs.slice(0, 8); // Keep top 8 logs
        }
        
        setActivityLogs(realLogs);
        
        // Update traffic stats if available
        if (data.liveVisitors !== undefined) {
          setLiveVisitors(data.liveVisitors);
        }
        if (data.trafficHistory) {
          setTrafficHistory(data.trafficHistory);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch real-time activity metrics:", err);
    }
  };

  const handleCreateUniversity = async (e) => {
    e.preventDefault();
    if (!uniName || !uniEmail) return;

    try {
      const res = await fetch('/api/universities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: uniName, email: uniEmail })
      });

      if (res.ok) {
        alert(`Success! Enrolled university "${uniName}". A representative login has been generated for "${uniEmail}".`);
        setUniName('');
        setUniEmail('');
        fetchUsers();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to create university partner.");
      }
    } catch (err) {
      alert("Database error connecting to Next.js API.");
    }
  };

  const handleAddStandardUser = async (e) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newUserName,
          email: newUserEmail,
          password: newUserPassword,
          role: newUserRole
        })
      });

      if (res.ok) {
        alert(`Success! Created student/admin user "${newUserName}" in backend database.`);
        setNewUserName('');
        setNewUserEmail('');
        setNewUserPassword('password');
        fetchUsers();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to create user.");
      }
    } catch (err) {
      alert("Database error connecting to Next.js API.");
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete user "${name}"?`)) {
      try {
        const res = await fetch(`/api/users?id=${id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          alert(`User "${name}" deleted successfully.`);
          fetchUsers();
        } else {
          alert("Failed to delete user.");
        }
      } catch (err) {
        alert("Database error connecting to Next.js API.");
      }
    }
  };

  const handleDeleteInquiry = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete the contact inquiry from "${name}"?`)) {
      try {
        const res = await fetch(`/api/contact?id=${id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          alert(`Inquiry from "${name}" deleted.`);
          fetchInquiries();
        } else {
          alert("Failed to delete inquiry.");
        }
      } catch (err) {
        alert("Database error connecting to Next.js API.");
      }
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
          Operator <span className="gradient-text">Super Admin Control</span>
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          System-wide governance: modify applications, register new university portals, and manage user accounts in real time.
        </p>
      </div>

      {/* Global stats grids */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Total Database Users</span>
            <Users size={20} style={{ color: 'var(--primary)' }} />
          </div>
          <h2 style={{ fontSize: '28px', color: 'white' }}>{usersList.length}</h2>
          <span style={{ fontSize: '11px', color: 'var(--success)' }}>Active credentials tracked</span>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Student Applications</span>
            <Landmark size={20} style={{ color: 'var(--secondary)' }} />
          </div>
          <h2 style={{ fontSize: '28px', color: 'white' }}>{appliedCourses.length} Active</h2>
          <span style={{ fontSize: '11px', color: 'var(--accent)' }}>Stored in persistent database</span>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Partner Portals</span>
            <Award size={20} style={{ color: 'var(--accent)' }} />
          </div>
          <h2 style={{ fontSize: '28px', color: 'white' }}>{usersList.filter(u => u.role === 'University').length} active</h2>
          <span style={{ fontSize: '11px', color: 'var(--success)' }}>KYC validated data</span>
        </div>
      </div>

      {/* Tab Selectors */}
      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--card-border)', background: 'rgba(255, 255, 255, 0.01)', flexWrap: 'wrap' }}>
          {[
            { id: 'analytics', label: 'Analytics & Live Insights' },
            { id: 'applications', label: 'Manage Applications' },
            { id: 'inquiries', label: 'Contact Inquiries' },
            { id: 'adduniversity', label: 'Enroll University Portal' },
            { id: 'users', label: 'User Database' },
            { id: 'adduser', label: 'Add Student/Admin Profile' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '16px 24px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                color: activeTab === tab.id ? 'var(--secondary)' : 'var(--text-muted)',
                borderBottom: activeTab === tab.id ? '2px solid var(--secondary)' : 'none',
                background: activeTab === tab.id ? 'rgba(180, 83, 9, 0.02)' : 'transparent'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div style={{ padding: '24px' }}>
          
          {/* Analytics & Live Insights Tab */}
          {activeTab === 'analytics' && (
            <div>
              {/* Dynamic Top Stat Alert Banner */}
              <div 
                className="glass-card" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '16px', 
                  padding: '16px 20px', 
                  borderLeft: '4px solid var(--secondary)', 
                  marginBottom: '24px',
                  background: 'linear-gradient(90deg, rgba(180, 83, 9, 0.05) 0%, rgba(0,0,0,0) 100%)'
                }}
              >
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: 'var(--secondary)',
                  boxShadow: '0 0 8px var(--secondary)',
                  animation: 'pulse 1.5s infinite alternate'
                }} />
                <div style={{ fontSize: '13.5px', color: '#e5e7eb' }}>
                  <strong>Real-Time Monitor Active:</strong> Storing visitor logs and tracking dynamic application distributions. Currently showing <strong>{liveVisitors} active visitors</strong> on the platform.
                </div>
              </div>

              {/* Grid Layout: Left (Charts) & Right (Log Feed) */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', flexWrap: 'wrap' }} className="analytics-grid">
                
                {/* Left Column (Charts) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  {/* Website Traffic Line Chart */}
                  <div className="glass-card" style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Globe size={18} style={{ color: 'var(--secondary)' }} />
                        <h4 style={{ fontSize: '15px', color: 'white', margin: 0, fontWeight: 700 }}>Website Traffic (Live Visitors)</h4>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '12px' }}>
                        Live Updates: Every 4s
                      </div>
                    </div>

                    <div style={{ position: 'relative', width: '100%', height: '180px' }}>
                      <svg width="100%" height="100%" viewBox="0 0 500 180" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="trafficGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--secondary)" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="var(--secondary)" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>

                        {/* Grid lines */}
                        <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                        <line x1="0" y1="75" x2="500" y2="75" stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                        <line x1="0" y1="120" x2="500" y2="120" stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                        <line x1="0" y1="165" x2="500" y2="165" stroke="rgba(255,255,255,0.06)" />

                        {/* Area path */}
                        <path
                          d={`M 0,165 
                             L 0,${160 - (trafficHistory[0] / 300) * 120} 
                             L 83.3,${160 - (trafficHistory[1] / 300) * 120} 
                             L 166.6,${160 - (trafficHistory[2] / 300) * 120} 
                             L 250,${160 - (trafficHistory[3] / 300) * 120} 
                             L 333.3,${160 - (trafficHistory[4] / 300) * 120} 
                             L 416.6,${160 - (trafficHistory[5] / 300) * 120} 
                             L 500,${160 - (trafficHistory[6] / 300) * 120} 
                             L 500,165 Z`}
                          fill="url(#trafficGrad)"
                          style={{ transition: 'd 0.5s ease-in-out' }}
                        />

                        {/* Line path */}
                        <path
                          d={`M 0,${160 - (trafficHistory[0] / 300) * 120} 
                             L 83.3,${160 - (trafficHistory[1] / 300) * 120} 
                             L 166.6,${160 - (trafficHistory[2] / 300) * 120} 
                             L 250,${160 - (trafficHistory[3] / 300) * 120} 
                             L 333.3,${160 - (trafficHistory[4] / 300) * 120} 
                             L 416.6,${160 - (trafficHistory[5] / 300) * 120} 
                             L 500,${160 - (trafficHistory[6] / 300) * 120}`}
                          fill="none"
                          stroke="var(--secondary)"
                          strokeWidth="3"
                          strokeLinecap="round"
                          style={{ transition: 'd 0.5s ease-in-out' }}
                        />

                        {/* Circles at data nodes */}
                        {trafficHistory.map((val, idx) => {
                          const cx = (idx / 6) * 500;
                          const cy = 160 - (val / 300) * 120;
                          return (
                            <g key={idx}>
                              <circle 
                                cx={cx} cy={cy} r="5" 
                                fill="var(--secondary)" 
                                stroke="#111827" strokeWidth="2"
                                style={{ transition: 'cx 0.5s, cy 0.5s' }}
                              />
                              <text 
                                x={cx} y={cy - 12} 
                                textAnchor="middle" 
                                fill="white" fontSize="9px" fontWeight="bold"
                                style={{ transition: 'x 0.5s, y 0.5s' }}
                              >
                                {val}
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    </div>

                    {/* X-axis labels */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '10.5px', color: 'var(--text-muted)', padding: '0 4px' }}>
                      <span>6 hrs ago</span>
                      <span>5 hrs ago</span>
                      <span>4 hrs ago</span>
                      <span>3 hrs ago</span>
                      <span>2 hrs ago</span>
                      <span>1 hr ago</span>
                      <span style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>Just now</span>
                    </div>
                  </div>

                  {/* University Applications Distribution */}
                  <div className="glass-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                      <BarChart3 size={18} style={{ color: 'var(--primary)' }} />
                      <h4 style={{ fontSize: '15px', color: 'white', margin: 0, fontWeight: 700 }}>Applications per University (Real-time Database)</h4>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {(() => {
                        const partnerUnis = [
                          "University of Birmingham Dubai",
                          "Middlesex University Dubai",
                          "American University of Sharjah",
                          "AstroLabs Academy"
                        ];
                        
                        const counts = {};
                        partnerUnis.forEach(name => { counts[name] = 0; });
                        
                        appliedCourses.forEach(app => {
                          if (counts[app.universityName] !== undefined) {
                            counts[app.universityName]++;
                          } else {
                            counts[app.universityName] = (counts[app.universityName] || 0) + 1;
                          }
                        });

                        const maxVal = Math.max(1, ...Object.values(counts));

                        return Object.entries(counts).map(([uniName, count], index) => {
                          const percentage = (count / maxVal) * 100;
                          
                          // Color mapping
                          const colors = [
                            'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)', // Blue
                            'linear-gradient(90deg, #10b981 0%, #34d399 100%)', // Green
                            'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)', // Orange/Amber
                            'linear-gradient(90deg, #8b5cf6 0%, #a78bfa 100%)'  // Purple
                          ];

                          return (
                            <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: '#e5e7eb' }}>
                                <span style={{ fontWeight: 600 }}>{uniName}</span>
                                <span style={{ fontWeight: 800, color: 'white' }}>{count} {count === 1 ? 'application' : 'applications'}</span>
                              </div>
                              <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '5px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.03)' }}>
                                <div style={{
                                  width: `${percentage}%`,
                                  height: '100%',
                                  background: colors[index % colors.length],
                                  borderRadius: '5px',
                                  transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                                }} />
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>

                </div>

                {/* Right Column (Donut + Live Activity) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  {/* Status Breakdown Donut */}
                  <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', alignSelf: 'flex-start' }}>
                      <PieChart size={18} style={{ color: 'var(--primary)' }} />
                      <h4 style={{ fontSize: '15px', color: 'white', margin: 0, fontWeight: 700 }}>Application Status</h4>
                    </div>

                    {(() => {
                      let accepted = 0;
                      let pending = 0;
                      let cancelled = 0;
                      appliedCourses.forEach(app => {
                        const s = app.status?.toLowerCase();
                        if (s === 'accepted' || s === 'approved') accepted++;
                        else if (s === 'cancelled' || s === 'rejected') cancelled++;
                        else pending++;
                      });
                      
                      const total = appliedCourses.length;
                      const radius = 35;
                      const circ = 2 * Math.PI * radius; // 219.9
                      
                      const stroke1 = total > 0 ? (accepted / total) * circ : 0;
                      const stroke2 = total > 0 ? (pending / total) * circ : 0;
                      const stroke3 = total > 0 ? (cancelled / total) * circ : 0;
                      
                      const offset1 = 0;
                      const offset2 = -stroke1;
                      const offset3 = -(stroke1 + stroke2);

                      return (
                        <div style={{ width: '100%' }}>
                          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                            <svg width="150" height="150" viewBox="0 0 100 100">
                              <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="10" />
                              
                              {accepted > 0 && (
                                <circle 
                                  cx="50" cy="50" r="35" fill="none" 
                                  stroke="#10b981" strokeWidth="10" 
                                  strokeDasharray={`${stroke1} ${circ}`} 
                                  strokeDashoffset={offset1} 
                                  transform="rotate(-90 50 50)" 
                                  strokeLinecap="round"
                                  style={{ transition: 'stroke-dasharray 0.5s, stroke-dashoffset 0.5s' }}
                                />
                              )}
                              
                              {pending > 0 && (
                                <circle 
                                  cx="50" cy="50" r="35" fill="none" 
                                  stroke="#f59e0b" strokeWidth="10" 
                                  strokeDasharray={`${stroke2} ${circ}`} 
                                  strokeDashoffset={offset2} 
                                  transform="rotate(-90 50 50)" 
                                  strokeLinecap="round"
                                  style={{ transition: 'stroke-dasharray 0.5s, stroke-dashoffset 0.5s' }}
                                />
                              )}
                              
                              {cancelled > 0 && (
                                <circle 
                                  cx="50" cy="50" r="35" fill="none" 
                                  stroke="#ef4444" strokeWidth="10" 
                                  strokeDasharray={`${stroke3} ${circ}`} 
                                  strokeDashoffset={offset3} 
                                  transform="rotate(-90 50 50)" 
                                  strokeLinecap="round"
                                  style={{ transition: 'stroke-dasharray 0.5s, stroke-dashoffset 0.5s' }}
                                />
                              )}

                              <text x="50" y="47" textAnchor="middle" fill="white" fontSize="13px" fontWeight="bold" fontFamily="var(--font-display)">
                                {total}
                              </text>
                              <text x="50" y="60" textAnchor="middle" fill="var(--text-muted)" fontSize="6.5px" fontWeight="bold" letterSpacing="0.5px">
                                TOTAL APPS
                              </text>
                            </svg>
                          </div>

                          {/* Legend list */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', textAlign: 'left', borderTop: '1px solid var(--card-border)', paddingTop: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                                <span>Approved / Accepted</span>
                              </div>
                              <span style={{ fontWeight: 'bold', color: 'white' }}>{accepted} ({total > 0 ? Math.round((accepted/total)*100) : 0}%)</span>
                            </div>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
                                <span>Under Review</span>
                              </div>
                              <span style={{ fontWeight: 'bold', color: 'white' }}>{pending} ({total > 0 ? Math.round((pending/total)*100) : 0}%)</span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
                                <span>Cancelled / Rejected</span>
                              </div>
                              <span style={{ fontWeight: 'bold', color: 'white' }}>{cancelled} ({total > 0 ? Math.round((cancelled/total)*100) : 0}%)</span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Live Activity Feed Logs */}
                  <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '272px', paddingBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                      <Zap size={18} style={{ color: 'var(--secondary)' }} />
                      <h4 style={{ fontSize: '15px', color: 'white', margin: 0, fontWeight: 700 }}>Live Activity Feed</h4>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', flexGrow: 1, paddingRight: '4px' }} className="custom-scrollbar">
                      {activityLogs.map((log) => (
                        <div 
                          key={log.id} 
                          style={{ 
                            display: 'flex', 
                            gap: '10px', 
                            fontSize: '11.5px', 
                            lineHeight: 1.4, 
                            borderBottom: '1px solid rgba(255,255,255,0.02)', 
                            paddingBottom: '8px',
                            animation: log.time === 'Just now' ? 'fadeIn 0.5s ease-out' : 'none'
                          }}
                        >
                          <div style={{ marginTop: '2px' }}>
                            {log.type === 'visit' && <Globe size={12} style={{ color: 'var(--primary)' }} />}
                            {log.type === 'match' && <Activity size={12} style={{ color: 'var(--secondary)' }} />}
                            {log.type === 'click' && <TrendingUp size={12} style={{ color: '#3b82f6' }} />}
                            {log.type === 'application' && <Landmark size={12} style={{ color: '#10b981' }} />}
                            {log.type === 'auth' && <Users size={12} style={{ color: '#8b5cf6' }} />}
                            {log.type === 'inquiry' && <CreditCard size={12} style={{ color: 'var(--accent)' }} />}
                          </div>
                          <div style={{ flexGrow: 1 }}>
                            <span style={{ color: '#e5e7eb' }}>{log.text}</span>
                            <span style={{ display: 'block', fontSize: '9.5px', color: 'var(--text-muted)', marginTop: '2px' }}>{log.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

              {/* Dynamic CSS styles injected inline for pulsing effect */}
              <style dangerouslySetInnerHTML={{__html: `
                @keyframes pulse {
                  0% { opacity: 0.3; transform: scale(0.9); }
                  100% { opacity: 1; transform: scale(1.1); }
                }
                .analytics-grid {
                  margin-bottom: 24px;
                }
                @media (max-width: 850px) {
                  .analytics-grid {
                    grid-template-columns: 1fr !important;
                  }
                }
                .custom-scrollbar::-webkit-scrollbar {
                  width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                  background: rgba(255,255,255,0.01);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                  background: rgba(255,255,255,0.1);
                  border-radius: 2px;
                }
              `}} />
            </div>
          )}

          {/* Manage Applications Tab */}
          {activeTab === 'applications' && (
            <div>
              <h3 style={{ fontSize: '16px', marginBottom: '16px', color: 'white' }}>Global Student Application Registrations</h3>
              {appliedCourses.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {appliedCourses.map((app, idx) => (
                    <div 
                      key={idx}
                      style={{
                        padding: '16px',
                        background: 'rgba(255,255,255,0.01)',
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
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                          <h4 style={{ fontSize: '16px', color: 'white', margin: 0 }}>{app.courseName}</h4>
                          <span style={{
                            padding: '2px 6px',
                            background: app.counselorPreference === 'No Counselor' ? 'rgba(255,255,255,0.05)' : 'rgba(16,185,129,0.1)',
                            color: app.counselorPreference === 'No Counselor' ? 'var(--text-muted)' : '#34d399',
                            fontSize: '9px',
                            fontWeight: 700,
                            borderRadius: '4px'
                          }}>
                            {app.counselorPreference}
                          </span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                          <span>University: <strong>{app.universityName}</strong></span>
                          <span>Candidate: <strong>{app.studentName} ({app.studentEmail})</strong></span>
                          <span>Contact: <strong>{app.studentContact}</strong></span>
                          <span>CGPA: <strong>{app.cgpa}</strong></span>
                          <span>Status: <strong style={{ color: app.status === 'Accepted' ? '#10b981' : '#f59e0b' }}>{app.status}</strong></span>
                        </div>
                        {app.replyText && (
                          <div style={{ marginTop: '8px', padding: '8px', background: 'rgba(255,255,255,0.02)', borderLeft: '3px solid var(--secondary)', fontSize: '11.5px' }}>
                            <strong>University Reply:</strong> "{app.replyText}" {app.meetingLink && <a href={app.meetingLink} target="_blank" rel="noreferrer" style={{ color: '#22d3ee', textDecoration: 'underline', marginLeft: '6px' }}>Join Zoom Meeting ↗</a>}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                  No active student applications inside system database.
                </div>
              )}
            </div>
          )}

          {/* Contact Inquiries Tab */}
          {activeTab === 'inquiries' && (
            <div>
              <h3 style={{ fontSize: '16px', marginBottom: '16px', color: 'white' }}>Contact Form Submissions</h3>
              {inquiriesList.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {inquiriesList.map((inq) => (
                    <div 
                      key={inq.id}
                      style={{
                        padding: '20px',
                        background: 'rgba(255,255,255,0.01)',
                        border: '1px solid var(--card-border)',
                        borderRadius: 'var(--border-radius-sm)',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                            <h4 style={{ fontSize: '16px', color: 'white', margin: 0 }}>{inq.fullName}</h4>
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: '4px',
                              background: inq.inquiryType === 'partnership' ? 'rgba(153, 27, 27, 0.15)' : (inq.inquiryType === 'university' ? 'rgba(180, 83, 9, 0.15)' : 'rgba(43, 92, 70, 0.15)'),
                              color: inq.inquiryType === 'partnership' ? 'var(--accent)' : (inq.inquiryType === 'university' ? 'var(--secondary)' : 'var(--primary)'),
                              fontSize: '11px',
                              fontWeight: 600,
                              textTransform: 'uppercase'
                            }}>
                              {inq.inquiryType}
                            </span>
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '12px', color: 'var(--text-muted)', margin: '6px 0' }}>
                            <span>Email: <strong style={{ color: 'white' }}>{inq.email}</strong></span>
                            {inq.phone && <span>Phone: <strong style={{ color: 'white' }}>{inq.phone}</strong></span>}
                            <span>Received: <strong style={{ color: 'white' }}>{inq.date}</strong></span>
                          </div>
                        </div>
                        <button 
                          className="btn-premium-outline"
                          onClick={() => handleDeleteInquiry(inq.id, inq.fullName)}
                          style={{ padding: '4px 8px', fontSize: '11px', borderColor: 'rgba(239, 68, 68, 0.2)', color: '#f87171' }}
                        >
                          <Trash2 size={12} style={{ marginRight: '4px' }} />
                          Delete
                        </button>
                      </div>
                      
                      <div style={{ 
                        marginTop: '12px', 
                        padding: '12px', 
                        background: 'rgba(255,255,255,0.02)', 
                        borderLeft: '3px solid var(--primary)', 
                        fontSize: '13px',
                        lineHeight: 1.5,
                        color: '#d1d5db',
                        whiteSpace: 'pre-wrap'
                      }}>
                        {inq.message}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                  No contact submissions found in database.
                </div>
              )}
            </div>
          )}

          {/* Enroll University Portal */}
          {activeTab === 'adduniversity' && (
            <form onSubmit={handleCreateUniversity} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '450px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>University Name</label>
                <input 
                  type="text" 
                  className="custom-input"
                  placeholder="e.g. American University of Sharjah"
                  value={uniName}
                  onChange={(e) => setUniName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>Representative Email (Login account name)</label>
                <input 
                  type="email" 
                  className="custom-input"
                  placeholder="e.g. aus@sapiomatch.ai"
                  value={uniEmail}
                  onChange={(e) => setUniEmail(e.target.value)}
                  required
                />
              </div>

              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', padding: '12px', border: '1px solid var(--card-border)', borderRadius: '6px' }}>
                💡 <strong>System Note:</strong> Creating a university partner will automatically provision a new user account with role <code>University</code> and default password <code>password</code>. The university representative can log in and respond to their own candidates.
              </div>

              <button type="submit" className="btn-premium" style={{ width: 'fit-content', marginTop: '10px' }}>
                <Landmark size={16} style={{ marginRight: '6px' }} />
                Enroll University Partner
              </button>
            </form>
          )}

          {/* User Database tab */}
          {activeTab === 'users' && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--card-border)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px' }}>Name</th>
                    <th style={{ padding: '12px' }}>Email</th>
                    <th style={{ padding: '12px' }}>System Role</th>
                    <th style={{ padding: '12px' }}>Status</th>
                    <th style={{ padding: '12px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map(user => (
                    <tr key={user.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                      <td style={{ padding: '14px 12px', fontWeight: 600, color: 'white' }}>{user.name}</td>
                      <td style={{ padding: '14px 12px' }}>{user.email}</td>
                      <td style={{ padding: '14px 12px' }}>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: user.role === 'Admin' ? 'rgba(239, 68, 68, 0.15)' : (user.role === 'University' ? 'rgba(245,158,11,0.15)' : 'rgba(52,211,153,0.15)'),
                          color: user.role === 'Admin' ? '#f87171' : (user.role === 'University' ? 'var(--secondary)' : 'var(--primary)'),
                          fontWeight: 600,
                          fontSize: '12px'
                        }}>{user.role} {user.universityName && `(${user.universityName})`}</span>
                      </td>
                      <td style={{ padding: '14px 12px', color: 'var(--success)', fontWeight: 600 }}>{user.status}</td>
                      <td style={{ padding: '14px 12px' }}>
                        <button 
                          className="btn-premium-outline"
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          disabled={user.email === 'operator@sapiomatch.ai' || user.email === currentUser?.email}
                          style={{ padding: '4px 8px', fontSize: '11px', borderColor: 'rgba(239, 68, 68, 0.2)', color: '#f87171' }}
                        >
                          <Trash size={12} />
                          Delete User
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Add User profile Form */}
          {activeTab === 'adduser' && (
            <form onSubmit={handleAddStandardUser} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '450px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>User Name</label>
                <input 
                  type="text" 
                  className="custom-input"
                  placeholder="Enter full name"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>Email Address</label>
                <input 
                  type="email" 
                  className="custom-input"
                  placeholder="enter email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>Password</label>
                <input 
                  type="password" 
                  className="custom-input"
                  placeholder="password"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>Role Type</label>
                <select 
                  className="custom-select"
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                >
                  <option value="Student">Student Candidate</option>
                  <option value="Admin">System Admin Operator</option>
                </select>
              </div>

              <button type="submit" className="btn-premium" style={{ width: 'fit-content', marginTop: '10px' }}>
                <UserPlus size={16} />
                Create New User
              </button>
            </form>
          )}

        </div>
      </div>

    </div>
  );
}
