import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/admin');
    document.title = 'Admin Login | Smart Art';
  }, [isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) { setError('Please fill all fields'); return; }
    setLoading(true); setError('');
    try {
      await login(form);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(245,166,35,0.07) 0%, transparent 60%), var(--bg-primary)',
      padding: '24px',
    }}>
      {/* Animated bg */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,166,35,0.05), transparent 70%)', top: -200, left: -150, animation: 'float 8s ease infinite' }} />
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,214,160,0.04), transparent 70%)', bottom: 0, right: -100, animation: 'float 6s ease infinite', animationDelay: '-3s' }} />
      </div>

      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1, animation: 'fadeInUp 0.5s ease forwards' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 72, height: 72, borderRadius: 18, background: 'rgba(245,166,35,0.1)', border: '1px solid var(--border-gold)', marginBottom: 16 }}>
            <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
              <polygon points="16,2 30,10 30,22 16,30 2,22 2,10" stroke="var(--gold)" strokeWidth="1.5" fill="none"/>
              <path d="M10 14 L16 10 L22 14" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M10 18 L16 22 L22 18" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="16" y1="10" x2="16" y2="22" stroke="var(--gold)" strokeWidth="1.5"/>
            </svg>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, background: 'linear-gradient(135deg, var(--gold-light), var(--gold))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: '0.1em', marginBottom: 6 }}>
            SMART ART
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'var(--font-heading)' }}>
            Admin Panel
          </p>
        </div>

        {/* Card */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '40px 36px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }} />

          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Welcome back</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 28 }}>Sign in to manage your Smart Art website.</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Username or Email</label>
              <input
                className="form-input"
                type="text"
                placeholder="admin"
                value={form.username}
                onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                autoComplete="username"
                autoFocus
              />
            </div>

            <div className="form-group" style={{ marginBottom: 28, position: 'relative' }}>
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                autoComplete="current-password"
                style={{ paddingRight: 48 }}
              />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 14, bottom: 12, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                {showPw ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>

            {error && (
              <div style={{ background: 'rgba(255,77,77,0.08)', border: '1px solid rgba(255,77,77,0.25)', borderRadius: 8, padding: '12px 16px', color: 'var(--red)', fontSize: '0.88rem', marginBottom: 20, display: 'flex', gap: 10, alignItems: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary w-full" disabled={loading} style={{ justifyContent: 'center' }}>
              {loading ? <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Signing in...</> : 'Sign In to Dashboard'}
            </button>
          </form>

          <div style={{ marginTop: 20, padding: '16px', background: 'rgba(245,166,35,0.04)', borderRadius: 8, border: '1px solid rgba(245,166,35,0.1)' }}>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', fontFamily: 'var(--font-heading)' }}>
              Default: <strong style={{ color: 'var(--gold)' }}>admin</strong> / <strong style={{ color: 'var(--gold)' }}>Admin@123</strong>
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <a href="/" style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
            ← Back to Website
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
