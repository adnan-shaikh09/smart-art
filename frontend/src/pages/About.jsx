import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { publicApi } from '../utils/api';

export default function About() {
  const [founderPhoto, setFounderPhoto] = useState('');
  const [ownerName, setOwnerName] = useState('Atik Shaikh');

  useEffect(() => {
    document.title = 'About | Smart Art - Nashik';
    publicApi.getSettings().then(r => {
      const d = r.data.data || {};
      if (d.founder_photo) setFounderPhoto(d.founder_photo);
      if (d.owner_name) setOwnerName(d.owner_name);
    }).catch(() => {});
  }, []);

  const values = [
    { icon:'🎯', title:'Precision Craftsmanship', desc:'CNC & laser tech delivering ±0.1mm accuracy on every cut.' },
    { icon:'⚡', title:'Fast Turnaround',         desc:'Rush delivery available. We respect your business timeline.' },
    { icon:'💰', title:'Best Value in Nashik',    desc:'Premium quality at prices that respect your budget.' },
    { icon:'🛡️', title:'5-Year Warranty',         desc:'All LED boards come with a comprehensive quality guarantee.' },
  ];

  const milestones = [
    { year:'2016', event:'Smart Art founded by Atik Shaikh in Nashik with a single CNC machine.' },
    { year:'2018', event:'Expanded services to include laser cutting and LED illumination.' },
    { year:'2020', event:'Crossed 500+ projects milestone. Moved to larger studio.' },
    { year:'2022', event:'Added 2 more CNC routers and industrial laser cutters. Team grew to 10.' },
    { year:'2024', event:'Serving clients across 12+ cities in Maharashtra. 1200+ happy clients.' },
  ];

  const initials = ownerName.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2);

  return (
    <div style={{ paddingTop:'var(--navbar-h)' }}>
      {/* Hero */}
      <section style={{ background:'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(245,166,35,0.08) 0%, transparent 60%), var(--bg-primary)', padding:'80px 0 60px', textAlign:'center' }}>
        <div className="container">
          <div className="section-label">Our Story</div>
          <h1 className="section-title" style={{ fontSize:'clamp(2.2rem,5vw,3.8rem)', marginTop:8 }}>About <span>Smart Art</span></h1>
          <p className="section-desc">Built on precision, passion, and a promise to make every business shine brighter.</p>
        </div>
      </section>

      {/* Founder Story */}
      <section className="section">
        <div className="container">
          <div className="about-story-grid">
            <div>
              <div className="section-label" style={{ justifyContent:'flex-start' }}>The Founder</div>
              <h2 className="section-title" style={{ textAlign:'left', margin:'12px 0 18px', fontSize:'clamp(1.8rem,3vw,2.6rem)' }}>
                Meet <span>{ownerName}</span>
              </h2>
              <p style={{ color:'var(--text-secondary)', lineHeight:1.9, marginBottom:14, fontSize:'0.96rem' }}>
                With over 8 years of experience in the signage industry, Atik Shaikh founded Smart Art with a singular vision — to bring world-class signage quality to Nashik's businesses at honest prices.
              </p>
              <p style={{ color:'var(--text-secondary)', lineHeight:1.9, marginBottom:14, fontSize:'0.96rem' }}>
                Starting with a single CNC machine in a small workshop, Atik combined technical mastery with an eye for design to build Nashik's most trusted name in custom signage. Today, Smart Art has completed over 1,200 projects and served businesses from local shops to hospital chains across Maharashtra.
              </p>
              <p style={{ color:'var(--text-secondary)', lineHeight:1.9, marginBottom:28, fontSize:'0.96rem' }}>
                "Every sign I make is a piece of someone's dream business. That responsibility drives me to deliver perfection every single time." — <strong style={{ color:'var(--gold)' }}>{ownerName}</strong>
              </p>
              <Link to="/contact" className="btn btn-primary">Talk to Atik Directly</Link>
            </div>

            <div className="about-card-wrap">
              <div style={{ background:'var(--bg-card)', border:'1px solid var(--border-gold)', borderRadius:'var(--radius-lg)', padding:32, position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:'linear-gradient(90deg, var(--gold-dark), var(--gold), var(--gold-light))' }}/>
                <div style={{ textAlign:'center', marginBottom:24 }}>
                  {/* Founder photo */}
                  <div style={{ width:180, height:180, borderRadius:'50%', overflow:'hidden', margin:'0 auto 22px', border:'4px solid var(--gold)', boxShadow:'0 0 35px rgba(245,166,35,0.35)', background:'linear-gradient(135deg, var(--gold-dark), var(--gold))', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {founderPhoto
                      ? <img src={founderPhoto} alt={ownerName} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                      : <span style={{ fontFamily:'var(--font-display)', fontSize:'3.2rem', fontWeight:700, color:'#000' }}>{initials}</span>
                    }
                  </div>
                  <div style={{ fontFamily:'var(--font-heading)', fontSize:'1.2rem', fontWeight:700, color:'var(--text-primary)' }}>{ownerName}</div>
                  <div style={{ fontSize:'0.83rem', color:'var(--gold)', marginTop:4 }}>Founder & Creative Director</div>
                </div>
                {[
                  { label:'Specialisation', value:'CNC & Laser Signage' },
                  { label:'Experience',     value:'8+ Years' },
                  { label:'Location',       value:'Nashik, Maharashtra' },
                  { label:'Projects Done',  value:'1200+' },
                ].map((row,i) => (
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'11px 0', borderBottom:i<3?'1px solid var(--border-subtle)':'none' }}>
                    <span style={{ fontSize:'0.83rem', color:'var(--text-muted)' }}>{row.label}</span>
                    <span style={{ fontSize:'0.88rem', color:'var(--text-primary)', fontFamily:'var(--font-heading)', fontWeight:600 }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section" style={{ background:'var(--bg-secondary)', borderTop:'1px solid var(--border-subtle)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-label">What We Stand For</div>
            <h2 className="section-title">Our Core <span>Values</span></h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:20 }}>
            {values.map((v,i) => (
              <div key={i} className="card" style={{ textAlign:'center', animation:`fadeInUp 0.4s ease ${i*0.1}s both` }}>
                <div style={{ fontSize:'2.2rem', marginBottom:14 }}>{v.icon}</div>
                <h4 style={{ fontFamily:'var(--font-heading)', fontSize:'1.05rem', fontWeight:700, color:'var(--text-primary)', marginBottom:8 }}>{v.title}</h4>
                <p style={{ fontSize:'0.86rem', color:'var(--text-muted)', lineHeight:1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-label">Our Journey</div>
            <h2 className="section-title">8 Years of <span>Excellence</span></h2>
          </div>
          <div style={{ maxWidth:680, margin:'0 auto' }}>
            {milestones.map((m,i) => (
              <div key={i} className="timeline-item" style={{ display:'flex', gap:20, marginBottom:24, animation:`fadeInUp 0.4s ease ${i*0.1}s both` }}>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
                  <div style={{ width:44, height:44, borderRadius:'50%', background:'rgba(245,166,35,0.12)', border:'1px solid var(--border-gold)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-display)', fontSize:'0.7rem', fontWeight:700, color:'var(--gold)' }}>{m.year}</div>
                  {i<milestones.length-1 && <div style={{ width:1, flex:1, background:'var(--border-gold)', opacity:0.3, minHeight:20, marginTop:6 }}/>}
                </div>
                <div style={{ background:'var(--bg-card)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-sm)', padding:'14px 18px', flex:1, marginBottom:i<milestones.length-1?0:0 }}>
                  <p style={{ fontSize:'0.9rem', color:'var(--text-secondary)', lineHeight:1.7 }}>{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'80px 0', textAlign:'center', background:'var(--bg-secondary)', borderTop:'1px solid var(--border-subtle)' }}>
        <div className="container">
          <h2 className="section-title">Let's Build Something <span>Great</span> Together</h2>
          <p className="section-desc" style={{ marginBottom:32 }}>Ready to elevate your business? We're just a call away.</p>
          <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
            <Link to="/contact" className="btn btn-primary">Get in Touch</Link>
            <Link to="/services" className="btn btn-outline">Our Services</Link>
          </div>
        </div>
      </section>

      <style>{`
        .about-story-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: start;
        }
        .about-card-wrap { display: flex; flex-direction: column; }
        @media (max-width: 900px) {
          .about-story-grid { grid-template-columns: 1fr; gap: 36px; }
          .about-card-wrap { max-width: 440px; margin: 0 auto; width: 100%; }
        }
        @media (max-width: 480px) {
          .about-card-wrap { max-width: 100%; }
        }
      `}</style>
    </div>
  );
}
