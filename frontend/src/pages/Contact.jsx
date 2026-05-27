import React, { useEffect, useState } from 'react';
import { publicApi } from '../utils/api';
import useScrollAnimation from '../hooks/useScrollAnimation';

const SERVICE_OPTIONS = [
  'CNC Cutting Signage', 'Laser Cutting & Engraving', 'LED Backlit Name Board',
  'Hospital / Clinic Board', 'Restaurant / Hotel Board', 'Shop / Retail Signage',
  'Digital Printing / Flex', 'Interior Decor Signage', 'Custom / Other',
];

const Contact = () => {
  useScrollAnimation();
  const [form, setForm] = useState({ name: '', email: '', phone: '', business_name: '', service_type: '', message: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { document.title = 'Contact | Smart Art - Nashik'; }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.phone && !form.email) { e.phone = 'Provide phone or email'; e.email = 'Provide phone or email'; }
    if (!form.message.trim()) e.message = 'Please describe your requirement';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({}); setLoading(true); setError('');
    try {
      await publicApi.submitContact(form);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="page-enter" style={{ paddingTop: 'var(--navbar-h)' }}>
      {/* Hero */}
      <section style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(245,166,35,0.08) 0%, transparent 60%), var(--bg-primary)', padding: '80px 0 60px', textAlign: 'center' }}>
        <div className="container">
          <div className="section-label reveal">Reach Us</div>
          <h1 className="section-title reveal" style={{ fontSize: 'clamp(2.2rem,5vw,3.8rem)', marginTop: 8 }}>
            Get In <span>Touch</span>
          </h1>
          <p className="section-desc reveal">Ready to start your signage project? Fill the form or contact us directly — we'll respond within 24 hours.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-layout">
            {/* Info panel */}
            <div className="contact-info reveal-left">
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 24 }}>
                Contact Information
              </h3>
              {[
                { icon: '📍', label: 'Address', value: 'Near Mahamarga Bus Stand,\nNashik, Maharashtra – 422001' },
                { icon: '📞', label: 'Phone', value: '+91 98765 43210', href: 'tel:+919876543210' },
                { icon: '📞', label: 'Alternate', value: '+91 87654 32109', href: 'tel:+918765432109' },
                { icon: '✉️', label: 'Email', value: 'info@smartart.in', href: 'mailto:info@smartart.in' },
                { icon: '🕐', label: 'Hours', value: 'Mon–Sat: 9AM–8PM\nSun: 10AM–4PM' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 20, alignItems: 'flex-start' }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(245,166,35,0.08)', border: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-heading)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3 }}>{item.label}</div>
                    {item.href ? (
                      <a href={item.href} style={{ color: 'var(--gold)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 600 }}>{item.value}</a>
                    ) : (
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', whiteSpace: 'pre-line', lineHeight: 1.6 }}>{item.value}</div>
                    )}
                  </div>
                </div>
              ))}

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/919876543210?text=Hello%20Smart%20Art!%20I%20need%20a%20signage%20quote."
                target="_blank" rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Quick WhatsApp Chat
              </a>
            </div>

            {/* Form panel */}
            <div className="contact-form-wrap reveal-right">
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '60px 40px' }}>
                  <div style={{ fontSize: '4rem', marginBottom: 20 }}>✅</div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--cyan)', marginBottom: 12 }}>
                    Enquiry Sent!
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 8 }}>
                    Thank you! We've received your enquiry and will contact you within 24 hours.
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 32 }}>
                    A confirmation email has been sent to your inbox (if you provided an email).
                  </p>
                  <button className="btn btn-outline" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', business_name: '', service_type: '', message: '' }); }}>
                    Send Another Enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                    Send Your Enquiry
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 28 }}>
                    Fill the form below and we'll get back to you with a custom quote.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div className="form-group">
                      <label className="form-label">Your Name *</label>
                      <input className={`form-input${errors.name ? ' error-input' : ''}`} name="name" value={form.name} onChange={handleChange} placeholder="Rajesh Sharma" />
                      {errors.name && <span className="form-error">{errors.name}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Business Name</label>
                      <input className="form-input" name="business_name" value={form.business_name} onChange={handleChange} placeholder="Sharma Medical Center" />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div className="form-group">
                      <label className="form-label">Phone *</label>
                      <input className={`form-input${errors.phone ? ' error-input' : ''}`} name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" />
                      {errors.phone && <span className="form-error">{errors.phone}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input className={`form-input${errors.email ? ' error-input' : ''}`} type="email" name="email" value={form.email} onChange={handleChange} placeholder="rajesh@example.com" />
                      {errors.email && <span className="form-error">{errors.email}</span>}
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label className="form-label">Service Required</label>
                    <select className="form-select" name="service_type" value={form.service_type} onChange={handleChange}>
                      <option value="">Select a service...</option>
                      {SERVICE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: 24 }}>
                    <label className="form-label">Your Requirement *</label>
                    <textarea
                      className={`form-textarea${errors.message ? ' error-input' : ''}`}
                      name="message" value={form.message} onChange={handleChange}
                      placeholder="Describe what you need — size, material, design ideas, deadline, etc."
                      style={{ minHeight: 130 }}
                    />
                    {errors.message && <span className="form-error">{errors.message}</span>}
                  </div>

                  {error && (
                    <div style={{ background: 'rgba(255,77,77,0.1)', border: '1px solid rgba(255,77,77,0.3)', borderRadius: 8, padding: '12px 16px', color: 'var(--red)', fontSize: '0.9rem', marginBottom: 20 }}>
                      ⚠️ {error}
                    </div>
                  )}

                  <button type="submit" className="btn btn-primary w-full" disabled={loading} style={{ justifyContent: 'center', opacity: loading ? 0.7 : 1 }}>
                    {loading ? (
                      <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Sending...</>
                    ) : (
                      <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9"/></svg> Send Enquiry</>
                    )}
                  </button>

                  <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 16 }}>
                    🔒 Your information is kept private and never shared.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .contact-layout {
          display: grid;
          grid-template-columns: 1fr 1.6fr;
          gap: 48px;
          align-items: start;
        }
        .contact-info {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 36px;
          position: sticky;
          top: calc(var(--navbar-h) + 24px);
        }
        .contact-form-wrap {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 40px;
        }
        .error-input { border-color: var(--red) !important; }
        @media (max-width: 900px) {
          .contact-layout { grid-template-columns: 1fr; }
          .contact-info { position: static; }
        }
        @media (max-width: 480px) {
          .contact-form-wrap { padding: 24px; }
          .contact-info { padding: 24px; }
          form > div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default Contact;
