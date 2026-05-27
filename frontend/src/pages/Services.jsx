import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { publicApi } from '../utils/api';

const ICON_MAP = {
  cnc:        { color: '#f5a623', emoji: '✂️' },
  laser:      { color: '#06d6a0', emoji: '🔆' },
  led:        { color: '#ffd166', emoji: '💡' },
  hospital:   { color: '#4ecdc4', emoji: '🏥' },
  restaurant: { color: '#ff6b6b', emoji: '🍽️' },
  shop:       { color: '#a78bfa', emoji: '🏪' },
};

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = 'Services | Smart Art - Nashik';
    publicApi.getServices()
      .then(r => {
        const data = r.data.data || [];
        setServices(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Services fetch error:', err);
        setError('Failed to load services');
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ paddingTop: 'var(--navbar-h)' }}>
      {/* Hero */}
      <section style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(245,166,35,0.08) 0%, transparent 60%), var(--bg-primary)', padding: '80px 0 60px', textAlign: 'center' }}>
        <div className="container">
          <div className="section-label">Our Expertise</div>
          <h1 className="section-title" style={{ fontSize: 'clamp(2.2rem,5vw,3.8rem)', marginTop: 8 }}>
            Premium <span>Signage</span> Services
          </h1>
          <p className="section-desc">
            From precision CNC cutting to glowing LED installations — we handle every type of signage for every type of business.
          </p>
        </div>
      </section>

      {/* Services list */}
      <section className="section">
        <div className="container">
          {loading ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--red)' }}>{error}</div>
          ) : services.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)', fontFamily: 'var(--font-heading)', fontSize: '1.1rem' }}>
              No services found. Check back soon!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {services.map((s, i) => {
                const meta = ICON_MAP[s.icon] || ICON_MAP.shop;
                const isOpen = active === s.id;
                return (
                  <div key={s.id}
                    style={{ background: isOpen ? 'var(--bg-card-hover)' : 'var(--bg-card)', border: `1px solid ${isOpen ? 'rgba(245,166,35,0.35)' : 'var(--border-subtle)'}`, borderRadius: 'var(--radius)', padding: '24px 28px', cursor: 'pointer', transition: 'all 0.25s', animation: `fadeInUp 0.4s ease ${i * 0.07}s both`, boxShadow: isOpen ? 'var(--shadow-gold)' : 'none' }}
                    onClick={() => setActive(isOpen ? null : s.id)}
                  >
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                      <div style={{ width: 56, height: 56, borderRadius: 12, background: `${meta.color}15`, border: `1px solid ${meta.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0 }}>
                        {meta.emoji}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'inline-block', background: 'rgba(245,166,35,0.1)', color: 'var(--gold)', fontSize: '0.68rem', fontWeight: 700, padding: '2px 10px', borderRadius: 100, border: '1px solid rgba(245,166,35,0.25)', marginBottom: 6, letterSpacing: '0.08em', fontFamily: 'var(--font-heading)' }}>
                          SERVICE {String(i + 1).padStart(2, '0')}
                        </div>
                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{s.title}</h3>
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{s.short_desc}</p>
                      </div>
                      <div style={{ color: isOpen ? 'var(--gold)' : 'var(--text-muted)', fontSize: '1.3rem', transition: 'transform 0.3s', transform: isOpen ? 'rotate(180deg)' : 'none', flexShrink: 0 }}>▼</div>
                    </div>

                    {/* Expanded body */}
                    {isOpen && (
                      <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border-subtle)' }}>
                        <p style={{ fontSize: '0.93rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 18 }}>{s.description}</p>
                        {s.features?.length > 0 && (
                          <>
                            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>What's Included</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8, marginBottom: 20 }}>
                              {s.features.map((f, fi) => (
                                <div key={fi} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', background: 'rgba(255,255,255,0.02)', border: `1px solid ${meta.color}30`, borderRadius: 8, fontSize: '0.83rem', color: 'var(--text-secondary)' }}>
                                  <span style={{ color: meta.color, fontWeight: 700 }}>✓</span> {f}
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                        <Link to="/contact" className="btn btn-primary" style={{ fontSize: '0.88rem', padding: '10px 22px' }}>
                          Get a Quote for This Service →
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Technology section */}
      <section className="section" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-label">Technology</div>
            <h2 className="section-title">Precision Tech Behind <span>Every Sign</span></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {[
              { icon: '🔩', title: 'CNC Routing', desc: 'Computer-controlled cutting for dimensional letters and complex shapes on acrylic, wood, PVC, aluminium.' },
              { icon: '⚡', title: 'CO₂ Laser Cutting', desc: 'Ultra-fine laser for intricate patterns on acrylic, MDF, wood, leather, and metal.' },
              { icon: '💡', title: 'LED Illumination', desc: 'Energy-efficient SMD LEDs with IP65 waterproofing for outdoor signs glowing 24/7.' },
              { icon: '🎨', title: 'Digital Printing', desc: 'UV-resistant solvent printing for banners, vinyl wraps, backdrops with vivid colours.' },
            ].map((t, i) => (
              <div key={i} className="card" style={{ animation: `fadeInUp 0.4s ease ${i * 0.1}s both` }}>
                <div style={{ fontSize: '2rem', marginBottom: 14 }}>{t.icon}</div>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>{t.title}</h4>
                <p style={{ fontSize: '0.87rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 0', textAlign: 'center', background: 'var(--bg-primary)' }}>
        <div className="container">
          <h2 className="section-title">Ready to <span>Transform</span> Your Business?</h2>
          <p className="section-desc" style={{ marginBottom: 32 }}>Get a custom quote tailored to your needs — free consultation, no obligation.</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn btn-primary">Request Free Quote</Link>
            <Link to="/gallery" className="btn btn-outline">Browse Our Work</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
