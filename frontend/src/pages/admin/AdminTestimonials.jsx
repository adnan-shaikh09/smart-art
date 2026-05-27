import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminApi } from '../../utils/api';

const BLANK = { client_name:'', client_business:'', client_location:'Nashik, MH', rating:5, message:'', is_active:1 };

const AdminTestimonials = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type='success') => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };
  const load = () => { setLoading(true); adminApi.getTestimonials().then(r=>{ setItems(r.data.data); setLoading(false); }).catch(()=>setLoading(false)); };
  useEffect(()=>{ document.title='Testimonials | Smart Art Admin'; load(); },[]);

  const openAdd = () => { setEditing(null); setForm(BLANK); setModal(true); };
  const openEdit = (t) => { setEditing(t.id); setForm({ client_name:t.client_name, client_business:t.client_business||'', client_location:t.client_location||'', rating:t.rating||5, message:t.message, is_active:t.is_active }); setModal(true); };

  const handleSave = async () => {
    if(!form.client_name.trim()||!form.message.trim()){ showToast('Name and message required','error'); return; }
    setSaving(true);
    try {
      if(editing) await adminApi.updateTestimonial(editing, form);
      else await adminApi.createTestimonial(form);
      showToast(editing?'Updated!':'Added!'); setModal(false); load();
    } catch { showToast('Save failed','error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Delete this testimonial?')) return;
    try { await adminApi.deleteTestimonial(id); showToast('Deleted'); load(); }
    catch { showToast('Delete failed','error'); }
  };

  const toggleActive = async (t) => {
    try { await adminApi.updateTestimonial(t.id, { ...t, is_active: t.is_active ? 0 : 1 }); load(); } catch {}
  };

  return (
    <AdminLayout title="Manage Testimonials">
      {toast && <div style={{position:'fixed',top:20,right:20,zIndex:9999,padding:'12px 20px',borderRadius:8,fontFamily:'var(--font-heading)',fontSize:'0.9rem',background:toast.type==='error'?'rgba(255,77,77,0.15)':'rgba(6,214,160,0.12)',border:`1px solid ${toast.type==='error'?'var(--red)':'var(--cyan)'}`,color:toast.type==='error'?'var(--red)':'var(--cyan)'}}>{toast.msg}</div>}

      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
        <h2 style={{fontFamily:'var(--font-heading)',fontSize:'1.2rem',fontWeight:700,color:'var(--text-primary)'}}>Testimonials <span style={{color:'var(--text-muted)',fontWeight:400,fontSize:'0.9rem'}}>({items.length})</span></h2>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Testimonial</button>
      </div>

      {loading ? <div className="loading-center"><div className="spinner"/></div> : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))',gap:16}}>
          {items.map(t=>(
            <div key={t.id} style={{background:'var(--bg-card)',border:'1px solid var(--border-subtle)',borderRadius:'var(--radius)',padding:'22px',transition:'var(--transition)',opacity:t.is_active?1:0.6}}>
              <div style={{display:'flex',gap:8,marginBottom:12}}>
                {[1,2,3,4,5].map(s=><svg key={s} width="14" height="14" viewBox="0 0 24 24" fill={s<=t.rating?'var(--gold)':'rgba(255,255,255,0.1)'}><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>)}
              </div>
              <p style={{fontSize:'0.88rem',color:'var(--text-secondary)',lineHeight:1.7,marginBottom:16,fontStyle:'italic'}}>"{t.message}"</p>
              <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:14}}>
                <div style={{width:38,height:38,borderRadius:'50%',background:'linear-gradient(135deg,var(--gold-dark),var(--gold))',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--font-heading)',fontWeight:700,color:'#000',fontSize:'0.9rem'}}>{t.client_name.charAt(0)}</div>
                <div>
                  <div style={{fontFamily:'var(--font-heading)',fontWeight:700,color:'var(--text-primary)',fontSize:'0.9rem'}}>{t.client_name}</div>
                  <div style={{fontSize:'0.75rem',color:'var(--text-muted)'}}>{t.client_business}{t.client_business&&t.client_location?' · ':''}{t.client_location}</div>
                </div>
                <span style={{marginLeft:'auto',fontSize:'0.7rem',padding:'2px 8px',borderRadius:100,background:t.is_active?'rgba(6,214,160,0.1)':'rgba(107,114,128,0.1)',color:t.is_active?'var(--cyan)':'#6b7280',fontFamily:'var(--font-heading)',fontWeight:600}}>{t.is_active?'Active':'Hidden'}</span>
              </div>
              <div style={{display:'flex',gap:8}}>
                <button onClick={()=>toggleActive(t)} style={{flex:1,padding:'7px',borderRadius:6,border:'1px solid var(--border-subtle)',background:'transparent',color:'var(--text-muted)',cursor:'pointer',fontFamily:'var(--font-heading)',fontSize:'0.78rem',fontWeight:600}}>{t.is_active?'Hide':'Show'}</button>
                <button onClick={()=>openEdit(t)} style={{flex:1,padding:'7px',borderRadius:6,border:'1px solid var(--border-gold)',background:'rgba(245,166,35,0.08)',color:'var(--gold)',cursor:'pointer',fontFamily:'var(--font-heading)',fontSize:'0.78rem',fontWeight:600}}>Edit</button>
                <button onClick={()=>handleDelete(t.id)} style={{flex:1,padding:'7px',borderRadius:6,border:'1px solid rgba(255,77,77,0.3)',background:'rgba(255,77,77,0.08)',color:'var(--red)',cursor:'pointer',fontFamily:'var(--font-heading)',fontSize:'0.78rem',fontWeight:600}}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.8)',zIndex:500,display:'flex',alignItems:'center',justifyContent:'center',padding:20}} onClick={()=>setModal(false)}>
          <div style={{background:'var(--bg-card)',border:'1px solid var(--border-subtle)',borderRadius:'var(--radius-lg)',width:'100%',maxWidth:520,maxHeight:'90vh',overflow:'auto'}} onClick={e=>e.stopPropagation()}>
            <div style={{padding:'20px 24px',borderBottom:'1px solid var(--border-subtle)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <h3 style={{fontFamily:'var(--font-heading)',fontSize:'1.1rem',fontWeight:700,color:'var(--text-primary)'}}>{editing?'Edit Testimonial':'Add Testimonial'}</h3>
              <button onClick={()=>setModal(false)} style={{background:'none',border:'none',color:'var(--text-muted)',cursor:'pointer',fontSize:'1.2rem'}}>✕</button>
            </div>
            <div style={{padding:'20px 24px',display:'flex',flexDirection:'column',gap:14}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                <div className="form-group"><label className="form-label">Client Name *</label><input className="form-input" value={form.client_name} onChange={e=>setForm(p=>({...p,client_name:e.target.value}))} placeholder="Rajesh Sharma"/></div>
                <div className="form-group"><label className="form-label">Business Name</label><input className="form-input" value={form.client_business} onChange={e=>setForm(p=>({...p,client_business:e.target.value}))} placeholder="Sharma Medical Center"/></div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                <div className="form-group"><label className="form-label">Location</label><input className="form-input" value={form.client_location} onChange={e=>setForm(p=>({...p,client_location:e.target.value}))} placeholder="Nashik, MH"/></div>
                <div className="form-group">
                  <label className="form-label">Rating</label>
                  <div style={{display:'flex',gap:8,marginTop:6}}>
                    {[1,2,3,4,5].map(s=>(
                      <button key={s} type="button" onClick={()=>setForm(p=>({...p,rating:s}))} style={{background:'none',border:'none',cursor:'pointer',padding:2,fontSize:'1.4rem',filter:s<=form.rating?'none':'grayscale(1) opacity(0.3)'}}>⭐</button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="form-group"><label className="form-label">Testimonial Message *</label><textarea className="form-textarea" value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))} placeholder="What the client said about Smart Art..." style={{minHeight:100}}/></div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-select" value={form.is_active} onChange={e=>setForm(p=>({...p,is_active:parseInt(e.target.value)}))}>
                  <option value={1}>Active (visible on website)</option><option value={0}>Hidden</option>
                </select>
              </div>
            </div>
            <div style={{padding:'16px 24px',borderTop:'1px solid var(--border-subtle)',display:'flex',gap:12,justifyContent:'flex-end'}}>
              <button className="btn btn-ghost" onClick={()=>setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving?'Saving...':'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
export default AdminTestimonials;
