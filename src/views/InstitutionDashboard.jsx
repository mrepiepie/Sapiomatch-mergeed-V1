import React, { useState } from 'react';
import { Landmark, Users, TrendingUp, BarChart2, ShieldCheck, DollarSign, Plus, Eye, Send, Calendar, CheckCircle, Clock, X, ArrowRight, Check } from 'lucide-react';
export default function InstitutionDashboard({ currentUser, alert, appliedCourses = [], onRefreshApplications }) {
  const [credits, setCredits] = useState(1240);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedAppForReply, setSelectedAppForReply] = useState(null);
  const [responseTemplate, setResponseTemplate] = useState('custom');
  const [replyForm, setReplyForm] = useState({
    replyText: '',
    meetingLink: '',
    meetingDate: ''
  });

  const handleTopup = (amount) => {
    setCredits(prev => prev + amount);
    alert(`Success! Credited AED ${amount} to your lead generation balance.`);
  };

  const handleTemplateChange = (val, applicant) => {
    setResponseTemplate(val);
    if (!applicant) return;

    let draftText = '';
    let draftLink = '';
    let draftDate = replyForm.meetingDate || 'June 18, 3:00 PM GST';

    if (val === 'confirm') {
      draftText = `Hello ${applicant.studentName},\n\nWe have reviewed your application for the ${applicant.courseName} program. We are pleased to confirm your counseling session. Details of the video meeting invite are attached below.`;
      draftLink = 'https://zoom.us/j/9991112222';
    } else if (val === 'cancel') {
      draftText = `Hello ${applicant.studentName},\n\nYour requested counselor meeting for ${applicant.courseName} has been cancelled / needs to be rescheduled. Please check your dashboard for updates.`;
      draftLink = '';
    } else if (val === 'accept') {
      draftText = `Dear ${applicant.studentName},\n\nCongratulations! We are delighted to inform you that your application for ${applicant.courseName} has been officially Accepted by our admissions board. Welcome to our global partner cohort!`;
      draftLink = '';
    } else {
      draftText = '';
      draftLink = '';
    }

    setReplyForm({
      replyText: draftText,
      meetingLink: draftLink,
      meetingDate: draftDate
    });
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!selectedAppForReply) return;

    try {
      const fetchUrl = `/api/applications/${selectedAppForReply.id}/reply`;
      const response = await fetch(fetchUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          replyText: replyForm.replyText,
          meetingLink: replyForm.meetingLink,
          meetingDate: replyForm.meetingDate,
          status: responseTemplate === 'accept' ? 'Accepted' : (responseTemplate === 'cancel' ? 'Cancelled' : 'Contacted')
        })
      });

      if (response.ok) {
        alert(`Reply sent successfully to ${selectedAppForReply.studentName}!`);
        
        // Dispatch simulated Gmail alert event
        window.dispatchEvent(new CustomEvent('sapio_gmail_alert', {
          detail: {
            to: selectedAppForReply.studentEmail,
            subject: `New Response: ${selectedAppForReply.courseName} - ${selectedAppForReply.universityName}`,
            body: `Dear ${selectedAppForReply.studentName},\n\nWe have updated your application status.\n\nMessage:\n"${replyForm.replyText}"\n\nScheduled Date: ${replyForm.meetingDate || 'N/A'}\nVideo Link: ${replyForm.meetingLink || 'N/A'}\n\nPlease check your student dashboard for full details.\n\nWarm regards,\nAdmissions Representative\n${selectedAppForReply.universityName}`
          }
        }));

        setSelectedAppForReply(null);
        setReplyForm({ replyText: '', meetingLink: '', meetingDate: '' });
        if (onRefreshApplications) {
          onRefreshApplications();
        }
      } else {
        alert("Failed to submit reply to database.");
      }
    } catch (err) {
      console.error("Error replying to application:", err);
      alert("Database error: Could not schedule meeting.");
    }
  };

  const handleQuickApprove = async (lead) => {
    let defaultMeetingLink = 'https://zoom.us/j/9991112222';
    let defaultMeetingDate = 'Tomorrow, 3:00 PM GST';
    
    if (lead.counselorPreference === '15-Min Live Chat') {
      defaultMeetingLink = 'https://sapiomatch.ai/chat/live';
      defaultMeetingDate = lead.chatSlot || 'Today, 2:15 PM - 2:30 PM';
    } else if (lead.counselorPreference === 'No Counselor') {
      defaultMeetingLink = '';
      defaultMeetingDate = 'N/A';
    }

    try {
      const fetchUrl = `/api/applications/${lead.id}/reply`;
      const response = await fetch(fetchUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          replyText: `Congratulations! Your application for "${lead.courseName}" has been Approved. Counselor preference: "${lead.counselorPreference}".`,
          meetingLink: defaultMeetingLink,
          meetingDate: defaultMeetingDate,
          status: 'Accepted'
        })
      });

      if (response.ok) {
        alert(`Application Approved! Email invitation sent to ${lead.studentEmail}.`);
        
        // Dispatch simulated Gmail alert event
        window.dispatchEvent(new CustomEvent('sapio_gmail_alert', {
          detail: {
            to: lead.studentEmail,
            subject: `[SapioMatch] Application Approved - ${lead.universityName}`,
            body: `Dear ${lead.studentName},\n\nWe are pleased to inform you that your application for "${lead.courseName}" at ${lead.universityName} has been APPROVED!\n\nCounselor Preference: ${lead.counselorPreference}\nMeeting Date/Time: ${defaultMeetingDate}\nVideo Link: ${defaultMeetingLink || 'N/A'}\n\nWe look forward to meeting you.\n\nWarm regards,\nAdmissions Representative\n${lead.universityName}`
          }
        }));

        if (onRefreshApplications) {
          onRefreshApplications();
        }
      } else {
        alert("Failed to update status.");
      }
    } catch (err) {
      console.error("Error approving application:", err);
      alert("Database error.");
    }
  };

  const handleQuickCancel = async (lead) => {
    try {
      const fetchUrl = `/api/applications/${lead.id}/reply`;
      const response = await fetch(fetchUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          replyText: `We regret to inform you that your application for "${lead.courseName}" has been Cancelled / Rejected.`,
          meetingLink: '',
          meetingDate: '',
          status: 'Cancelled'
        })
      });

      if (response.ok) {
        alert(`Application Cancelled. Notification sent to ${lead.studentName}.`);

        // Dispatch simulated Gmail alert event
        window.dispatchEvent(new CustomEvent('sapio_gmail_alert', {
          detail: {
            to: lead.studentEmail,
            subject: `[SapioMatch] Application Update - ${lead.universityName}`,
            body: `Dear ${lead.studentName},\n\nWe regret to inform you that your application for "${lead.courseName}" at ${lead.universityName} has been Cancelled.\n\nPlease check your student dashboard for feedback or to submit a new inquiry.\n\nWarm regards,\nAdmissions Representative\n${lead.universityName}`
          }
        }));

        if (onRefreshApplications) {
          onRefreshApplications();
        }
      } else {
        alert("Failed to cancel application.");
      }
    } catch (err) {
      console.error("Error cancelling application:", err);
      alert("Database error.");
    }
  };

  const universityName = currentUser?.universityName || "Partner Institution";

  // Strict filtration by current representative's university
  const universityLeads = appliedCourses.filter(lead => 
    lead.universityName?.toLowerCase() === universityName?.toLowerCase()
  );

  // Split into Pending and Approved sections (exclude Cancelled completely from both)
  const pendingLeads = universityLeads.filter(lead => 
    lead.status !== 'Accepted' && lead.status !== 'Approved' && lead.status !== 'Cancelled'
  );

  const approvedLeads = universityLeads.filter(lead => 
    lead.status === 'Accepted' || lead.status === 'Approved'
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
      
      {/* Header Panel */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
            {universityName} <span className="gradient-text">Partner Panel</span>
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Monitor matches, capture leads, respond to counselor queries, and send interview links in real time.
          </p>
        </div>
        
        {/* Credits Wallet */}
        <div className="glass-card flex-row-center" style={{ gap: '16px', padding: '12px 24px', border: '1px solid var(--secondary)' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Available Lead Balance</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--secondary)', marginTop: '2px' }}>{credits} Credits</div>
          </div>
          <button 
            className="btn-premium" 
            onClick={() => handleTopup(500)}
            style={{ padding: '6px 12px', fontSize: '12px', gap: '4px' }}
          >
            <Plus size={14} />
            Top Up
          </button>
        </div>
      </div>

      {/* Grid Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Incoming Applicants</span>
            <Users size={20} style={{ color: 'var(--primary)' }} />
          </div>
          <h2 style={{ fontSize: '28px', color: 'white' }}>{universityLeads.length}</h2>
          <span style={{ fontSize: '11px', color: 'var(--success)' }}>Active requests to review</span>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Leads Captured</span>
            <TrendingUp size={20} style={{ color: 'var(--secondary)' }} />
          </div>
          <h2 style={{ fontSize: '28px', color: 'white' }}>{universityLeads.length + 3}</h2>
          <span style={{ fontSize: '11px', color: 'var(--success)' }}>CPC avg: AED 12.50</span>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Ad Campaign Spend</span>
            <DollarSign size={20} style={{ color: 'var(--accent)' }} />
          </div>
          <h2 style={{ fontSize: '28px', color: 'white' }}>AED 120.00</h2>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Lead conversion: 22.4%</span>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Verification Status</span>
            <ShieldCheck size={20} style={{ color: 'var(--success)' }} />
          </div>
          <h2 style={{ fontSize: '24px', color: '#34d399' }}>KYC Approved</h2>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Official Portal verified</span>
        </div>
      </div>

      {/* Main Table */}
      <div className="glass-card" style={{ padding: '0', overflow: 'hidden', marginBottom: '32px' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--card-border)', background: 'rgba(255, 255, 255, 0.01)' }}>
          <button 
            onClick={() => setActiveTab('pending')}
            style={{ 
              padding: '16px 24px', 
              fontSize: '14px', 
              fontWeight: 600, 
              cursor: 'pointer',
              color: activeTab === 'pending' ? 'var(--secondary)' : 'var(--text-muted)',
              borderBottom: activeTab === 'pending' ? '2px solid var(--secondary)' : 'none',
              background: activeTab === 'pending' ? 'rgba(180, 83, 9, 0.02)' : 'transparent'
            }}
          >
            Pending Requests ({pendingLeads.length})
          </button>
          <button 
            onClick={() => setActiveTab('approved')}
            style={{ 
              padding: '16px 24px', 
              fontSize: '14px', 
              fontWeight: 600, 
              cursor: 'pointer',
              color: activeTab === 'approved' ? 'var(--secondary)' : 'var(--text-muted)',
              borderBottom: activeTab === 'approved' ? '2px solid var(--secondary)' : 'none',
              background: activeTab === 'approved' ? 'rgba(16, 185, 129, 0.02)' : 'transparent'
            }}
          >
            Approved & Scheduled ({approvedLeads.length})
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          {activeTab === 'pending' && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--card-border)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px' }}>Candidate Name</th>
                    <th style={{ padding: '12px' }}>Contact details</th>
                    <th style={{ padding: '12px' }}>Target Course</th>
                    <th style={{ padding: '12px' }}>CGPA</th>
                    <th style={{ padding: '12px' }}>Statement of Purpose (SOP)</th>
                    <th style={{ padding: '12px' }}>Counselor Preference</th>
                    <th style={{ padding: '12px' }}>Application Status</th>
                    <th style={{ padding: '12px' }}>Quick Decision</th>
                    <th style={{ padding: '12px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingLeads.length > 0 ? (
                    pendingLeads.map((lead, idx) => (
                      <tr key={idx} style={{ borderBottom: idx < pendingLeads.length - 1 ? '1px solid var(--card-border)' : 'none' }}>
                        <td style={{ padding: '16px 12px', fontWeight: 600, color: 'white' }}>{lead.studentName}</td>
                        <td style={{ padding: '16px 12px' }}>
                          <div style={{ fontSize: '12px', color: 'white' }}>{lead.studentEmail}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{lead.studentContact}</div>
                        </td>
                        <td style={{ padding: '16px 12px' }}>{lead.courseName}</td>
                        <td style={{ padding: '16px 12px', fontWeight: 700, color: 'var(--primary)' }}>{lead.cgpa}</td>
                        <td style={{ padding: '16px 12px', maxWidth: '240px', fontSize: '12px', color: '#e5e7eb', lineHeight: '1.45' }}>
                          <div style={{ 
                            maxHeight: '60px', 
                            overflowY: 'auto',
                            paddingRight: '4px' 
                          }} title={lead.sop}>
                            {lead.sop || <span style={{ color: 'var(--text-muted)' }}>No SOP provided</span>}
                          </div>
                        </td>
                        <td style={{ padding: '16px 12px' }}>
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: lead.counselorPreference === 'Video Meeting' 
                              ? 'rgba(59, 130, 246, 0.15)' 
                              : (lead.counselorPreference === '15-Min Live Chat' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.05)'),
                            color: lead.counselorPreference === 'Video Meeting' 
                              ? '#60a5fa' 
                              : (lead.counselorPreference === '15-Min Live Chat' ? '#34d399' : 'var(--text-muted)'),
                            fontWeight: 700,
                            fontSize: '11px'
                          }}>
                            {lead.counselorPreference}
                            {lead.counselorPreference === '15-Min Live Chat' && lead.chatSlot && ` (${lead.chatSlot})`}
                          </span>
                        </td>
                        <td style={{ padding: '16px 12px' }}>
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: 'rgba(245, 158, 11, 0.1)',
                            color: '#f59e0b',
                            fontSize: '12px',
                            fontWeight: 600
                          }}>
                            {lead.status}
                          </span>
                        </td>
                        <td style={{ padding: '16px 12px' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                              className="btn-approve-quick"
                              onClick={() => handleQuickApprove(lead)}
                              title="Approve & Schedule Default counselor meeting"
                            >
                              <Check size={12} />
                              Approve
                            </button>
                            <button 
                              className="btn-cancel-quick"
                              onClick={() => handleQuickCancel(lead)}
                              title="Cancel Counselor request"
                            >
                              <X size={12} />
                              Cancel
                            </button>
                          </div>
                        </td>
                        <td style={{ padding: '16px 12px' }}>
                          <button 
                            className="btn-premium" 
                            onClick={() => setSelectedAppForReply(lead)}
                            style={{ padding: '6px 12px', fontSize: '11px', gap: '4px' }}
                          >
                            <Send size={11} />
                            Reply & Action
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                        No pending requests for {universityName}.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'approved' && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--card-border)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px' }}>Candidate Name</th>
                    <th style={{ padding: '12px' }}>Contact details</th>
                    <th style={{ padding: '12px' }}>Target Course</th>
                    <th style={{ padding: '12px' }}>CGPA</th>
                    <th style={{ padding: '12px' }}>Statement of Purpose (SOP)</th>
                    <th style={{ padding: '12px' }}>Counselor Preference</th>
                    <th style={{ padding: '12px' }}>Scheduled Date/Time</th>
                    <th style={{ padding: '12px' }}>Meeting Video Link</th>
                    <th style={{ padding: '12px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {approvedLeads.length > 0 ? (
                    approvedLeads.map((lead, idx) => (
                      <tr 
                        key={idx} 
                        style={{ 
                          borderBottom: idx < approvedLeads.length - 1 ? '1px solid var(--card-border)' : 'none',
                          background: 'rgba(16, 185, 129, 0.06)',
                          borderLeft: '4px solid #10b981'
                        }}
                      >
                        <td style={{ padding: '16px 12px', fontWeight: 600, color: 'white' }}>{lead.studentName}</td>
                        <td style={{ padding: '16px 12px' }}>
                          <div style={{ fontSize: '12px', color: 'white' }}>{lead.studentEmail}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{lead.studentContact}</div>
                        </td>
                        <td style={{ padding: '16px 12px' }}>{lead.courseName}</td>
                        <td style={{ padding: '16px 12px', fontWeight: 700, color: 'var(--primary)' }}>{lead.cgpa}</td>
                        <td style={{ padding: '16px 12px', maxWidth: '200px', fontSize: '12px', color: '#e5e7eb', lineHeight: '1.45' }}>
                          <div style={{ 
                            maxHeight: '60px', 
                            overflowY: 'auto',
                            paddingRight: '4px' 
                          }} title={lead.sop}>
                            {lead.sop || <span style={{ color: 'var(--text-muted)' }}>No SOP provided</span>}
                          </div>
                        </td>
                        <td style={{ padding: '16px 12px' }}>
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: lead.counselorPreference === 'Video Meeting' 
                              ? 'rgba(59, 130, 246, 0.15)' 
                              : (lead.counselorPreference === '15-Min Live Chat' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.05)'),
                            color: lead.counselorPreference === 'Video Meeting' 
                              ? '#60a5fa' 
                              : (lead.counselorPreference === '15-Min Live Chat' ? '#34d399' : 'var(--text-muted)'),
                            fontWeight: 700,
                            fontSize: '11px'
                          }}>
                            {lead.counselorPreference}
                            {lead.counselorPreference === '15-Min Live Chat' && lead.chatSlot && ` (${lead.chatSlot})`}
                          </span>
                        </td>
                        <td style={{ padding: '16px 12px', fontWeight: 600, color: 'white' }}>
                          {lead.meetingDate || 'N/A (Auto Scheduled)'}
                        </td>
                        <td style={{ padding: '16px 12px' }}>
                          {lead.meetingLink ? (
                            <a 
                              href={lead.meetingLink} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="btn-premium"
                              style={{ padding: '4px 8px', fontSize: '10.5px', gap: '3px' }}
                            >
                              <Calendar size={10} />
                              Join Meeting
                            </a>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '11.5px' }}>No video link</span>
                          )}
                        </td>
                        <td style={{ padding: '16px 12px' }}>
                          <button 
                            className="btn-premium-outline" 
                            onClick={() => setSelectedAppForReply(lead)}
                            style={{ padding: '6px 12px', fontSize: '11px', gap: '4px' }}
                          >
                            <Send size={11} />
                            Reschedule
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                        No approved candidate applications for {universityName}.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Reply & Schedule Panel Overlay modal */}
      {selectedAppForReply && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(5, 8, 16, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100000
        }}>
          <div className="glass-card" style={{ width: '90%', maxWidth: '500px', padding: '32px', border: '1px solid var(--card-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--secondary)', fontWeight: 700 }}>Send Response</span>
                <h3 style={{ fontSize: '18px', color: 'white', fontWeight: 700, marginTop: '2px' }}>Reply to {selectedAppForReply.studentName}</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Program: {selectedAppForReply.courseName}</p>
              </div>
              <button 
                onClick={() => setSelectedAppForReply(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleReplySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Candidate Info Box */}
              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--card-border)', borderRadius: '6px', fontSize: '12px' }}>
                <div><strong>Prior CGPA:</strong> {selectedAppForReply.cgpa}</div>
                <div style={{ marginTop: '4px' }}><strong>SOP:</strong> "{selectedAppForReply.sop}"</div>
                <div style={{ marginTop: '4px' }}><strong>Counsellor Preference:</strong> {selectedAppForReply.counselorPreference}</div>
              </div>
              {/* Draft Email Template */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>Select Email Draft Template</label>
                <select 
                  className="custom-select"
                  value={responseTemplate}
                  onChange={(e) => handleTemplateChange(e.target.value, selectedAppForReply)}
                  style={{ padding: '8px 12px', fontSize: '12.5px' }}
                >
                  <option value="custom">-- Custom Message (Blank Draft) --</option>
                  <option value="confirm">Confirm Meeting / Schedule Interview</option>
                  <option value="cancel">Cancel Request / Request Reschedule</option>
                  <option value="accept">Accept Candidate Application</option>
                </select>
              </div>

              {/* Message to Student */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>Reply Message</label>
                <textarea 
                  className="custom-input"
                  rows="3"
                  placeholder="e.g. We have reviewed your application and would love to schedule a session to guide you through visa eligibility..."
                  value={replyForm.replyText}
                  onChange={(e) => setReplyForm(prev => ({ ...prev, replyText: e.target.value }))}
                  required
                />
              </div>

              {/* Scheduled Date/Time */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  {selectedAppForReply.counselorPreference === '15-Min Live Chat' ? 'Confirm Chat Timings' : 'Meeting Date & Time'}
                </label>
                <input 
                  type="text" 
                  className="custom-input"
                  placeholder="e.g. June 15, 3:00 PM GST"
                  value={replyForm.meetingDate}
                  onChange={(e) => setReplyForm(prev => ({ ...prev, meetingDate: e.target.value }))}
                  required
                />
              </div>

              {/* Meeting Link */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Meeting Video Link (Zoom/Teams)
                </label>
                <input 
                  type="url" 
                  className="custom-input"
                  placeholder="https://zoom.us/j/..."
                  value={replyForm.meetingLink}
                  onChange={(e) => setReplyForm(prev => ({ ...prev, meetingLink: e.target.value }))}
                  required={selectedAppForReply.counselorPreference !== 'No Counselor'}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid var(--card-border)', paddingTop: '16px' }}>
                <button 
                  type="button" 
                  className="btn-premium-outline"
                  onClick={() => setSelectedAppForReply(null)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-premium"
                >
                  Send Reply & Email
                  <ArrowRight size={14} />
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
