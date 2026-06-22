import React, { useState } from 'react';
import { X, CreditCard, Calendar, Lock, CheckCircle2, Loader2 } from 'lucide-react';

export default function CheckoutModal({ isOpen, onClose, onSuccess, planPrice = "30 AED" }) {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  
  const [paymentState, setPaymentState] = useState('idle'); // 'idle', 'processing', 'success'
  const [statusText, setStatusText] = useState('Initiating payment gateway...');

  if (!isOpen) return null;

  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 16) val = val.substring(0, 16);
    // Format as 4-4-4-4
    let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 4) val = val.substring(0, 4);
    if (val.length > 2) {
      val = val.substring(0, 2) + '/' + val.substring(2);
    }
    setExpiry(val);
  };

  const handleCvvChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 3) val = val.substring(0, 3);
    setCvv(val);
  };

  const handlePay = (e) => {
    e.preventDefault();
    if (!cardNumber || !cardName || !expiry || !cvv) return;

    setPaymentState('processing');
    
    // Simulate secure network transaction stages
    setTimeout(() => {
      setStatusText("Connecting to secure bank gateway...");
    }, 800);

    setTimeout(() => {
      setStatusText("Verifying card holder credentials...");
    }, 1600);

    setTimeout(() => {
      setStatusText("Authorizing upgrade tokens...");
    }, 2400);

    setTimeout(() => {
      setPaymentState('success');
      setTimeout(() => {
        onSuccess();
        onClose();
        // Reset state
        setPaymentState('idle');
        setCardNumber('');
        setCardName('');
        setExpiry('');
        setCvv('');
      }, 1500);
    }, 3200);
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
              height: '170px',
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
                {/* Simulated Chip */}
                <div style={{
                  width: '38px',
                  height: '28px',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  borderRadius: '6px',
                  boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.4)'
                }} />
                {/* Logo */}
                <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--secondary)', letterSpacing: '0.1em' }}>
                  SAPIOPAY
                </span>
              </div>

              {/* Middle Row: Card Number */}
              <div style={{ 
                fontSize: '20px', 
                fontFamily: 'monospace', 
                letterSpacing: '0.15em', 
                color: 'white', 
                textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                margin: '12px 0'
              }}>
                {cardNumber || '•••• •••• •••• ••••'}
              </div>

              {/* Bottom Row: Name and Expiry */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                <div>
                  <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)', marginBottom: '2px' }}>CARDHOLDER</div>
                  <div style={{ letterSpacing: '0.05em' }}>{cardName || 'YOUR NAME'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)', marginBottom: '2px' }}>EXPIRES</div>
                  <div>{expiry || 'MM/YY'}</div>
                </div>
              </div>
            </div>

            {/* Payment Inputs Form */}
            <form onSubmit={handlePay} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Cardholder Full Name
                </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Sanji Al-Mansoori"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="custom-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Credit Card Number
                </label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text"
                    required
                    placeholder="4242 4242 4242 4242"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    className="custom-input"
                    style={{ paddingLeft: '40px' }}
                  />
                  <CreditCard size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Expiration Date
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="text"
                      required
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={handleExpiryChange}
                      className="custom-input"
                      style={{ paddingLeft: '40px' }}
                    />
                    <Calendar size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    CVV / Security Code
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="password"
                      required
                      placeholder="123"
                      value={cvv}
                      onChange={handleCvvChange}
                      className="custom-input"
                      style={{ paddingLeft: '40px' }}
                    />
                    <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '8px', fontSize: '11px', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '6px', border: '1px solid var(--card-border)' }}>
                <Lock size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <span>Simulated secure sandboxed checkout environment. No real funds will be charged.</span>
              </div>

              <button 
                type="submit" 
                className="btn-premium animate-pulse" 
                style={{ width: '100%', justifyContent: 'center', marginTop: '10px', padding: '14px 24px' }}
              >
                Pay {planPrice} & Upgrade Now
              </button>
            </form>
          </div>
        )}

        {paymentState === 'processing' && (
          <div style={{ padding: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <Loader2 size={48} className="animate-spin" style={{ color: 'var(--secondary)' }} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'white' }}>Processing Payment...</h3>
            <p style={{ color: 'var(--secondary)', fontSize: '14px', fontWeight: 500 }}>
              {statusText}
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px', maxWidth: '300px', lineHeight: '1.4' }}>
              Please do not refresh the page or click back. Establishing secure SSL handshake tunnel...
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
