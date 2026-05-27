import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer>
      <div className="footer-top">
        <div className="container">
          <div className="footer-grid">
            {/* Brand */}
            <div className="footer-brand">
              <div className="footer-logo">
                <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
                  <polygon points="16,2 30,10 30,22 16,30 2,22 2,10" stroke="var(--gold)" strokeWidth="1.5" fill="none"/>
                  <polygon points="16,7 25,12 25,20 16,25 7,20 7,12" fill="var(--gold)" opacity="0.1"/>
                  <path d="M10 14 L16 10 L22 14" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M10 18 L16 22 L22 18" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="16" y1="10" x2="16" y2="22" stroke="var(--gold)" strokeWidth="1.5"/>
                </svg>
                <span>SMART ART</span>
              </div>
              <p className="footer-tagline">Crafting Identity. Illuminating Brands.</p>
              <p className="footer-desc">
                Nashik's premier signage studio delivering precision CNC cut boards, 
                laser engravings, and LED illuminated name boards for businesses across all industries.
              </p>
              <div className="footer-social">
                <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="social-link">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </a>
                <a href="tel:+919876543210" className="social-link">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                </a>
                <a href="mailto:info@smartart.in" className="social-link">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-col">
              <h4>Quick Links</h4>
              <ul>
                {[
                  { to: '/', label: 'Home' },
                  { to: '/services', label: 'Our Services' },
                  { to: '/gallery', label: 'Portfolio Gallery' },
                  { to: '/about', label: 'About Us' },
                  { to: '/contact', label: 'Contact Us' },
                ].map(link => (
                  <li key={link.to}><Link to={link.to}>{link.label}</Link></li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className="footer-col">
              <h4>Services</h4>
              <ul>
                {['CNC Cutting Signs', 'Laser Engraving', 'LED Name Boards', 'Hospital Boards', 'Restaurant Signs', 'Shop Boards'].map(s => (
                  <li key={s}><Link to="/services">{s}</Link></li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="footer-col footer-contact">
              <h4>Get In Touch</h4>
              <div className="contact-item">
                <div className="contact-icon">📍</div>
                <span>Near Mahamarga Bus Stand, Nashik, Maharashtra - 422001</span>
              </div>
              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <a href="tel:+919876543210">+91 98765 43210</a>
              </div>
              <div className="contact-item">
                <div className="contact-icon">✉️</div>
                <a href="mailto:info@smartart.in">info@smartart.in</a>
              </div>
              <div className="contact-item">
                <div className="contact-icon">🕐</div>
                <span>Mon–Sat: 9AM–8PM<br/>Sun: 10AM–4PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>© {year} <strong>Smart Art</strong> — Atik Shaikh. All rights reserved. | Nashik, Maharashtra</p>
          <Link to="/admin/login" style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textDecoration: 'none', opacity: 0.5 }}>
            Admin
          </Link>
        </div>
      </div>

      <style>{`
        footer {
          border-top: 1px solid var(--border-subtle);
          background: var(--bg-secondary);
          position: relative;
        }
        footer::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--gold), var(--gold-light), var(--gold), transparent);
        }
        .footer-top { padding: 64px 0 48px; }
        .footer-grid {
          display: grid;
          grid-template-columns: 1.8fr 1fr 1fr 1.4fr;
          gap: 48px;
        }
        .footer-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }
        .footer-logo span {
          font-family: var(--font-display);
          font-size: 1.3rem;
          font-weight: 700;
          background: linear-gradient(135deg, var(--gold-light), var(--gold));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .footer-tagline {
          font-family: var(--font-heading);
          font-size: 0.85rem;
          color: var(--gold);
          letter-spacing: 0.08em;
          margin-bottom: 12px;
        }
        .footer-desc {
          font-size: 0.88rem;
          color: var(--text-muted);
          line-height: 1.7;
          margin-bottom: 20px;
        }
        .footer-social { display: flex; gap: 10px; }
        .social-link {
          width: 38px; height: 38px;
          border-radius: 8px;
          border: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          transition: var(--transition);
          text-decoration: none;
        }
        .social-link:hover {
          color: var(--gold);
          border-color: var(--border-gold);
          background: rgba(245,166,35,0.08);
        }
        .footer-col h4 {
          font-family: var(--font-heading);
          font-size: 1rem;
          font-weight: 700;
          color: var(--gold);
          margin-bottom: 20px;
          letter-spacing: 0.05em;
          position: relative;
          padding-bottom: 10px;
        }
        .footer-col h4::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 30px; height: 2px;
          background: var(--gold);
          border-radius: 1px;
        }
        .footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 10px; }
        .footer-col ul li a {
          color: var(--text-primary);
          text-decoration: none;
          font-size: 0.9rem;
          transition: var(--transition);
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .footer-col ul li a::before {
          content: '›';
          color: var(--gold);
          opacity: 0;
          transform: translateX(-6px);
          transition: var(--transition);
        }
        .footer-col ul li a:hover {
          color: var(--gold);
          transform: translateX(4px);
        }
        .footer-col ul li a:hover::before { opacity: 1; transform: translateX(0); }
        .contact-item {
          display: flex;
          gap: 12px;
          margin-bottom: 14px;
          align-items: flex-start;
        }
        .contact-icon { font-size: 1rem; flex-shrink: 0; margin-top: 2px; }
        .contact-item span, .contact-item a {
          font-size: 0.88rem;
          color: var(--text-secondary);
          line-height: 1.6;
          text-decoration: none;
          transition: color 0.2s;
        }
        .contact-item a:hover { color: var(--gold); }
        .footer-bottom {
          border-top: 1px solid var(--border-subtle);
          padding: 20px 0;
        }
        .footer-bottom .container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .footer-bottom p {
          font-size: 0.82rem;
          color: var(--text-muted);
        }
        @media (max-width: 1024px) {
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 40px; }
        }
        @media (max-width: 640px) {
          .footer-grid { grid-template-columns: 1fr; gap: 32px; }
          .footer-top { padding: 48px 0 32px; }
          .footer-bottom .container { flex-direction: column; text-align: center; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
