"use client";

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, PhoneCall, Check, Lock, ArrowRight } from 'lucide-react';

export default function LeadModal({ open, onClose, courseTitle }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', time: 'Morning (9am–12pm)' });
  const [submitted, setSubmitted] = useState(false);

  if (!open) return null;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const valid = form.name.trim() && form.email.trim();

  const submit = (e) => {
    e.preventDefault();
    if (!valid) return;
    setSubmitted(true);
  };

  const close = () => {
    setSubmitted(false);
    setForm({ name: '', email: '', phone: '', time: 'Morning (9am–12pm)' });
    onClose();
  };

  const inputStyle = {
    width: '100%', padding: '11px 14px',
    background: 'rgba(255,255,255,0.03)', border: '1px solid var(--card-border)',
    borderRadius: '8px', color: 'white', fontSize: '14px', fontFamily: 'inherit'
  };
  const labelStyle = { display: 'block', marginBottom: '6px', fontSize: '12.5px', fontWeight: 600, color: 'var(--text-muted)' };

  const modal = (
    <div
      onClick={close}
      style={{
        position: 'fixed', inset: 0, zIndex: 100000,
        background: 'rgba(4, 6, 15, 0.85)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
      }}
    >
      <div
        className="glass-card"
        onClick={(e) => e.stopPropagation()}
        style={{ width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto', padding: '28px', position: 'relative', border: '1px solid var(--secondary)' }}
      >
        <button onClick={close} style={{ position: 'absolute', top: '18px', right: '18px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <X size={22} />
        </button>

        {!submitted ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div className="icon-container" style={{ width: '40px', height: '40px', borderRadius: '9px', background: 'rgba(180, 83, 9, 0.12)', border: '1px solid rgba(180, 83, 9, 0.25)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Lock size={18} />
              </div>
              <h2 style={{ fontSize: '20px', fontFamily: 'var(--font-display)' }}>Unlock full details</h2>
            </div>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: '20px' }}>
              Get the full fee structure, scholarship eligibility, and a free 1:1 call with an advisor
              {courseTitle ? <> for <strong style={{ color: 'white' }}>{courseTitle}</strong></> : ''}. No charge — we&apos;ll reach out to you.
            </p>

            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={labelStyle}>Full name *</label>
                <input style={inputStyle} value={form.name} onChange={set('name')} placeholder="Your name" required />
              </div>
              <div>
                <label style={labelStyle}>Email *</label>
                <input type="email" style={inputStyle} value={form.email} onChange={set('email')} placeholder="you@email.com" required />
              </div>
              <div>
                <label style={labelStyle}>Phone (optional)</label>
                <input style={inputStyle} value={form.phone} onChange={set('phone')} placeholder="+971 ..." />
              </div>
              <div>
                <label style={labelStyle}>Preferred call time</label>
                <select style={inputStyle} value={form.time} onChange={set('time')}>
                  <option>Morning (9am–12pm)</option>
                  <option>Afternoon (12pm–4pm)</option>
                  <option>Evening (4pm–7pm)</option>
                </select>
              </div>
              <button type="submit" className="btn-premium" disabled={!valid} style={{ padding: '12px', fontSize: '14px', justifyContent: 'center', opacity: valid ? 1 : 0.6, marginTop: '4px' }}>
                <PhoneCall size={16} /> Request my free call
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 8px' }}>
            <div className="icon-container" style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(43, 92, 70, 0.15)', border: '1px solid rgba(43, 92, 70, 0.3)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px auto' }}>
              <Check size={28} />
            </div>
            <h2 style={{ fontSize: '21px', fontFamily: 'var(--font-display)', marginBottom: '10px' }}>Request received!</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '24px', maxWidth: '340px', margin: '0 auto 24px auto' }}>
              Thanks, {form.name.split(' ')[0] || 'there'} — a SapioMatch advisor will reach out within <strong style={{ color: 'white' }}>1 business day</strong> with your full match details{courseTitle ? <> for <strong style={{ color: 'white' }}>{courseTitle}</strong></> : ''}.
            </p>
            <button className="btn-premium" onClick={close} style={{ padding: '11px 26px', fontSize: '14px' }}>
              Done <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (typeof document !== 'undefined') ? createPortal(modal, document.body) : null;
}
