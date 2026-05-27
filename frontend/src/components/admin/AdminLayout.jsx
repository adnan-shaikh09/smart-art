import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminApi } from '../../utils/api';

const NAV = [
  { path: '/admin', label: 'Dashboard', exact: true, icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
  )},
  { path: '/admin/contacts', label: 'Enquiries', badge: true, icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
  )},
  { path: '/admin/services', label: 'Services', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/></svg>
  )},
  { path: '/admin/gallery', label: 'Gallery', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>
  )},
  { path: '/admin/testimonials', label: 'Testimonials', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>
  )},
  { path: '/admin/settings', label: 'Settings', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>
  )},
];

const AdminLayout = ({ children, title }) => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    adminApi.getContactStats().then(r => setUnread(r.data.data.new || 0)).catch(() => {});
    const interval = setInterval(() => {
      adminApi.getContactStats().then(r => setUnread(r.data.data.new || 0)).catch(() => {});
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  return (
    <div className="admin-shell">
      {/* Overlay for mobile */}
      {sidebarOpen && <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="sidebar-logo">
          <Link to="/" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <polygon points="16,2 30,10 30,22 16,30 2,22 2,10" stroke="var(--gold)" strokeWidth="1.5" fill="none"/>
              <path d="M10 14 L16 10 L22 14" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M10 18 L16 22 L22 18" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="16" y1="10" x2="16" y2="22" stroke="var(--gold)" strokeWidth="1.5"/>
            </svg>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.1em' }}>SMART ART</div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.15em' }}>ADMIN PANEL</div>
            </div>
          </Link>
        </div>

        <nav className="sidebar-nav">
          {NAV.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && unread > 0 && (
                <span className="sidebar-badge">{unread > 99 ? '99+' : unread}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-user">
          <div className="user-avatar">{admin?.name?.charAt(0) || 'A'}</div>
          <div className="user-info">
            <div className="user-name">{admin?.name}</div>
            <div className="user-role">Administrator</div>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="admin-main">
        {/* Top bar */}
        <header className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
            <h1 className="page-title">{title}</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {unread > 0 && (
              <Link to="/admin/contacts" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'var(--gold)', fontSize: '0.85rem', fontFamily: 'var(--font-heading)', fontWeight: 600, background: 'rgba(245,166,35,0.1)', border: '1px solid var(--border-gold)', padding: '6px 14px', borderRadius: 100, animation: 'glow 2s ease infinite' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>
                {unread} new {unread === 1 ? 'enquiry' : 'enquiries'}
              </Link>
            )}
            <Link to="/" target="_blank" className="btn btn-ghost" style={{ padding: '7px 16px', fontSize: '0.82rem' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              View Site
            </Link>
          </div>
        </header>

        <div className="admin-body">
          {children}
        </div>
      </div>

      <style>{`
        .admin-shell {
          display: flex;
          min-height: 100vh;
          background: var(--bg-primary);
        }
        .admin-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.6);
          z-index: 199;
        }
        .admin-sidebar {
          width: 250px;
          background: var(--bg-secondary);
          border-right: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
          z-index: 200;
          transition: transform 0.3s ease;
        }
        .sidebar-logo {
          padding: 24px 20px;
          border-bottom: 1px solid var(--border-subtle);
        }
        .sidebar-nav {
          flex: 1;
          padding: 16px 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 8px;
          font-family: var(--font-heading);
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-muted);
          text-decoration: none;
          transition: var(--transition);
          border: 1px solid transparent;
          position: relative;
        }
        .sidebar-link:hover {
          color: var(--text-primary);
          background: rgba(255,255,255,0.04);
        }
        .sidebar-link.active {
          color: var(--gold);
          background: rgba(245,166,35,0.08);
          border-color: var(--border-gold);
        }
        .sidebar-icon { opacity: 0.8; flex-shrink: 0; }
        .sidebar-badge {
          margin-left: auto;
          background: var(--red);
          color: #fff;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 100px;
          animation: pulse 2s ease infinite;
        }
        .sidebar-user {
          padding: 16px 20px;
          border-top: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .user-avatar {
          width: 36px; height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--gold-dark), var(--gold));
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-display);
          font-size: 0.9rem;
          font-weight: 700;
          color: #000;
          flex-shrink: 0;
        }
        .user-info { flex: 1; overflow: hidden; }
        .user-name { font-family: var(--font-heading); font-size: 0.88rem; font-weight: 700; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .user-role { font-size: 0.72rem; color: var(--text-muted); }
        .logout-btn {
          background: none; border: none; color: var(--text-muted);
          cursor: pointer; padding: 6px; border-radius: 6px;
          transition: var(--transition); flex-shrink: 0;
        }
        .logout-btn:hover { color: var(--red); background: rgba(255,77,77,0.1); }
        .admin-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          min-width: 0;
        }
        .admin-topbar {
          height: 64px;
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          position: sticky;
          top: 0;
          z-index: 100;
          gap: 16px;
        }
        .page-title {
          font-family: var(--font-heading);
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .sidebar-toggle {
          display: none;
          background: none; border: none;
          color: var(--text-secondary);
          cursor: pointer; padding: 6px;
          border-radius: 6px;
        }
        .admin-body {
          flex: 1;
          padding: 28px;
          overflow-y: auto;
        }
        @media (max-width: 900px) {
          .admin-sidebar {
            position: fixed;
            top: 0; left: 0; bottom: 0;
            transform: translateX(-100%);
          }
          .admin-sidebar.open { transform: translateX(0); }
          .sidebar-toggle { display: block; }
          .admin-body { padding: 20px 16px; }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
