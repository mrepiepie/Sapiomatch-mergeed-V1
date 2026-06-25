"use client";

import React, { useState } from 'react';
import { PenLine, Sparkles, Copy, Save, Check, Wand2, ArrowRight } from 'lucide-react';

const TONES = [
  { key: 'Professional', desc: 'Polished and workplace-ready' },
  { key: 'Academic', desc: 'Formal, structured, citation-friendly' },
  { key: 'Concise', desc: 'Tight and to the point' },
  { key: 'Engaging', desc: 'Warm and persuasive' }
];

export default function WritingEnhancer({ setView }) {
  const [input, setInput] = useState('');
  const [tone, setTone] = useState('Professional');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const enhance = () => {
    const text = input.trim();
    if (!text) return;
    setLoading(true);
    setOutput('');
    setCopied(false);
    setSaved(false);
    // Simulated AI refinement (no external call) — mirrors the prototype's behaviour.
    setTimeout(() => {
      const cleaned = text.replace(/\s+/g, ' ').trim();
      const opener = {
        Professional: 'Here is a polished, professional version of your text:',
        Academic: 'Here is a more formal, academically-structured rewrite:',
        Concise: 'Here is a tighter, more concise version:',
        Engaging: 'Here is a warmer, more engaging rewrite:'
      }[tone];
      const refined =
        `${opener}\n\n` +
        cleaned.charAt(0).toUpperCase() + cleaned.slice(1) +
        (/[.!?]$/.test(cleaned) ? '' : '.') +
        `\n\n— Refined by SapioMatch Writer (${tone} tone). Review and adjust before submitting.`;
      setOutput(refined);
      setLoading(false);
    }, 1200);
  };

  const copyOutput = () => {
    if (!output) return;
    if (navigator.clipboard) navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const saveDraft = () => {
    if (!output) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const panelStyle = {
    background: 'var(--card-bg)',
    border: '1px solid var(--card-border)',
    borderRadius: '14px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  };

  return (
    <div className="page-fade-enter" style={{ minHeight: '100vh', paddingBottom: '60px' }}>

      {/* Hero */}
      <section style={{
        position: 'relative',
        padding: '100px 24px 50px 24px',
        textAlign: 'center',
        borderBottom: '1px solid var(--card-border)',
        background: 'linear-gradient(180deg, rgba(43, 92, 70, 0.05) 0%, transparent 100%)'
      }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 14px', borderRadius: '999px', marginBottom: '20px',
            background: 'rgba(43, 92, 70, 0.08)', border: '1px solid rgba(43, 92, 70, 0.2)',
            color: 'var(--primary)', fontSize: '13px', fontWeight: 600
          }}>
            <PenLine size={14} /> SapioMatch Writer
          </div>
          <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.2rem)', fontFamily: 'var(--font-display)', lineHeight: 1.15, marginBottom: '16px' }}>
            Sharpen your <span className="gradient-text">applications &amp; essays</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '17px', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto' }}>
            Paste a rough draft, statement of purpose, or cover letter and get a cleaner, better-structured version in the tone you choose.
          </p>
        </div>
      </section>

      {/* Two-panel editor */}
      <section style={{ padding: '40px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>

          {/* Input panel */}
          <div style={panelStyle}>
            <h3 style={{ fontSize: '17px', fontFamily: 'var(--font-display)', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PenLine size={18} style={{ color: 'var(--primary)' }} /> Your draft
            </h3>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your rough draft, prompt, or essay here..."
              rows={9}
              style={{
                width: '100%', resize: 'vertical', padding: '14px',
                background: 'rgba(255,255,255,0.03)', border: '1px solid var(--card-border)',
                borderRadius: '10px', color: 'white', fontSize: '14.5px', lineHeight: 1.6, fontFamily: 'inherit'
              }}
            />
            <div>
              <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '10px' }}>Choose a tone</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {TONES.map((t) => {
                  const active = tone === t.key;
                  return (
                    <button
                      key={t.key}
                      onClick={() => setTone(t.key)}
                      title={t.desc}
                      style={{
                        padding: '8px 14px', borderRadius: '999px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                        border: `1px solid ${active ? 'var(--primary)' : 'var(--card-border)'}`,
                        background: active ? 'rgba(43, 92, 70, 0.15)' : 'transparent',
                        color: active ? 'white' : 'var(--text-muted)',
                        transition: 'all 0.2s'
                      }}
                    >
                      {t.key}
                    </button>
                  );
                })}
              </div>
            </div>
            <button className="btn-premium" onClick={enhance} disabled={loading || !input.trim()} style={{ padding: '12px', fontSize: '14px', justifyContent: 'center', opacity: (loading || !input.trim()) ? 0.6 : 1 }}>
              {loading ? 'Refining…' : (<><Wand2 size={16} /> Enhance Writing</>)}
            </button>
          </div>

          {/* Output panel */}
          <div style={panelStyle}>
            <h3 style={{ fontSize: '17px', fontFamily: 'var(--font-display)', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} style={{ color: 'var(--secondary)' }} /> Enhanced version
            </h3>
            <div style={{
              flexGrow: 1, minHeight: '230px', padding: '16px',
              background: 'rgba(255,255,255,0.02)', border: '1px solid var(--card-border)', borderRadius: '10px',
              color: output ? 'white' : 'var(--text-muted)', fontSize: '14.5px', lineHeight: 1.65, whiteSpace: 'pre-wrap'
            }}>
              {loading
                ? 'AI is refining your content…'
                : (output || 'Your polished content will appear here.')}
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button className="btn-premium-outline" onClick={copyOutput} disabled={!output} style={{ padding: '10px 16px', fontSize: '13px', opacity: output ? 1 : 0.5 }}>
                {copied ? (<><Check size={15} /> Copied</>) : (<><Copy size={15} /> Copy Text</>)}
              </button>
              <button className="btn-premium-outline" onClick={saveDraft} disabled={!output} style={{ padding: '10px 16px', fontSize: '13px', opacity: output ? 1 : 0.5 }}>
                {saved ? (<><Check size={15} /> Saved</>) : (<><Save size={15} /> Save Draft</>)}
              </button>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ maxWidth: '1100px', margin: '32px auto 0 auto', textAlign: 'center' }}>
          <button className="btn-premium" onClick={() => setView('questionnaire')} style={{ padding: '12px 26px', fontSize: '14px' }}>
            Find courses that fit your profile <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
}
