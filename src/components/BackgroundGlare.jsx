import React, { useEffect, useState } from 'react';

export default function BackgroundGlare() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 0,
      pointerEvents: 'none',
      overflow: 'hidden'
    }} aria-hidden="true">
      {/* Main Top Glow - Parallax Downwards */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        left: '50%',
        width: '1000px',
        height: '600px',
        background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(0, 229, 201, 0.09) 0%, rgba(52, 211, 153, 0.03) 50%, transparent 100%)',
        filter: 'blur(90px)',
        transform: `translate3d(-50%, ${scrollY * 0.12}px, 0)`,
        pointerEvents: 'none',
        transition: 'transform 0.1s cubic-bezier(0.1, 0.8, 0.2, 1)'
      }} />
      
      {/* Floating Center-Right Orb - Parallax Upwards (creates opposing depth motion) */}
      <div style={{
        position: 'absolute',
        top: '45%',
        right: '8%',
        width: '450px',
        height: '450px',
        background: 'radial-gradient(circle, rgba(0, 229, 201, 0.04) 0%, transparent 70%)',
        filter: 'blur(70px)',
        transform: `translate3d(0, ${-scrollY * 0.08}px, 0)`,
        pointerEvents: 'none',
        transition: 'transform 0.1s cubic-bezier(0.1, 0.8, 0.2, 1)'
      }} />

      {/* Bottom Glow - Parallax Downwards (slower rate) */}
      <div style={{
        position: 'absolute',
        bottom: '-15%',
        left: '10%',
        width: '800px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(14, 165, 233, 0.03) 0%, transparent 75%)',
        filter: 'blur(100px)',
        transform: `translate3d(0, ${scrollY * 0.05}px, 0)`,
        pointerEvents: 'none',
        transition: 'transform 0.1s cubic-bezier(0.1, 0.8, 0.2, 1)'
      }} />
    </div>
  );
}
