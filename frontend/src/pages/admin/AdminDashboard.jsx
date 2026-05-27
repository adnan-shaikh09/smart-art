import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminApi } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const StatCard = ({ label, value, icon, color, to, badge }) => (
  <Link to={to} style={{ textDecoration: 'none' }}>
    <div style={{
      background: 'var(--bg-card)',
      border: `1px solid ${badge ? 'rgba(255,77,77,0.3)' : 'var(--border-subtle)'}`,
      borderRadius: 'var(--radius)',
      padding: '24px',
      transition: 'var(--transition)',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden',
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-2px)'; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = badge ? 'rgba(255,77,77,0.3)' : 'var(--border-subtle)'; e.currentTarget.style.transform = ''; }}
    >
      {badge > 0 && (
        <div style={{ position: 'absolute', top: 12, right: 12, background: 'var(--red)', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: 100, animation: 'pulse 2s ease infinite' }}>
          {badge} new
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: `${color}18`, border: `1px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
          {icon}
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 4 }}>{label}</div>
        </div>
      </div>
    </div>
  </Link>
);

const AdminDashboard = () => {
  const { admin } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [contactStats, setContactStats] = useState({ new: 0, total: 0 });
  const [services, setServices] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Dashboard | Smart Art Admin';
    Promise.all([
      adminApi.getContacts({ limit: 5 }),
      adminApi.getContactStats(),
      adminApi.getServices(),
      adminApi.getGallery(),
    ]).then(([c, cs, s, g]) => {
      setContacts(c.data.data);
      setContactStats(cs.data.data);
      setServices(s.data.data);
      setGallery(g.data.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  const STATUS_COLOR = { new: '#ff4d4d', read: '#06d6a0', replied: '#f5a623', closed: 'var(--text-muted)' };
  const STATUS_LABEL = { new: 'New', read: 'Read', replied: 'Replied', closed: 'Closed' };

  return (
    <AdminLayout title="Dashboard">
      {/* Greeting */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          {greeting}, <span style={{ color: 'var(--gold)' }}>{admin?.name?.split(' ')[0]}</span> 👋
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 4 }}>
          Here's what's happening with Smart Art today.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <StatCard label="Total Enquiries" value={contactStats.total || 0} color="#f5a623" to="/admin/contacts"
          badge={contactStats.new}
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>}
        />
        <StatCard label="New Enquiries" value={contactStats.new || 0} color="#ff4d4d" to="/admin/contacts?status=new"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>}
        />
        <StatCard label="Services" value={services.length} color="#06d6a0" to="/admin/services"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14"/></svg>}
        />
        <StatCard label="Gallery Items" value={gallery.length} color="#a78bfa" to="/admin/gallery"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>}
        />
      </div>

      {/* Recent enquiries */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 10 }}>
              Recent Enquiries
              {contactStats.new > 0 && <span style={{ background: 'var(--red)', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: 100 }}>{contactStats.new} new</span>}
            </div>
            <Link to="/admin/contacts" style={{ color: 'var(--gold)', fontSize: '0.82rem', textDecoration: 'none', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>View All →</Link>
          </div>
          {loading ? (
            <div className="loading-center" style={{ minHeight: 200 }}><div className="spinner" /></div>
          ) : contacts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📭</div>
              No enquiries yet
            </div>
          ) : (
            <div>
              {contacts.map((c, i) => (
                <Link key={c.id} to="/admin/contacts" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 24px', borderBottom: i < contacts.length - 1 ? '1px solid var(--border-subtle)' : 'none', textDecoration: 'none', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = ''}
                >
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: c.status === 'new' ? 'rgba(245,166,35,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${c.status === 'new' ? 'var(--border-gold)' : 'var(--border-subtle)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-heading)', fontWeight: 700, color: c.status === 'new' ? 'var(--gold)' : 'var(--text-muted)', fontSize: '0.9rem', flexShrink: 0 }}>
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                      <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</span>
                      {c.business_name && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>• {c.business_name}</span>}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.message}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                    <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 100, background: `${STATUS_COLOR[c.status]}15`, color: STATUS_COLOR[c.status], fontFamily: 'var(--font-heading)', fontWeight: 600 }}>{STATUS_LABEL[c.status]}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius)', padding: '20px 24px' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: 16 }}>Quick Actions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { to: '/admin/contacts', label: 'View Enquiries', icon: '💬', color: 'var(--gold)' },
                { to: '/admin/gallery', label: 'Add Gallery Item', icon: '📷', color: '#a78bfa' },
                { to: '/admin/services', label: 'Manage Services', icon: '⚙️', color: '#06d6a0' },
                { to: '/admin/testimonials', label: 'Add Testimonial', icon: '⭐', color: '#ffd166' },
                { to: '/admin/settings', label: 'Email Settings', icon: '✉️', color: '#ff6b6b' },
              ].map((action, i) => (
                <Link key={i} to={action.to} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 8,
                  textDecoration: 'none',
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  transition: 'var(--transition)',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = action.color; e.currentTarget.style.color = action.color; e.currentTarget.style.background = `${action.color}08`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                >
                  <span style={{ fontSize: '1.1rem' }}>{action.icon}</span>
                  {action.label}
                  <svg style={{ marginLeft: 'auto' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
              ))}
            </div>
          </div>

          {/* Enquiry status breakdown */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius)', padding: '20px 24px' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: 16 }}>Enquiry Status</div>
            {[
              { key: 'new', label: 'New', color: '#ff4d4d' },
              { key: 'read', label: 'Read', color: '#06d6a0' },
              { key: 'replied', label: 'Replied', color: '#f5a623' },
              { key: 'closed', label: 'Closed', color: '#6b7280' },
            ].map(s => {
              const count = contactStats[s.key] || 0;
              const pct = contactStats.total > 0 ? Math.round((count / contactStats.total) * 100) : 0;
              return (
                <div key={s.key} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontFamily: 'var(--font-heading)', fontSize: '0.82rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{s.label}</span>
                    <span style={{ color: s.color, fontWeight: 600 }}>{count}</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: s.color, borderRadius: 3, transition: 'width 1s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .dashboard-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </AdminLayout>
  );
};

export default AdminDashboard;
