import React from 'react';

const LoadingScreen = () => {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'var(--bg-primary)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      gap: '20px'
    }}>
      {/* Logo */}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '2rem',
        fontWeight: 700,
        background: 'linear-gradient(135deg, var(--gold-light), var(--gold), var(--gold-dark))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        letterSpacing: '0.1em',
        animation: 'pulse 1.5s ease infinite'
      }}>
        SMART ART
      </div>

      {/* Laser scan line */}
      <div style={{
        width: '200px',
        height: '3px',
        background: 'var(--bg-secondary)',
        borderRadius: '2px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '60%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
          animation: 'laserScan 1.2s ease infinite'
        }} />
      </div>

      <div style={{
        fontFamily: 'var(--font-heading)',
        fontSize: '0.75rem',
        letterSpacing: '0.3em',
        color: 'var(--text-muted)',
        textTransform: 'uppercase'
      }}>
        Loading...
      </div>
    </div>
  );
};

export default LoadingScreen;
