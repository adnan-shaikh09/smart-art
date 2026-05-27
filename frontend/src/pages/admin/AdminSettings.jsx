import React, { useEffect, useState, useRef } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import ImageCropper from '../../components/ImageCropper';
import { adminApi } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function AdminSettings() {
  const { admin } = useAuth();
  const [settings, setSettings] = useState({});
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [testing, setTesting]   = useState(false);
  const [toast, setToast]       = useState(null);
  const [pwForm, setPwForm]     = useState({ currentPassword:'', newPassword:'', confirmPassword:'' });
  const [pwSaving, setPwSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [cropFile, setCropFile]   = useState(null);
  const fileRef = useRef();

  const showToast = (msg, type='success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    document.title = 'Settings | Smart Art Admin';
    adminApi.getSettings()
      .then(r => { setSettings(r.data.data || {}); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const set = (k, v) => setSettings(p => ({ ...p, [k]: v }));

  const saveSettings = async () => {
    setSaving(true);
    try {
      await adminApi.updateSettings(settings);
      showToast('Settings saved!');
    } catch { showToast('Failed to save', 'error'); }
    finally { setSaving(false); }
  };

  const testSmtp = async () => {
    setTesting(true);
    try { const r = await adminApi.testSmtp(); showToast(r.data.message); }
    catch (e) { showToast(e.response?.data?.message || 'SMTP test failed', 'error'); }
    finally { setTesting(false); }
  };

  const changePassword = async () => {
    if (!pwForm.currentPassword || !pwForm.newPassword) { showToast('All fields required', 'error'); return; }
    if (pwForm.newPassword !== pwForm.confirmPassword) { showToast('Passwords do not match', 'error'); return; }
    if (pwForm.newPassword.length < 6) { showToast('Min 6 characters', 'error'); return; }
    setPwSaving(true);
    try {
      await adminApi.changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      showToast('Password changed!');
      setPwForm({ currentPassword:'', newPassword:'', confirmPassword:'' });
    } catch (e) { showToast(e.response?.data?.message || 'Failed', 'error'); }
    finally { setPwSaving(false); }
  };

  const handlePhotoCrop = async (base64) => {
    setCropFile(null);
    set('founder_photo', base64);
    try {
      await adminApi.updateSettings({ founder_photo: base64 });
      showToast('Founder photo updated!');
    } catch { showToast('Failed to save photo', 'error'); }
  };

  const removePhoto = async () => {
    set('founder_photo', '');
    try {
      await adminApi.updateSettings({ founder_photo: '' });
      showToast('Photo removed');
    } catch { showToast('Failed', 'error'); }
  };

  const TABS = [
    { key:'general', label:'General Info',  icon:'🏪' },
    { key:'photo',   label:'Founder Photo', icon:'👤' },
    { key:'email',   label:'Email / SMTP',  icon:'✉️' },
    { key:'account', label:'Account',       icon:'🔒' },
  ];

  const Field = ({ label, skey, type='text', placeholder='' }) => (
    <div className="form-group" style={{ marginBottom:14 }}>
      <label className="form-label">{label}</label>
      <input className="form-input" type={type} value={settings[skey]||''} onChange={e => set(skey, e.target.value)} placeholder={placeholder} />
    </div>
  );

  return (
    <AdminLayout title="Settings">
      {cropFile && (
        <ImageCropper
          file={cropFile}
          onCrop={handlePhotoCrop}
          onCancel={() => setCropFile(null)}
          cropShape="circle"
        />
      )}

      {toast && (
        <div style={{ position:'fixed', top:20, right:20, zIndex:9999, padding:'12px 20px', borderRadius:8, fontFamily:'var(--font-heading)', fontSize:'0.9rem', background:toast.type==='error'?'rgba(255,77,77,0.15)':'rgba(6,214,160,0.12)', border:`1px solid ${toast.type==='error'?'var(--red)':'var(--cyan)'}`, color:toast.type==='error'?'var(--red)':'var(--cyan)', maxWidth:360 }}>
          {toast.type==='error'?'⚠️':'✅'} {toast.msg}
        </div>
      )}

      {loading ? <div className="loading-center"><div className="spinner"/></div> : (
        <div style={{ display:'grid', gridTemplateColumns:'200px 1fr', gap:20, alignItems:'start' }}>
          {/* Tab sidebar */}
          <div style={{ background:'var(--bg-card)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius)', padding:10, position:'sticky', top:80 }}>
            {TABS.map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)} style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'9px 12px', borderRadius:7, border:'1px solid', borderColor:activeTab===t.key?'var(--border-gold)':'transparent', background:activeTab===t.key?'rgba(245,166,35,0.08)':'transparent', color:activeTab===t.key?'var(--gold)':'var(--text-muted)', fontFamily:'var(--font-heading)', fontSize:'0.86rem', fontWeight:600, cursor:'pointer', textAlign:'left', marginBottom:3 }}>
                <span>{t.icon}</span>{t.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{ background:'var(--bg-card)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius)', overflow:'hidden' }}>

            {/* General */}
            {activeTab==='general' && (
              <>
                <div style={{ padding:'18px 24px', borderBottom:'1px solid var(--border-subtle)', background:'var(--bg-secondary)' }}>
                  <h3 style={{ fontFamily:'var(--font-heading)', fontSize:'1.05rem', fontWeight:700, color:'var(--text-primary)', margin:0 }}>🏪 General Business Information</h3>
                </div>
                <div style={{ padding:24 }}>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                    <Field label="Business Name" skey="site_name" placeholder="Smart Art"/>
                    <Field label="Owner Name" skey="owner_name" placeholder="Atik Shaikh"/>
                    <Field label="Primary Phone" skey="phone_primary" placeholder="+91 98765 43210"/>
                    <Field label="Secondary Phone" skey="phone_secondary"/>
                    <Field label="Email Address" skey="email" type="email"/>
                    <Field label="WhatsApp Number" skey="whatsapp" placeholder="+919876543210"/>
                  </div>
                  <Field label="Business Address" skey="address"/>
                  <Field label="Business Hours" skey="business_hours"/>
                  <Field label="Tagline" skey="tagline" placeholder="Crafting Identity. Illuminating Brands."/>
                  <div className="form-group" style={{ marginBottom:14 }}>
                    <label className="form-label">About (Short)</label>
                    <textarea className="form-textarea" value={settings.about_short||''} onChange={e => set('about_short',e.target.value)} style={{ minHeight:70 }}/>
                  </div>
                  <button className="btn btn-primary" onClick={saveSettings} disabled={saving}>{saving?'Saving...':'Save General Settings'}</button>
                </div>
              </>
            )}

            {/* Founder Photo */}
            {activeTab==='photo' && (
              <>
                <div style={{ padding:'18px 24px', borderBottom:'1px solid var(--border-subtle)', background:'var(--bg-secondary)' }}>
                  <h3 style={{ fontFamily:'var(--font-heading)', fontSize:'1.05rem', fontWeight:700, color:'var(--text-primary)', margin:0 }}>👤 Founder Photo</h3>
                  <p style={{ fontSize:'0.8rem', color:'var(--text-muted)', marginTop:4 }}>This photo appears on the About page next to Atik Shaikh's profile.</p>
                </div>
                <div style={{ padding:24 }}>
                  <div style={{ display:'flex', alignItems:'flex-start', gap:32, flexWrap:'wrap' }}>
                    {/* Current photo */}
                    <div style={{ textAlign:'center' }}>
                      <div style={{ width:140, height:140, borderRadius:'50%', border:'2px solid var(--border-gold)', overflow:'hidden', background:'linear-gradient(135deg,var(--gold-dark),var(--gold))', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12 }}>
                        {settings.founder_photo
                          ? <img src={settings.founder_photo} alt="Founder" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                          : <span style={{ fontFamily:'var(--font-display)', fontSize:'2.5rem', fontWeight:700, color:'#000' }}>AS</span>
                        }
                      </div>
                      <div style={{ fontFamily:'var(--font-heading)', fontSize:'0.82rem', color:'var(--text-muted)' }}>
                        {settings.founder_photo ? '✅ Photo set' : 'No photo set'}
                      </div>
                    </div>

                    {/* Upload controls */}
                    <div style={{ flex:1, minWidth:240 }}>
                      <div style={{ background:'rgba(245,166,35,0.04)', border:'1px solid var(--border-gold)', borderRadius:10, padding:20, marginBottom:16 }}>
                        <div style={{ fontFamily:'var(--font-heading)', fontWeight:700, color:'var(--gold)', marginBottom:8, fontSize:'0.9rem' }}>📸 Upload Photo</div>
                        <p style={{ fontSize:'0.82rem', color:'var(--text-muted)', lineHeight:1.7, marginBottom:14 }}>
                          Upload a clear photo of Atik Shaikh. After selecting, you can <strong style={{ color:'var(--text-primary)' }}>crop and zoom</strong> the image before saving.
                        </p>
                        <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e => { if(e.target.files[0]) setCropFile(e.target.files[0]); }}/>
                        <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                          <button className="btn btn-primary" onClick={() => fileRef.current?.click()} style={{ fontSize:'0.88rem', padding:'9px 20px' }}>
                            📁 Choose Photo
                          </button>
                          {settings.founder_photo && (
                            <button className="btn btn-ghost" onClick={removePhoto} style={{ fontSize:'0.88rem', padding:'9px 16px', color:'var(--red)', borderColor:'rgba(255,77,77,0.3)' }}>
                              🗑 Remove
                            </button>
                          )}
                        </div>
                      </div>
                      <div style={{ background:'rgba(6,214,160,0.05)', border:'1px solid rgba(6,214,160,0.2)', borderRadius:8, padding:'12px 14px', fontSize:'0.8rem', color:'var(--text-muted)', lineHeight:1.7 }}>
                        <strong style={{ color:'var(--cyan)' }}>Tip:</strong> Best results with a square photo, minimum 400×400px. The crop tool will help you frame the photo perfectly.
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            {activeTab==='email' && (
              <>
                <div style={{ padding:'18px 24px', borderBottom:'1px solid var(--border-subtle)', background:'var(--bg-secondary)' }}>
                  <h3 style={{ fontFamily:'var(--font-heading)', fontSize:'1.05rem', fontWeight:700, color:'var(--text-primary)', margin:0 }}>✉️ Email Notification Settings</h3>
                </div>
                <div style={{ padding:24 }}>
                  <div style={{ background:'rgba(245,166,35,0.06)', border:'1px solid var(--border-gold)', borderRadius:10, padding:'14px 18px', marginBottom:20 }}>
                    <div style={{ fontFamily:'var(--font-heading)', fontWeight:700, color:'var(--gold)', marginBottom:6, fontSize:'0.88rem' }}>📧 How It Works</div>
                    <ul style={{ color:'var(--text-muted)', fontSize:'0.82rem', lineHeight:1.9, paddingLeft:18, margin:0 }}>
                      <li>When a client submits the contact form, an alert is sent to <strong style={{ color:'var(--text-primary)' }}>Admin Notification Email</strong></li>
                      <li>Client receives an auto-reply confirmation if they provided email</li>
                      <li>Uses Gmail App Password or any SMTP provider</li>
                    </ul>
                  </div>
                  <div style={{ fontFamily:'var(--font-heading)', fontWeight:700, color:'var(--text-primary)', marginBottom:10, fontSize:'0.9rem' }}>📬 Notification Destination</div>
                  <Field label="Admin Notification Email *" skey="admin_notify_email" type="email" placeholder="atik@smartart.in"/>
                  <div style={{ height:1, background:'var(--border-subtle)', margin:'20px 0' }}/>
                  <div style={{ fontFamily:'var(--font-heading)', fontWeight:700, color:'var(--text-primary)', marginBottom:10, fontSize:'0.9rem' }}>⚙️ SMTP Configuration</div>
                  <div style={{ background:'rgba(6,214,160,0.05)', border:'1px solid rgba(6,214,160,0.2)', borderRadius:8, padding:'10px 14px', marginBottom:16, fontSize:'0.8rem', color:'var(--text-muted)' }}>
                    <strong style={{ color:'var(--cyan)' }}>Gmail:</strong> Google Account → Security → 2-Step Verification → App Passwords → Generate for "Mail"
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                    <Field label="SMTP Host" skey="smtp_host" placeholder="smtp.gmail.com"/>
                    <Field label="SMTP Port" skey="smtp_port" placeholder="587"/>
                    <Field label="SMTP Username" skey="smtp_user" placeholder="yourname@gmail.com"/>
                    <div className="form-group" style={{ marginBottom:14 }}>
                      <label className="form-label">SMTP Password</label>
                      <input className="form-input" type="password" value={settings.smtp_pass||''} onChange={e => set('smtp_pass',e.target.value)} placeholder="App password"/>
                    </div>
                    <Field label="From Name" skey="smtp_from_name" placeholder="Smart Art Website"/>
                  </div>
                  <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginTop:8 }}>
                    <button className="btn btn-primary" onClick={saveSettings} disabled={saving}>{saving?'Saving...':'Save Email Settings'}</button>
                    <button className="btn btn-outline" onClick={testSmtp} disabled={testing} style={{ display:'flex', alignItems:'center', gap:8 }}>
                      {testing ? <><div className="spinner" style={{ width:14, height:14, borderWidth:2 }}/>Testing...</> : <>🔌 Test SMTP</>}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Account */}
            {activeTab==='account' && (
              <>
                <div style={{ padding:'18px 24px', borderBottom:'1px solid var(--border-subtle)', background:'var(--bg-secondary)' }}>
                  <h3 style={{ fontFamily:'var(--font-heading)', fontSize:'1.05rem', fontWeight:700, color:'var(--text-primary)', margin:0 }}>🔒 Account Settings</h3>
                </div>
                <div style={{ padding:24 }}>
                  <div style={{ background:'var(--bg-secondary)', border:'1px solid var(--border-subtle)', borderRadius:10, padding:18, marginBottom:24, display:'flex', alignItems:'center', gap:14 }}>
                    <div style={{ width:52, height:52, borderRadius:'50%', background:'linear-gradient(135deg,var(--gold-dark),var(--gold))', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-display)', fontSize:'1.1rem', fontWeight:700, color:'#000' }}>
                      {admin?.name?.charAt(0)||'A'}
                    </div>
                    <div>
                      <div style={{ fontFamily:'var(--font-heading)', fontWeight:700, color:'var(--text-primary)', fontSize:'1rem' }}>{admin?.name}</div>
                      <div style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>{admin?.email} · Administrator</div>
                    </div>
                  </div>
                  <h4 style={{ fontFamily:'var(--font-heading)', fontWeight:700, color:'var(--text-primary)', marginBottom:14, fontSize:'0.92rem' }}>🔑 Change Password</h4>
                  <div style={{ maxWidth:400 }}>
                    {[['Current Password','currentPassword'],['New Password','newPassword'],['Confirm New Password','confirmPassword']].map(([lbl,key]) => (
                      <div className="form-group" key={key} style={{ marginBottom:12 }}>
                        <label className="form-label">{lbl}</label>
                        <input className="form-input" type="password" value={pwForm[key]} onChange={e => setPwForm(p=>({...p,[key]:e.target.value}))} placeholder="••••••••"/>
                      </div>
                    ))}
                    <button className="btn btn-primary" onClick={changePassword} disabled={pwSaving} style={{ marginTop:4 }}>{pwSaving?'Changing...':'Change Password'}</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .settings-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </AdminLayout>
  );
}
