export default function BackgroundGlare() {
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
      {/* Premium Minimalist Teal-Cyan Radial Ambient Glow */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '1000px',
        height: '600px',
        background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(0, 229, 201, 0.09) 0%, rgba(52, 211, 153, 0.03) 50%, transparent 100%)',
        filter: 'blur(80px)',
        pointerEvents: 'none'
      }} />
      
      {/* Muted Blue Support Radial Glow */}
      <div style={{
        position: 'absolute',
        bottom: '-15%',
        right: '10%',
        width: '800px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(14, 165, 233, 0.04) 0%, transparent 75%)',
        filter: 'blur(100px)',
        pointerEvents: 'none'
      }} />
    </div>
  );
}
