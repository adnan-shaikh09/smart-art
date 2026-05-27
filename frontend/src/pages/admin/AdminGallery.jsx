import React, { useEffect, useState, useRef } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminApi } from '../../utils/api';

const CATS = ['general','cnc','laser','led','hospital','restaurant','shop'];
const BLANK = { title:'', description:'', category:'general', is_featured:0, is_active:1, sort_order:0 };

const isVideo = (url = '') => {
  const ext = url.split('.').pop().toLowerCase();
  return ['mp4','webm','mov','avi','mkv','3gp','ogv','m4v'].includes(ext);
};

const MediaPreview = ({ src, style = {} }) => {
  if (!src) return null;
  if (isVideo(src)) {
    return (
      <video src={src} muted playsInline preload="metadata"
        style={{ width:'100%', height:'100%', objectFit:'cover', ...style }}
      />
    );
  }
  return <img src={src} alt="preview" style={{ width:'100%', height:'100%', objectFit:'cover', ...style }}/>;
};

export default function AdminGallery() {
  const [items,      setItems]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [modal,      setModal]      = useState(false);
  const [editing,    setEditing]    = useState(null);
  const [form,       setForm]       = useState(BLANK);
  const [mediaFile,  setMediaFile]  = useState(null);
  const [preview,    setPreview]    = useState(null);
  const [saving,     setSaving]     = useState(false);
  const [progress,   setProgress]   = useState(0);
  const [toast,      setToast]      = useState(null);
  const [filterCat,  setFilterCat]  = useState('all');
  const fileRef = useRef();

  const showToast = (msg, type='success') => { setToast({msg,type}); setTimeout(()=>setToast(null),4000); };

  const load = () => {
    setLoading(true);
    adminApi.getGallery()
      .then(r => setItems(r.data.data || []))
      .catch(() => showToast('Failed to load gallery','error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { document.title='Gallery | Smart Art Admin'; load(); }, []);

  const openAdd = () => { setEditing(null); setForm(BLANK); setMediaFile(null); setPreview(null); setProgress(0); setModal(true); };
  const openEdit = (item) => {
    setEditing(item.id);
    setForm({ title:item.title, description:item.description||'', category:item.category||'general', is_featured:item.is_featured||0, is_active:item.is_active||1, sort_order:item.sort_order||0 });
    setMediaFile(null);
    setPreview(item.image_url || null);
    setProgress(0);
    setModal(true);
  };

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setMediaFile(f);
    // Show local preview immediately
    const url = URL.createObjectURL(f);
    setPreview(url);
    // Auto-fill title if empty
    if (!form.title) {
      const name = f.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
      setForm(p => ({ ...p, title: name }));
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) { showToast('Title is required','error'); return; }
    if (!editing && !mediaFile) { showToast('Please select a video file','error'); return; }

    setSaving(true);
    setProgress(0);

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => fd.append(k, v));
      if (mediaFile) fd.append('image', mediaFile);

      // Use XMLHttpRequest for upload progress tracking
      if (mediaFile) {
        await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          const token = localStorage.getItem('smartart_token');

          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              setProgress(Math.round((e.loaded / e.total) * 100));
            }
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(JSON.parse(xhr.responseText));
            } else {
              reject(new Error(JSON.parse(xhr.responseText)?.message || 'Upload failed'));
            }
          };
          xhr.onerror = () => reject(new Error('Network error'));

          const url = editing
            ? `/api/gallery/${editing}`
            : '/api/gallery';
          xhr.open(editing ? 'PUT' : 'POST', url);
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
          xhr.send(fd);
        });
      } else {
        if (editing) await adminApi.updateGalleryItem(editing, fd);
        else await adminApi.addGalleryItem(fd);
      }

      showToast(editing ? 'Updated!' : 'Video uploaded!');
      setModal(false);
      load();
    } catch (err) {
      showToast(err.message || 'Upload failed','error');
    } finally {
      setSaving(false);
      setProgress(0);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this video permanently?')) return;
    try { await adminApi.deleteGalleryItem(id); showToast('Deleted'); load(); }
    catch { showToast('Delete failed','error'); }
  };

  const filtered = filterCat === 'all' ? items : items.filter(i => i.category === filterCat);

  return (
    <AdminLayout title="Manage Video Gallery">
      {toast && (
        <div style={{ position:'fixed', top:20, right:20, zIndex:9999, padding:'12px 20px', borderRadius:8, fontFamily:'var(--font-heading)', fontSize:'0.9rem', background:toast.type==='error'?'rgba(255,77,77,0.15)':'rgba(6,214,160,0.12)', border:`1px solid ${toast.type==='error'?'var(--red)':'var(--cyan)'}`, color:toast.type==='error'?'var(--red)':'var(--cyan)', maxWidth:360, zIndex:10000 }}>
          {toast.type==='error'?'⚠️':'✅'} {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20, flexWrap:'wrap', gap:12 }}>
        <div style={{ display:'flex', gap:7, flexWrap:'wrap' }}>
          {['all',...CATS].map(c => (
            <button key={c} onClick={() => setFilterCat(c)}
              style={{ padding:'6px 14px', borderRadius:100, border:'1px solid', borderColor:filterCat===c?'var(--gold)':'var(--border-subtle)', background:filterCat===c?'rgba(245,166,35,0.1)':'transparent', color:filterCat===c?'var(--gold)':'var(--text-muted)', fontSize:'0.8rem', fontFamily:'var(--font-heading)', fontWeight:600, cursor:'pointer' }}>
              {c.charAt(0).toUpperCase()+c.slice(1)}
            </button>
          ))}
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Upload Video</button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="loading-center"><div className="spinner"/></div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px 0', color:'var(--text-muted)' }}>
          <div style={{ fontSize:'3rem', marginBottom:12 }}>🎬</div>
          <p style={{ fontFamily:'var(--font-heading)', marginBottom:16 }}>No videos yet. Upload your first video!</p>
          <button className="btn btn-primary" onClick={openAdd}>+ Upload Video</button>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:16 }}>
          {filtered.map(item => (
            <div key={item.id} style={{ background:'var(--bg-card)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius)', overflow:'hidden', transition:'var(--transition)' }}
              onMouseEnter={e => e.currentTarget.style.borderColor='var(--border-gold)'}
              onMouseLeave={e => e.currentTarget.style.borderColor='var(--border-subtle)'}>
              {/* Thumbnail */}
              <div style={{ height:160, overflow:'hidden', position:'relative', background:'#000', cursor:'pointer' }}
                onClick={() => { if(item.image_url) window.open(item.image_url,'_blank'); }}>
                {item.image_url ? (
                  <video src={item.image_url} preload="metadata" muted playsInline
                    style={{ width:'100%', height:'100%', objectFit:'cover' }}
                    onMouseEnter={e => e.target.play()}
                    onMouseLeave={e => { e.target.pause(); e.target.currentTime=0; }}
                  />
                ) : (
                  <div style={{ height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.5rem', color:'var(--text-muted)' }}>🎬</div>
                )}
                {/* Video icon badge */}
                <div style={{ position:'absolute', top:8, right:8, background:'rgba(0,0,0,0.7)', borderRadius:6, padding:'3px 8px', fontSize:'0.65rem', fontFamily:'var(--font-heading)', fontWeight:700, color:'#fff' }}>
                  ▶ VIDEO
                </div>
                {item.is_featured && (
                  <div style={{ position:'absolute', top:8, left:8, background:'rgba(245,166,35,0.9)', color:'#000', fontSize:'0.65rem', fontWeight:700, padding:'2px 8px', borderRadius:100, fontFamily:'var(--font-heading)' }}>⭐ Featured</div>
                )}
                {!item.is_active && (
                  <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'0.8rem', fontFamily:'var(--font-heading)', fontWeight:600 }}>Hidden</div>
                )}
              </div>
              {/* Card info */}
              <div style={{ padding:'12px 14px' }}>
                <div style={{ fontFamily:'var(--font-heading)', fontWeight:700, fontSize:'0.9rem', color:'var(--text-primary)', marginBottom:4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.title}</div>
                <div style={{ display:'flex', gap:6, marginBottom:10 }}>
                  <span style={{ fontSize:'0.7rem', padding:'2px 8px', borderRadius:100, background:'rgba(245,166,35,0.1)', color:'var(--gold)', fontFamily:'var(--font-heading)', fontWeight:600 }}>{item.category}</span>
                  <span style={{ fontSize:'0.7rem', padding:'2px 8px', borderRadius:100, background:item.is_active?'rgba(6,214,160,0.1)':'rgba(107,114,128,0.1)', color:item.is_active?'var(--cyan)':'#6b7280', fontFamily:'var(--font-heading)', fontWeight:600 }}>{item.is_active?'Active':'Hidden'}</span>
                </div>
                <div style={{ display:'flex', gap:6 }}>
                  <button onClick={() => openEdit(item)} style={{ flex:1, padding:'7px', borderRadius:6, border:'1px solid var(--border-gold)', background:'rgba(245,166,35,0.08)', color:'var(--gold)', cursor:'pointer', fontFamily:'var(--font-heading)', fontSize:'0.78rem', fontWeight:600 }}>Edit</button>
                  <button onClick={() => handleDelete(item.id)} style={{ flex:1, padding:'7px', borderRadius:6, border:'1px solid rgba(255,77,77,0.3)', background:'rgba(255,77,77,0.08)', color:'var(--red)', cursor:'pointer', fontFamily:'var(--font-heading)', fontSize:'0.78rem', fontWeight:600 }}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {modal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', zIndex:500, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }} onClick={() => !saving && setModal(false)}>
          <div style={{ background:'var(--bg-card)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-lg)', width:'100%', maxWidth:560, maxHeight:'92vh', overflow:'auto' }} onClick={e => e.stopPropagation()}>
            {/* Modal header */}
            <div style={{ padding:'18px 24px', borderBottom:'1px solid var(--border-subtle)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <h3 style={{ fontFamily:'var(--font-heading)', fontSize:'1.1rem', fontWeight:700, color:'var(--text-primary)', margin:0 }}>
                {editing ? 'Edit Video' : 'Upload New Video'}
              </h3>
              {!saving && <button onClick={() => setModal(false)} style={{ background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer', fontSize:'1.2rem' }}>✕</button>}
            </div>

            <div style={{ padding:'20px 24px', display:'flex', flexDirection:'column', gap:16 }}>
              {/* File drop zone */}
              <div>
                <label style={{ fontFamily:'var(--font-heading)', fontSize:'0.85rem', fontWeight:600, color:'var(--text-muted)', display:'block', marginBottom:8, letterSpacing:'0.06em', textTransform:'uppercase' }}>
                  {editing ? 'Replace Video (optional)' : 'Video File *'}
                </label>
                <div
                  onClick={() => !saving && fileRef.current?.click()}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => { e.preventDefault(); const f=e.dataTransfer.files[0]; if(f){ const dummy={target:{files:[f]}}; handleFile(dummy); }}}
                  style={{ border:`2px dashed ${preview?'var(--border-gold)':'var(--border-subtle)'}`, borderRadius:'var(--radius)', overflow:'hidden', cursor:saving?'not-allowed':'pointer', background:'rgba(255,255,255,0.02)', minHeight:180, display:'flex', alignItems:'center', justifyContent:'center', transition:'border-color 0.2s', position:'relative' }}
                  onMouseEnter={e => { if(!saving) e.currentTarget.style.borderColor='var(--gold)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor=preview?'var(--border-gold)':'var(--border-subtle)'; }}
                >
                  {preview ? (
                    <div style={{ position:'absolute', inset:0 }}>
                      {isVideo(preview) || (mediaFile && mediaFile.type?.startsWith('video/')) ? (
                        <video src={preview} preload="metadata" muted playsInline style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                      ) : (
                        <img src={preview} alt="preview" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                      )}
                      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <div style={{ color:'#fff', textAlign:'center', fontFamily:'var(--font-heading)', fontSize:'0.85rem' }}>
                          <div style={{ fontSize:'1.5rem', marginBottom:4 }}>🎬</div>
                          {mediaFile ? `${(mediaFile.size/1024/1024).toFixed(1)} MB · ${mediaFile.name.split('.').pop().toUpperCase()}` : 'Click to change'}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign:'center', padding:24, color:'var(--text-muted)' }}>
                      <div style={{ fontSize:'3rem', marginBottom:12 }}>🎬</div>
                      <div style={{ fontFamily:'var(--font-heading)', fontWeight:600, color:'var(--text-secondary)', marginBottom:6 }}>
                        Click or drag to upload video
                      </div>
                      <div style={{ fontSize:'0.8rem', lineHeight:1.7 }}>
                        <span style={{ color:'var(--cyan)', fontWeight:600 }}>All formats accepted</span>
                        <br/>MP4, MOV, AVI, MKV, WEBM, 3GP and more
                        <br/><span style={{ color:'var(--gold)', fontWeight:600 }}>No size limit</span>
                      </div>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="video/*,image/*" style={{ display:'none' }} onChange={handleFile} disabled={saving}/>

                {/* Upload progress */}
                {saving && progress > 0 && (
                  <div style={{ marginTop:10 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', fontFamily:'var(--font-heading)', fontSize:'0.8rem', color:'var(--text-muted)', marginBottom:5 }}>
                      <span>Uploading video...</span>
                      <span style={{ color:'var(--gold)', fontWeight:700 }}>{progress}%</span>
                    </div>
                    <div style={{ height:6, background:'rgba(255,255,255,0.06)', borderRadius:3, overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${progress}%`, background:'linear-gradient(90deg, var(--gold-dark), var(--gold))', borderRadius:3, transition:'width 0.3s ease' }}/>
                    </div>
                    <div style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginTop:5 }}>
                      Large videos may take a few minutes. Please don't close this window.
                    </div>
                  </div>
                )}
              </div>

              {/* Form fields */}
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input className="form-input" value={form.title} onChange={e => setForm(p=>({...p,title:e.target.value}))} placeholder="e.g. LED Board Installation at Hotel Grand" disabled={saving}/>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" value={form.description} onChange={e => setForm(p=>({...p,description:e.target.value}))} placeholder="Brief description of the project..." style={{ minHeight:70 }} disabled={saving}/>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={form.category} onChange={e => setForm(p=>({...p,category:e.target.value}))} disabled={saving}>
                    {CATS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-select" value={form.is_active} onChange={e => setForm(p=>({...p,is_active:parseInt(e.target.value)}))} disabled={saving}>
                    <option value={1}>Active</option>
                    <option value={0}>Hidden</option>
                  </select>
                </div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <input type="checkbox" id="feat" checked={!!form.is_featured} onChange={e => setForm(p=>({...p,is_featured:e.target.checked?1:0}))} style={{ width:16, height:16, accentColor:'var(--gold)' }} disabled={saving}/>
                <label htmlFor="feat" style={{ fontFamily:'var(--font-heading)', fontSize:'0.88rem', color:'var(--text-secondary)', cursor:'pointer' }}>
                  Mark as Featured (appears on homepage)
                </label>
              </div>
            </div>

            {/* Modal footer */}
            <div style={{ padding:'14px 24px', borderTop:'1px solid var(--border-subtle)', display:'flex', gap:12, justifyContent:'flex-end' }}>
              <button className="btn btn-ghost" onClick={() => setModal(false)} disabled={saving}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ minWidth:130 }}>
                {saving ? (
                  <span style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div className="spinner" style={{ width:14, height:14, borderWidth:2 }}/>
                    {progress > 0 ? `${progress}%` : 'Uploading...'}
                  </span>
                ) : (
                  editing ? 'Save Changes' : '⬆ Upload Video'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
