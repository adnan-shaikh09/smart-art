import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { path: '/',         label: 'Home' },
  { path: '/services', label: 'Services' },
  { path: '/gallery',  label: 'Gallery' },
  { path: '/about',    label: 'About' },
  { path: '/contact',  label: 'Contact' },
];

const LogoSVG = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <polygon points="16,2 30,10 30,22 16,30 2,22 2,10" stroke="var(--gold)" strokeWidth="1.5" fill="none"/>
    <polygon points="16,7 25,12 25,20 16,25 7,20 7,12" fill="var(--gold)" opacity="0.15"/>
    <path d="M10 14 L16 10 L22 14" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M10 18 L16 22 L22 18" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="16" y1="10" x2="16" y2="22" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const Navbar = () => {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close sidebar on route change
  useEffect(() => { setMenuOpen(false); }, [location]);

  // Lock body scroll when sidebar is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const openMenu  = (e) => { e.stopPropagation(); setMenuOpen(true); };
  const closeMenu = ()  => setMenuOpen(false);

  return (
    <>
      {/* ── Main Navbar ────────────────────────────────── */}
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-container">

          {/* Logo */}
          <Link to="/" className="nav-logo">
            <div style={{ animation: 'float 3s ease infinite' }}>
              <LogoSVG size={32} />
            </div>
            <div className="logo-text">
              <span className="logo-name">SMART ART</span>
              <span className="logo-tagline">
                <span className="logo-by">BY&nbsp;</span>
                <strong className="logo-atik">ATIK</strong>
              </span>
            </div>
          </Link>

          {/* Desktop links */}
          <ul className="nav-links">
            {NAV_LINKS.map(link => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* CTA + Hamburger */}
          <div className="nav-cta">
              <a
            
              href="https://wa.me/919876543210?text=Hello%20Smart%20Art!%20I%20need%20a%20signage%20quote."
              target="_blank" rel="noopener noreferrer"
              className="btn btn-primary nav-btn"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Get Quote
            </a>

            {/* 3-line hamburger — ONLY opens, never duplicates close btn */}
            <button className="hamburger" onClick={openMenu} aria-label="Open menu">
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Dark overlay behind sidebar ─────────────────── */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 998,
            animation: 'fadeIn 0.2s ease',
          }}
          onClick={closeMenu}
        />
      )}

      {/* ── Mobile Sidebar ──────────────────────────────── */}
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>

        {/* Header: Logo + single ✕ close button */}
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo-link" onClick={closeMenu}>
            <LogoSVG size={28} />
            <div>
              <div className="sidebar-logo-name">SMART ART</div>
              <div className="sidebar-logo-sub">
                <span className="sidebar-by">BY&nbsp;</span>
                <strong className="sidebar-atik">ATIK</strong>
              </div>
            </div>
          </Link>

          {/* ONE close button only */}
          <button
            className="sidebar-close-btn"
            onClick={closeMenu}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'var(--border-subtle)', margin: '0 0 12px' }} />

        {/* Nav links */}
        <ul className="mobile-nav-links">
          {NAV_LINKS.map(link => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) => `mobile-nav-link${isActive ? ' active' : ''}`}
                onClick={closeMenu}
              >
                {link.label}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="sidebar-footer">
          
            <a
            href="https://wa.me/919876543210"
            target="_blank" rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            WhatsApp for Quote
          </a>
        </div>
      </div>

      <style>{`
        /* ── Navbar ── */
        .navbar {
          position: fixed; top: 0; left: 0; right: 0;
          height: var(--navbar-h); z-index: 1000;
          transition: var(--transition);
        }
        .navbar.scrolled {
          background: rgba(7,7,15,0.96);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-subtle);
          box-shadow: 0 4px 30px rgba(0,0,0,0.3);
        }
        .nav-container {
          max-width: var(--container-max);
          margin: 0 auto; padding: 0 24px;
          height: 100%;
          display: flex; align-items: center;
          justify-content: space-between; gap: 24px;
        }

        /* ── Logo ── */
        .nav-logo {
          display: flex; align-items: center;
          gap: 12px; text-decoration: none; flex-shrink: 0;
        }
        .logo-text { display: flex; flex-direction: column; line-height: 1.1; }
        .logo-name {
          font-family: var(--font-display); font-size: 1.1rem; font-weight: 700;
          background: linear-gradient(135deg, var(--gold-light), var(--gold));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; letter-spacing: 0.1em;
        }
        .logo-tagline {
          display: flex; align-items: center;
          font-family: var(--font-heading);
          font-size: 0.8rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-top: 3px;
          line-height: 1;
        }
        .logo-by  { color: var(--gold); font-weight: 700; }
        .logo-atik {
          font-style: normal; font-weight: 800;
          color: #fff;
          text-shadow:
            0 0 5px rgba(255,255,255,1),
            0 0 12px rgba(255,255,255,0.8),
            0 0 22px rgba(255,255,255,0.4);
        }

        /* ── Desktop nav ── */
        .nav-links {
          display: flex; align-items: center;
          gap: 4px; list-style: none;
          flex: 1; justify-content: center;
        }
        .nav-link {
          display: block; padding: 8px 16px;
          font-family: var(--font-heading); font-size: 0.95rem; font-weight: 600;
          color: var(--text-secondary); text-decoration: none;
          border-radius: 6px; transition: var(--transition); position: relative;
        }
        .nav-link::after {
          content: ''; position: absolute;
          bottom: 4px; left: 16px; right: 16px;
          height: 2px; background: var(--gold);
          transform: scaleX(0); transition: transform 0.3s; border-radius: 1px;
        }
        .nav-link:hover, .nav-link.active { color: var(--gold); }
        .nav-link:hover::after, .nav-link.active::after { transform: scaleX(1); }

        .nav-cta { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
        .nav-btn  { padding: 10px 22px; font-size: 0.85rem; }

        /* ── Hamburger ── */
        .hamburger {
          display: none; flex-direction: column; gap: 5px;
          background: none; border: none; cursor: pointer;
          padding: 8px; border-radius: 8px; transition: var(--transition);
        }
        .hamburger:hover { background: rgba(255,255,255,0.05); }
        .hamburger span {
          display: block; width: 24px; height: 2px;
          background: var(--text-primary); border-radius: 1px;
        }

        /* ── Mobile sidebar ── */
        .mobile-menu {
          position: fixed; top: 0; right: 0;
          width: 300px; height: 100vh;
          background: var(--bg-card);
          border-left: 1px solid var(--border-subtle);
          z-index: 1002;
          transform: translateX(100%);
          transition: transform 0.32s cubic-bezier(0.4,0,0.2,1);
          display: flex; flex-direction: column;
          overflow-y: auto;
        }
        .mobile-menu.open { transform: translateX(0); }

        /* Sidebar header */
        .sidebar-header {
          display: flex; align-items: center;
          justify-content: space-between;
          padding: 22px 20px 18px;
          flex-shrink: 0;
        }
        .sidebar-logo-link {
          display: flex; align-items: center;
          gap: 12px; text-decoration: none;
        }
        .sidebar-logo-name {
          font-family: var(--font-display); font-size: 1.1rem; font-weight: 700;
          background: linear-gradient(135deg, var(--gold-light), var(--gold));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; letter-spacing: 0.1em;
        }
        .sidebar-logo-sub {
          display: flex; align-items: center;
          font-family: var(--font-heading);
          font-size: 0.85rem; font-weight: 700;
          letter-spacing: 0.06em; text-transform: uppercase;
          margin-top: 3px;
        }
        .sidebar-by   { color: var(--gold); }
        .sidebar-atik {
          font-style: normal; font-weight: 800; color: #fff;
          text-shadow:
            0 0 6px rgba(255,255,255,1),
            0 0 14px rgba(255,255,255,0.75),
            0 0 28px rgba(255,255,255,0.35);
        }

        /* Single close button */
        .sidebar-close-btn {
          width: 36px; height: 36px; border-radius: 8px;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border-subtle);
          color: var(--text-muted); cursor: pointer;
          font-size: 1rem;
          display: flex; align-items: center; justify-content: center;
          transition: var(--transition); flex-shrink: 0;
        }
        .sidebar-close-btn:hover {
          background: rgba(255,77,77,0.12);
          border-color: rgba(255,77,77,0.35);
          color: var(--red);
        }

        /* Mobile nav links */
        .mobile-nav-links {
          list-style: none;
          display: flex; flex-direction: column;
          gap: 4px; flex: 1; padding: 0 12px;
        }
        .mobile-nav-link {
          display: flex; align-items: center;
          justify-content: space-between;
          padding: 13px 16px;
          font-family: var(--font-heading); font-size: 1rem; font-weight: 600;
          color: var(--text-secondary); text-decoration: none;
          border-radius: 8px; transition: var(--transition);
          border: 1px solid transparent;
        }
        .mobile-nav-link:hover, .mobile-nav-link.active {
          color: var(--gold);
          background: rgba(245,166,35,0.06);
          border-color: var(--border-gold);
        }

        /* Sidebar footer */
        .sidebar-footer {
          padding: 20px; margin-top: 12px;
          border-top: 1px solid var(--border-subtle);
          flex-shrink: 0;
        }

        /* Responsive breakpoints */
        @media (max-width: 900px) {
          .nav-links { display: none; }
          .hamburger { display: flex; }
          .nav-btn   { display: none; }
        }
        @media (max-width: 900px) {
          .mobile-menu { width: 100%; border-left: none; border-radius: 0; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
