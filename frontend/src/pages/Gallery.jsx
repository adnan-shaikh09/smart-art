import React, { useEffect, useState, useRef, useCallback } from 'react';
import { publicApi } from '../utils/api';

const CATEGORIES = [
  { key: 'all',        label: 'All Videos' },
  { key: 'cnc',        label: 'CNC Cutting' },
  { key: 'laser',      label: 'Laser Cut' },
  { key: 'led',        label: 'LED Boards' },
  { key: 'hospital',   label: 'Hospital' },
  { key: 'restaurant', label: 'Restaurant' },
  { key: 'shop',       label: 'Shop/Retail' },
];

// ── Individual video card ────────────────────────────────────
const VideoCard = ({ item, onOpen }) => {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const handleEnter = () => {
    const v = videoRef.current;
    if (!v || !item.image_url) return;
    v.muted = true;
    v.play().then(() => setPlaying(true)).catch(() => {});
  };
  const handleLeave = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause(); v.currentTime = 0; setPlaying(false);
  };

  return (
    <div className="vid-card" onClick={() => onOpen(item)}
      onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <div className="vid-inner">
        {item.image_url ? (
          <video ref={videoRef} src={item.image_url}
            muted playsInline preload="metadata" loop
            style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}/>
        ) : (
          <div className="vid-placeholder"><span>🎬</span></div>
        )}
        <div className={`vid-overlay${playing ? ' playing' : ''}`}>
          {!playing && (
            <div className="play-btn">
              <svg viewBox="0 0 24 24" fill="white" width="32" height="32">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          )}
          <div className="vid-info">
            {item.is_featured && <span className="featured-tag">⭐ Featured</span>}
            <span className="cat-tag">{item.category}</span>
            <h4 className="vid-title">{item.title}</h4>
            {item.description && <p className="vid-desc">{item.description}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Lightbox ─────────────────────────────────────────────────
const Lightbox = ({ item, onClose, onPrev, onNext, hasPrev, hasNext }) => {
  const videoRef = useRef(null);
  useEffect(() => {
    videoRef.current?.play().catch(() => {});
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && hasNext) onNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [item]);

  return (
    <div className="lightbox" onClick={onClose}>
      <button className="lb-close" onClick={onClose}>✕</button>
      {hasPrev && <button className="lb-nav lb-prev" onClick={e=>{e.stopPropagation();onPrev();}}>‹</button>}
      {hasNext && <button className="lb-nav lb-next" onClick={e=>{e.stopPropagation();onNext();}}>›</button>}
      <div className="lb-content" onClick={e=>e.stopPropagation()}>
        {item.image_url
          ? <video ref={videoRef} src={item.image_url} controls playsInline autoPlay className="lb-video"/>
          : <div className="lb-placeholder">🎬 Video unavailable</div>
        }
        <div className="lb-info">
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            <span className="cat-tag">{item.category}</span>
            {item.is_featured && <span className="featured-tag">⭐ Featured</span>}
          </div>
          <h3 className="lb-title">{item.title}</h3>
          {item.description && <p className="lb-desc">{item.description}</p>}
        </div>
      </div>
    </div>
  );
};

// ── Main Gallery ──────────────────────────────────────────────
export default function Gallery() {
  const [items,        setItems]        = useState([]);
  const [filtered,     setFiltered]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxItem, setLightboxItem] = useState(null);
  const [error,        setError]        = useState(null);

  // Horizontal scroll state (desktop only)
  const scrollRef        = useRef(null);
  const [progress,       setProgress]       = useState(0);
  const [canLeft,        setCanLeft]        = useState(false);
  const [canRight,       setCanRight]       = useState(false);
  const [isDragging,     setIsDragging]     = useState(false);
  const dragStartX       = useRef(0);
  const dragScrollLeft   = useRef(0);

  const isMobile = () => window.innerWidth <= 768;

  useEffect(() => {
    document.title = 'Video Gallery | Smart Art - Nashik';
    publicApi.getGallery()
      .then(r => { const d = r.data.data||[]; setItems(d); setFiltered(d); })
      .catch(() => setError('Failed to load gallery.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setFiltered(activeFilter==='all' ? items : items.filter(i=>i.category===activeFilter));
    // Reset scroll position on filter change
    if (scrollRef.current) scrollRef.current.scrollLeft = 0;
  }, [activeFilter, items]);

  const updateScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? (el.scrollLeft / max) * 100 : 0);
    setCanLeft(el.scrollLeft > 2);
    setCanRight(el.scrollLeft < max - 2);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    // Set initial state
    setTimeout(updateScroll, 100);
    el.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
    };
  }, [filtered, updateScroll]);

  const scrollBy = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector('.vid-card')?.offsetWidth || 340;
    el.scrollBy({ left: dir * (cardWidth + 16), behavior: 'smooth' });
  };

  // Click-drag to scroll (desktop)
  const onMouseDown = (e) => {
    if (isMobile()) return;
    setIsDragging(true);
    dragStartX.current = e.pageX - scrollRef.current.offsetLeft;
    dragScrollLeft.current = scrollRef.current.scrollLeft;
    scrollRef.current.style.cursor = 'grabbing';
    scrollRef.current.style.userSelect = 'none';
  };
  const onMouseMove = (e) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x    = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - dragStartX.current) * 1.5;
    scrollRef.current.scrollLeft = dragScrollLeft.current - walk;
  };
  const onMouseUp = () => {
    setIsDragging(false);
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab';
      scrollRef.current.style.userSelect = '';
    }
  };

  const lbIdx  = lightboxItem ? filtered.findIndex(i=>i.id===lightboxItem.id) : -1;
  const openLB = (item) => setLightboxItem(item);
  const closeLB = () => setLightboxItem(null);
  const goPrev  = () => lbIdx > 0 && setLightboxItem(filtered[lbIdx-1]);
  const goNext  = () => lbIdx < filtered.length-1 && setLightboxItem(filtered[lbIdx+1]);

  return (
    <div style={{ paddingTop:'var(--navbar-h)' }}>
      {/* Hero */}
      <section style={{ background:'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(245,166,35,0.08) 0%, transparent 60%), var(--bg-primary)', padding:'80px 0 60px', textAlign:'center' }}>
        <div className="container">
          <div className="section-label">Our Work</div>
          <h1 className="section-title" style={{ fontSize:'clamp(2rem,5vw,3.8rem)', marginTop:8 }}>
            Video <span>Gallery</span>
          </h1>
          <p className="section-desc">Watch our signage installations and craftsmanship in action.</p>
        </div>
      </section>

      {/* Filter bar */}
      <div className="filter-bar-sticky">
        <div className="container">
          <div className="filter-bar-inner">
            {CATEGORIES.map(cat => (
              <button key={cat.key} onClick={() => setActiveFilter(cat.key)}
                className={`filter-btn${activeFilter===cat.key?' active':''}`}>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery section */}
      <section className="section">
        <div className="container">
          {loading ? (
            <div className="loading-center" style={{ minHeight:300 }}><div className="spinner"/></div>
          ) : error ? (
            <div style={{ textAlign:'center', padding:'80px 0', color:'var(--red)' }}>
              <div style={{ fontSize:'3rem', marginBottom:12 }}>⚠️</div><p>{error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign:'center', padding:'80px 0', color:'var(--text-muted)' }}>
              <div style={{ fontSize:'4rem', marginBottom:16 }}>🎬</div>
              <p style={{ fontFamily:'var(--font-heading)', fontSize:'1.1rem', marginBottom:8 }}>No videos yet.</p>
            </div>
          ) : (
            <>
              {/* ── DESKTOP: Horizontal scroll ── */}
              <div className="gallery-desktop">
                <div className="gallery-scroll-wrap">
                  {/* Left arrow */}
                  <button
                    className={`gal-arrow gal-arrow-left${canLeft ? ' visible' : ''}`}
                    onClick={() => scrollBy(-1)}
                    aria-label="Scroll left"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="22" height="22">
                      <polyline points="15,18 9,12 15,6"/>
                    </svg>
                  </button>

                  {/* Fade masks */}
                  {canLeft  && <div className="gal-fade-left"/>}
                  {canRight && <div className="gal-fade-right"/>}

                  {/* Scrollable row */}
                  <div
                    ref={scrollRef}
                    className="gallery-scroll-row"
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onMouseUp={onMouseUp}
                    onMouseLeave={onMouseUp}
                  >
                    {filtered.map(item => (
                      <div key={item.id} className="gallery-scroll-item">
                        <VideoCard item={item} onOpen={openLB}/>
                      </div>
                    ))}
                  </div>

                  {/* Right arrow */}
                  <button
                    className={`gal-arrow gal-arrow-right${canRight ? ' visible' : ''}`}
                    onClick={() => scrollBy(1)}
                    aria-label="Scroll right"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="22" height="22">
                      <polyline points="9,6 15,12 9,18"/>
                    </svg>
                  </button>
                </div>

                {/* Progress bar + count */}
                <div className="gal-scroll-meta">
                  <span className="gal-scroll-count">
                    {filtered.length} video{filtered.length !== 1 ? 's' : ''}
                  </span>
                  <div className="gal-progress-track">
                    <div
                      className="gal-progress-fill"
                      style={{ width: `${Math.max(progress, filtered.length > 0 ? 6 : 0)}%` }}
                    />
                  </div>
                  <span className="gal-scroll-hint">
                    {canRight ? '← drag or click arrows to scroll →' : '✓ end'}
                  </span>
                </div>
              </div>

              {/* ── MOBILE: Grid layout ── */}
              <div className="gallery-mobile">
                <div className="video-grid">
                  {filtered.map(item => (
                    <VideoCard key={item.id} item={item} onOpen={openLB}/>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxItem && (
        <Lightbox item={lightboxItem} onClose={closeLB}
          onPrev={goPrev} onNext={goNext}
          hasPrev={lbIdx > 0} hasNext={lbIdx < filtered.length - 1}
        />
      )}

      <style>{`
        /* ── Filter bar ── */
        .filter-bar-sticky {
          position: sticky; top: var(--navbar-h); z-index: 100;
          background: rgba(7,7,15,0.96); backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-subtle); padding: 12px 0;
        }
        .filter-bar-inner { display:flex; gap:8px; flex-wrap:wrap; justify-content:center; }
        .filter-btn {
          padding: 7px 18px; border-radius: 100px;
          border: 1px solid var(--border-subtle);
          background: transparent; color: var(--text-muted);
          font-family: var(--font-heading); font-size: 0.83rem; font-weight: 600;
          cursor: pointer; transition: all 0.2s; white-space: nowrap;
        }
        .filter-btn.active, .filter-btn:hover {
          border-color: var(--gold); background: rgba(245,166,35,0.1); color: var(--gold);
        }

        /* ── Desktop horizontal scroll ── */
        .gallery-desktop { display: block; }
        .gallery-mobile  { display: none; }

        .gallery-scroll-wrap {
          position: relative;
          margin: 0 -8px;
          padding: 8px 0;
        }

        /* Scrollable row */
        .gallery-scroll-row {
          display: flex;
          flex-direction: row;
          gap: 18px;
          overflow-x: auto;
          scroll-behavior: smooth;
          scroll-snap-type: x mandatory;
          -ms-overflow-style: none;
          scrollbar-width: none;
          padding: 12px 16px 20px;
          cursor: grab;
        }
        .gallery-scroll-row::-webkit-scrollbar { display: none; }
        .gallery-scroll-row:active { cursor: grabbing; }

        /* Each card in horizontal scroll */
        .gallery-scroll-item {
          flex-shrink: 0;
          width: 340px;
          scroll-snap-align: start;
        }

        /* Edge fade masks */
        .gal-fade-left, .gal-fade-right {
          position: absolute; top: 0; bottom: 20px;
          width: 80px; pointer-events: none; z-index: 5;
        }
        .gal-fade-left  {
          left: 0;
          background: linear-gradient(to right, var(--bg-primary) 0%, transparent 100%);
        }
        .gal-fade-right {
          right: 0;
          background: linear-gradient(to left, var(--bg-primary) 0%, transparent 100%);
        }

        /* Arrow buttons */
        .gal-arrow {
          position: absolute; top: 50%; transform: translateY(-60%);
          width: 46px; height: 46px; border-radius: 50%;
          background: rgba(245,166,35,0.12);
          border: 1.5px solid rgba(245,166,35,0.4);
          color: var(--gold); cursor: pointer; z-index: 10;
          display: flex; align-items: center; justify-content: center;
          opacity: 0; pointer-events: none;
          transition: opacity 0.25s, background 0.2s, transform 0.2s;
          backdrop-filter: blur(8px);
        }
        .gal-arrow.visible { opacity: 1; pointer-events: auto; }
        .gal-arrow:hover {
          background: rgba(245,166,35,0.3);
          box-shadow: 0 0 18px rgba(245,166,35,0.4);
        }
        .gal-arrow-left  { left: -8px; }
        .gal-arrow-right { right: -8px; }
        .gal-arrow-left:hover  { transform: translateY(-60%) scale(1.1) translateX(-2px); }
        .gal-arrow-right:hover { transform: translateY(-60%) scale(1.1) translateX(2px); }

        /* Progress bar + meta */
        .gal-scroll-meta {
          display: flex; align-items: center; gap: 14px;
          padding: 0 8px 4px;
        }
        .gal-scroll-count {
          font-family: var(--font-heading); font-size: 0.8rem;
          color: var(--text-muted); white-space: nowrap; flex-shrink: 0;
        }
        .gal-progress-track {
          flex: 1; height: 4px;
          background: rgba(255,255,255,0.07);
          border-radius: 2px; overflow: hidden;
          position: relative;
        }
        .gal-progress-fill {
          height: 100%; border-radius: 2px;
          background: linear-gradient(90deg, var(--gold-dark), var(--gold), var(--gold-light));
          transition: width 0.2s ease;
          box-shadow: 0 0 8px rgba(245,166,35,0.5);
          min-width: 30px;
        }
        .gal-scroll-hint {
          font-family: var(--font-heading); font-size: 0.72rem;
          color: var(--text-muted); white-space: nowrap; flex-shrink: 0;
          opacity: 0.7;
        }

        /* ── Video card ── */
        .vid-card {
          border-radius: 12px; overflow: hidden; cursor: pointer;
          background: var(--bg-card); border: 1px solid var(--border-subtle);
          transition: border-color 0.3s, transform 0.3s;
        }
        .vid-card:hover {
          border-color: var(--border-gold);
          transform: translateY(-4px); box-shadow: var(--shadow-gold);
        }
        .vid-inner { position: relative; width: 100%; overflow: hidden; }
        .vid-placeholder {
          width: 100%; aspect-ratio: 16/9;
          display: flex; align-items: center; justify-content: center;
          font-size: 3rem; background: var(--bg-card-hover); color: var(--text-muted);
        }
        .vid-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.1) 50%, transparent 100%);
          display: flex; flex-direction: column; justify-content: flex-end;
          align-items: flex-start; padding: 14px;
          opacity: 0; transition: opacity 0.3s;
        }
        .vid-card:hover .vid-overlay, .vid-overlay.playing { opacity: 1; }
        .play-btn {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%,-50%);
          width: 54px; height: 54px; border-radius: 50%;
          background: rgba(245,166,35,0.85);
          display: flex; align-items: center; justify-content: center;
          transition: all 0.25s; box-shadow: 0 4px 20px rgba(245,166,35,0.5);
        }
        .vid-card:hover .play-btn { transform: translate(-50%,-50%) scale(1.1); background: var(--gold); }
        .vid-info { width: 100%; }
        .cat-tag {
          display: inline-block; font-size: 0.65rem; padding: 2px 8px;
          border-radius: 100px; background: rgba(245,166,35,0.85); color: #000;
          font-family: var(--font-heading); font-weight: 700;
          margin-bottom: 5px; text-transform: capitalize;
        }
        .featured-tag {
          display: inline-block; font-size: 0.65rem; padding: 2px 8px;
          border-radius: 100px; background: rgba(255,255,255,0.15); color: #fff;
          font-family: var(--font-heading); font-weight: 600;
          margin-bottom: 5px; margin-left: 4px;
        }
        .vid-title { font-family: var(--font-heading); font-size: 0.9rem; font-weight: 700; color: #fff; margin: 0 0 3px; }
        .vid-desc { font-size: 0.75rem; color: rgba(255,255,255,0.65); margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

        /* ── Lightbox ── */
        .lightbox {
          position: fixed; inset: 0; background: rgba(0,0,0,0.97);
          z-index: 9000; display: flex; align-items: center;
          justify-content: center; padding: 16px;
          animation: fadeIn 0.2s ease;
        }
        .lb-close {
          position: absolute; top: 16px; right: 16px;
          background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
          color: #fff; width: 44px; height: 44px; border-radius: 50%;
          font-size: 1.1rem; cursor: pointer; z-index: 10;
        }
        .lb-close:hover { background: rgba(255,255,255,0.2); }
        .lb-nav {
          position: absolute; top: 50%; transform: translateY(-50%);
          background: rgba(245,166,35,0.15); border: 1px solid var(--border-gold);
          color: var(--gold); width: 48px; height: 48px; border-radius: 50%;
          font-size: 1.8rem; display: flex; align-items: center;
          justify-content: center; cursor: pointer; z-index: 10; transition: all 0.2s;
        }
        .lb-nav:hover { background: rgba(245,166,35,0.3); }
        .lb-prev { left: 12px; } .lb-next { right: 12px; }
        .lb-content { max-width: min(95vw, 1100px); width: 100%; display: flex; flex-direction: column; gap: 14px; }
        .lb-video { width: 100%; max-height: 78vh; border-radius: 10px; background: #000; outline: none; display: block; }
        .lb-placeholder { width: 100%; aspect-ratio: 16/9; background: var(--bg-card); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: var(--text-muted); }
        .lb-info { display: flex; flex-direction: column; gap: 6px; padding: 0 4px; }
        .lb-title { font-family: var(--font-heading); font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin: 4px 0 0; }
        .lb-desc { font-size: 0.88rem; color: var(--text-muted); margin: 0; }

        /* ── RESPONSIVE ── */
        @media (max-width: 768px) {
          .gallery-desktop { display: none; }
          .gallery-mobile  { display: block; }
          .video-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
        }
        @media (max-width: 480px) {
          .video-grid { grid-template-columns: 1fr; gap: 12px; }
          .lb-nav { display: none; }
        }
      `}</style>
    </div>
  );
}
