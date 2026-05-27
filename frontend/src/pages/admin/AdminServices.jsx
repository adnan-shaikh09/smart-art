import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminApi } from '../../utils/api';

const BLANK = { title:'', short_desc:'', description:'', icon:'shop', features:'', is_active:1, sort_order:0 };

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type='success') => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

  const load = () => {
    setLoading(true);
    adminApi.getServices().then(r=>{ setServices(r.data.data); setLoading(false); }).catch(()=>setLoading(false));
  };

  useEffect(()=>{ document.title='Services | Smart Art Admin'; load(); },[]);

  const openAdd = () => { setEditing(null); setForm(BLANK); setModal(true); };
  const openEdit = (s) => {
    setEditing(s.id);
    setForm({ title:s.title, short_desc:s.short_desc||'', description:s.description, icon:s.icon||'shop', features:Array.isArray(s.features)?s.features.join('\n'):s.features||'', is_active:s.is_active, sort_order:s.sort_order||0 });
    setModal(true);
  };

  const handleSave = async () => {
    if(!form.title.trim()||!form.description.trim()){ showToast('Title and description required','error'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v])=>{ if(k==='features'){ const arr=v.split('\n').map(x=>x.trim()).filter(Boolean); fd.append('features',JSON.stringify(arr)); } else fd.append(k,v); });
      if(editing) await adminApi.updateService(editing, fd);
      else await adminApi.createService(fd);
      showToast(editing?'Service updated!':'Service created!');
      setModal(false); load();
    } catch { showToast('Save failed','error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Delete this service?')) return;
    try { await adminApi.deleteService(id); showToast('Deleted'); load(); }
    catch { showToast('Delete failed','error'); }
  };

  const toggle = async (s) => {
    const fd = new FormData();
    fd.append('title', s.title); fd.append('description', s.description);
    fd.append('is_active', s.is_active ? 0 : 1);
    try { await adminApi.updateService(s.id, fd); load(); } catch {}
  };

  return (
    <AdminLayout title="Manage Services">
      {toast && <div style={{position:'fixed',top:20,right:20,zIndex:9999,padding:'12px 20px',borderRadius:8,fontFamily:'var(--font-heading)',fontSize:'0.9rem',background:toast.type==='error'?'rgba(255,77,77,0.15)':'rgba(6,214,160,0.12)',border:`1px solid ${toast.type==='error'?'var(--red)':'var(--cyan)'}`,color:toast.type==='error'?'var(--red)':'var(--cyan)',animation:'slideInRight 0.3s ease'}}>{toast.msg}</div>}

      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
        <div><h2 style={{fontFamily:'var(--font-heading)',fontSize:'1.2rem',fontWeight:700,color:'var(--text-primary)'}}>Services <span style={{color:'var(--text-muted)',fontWeight:400,fontSize:'0.9rem'}}>({services.length})</span></h2></div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Service</button>
      </div>

      {loading ? <div className="loading-center"><div className="spinner"/></div> : (
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {services.map((s,i)=>(
            <div key={s.id} style={{background:'var(--bg-card)',border:'1px solid var(--border-subtle)',borderRadius:'var(--radius)',padding:'20px 24px',display:'flex',alignItems:'center',gap:20,transition:'var(--transition)'}}>
              <div style={{width:44,height:44,borderRadius:10,background:'rgba(245,166,35,0.08)',border:'1px solid var(--border-gold)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--font-display)',fontWeight:700,color:'var(--gold)',fontSize:'0.8rem',flexShrink:0}}>{String(i+1).padStart(2,'0')}</div>
              <div style={{flex:1,overflow:'hidden'}}>
                <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:4}}>
                  <span style={{fontFamily:'var(--font-heading)',fontWeight:700,color:'var(--text-primary)',fontSize:'1rem'}}>{s.title}</span>
                  <span style={{fontSize:'0.7rem',padding:'2px 8px',borderRadius:100,background:s.is_active?'rgba(6,214,160,0.1)':'rgba(107,114,128,0.1)',color:s.is_active?'var(--cyan)':'#6b7280',fontFamily:'var(--font-heading)',fontWeight:600}}>{s.is_active?'Active':'Hidden'}</span>
                </div>
                <div style={{fontSize:'0.85rem',color:'var(--text-muted)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{s.short_desc}</div>
              </div>
              <div style={{display:'flex',gap:8,flexShrink:0}}>
                <button onClick={()=>toggle(s)} style={{padding:'7px 14px',borderRadius:8,border:'1px solid var(--border-subtle)',background:'transparent',color:'var(--text-muted)',cursor:'pointer',fontFamily:'var(--font-heading)',fontSize:'0.8rem',fontWeight:600}}>{s.is_active?'Hide':'Show'}</button>
                <button onClick={()=>openEdit(s)} style={{padding:'7px 14px',borderRadius:8,border:'1px solid var(--border-gold)',background:'rgba(245,166,35,0.08)',color:'var(--gold)',cursor:'pointer',fontFamily:'var(--font-heading)',fontSize:'0.8rem',fontWeight:600}}>Edit</button>
                <button onClick={()=>handleDelete(s.id)} style={{padding:'7px 14px',borderRadius:8,border:'1px solid rgba(255,77,77,0.3)',background:'rgba(255,77,77,0.08)',color:'var(--red)',cursor:'pointer',fontFamily:'var(--font-heading)',fontSize:'0.8rem',fontWeight:600}}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.8)',zIndex:500,display:'flex',alignItems:'center',justifyContent:'center',padding:20}} onClick={()=>setModal(false)}>
          <div style={{background:'var(--bg-card)',border:'1px solid var(--border-subtle)',borderRadius:'var(--radius-lg)',width:'100%',maxWidth:600,maxHeight:'90vh',overflow:'auto'}} onClick={e=>e.stopPropagation()}>
            <div style={{padding:'24px 28px',borderBottom:'1px solid var(--border-subtle)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <h3 style={{fontFamily:'var(--font-heading)',fontSize:'1.1rem',fontWeight:700,color:'var(--text-primary)'}}>{editing?'Edit Service':'Add New Service'}</h3>
              <button onClick={()=>setModal(false)} style={{background:'none',border:'none',color:'var(--text-muted)',cursor:'pointer',fontSize:'1.2rem'}}>✕</button>
            </div>
            <div style={{padding:'24px 28px',display:'flex',flexDirection:'column',gap:16}}>
              {[['Title *','title','text'],['Short Description','short_desc','text'],['Icon Key','icon','text']].map(([lbl,key,type])=>(
                <div className="form-group" key={key}>
                  <label className="form-label">{lbl}</label>
                  <input className="form-input" type={type} value={form[key]} onChange={e=>setForm(p=>({...p,[key]:e.target.value}))} placeholder={lbl}/>
                </div>
              ))}
              <div className="form-group">
                <label className="form-label">Full Description *</label>
                <textarea className="form-textarea" value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} placeholder="Detailed description..." style={{minHeight:100}}/>
              </div>
              <div className="form-group">
                <label className="form-label">Features (one per line)</label>
                <textarea className="form-textarea" value={form.features} onChange={e=>setForm(p=>({...p,features:e.target.value}))} placeholder={"Custom shapes\nFast delivery\nWeather resistant"} style={{minHeight:90}}/>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-select" value={form.is_active} onChange={e=>setForm(p=>({...p,is_active:parseInt(e.target.value)}))}>
                    <option value={1}>Active</option><option value={0}>Hidden</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Sort Order</label>
                  <input className="form-input" type="number" value={form.sort_order} onChange={e=>setForm(p=>({...p,sort_order:parseInt(e.target.value)||0}))}/>
                </div>
              </div>
            </div>
            <div style={{padding:'16px 28px',borderTop:'1px solid var(--border-subtle)',display:'flex',gap:12,justifyContent:'flex-end'}}>
              <button className="btn btn-ghost" onClick={()=>setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving?'Saving...':'Save Service'}</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
export default AdminServices;
