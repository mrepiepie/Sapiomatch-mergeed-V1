import React, { useState } from 'react';
import { X, CreditCard, Lock, CheckCircle2, Loader2, Mail } from 'lucide-react';

export default function CheckoutModal({ isOpen, onClose, onSuccess, planPrice = "30 AED", currentUser }) {
  const [emailInput, setEmailInput] = useState('');
  
  const [paymentState, setPaymentState] = useState('idle'); // 'idle', 'processing', 'success'
  const [statusText, setStatusText] = useState('Initiating payment gateway...');

  if (!isOpen) return null;

  const handlePay = async (e) => {
    e.preventDefault();
    const billingEmail = emailInput || currentUser?.email || 'guest@sapiomatch.ai';
    if (!billingEmail) {
      alert("Please provide an email address for billing.");
      return;
    }

    setPaymentState('processing');
    setStatusText('Initiating secure Stripe session...');

    try {
      const res = await fetch('/api/payments/checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: 'Premium Membership Upgrade',
          price: 30,
          credits: 700,
          userEmail: billingEmail
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          setPaymentState('idle');
          alert("Stripe portal URL not returned.");
        }
      } else {
        setPaymentState('idle');
        alert("Failed to create Stripe checkout session.");
      }
    } catch (err) {
      console.error("Stripe redirect error:", err);
      setPaymentState('idle');
      alert("Failed to connect to checkout services.");
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(9, 6, 16, 0.85)',
      backdropFilter: 'blur(12px)',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      {/* Glow Backdrops */}
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(251, 146, 60, 0.08) 0%, transparent 70%)',
        filter: 'blur(40px)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div className="glass-card" style={{
        maxWidth: '460px',
        width: '100%',
        padding: '32px',
        position: 'relative',
        zIndex: 1,
        border: '1px solid var(--secondary)',
        background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.02) 0%, rgba(17, 24, 39, 0.95) 100%)',
        textAlign: 'center',
        boxShadow: '0 0 30px rgba(251, 146, 60, 0.15)'
      }}>
        {/* Close Button */}
        {paymentState === 'idle' && (
          <button 
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        )}

        {paymentState === 'idle' && (
          <div>
            <h2 style={{ fontSize: '22px', fontFamily: 'var(--font-display)', color: 'white', marginBottom: '6px' }}>
              Academic Upgrade Checkout
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', marginBottom: '24px' }}>
              Unlock the **Holographic Gold Passport** and **700 extra advisor credits**.
            </p>

            {/* Simulated Live Credit Card Graphic */}
            <div style={{
              width: '100%',
              height: '150px',
              background: 'linear-gradient(135deg, #1f2937 0%, #111827 50%, #030712 100%)',
              borderRadius: '12px',
              border: '1px solid rgba(251, 146, 60, 0.25)',
              padding: '20px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              marginBottom: '28px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Card Hologram Glow overlay */}
              <div style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '180px',
                height: '180px',
                background: 'radial-gradient(circle, rgba(251, 146, 60, 0.08) 0%, transparent 75%)',
                pointerEvents: 'none'
              }} />

              {/* Top Row: Chip and Logo */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{
                  width: '38px',
                  height: '28px',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  borderRadius: '6px',
                  boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.4)'
                }} />
                <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--secondary)', letterSpacing: '0.1em' }}>
                  SAPIOPAY
                </span>
              </div>

              {/* Bottom Row: Name and Expiry */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                <div>
                  <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)', marginBottom: '2px' }}>UPGRADE TYPE</div>
                  <div style={{ letterSpacing: '0.05em' }}>PREMIUM PASSPORT</div>
                </div>
                <div>
                  <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)', marginBottom: '2px' }}>PRICE</div>
                  <div style={{ color: 'var(--secondary)' }}>{planPrice}</div>
                </div>
              </div>
            </div>

            {/* Payment Inputs Form */}
            <form onSubmit={handlePay} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Billing Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="email"
                    required
                    placeholder={currentUser?.email || "e.g. name@example.com"}
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="custom-input"
                    style={{ paddingLeft: '40px' }}
                  />
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px', fontSize: '11px', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '6px', border: '1px solid var(--card-border)' }}>
                <Lock size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <span>Redirects to Stripe Checkout. PCI-compliant and fully secure.</span>
              </div>

              <button 
                type="submit" 
                className="btn-premium animate-pulse" 
                style={{ width: '100%', justifyContent: 'center', marginTop: '10px', padding: '14px 24px' }}
              >
                Proceed to Stripe Payment ({planPrice})
              </button>
            </form>
          </div>
        )}

        {paymentState === 'processing' && (
          <div style={{ padding: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <Loader2 size={48} className="animate-spin" style={{ color: 'var(--secondary)' }} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'white' }}>Processing Checkout...</h3>
            <p style={{ color: 'var(--secondary)', fontSize: '14px', fontWeight: 500 }}>
              {statusText}
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px', maxWidth: '300px', lineHeight: '1.4' }}>
              Please do not refresh the page or click back. Redirecting to billing portal...
            </p>
          </div>
        )}

        {paymentState === 'success' && (
          <div style={{ padding: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', animation: 'scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '2px solid var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)'
            }}>
              <CheckCircle2 size={44} style={{ color: 'var(--primary)' }} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'white' }}>Upgrade Completed!</h3>
            <p style={{ color: 'var(--primary)', fontSize: '14px', fontWeight: 600 }}>
              Transaction Approved successfully.
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px', maxWidth: '300px', lineHeight: '1.4' }}>
              Your academic passport has been upgraded. 700 advisor credits have been deposited to your account balance.
            </p>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scaleUp {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}} />
    </div>
  );
}
