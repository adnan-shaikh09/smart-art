import React, { useEffect, useState, useCallback } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminApi } from '../../utils/api';

const S = {
  new:     { color:'#ff4d4d', bg:'rgba(255,77,77,0.12)',  label:'New' },
  read:    { color:'#06d6a0', bg:'rgba(6,214,160,0.1)',   label:'Read' },
  replied: { color:'#f5a623', bg:'rgba(245,166,35,0.12)', label:'Replied' },
  closed:  { color:'#6b7280', bg:'rgba(107,114,128,0.1)', label:'Closed' },
};

const fmt = (d) => {
  if (!d) return '';
  const date = new Date(d), now = new Date(), diff = now - date;
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff/60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff/3600000)}h ago`;
  return date.toLocaleDateString('en-IN', { day:'numeric', month:'short' });
};

const fmtFull = (d) => d ? new Date(d).toLocaleString('en-IN', { day:'numeric', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit' }) : '';

export default function AdminContacts() {
  const [contacts, setContacts]   = useState([]);
  const [selected, setSelected]   = useState(null);
  const [detail,   setDetail]     = useState(null);
  const [filter,   setFilter]     = useState('all');
  const [search,   setSearch]     = useState('');
  const [stats,    setStats]      = useState({ new:0, read:0, replied:0, closed:0, total:0 });
  const [loading,  setLoading]    = useState(true);
  const [detailLoading, setDL]    = useState(false);
  const [error,    setError]      = useState(null);
  const [toast,    setToast]      = useState(null);
  const [isMobile, setIsMobile]   = useState(window.innerWidth < 768);

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  const showToast = (msg, type='success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { limit: 50 };
      if (filter !== 'all') params.status = filter;
      if (search.trim()) params.search = search.trim();

      const [cRes, sRes] = await Promise.all([
        adminApi.getContacts(params),
        adminApi.getContactStats()
      ]);

      const contactData = cRes?.data?.data || [];
      const statsData   = sRes?.data?.data || {};

      setContacts(contactData);
      setStats(statsData);

      if (contactData.length === 0 && statsData.total > 0 && filter === 'all') {
        setError('Data exists but failed to load list. Try refreshing.');
      }
    } catch (err) {
      console.error('Contacts load error:', err);
      setError('Failed to load enquiries: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  }, [filter, search]);

  useEffect(() => {
    document.title = 'Enquiries | Smart Art Admin';
    loadList();
  }, [loadList]);

  useEffect(() => {
    const t = setInterval(loadList, 30000);
    return () => clearInterval(t);
  }, [loadList]);

  const openContact = async (c) => {
    setSelected(c.id);
    setDetail(c); // Show immediately
    setDL(true);
    try {
      const r = await adminApi.getContact(c.id);
      const data = r?.data?.data || c;
      setDetail(data);
      setContacts(prev => prev.map(x => x.id === c.id ? { ...x, status: data.status } : x));
      adminApi.getContactStats().then(s => setStats(s.data.data || {})).catch(() => {});
    } catch (err) {
      console.error('Get contact error:', err);
    } finally {
      setDL(false);
    }
  };

  const changeStatus = async (id, status) => {
    try {
      await adminApi.updateContactStatus(id, status);
      setDetail(d => d ? { ...d, status } : d);
      setContacts(prev => prev.map(c => c.id === id ? { ...c, status } : c));
      adminApi.getContactStats().then(s => setStats(s.data.data || {})).catch(() => {});
      showToast(`Marked as "${status}"`);
    } catch { showToast('Failed to update', 'error'); }
  };

  const deleteContact = async (id) => {
    if (!window.confirm('Delete this enquiry?')) return;
    try {
      await adminApi.deleteContact(id);
      setContacts(prev => prev.filter(c => c.id !== id));
      if (selected === id) { setSelected(null); setDetail(null); }
      adminApi.getContactStats().then(s => setStats(s.data.data || {})).catch(() => {});
      showToast('Deleted');
    } catch { showToast('Delete failed', 'error'); }
  };

  const d = detail;

  return (
    <AdminLayout title="Enquiries / Inbox">
      {toast && (
        <div style={{ position:'fixed', top:20, right:20, zIndex:9999, padding:'12px 20px', borderRadius:8, fontFamily:'var(--font-heading)', fontSize:'0.9rem', background:toast.type==='error'?'rgba(255,77,77,0.15)':'rgba(6,214,160,0.12)', border:`1px solid ${toast.type==='error'?'var(--red)':'var(--cyan)'}`, color:toast.type==='error'?'var(--red)':'var(--cyan)' }}>
          {toast.type==='error'?'⚠️':'✅'} {toast.msg}
        </div>
      )}

      {/* Stats bar */}
      <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap' }}>
        {Object.entries(S).map(([key, meta]) => (
          <div key={key} style={{ background:'var(--bg-card)', border:`1px solid ${meta.color}25`, borderRadius:8, padding:'10px 16px', display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background:meta.color }} />
            <span style={{ fontFamily:'var(--font-heading)', fontSize:'0.8rem', color:'var(--text-muted)' }}>{meta.label}</span>
            <span style={{ fontFamily:'var(--font-display)', fontSize:'1rem', fontWeight:700, color:meta.color }}>{stats[key]||0}</span>
          </div>
        ))}
        <div style={{ marginLeft:'auto', background:'var(--bg-card)', border:'1px solid var(--border-subtle)', borderRadius:8, padding:'10px 16px', fontFamily:'var(--font-heading)', fontSize:'0.8rem', color:'var(--text-muted)', display:'flex', alignItems:'center', gap:6 }}>
          Total: <strong style={{ color:'var(--text-primary)' }}>{stats.total||0}</strong>
          <button onClick={loadList} style={{ background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer', padding:4, marginLeft:4, fontSize:'1rem' }} title="Refresh">↻</button>
        </div>
      </div>

      {/* Inbox layout */}
      <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : (selected ? '320px 1fr' : '320px 1fr'), gap:0, height: isMobile ? 'auto' : 'calc(100vh - 240px)', background:'var(--bg-card)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius)', overflow:'hidden' }}>

        {/* LIST PANEL */}
        <div style={{ display:'flex', flexDirection:'column', borderRight: isMobile ? 'none' : '1px solid var(--border-subtle)', borderBottom: isMobile && selected ? '1px solid var(--border-subtle)' : 'none', overflow:'hidden', maxHeight: isMobile ? (selected ? 250 : 'none') : 'none' }}>
          {/* Search + filter */}
          <div style={{ padding:14, borderBottom:'1px solid var(--border-subtle)', background:'var(--bg-secondary)', flexShrink:0 }}>
            <div style={{ position:'relative', marginBottom:10 }}>
              <svg style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input style={{ width:'100%', background:'rgba(255,255,255,0.04)', border:'1px solid var(--border-subtle)', borderRadius:7, color:'var(--text-primary)', fontSize:'0.83rem', padding:'8px 10px 8px 32px', outline:'none', fontFamily:'var(--font-body)' }}
                placeholder="Search name, phone, email..."
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
              {['all','new','read','replied','closed'].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{ padding:'4px 10px', borderRadius:100, border:'1px solid', borderColor:filter===f?'var(--gold)':'var(--border-subtle)', background:filter===f?'rgba(245,166,35,0.1)':'transparent', color:filter===f?'var(--gold)':'var(--text-muted)', fontSize:'0.72rem', fontFamily:'var(--font-heading)', fontWeight:600, cursor:'pointer' }}>
                  {f.charAt(0).toUpperCase()+f.slice(1)}
                  {f==='new' && stats.new>0 && <span style={{ marginLeft:4, background:'var(--red)', color:'#fff', borderRadius:100, padding:'0 4px', fontSize:'0.65rem' }}>{stats.new}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div style={{ flex:1, overflowY:'auto' }}>
            {loading ? (
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:150 }}><div className="spinner" /></div>
            ) : error ? (
              <div style={{ padding:24, textAlign:'center', color:'var(--red)', fontSize:'0.85rem' }}>
                <div style={{ fontSize:'2rem', marginBottom:10 }}>⚠️</div>
                <div>{error}</div>
                <button onClick={loadList} className="btn btn-outline" style={{ marginTop:14, fontSize:'0.8rem', padding:'6px 14px' }}>Retry</button>
              </div>
            ) : contacts.length === 0 ? (
              <div style={{ textAlign:'center', padding:'40px 16px', color:'var(--text-muted)' }}>
                <div style={{ fontSize:'2.5rem', marginBottom:10 }}>📭</div>
                <p style={{ fontSize:'0.88rem' }}>No enquiries found</p>
                {filter !== 'all' && <p style={{ fontSize:'0.78rem', marginTop:6 }}>Try selecting "All" filter</p>}
              </div>
            ) : contacts.map((c, i) => {
              const meta = S[c.status] || S.read;
              const isActive = selected === c.id;
              return (
                <div key={c.id} onClick={() => openContact(c)}
                  style={{ padding:'12px 14px', borderBottom:'1px solid var(--border-subtle)', cursor:'pointer', background:isActive?'rgba(245,166,35,0.07)':'transparent', borderLeft:`3px solid ${isActive?'var(--gold)':'transparent'}`, transition:'all 0.15s', position:'relative' }}
                  onMouseEnter={e => { if(!isActive) e.currentTarget.style.background='rgba(255,255,255,0.02)'; }}
                  onMouseLeave={e => { if(!isActive) e.currentTarget.style.background='transparent'; }}>
                  <div style={{ display:'flex', alignItems:'flex-start', gap:10 }}>
                    <div style={{ width:38, height:38, borderRadius:'50%', flexShrink:0, background:c.status==='new'?'rgba(245,166,35,0.15)':'rgba(255,255,255,0.05)', border:`1.5px solid ${c.status==='new'?'var(--gold)':'var(--border-subtle)'}`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-heading)', fontWeight:700, fontSize:'0.9rem', color:c.status==='new'?'var(--gold)':'var(--text-muted)' }}>
                      {c.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div style={{ flex:1, overflow:'hidden', minWidth:0 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', gap:4, marginBottom:2 }}>
                        <span style={{ fontFamily:'var(--font-heading)', fontWeight:c.status==='new'?700:600, fontSize:'0.88rem', color:c.status==='new'?'var(--text-primary)':'var(--text-secondary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.name}</span>
                        <span style={{ fontSize:'0.68rem', color:'var(--text-muted)', flexShrink:0 }}>{fmt(c.created_at)}</span>
                      </div>
                      {c.business_name && <div style={{ fontSize:'0.72rem', color:'var(--text-muted)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginBottom:2 }}>🏢 {c.business_name}</div>}
                      <div style={{ fontSize:'0.75rem', color:'var(--text-muted)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.message}</div>
                      <div style={{ marginTop:5, display:'flex', alignItems:'center', gap:5 }}>
                        <span style={{ fontSize:'0.65rem', padding:'1px 7px', borderRadius:100, background:meta.bg, color:meta.color, fontFamily:'var(--font-heading)', fontWeight:600 }}>{meta.label}</span>
                        {c.service_type && <span style={{ fontSize:'0.65rem', color:'var(--text-muted)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>• {c.service_type}</span>}
                      </div>
                    </div>
                  </div>
                  {c.status==='new' && <div style={{ position:'absolute', top:12, right:10, width:7, height:7, borderRadius:'50%', background:'var(--red)', animation:'pulse 2s ease infinite' }} />}
                </div>
              );
            })}
          </div>
        </div>

        {/* DETAIL PANEL */}
        <div style={{ display:'flex', flexDirection:'column', overflow:'hidden' }}>
          {!selected ? (
            <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color:'var(--text-muted)', gap:14, padding:24 }}>
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.25"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
              <p style={{ fontFamily:'var(--font-heading)', fontSize:'1rem' }}>Select an enquiry to view details</p>
              <p style={{ fontSize:'0.8rem', opacity:0.6 }}>{contacts.length} enquir{contacts.length===1?'y':'ies'} in inbox</p>
            </div>
          ) : detailLoading && !d ? (
            <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center' }}><div className="spinner" /></div>
          ) : d ? (
            <>
              {/* Detail header */}
              <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--border-subtle)', background:'var(--bg-secondary)', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, flexWrap:'wrap', flexShrink:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:44, height:44, borderRadius:'50%', background:'linear-gradient(135deg,rgba(245,166,35,0.2),rgba(245,166,35,0.05))', border:'1.5px solid var(--border-gold)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1rem', color:'var(--gold)', flexShrink:0 }}>
                    {d.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <div style={{ fontFamily:'var(--font-heading)', fontSize:'1rem', fontWeight:700, color:'var(--text-primary)' }}>{d.name}</div>
                    <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>{d.business_name && `🏢 ${d.business_name} · `}📅 {fmtFull(d.created_at)}</div>
                  </div>
                </div>
                <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                  <select value={d.status} onChange={e => changeStatus(d.id, e.target.value)}
                    style={{ background:'var(--bg-card)', border:`1px solid ${S[d.status]?.color||'var(--border-subtle)'}40`, color:S[d.status]?.color||'var(--text-primary)', borderRadius:7, padding:'6px 10px', fontSize:'0.8rem', fontFamily:'var(--font-heading)', fontWeight:600, cursor:'pointer', outline:'none' }}>
                    <option value="new">🔴 New</option>
                    <option value="read">🟢 Read</option>
                    <option value="replied">🟡 Replied</option>
                    <option value="closed">⚫ Closed</option>
                  </select>
                  <button onClick={() => deleteContact(d.id)} style={{ background:'rgba(255,77,77,0.1)', border:'1px solid rgba(255,77,77,0.3)', color:'var(--red)', borderRadius:7, padding:'6px 12px', cursor:'pointer', fontSize:'0.8rem', fontFamily:'var(--font-heading)', fontWeight:600 }}>🗑</button>
                </div>
              </div>

              {/* Detail body */}
              <div style={{ flex:1, overflowY:'auto', padding:20 }}>
                {/* Info cards */}
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(180px, 1fr))', gap:10, marginBottom:20 }}>
                  {[
                    d.phone        && { icon:'📞', label:'Phone',    value:d.phone,        href:`tel:${d.phone}` },
                    d.email        && { icon:'✉️', label:'Email',    value:d.email,        href:`mailto:${d.email}` },
                    d.service_type && { icon:'🔧', label:'Service',  value:d.service_type },
                    { icon:'📊', label:'Status', value:S[d.status]?.label || d.status },
                  ].filter(Boolean).map((item, i) => (
                    <div key={i} style={{ background:'var(--bg-secondary)', border:'1px solid var(--border-subtle)', borderRadius:9, padding:'12px 14px' }}>
                      <div style={{ fontSize:'0.68rem', color:'var(--text-muted)', fontFamily:'var(--font-heading)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:5 }}>{item.icon} {item.label}</div>
                      {item.href
                        ? <a href={item.href} style={{ color:'var(--gold)', fontSize:'0.88rem', fontWeight:600, textDecoration:'none', fontFamily:'var(--font-heading)', wordBreak:'break-all' }}>{item.value}</a>
                        : <div style={{ color:'var(--text-primary)', fontSize:'0.88rem', fontWeight:600, fontFamily:'var(--font-heading)' }}>{item.value}</div>
                      }
                    </div>
                  ))}
                </div>

                {/* Message */}
                <div style={{ marginBottom:20 }}>
                  <div style={{ fontSize:'0.72rem', color:'var(--text-muted)', fontFamily:'var(--font-heading)', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:10 }}>💬 Message</div>
                  <div style={{ background:'var(--bg-secondary)', border:'1px solid var(--border-subtle)', borderLeft:'3px solid var(--gold)', borderRadius:'0 10px 10px 10px', padding:'16px 18px', color:'var(--text-secondary)', fontSize:'0.93rem', lineHeight:1.8 }}>
                    {d.message}
                  </div>
                  <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', marginTop:6, textAlign:'right' }}>Received: {fmtFull(d.created_at)}</div>
                </div>

                {/* Reply actions */}
                <div style={{ background:'rgba(245,166,35,0.04)', border:'1px solid var(--border-gold)', borderRadius:10, padding:'16px 18px' }}>
                  <div style={{ fontFamily:'var(--font-heading)', fontWeight:700, color:'var(--text-primary)', marginBottom:12, fontSize:'0.88rem' }}>⚡ Quick Reply</div>
                  <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                    {d.phone && (
                      <>
                        <a href={`https://wa.me/${d.phone.replace(/[^0-9]/g,'')}?text=Hello%20${encodeURIComponent(d.name)}!%20Thank%20you%20for%20contacting%20Smart%20Art.`}
                          target="_blank" rel="noopener noreferrer"
                          style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'8px 14px', background:'rgba(37,211,102,0.1)', border:'1px solid rgba(37,211,102,0.3)', borderRadius:7, color:'#25d366', textDecoration:'none', fontFamily:'var(--font-heading)', fontWeight:600, fontSize:'0.82rem' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                          WhatsApp
                        </a>
                        <a href={`tel:${d.phone}`} style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'8px 14px', background:'rgba(6,214,160,0.1)', border:'1px solid rgba(6,214,160,0.3)', borderRadius:7, color:'var(--cyan)', textDecoration:'none', fontFamily:'var(--font-heading)', fontWeight:600, fontSize:'0.82rem' }}>
                          📞 Call
                        </a>
                      </>
                    )}
                    {d.email && (
                      <a href={`mailto:${d.email}?subject=Re: Your enquiry at Smart Art${d.service_type?` – ${d.service_type}`:''}&body=Dear ${d.name},%0D%0A%0D%0AThank you for contacting Smart Art!%0D%0A%0D%0ABest regards,%0D%0AAtik Shaikh%0D%0ASmart Art, Nashik`}
                        style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'8px 14px', background:'rgba(245,166,35,0.1)', border:'1px solid rgba(245,166,35,0.3)', borderRadius:7, color:'var(--gold)', textDecoration:'none', fontFamily:'var(--font-heading)', fontWeight:600, fontSize:'0.82rem' }}>
                        ✉️ Email
                      </a>
                    )}
                    {d.status !== 'replied' && (
                      <button onClick={() => changeStatus(d.id,'replied')} style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'8px 14px', background:'rgba(245,166,35,0.08)', border:'1px solid var(--border-gold)', borderRadius:7, color:'var(--gold)', cursor:'pointer', fontFamily:'var(--font-heading)', fontWeight:600, fontSize:'0.82rem' }}>
                        ✅ Mark Replied
                      </button>
                    )}
                    {d.status !== 'closed' && (
                      <button onClick={() => changeStatus(d.id,'closed')} style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'8px 14px', background:'rgba(107,114,128,0.08)', border:'1px solid rgba(107,114,128,0.3)', borderRadius:7, color:'#9ca3af', cursor:'pointer', fontFamily:'var(--font-heading)', fontWeight:600, fontSize:'0.82rem' }}>
                        🔒 Close
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </AdminLayout>
  );
}
