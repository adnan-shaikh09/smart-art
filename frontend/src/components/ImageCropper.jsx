import React, { useState, useEffect, useRef, useCallback } from 'react';

const ImageCropper = ({ file, onCrop, onCancel, aspectRatio = 1, cropShape = 'circle' }) => {
  const [imgSrc, setImgSrc] = useState(null);
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imgRef = useRef(new Image());
  const CROP_SIZE = 260;

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImgSrc(e.target.result);
      imgRef.current.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }, [file]);

  const onMouseDown = useCallback((e) => {
    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setDragging(true);
    setDragStart({ x: clientX - pos.x, y: clientY - pos.y });
  }, [pos]);

  const onMouseMove = useCallback((e) => {
    if (!dragging) return;
    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setPos({ x: clientX - dragStart.x, y: clientY - dragStart.y });
  }, [dragging, dragStart]);

  const onMouseUp = useCallback(() => setDragging(false), []);

  useEffect(() => {
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchend', onMouseUp);
    return () => {
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchend', onMouseUp);
    };
  }, [onMouseUp]);

  const handleCrop = () => {
    const img = imgRef.current;
    if (!img.complete) return;
    const canvas = document.createElement('canvas');
    const OUTPUT = 400;
    canvas.width = OUTPUT;
    canvas.height = OUTPUT;
    const ctx = canvas.getContext('2d');

    const displayW = img.naturalWidth * scale;
    const displayH = img.naturalHeight * scale;
    const imgX = (CROP_SIZE - displayW) / 2 + pos.x;
    const imgY = (CROP_SIZE - displayH) / 2 + pos.y;

    const scaleX = img.naturalWidth / displayW;
    const scaleY = img.naturalHeight / displayH;
    const srcX = (-imgX) * scaleX;
    const srcY = (-imgY) * scaleY;
    const srcW = CROP_SIZE * scaleX;
    const srcH = CROP_SIZE * scaleY;

    if (cropShape === 'circle') {
      ctx.beginPath();
      ctx.arc(OUTPUT / 2, OUTPUT / 2, OUTPUT / 2, 0, Math.PI * 2);
      ctx.clip();
    }
    ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, OUTPUT, OUTPUT);
    onCrop(canvas.toDataURL('image/jpeg', 0.88));
  };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.9)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding:20, flexDirection:'column', gap:20 }}>
      <div style={{ fontFamily:'var(--font-heading)', fontSize:'1.1rem', fontWeight:700, color:'var(--text-primary)', textAlign:'center' }}>
        Crop Photo
        <div style={{ fontSize:'0.8rem', color:'var(--text-muted)', fontWeight:400, marginTop:4 }}>Drag to reposition · Scroll to zoom</div>
      </div>

      {/* Crop area */}
      <div style={{ position:'relative', width:CROP_SIZE, height:CROP_SIZE, overflow:'hidden', borderRadius: cropShape==='circle' ? '50%' : 12, border:'2px solid var(--gold)', cursor:dragging?'grabbing':'grab', userSelect:'none', background:'#111' }}
        onMouseDown={onMouseDown} onMouseMove={onMouseMove}
        onTouchStart={onMouseDown} onTouchMove={onMouseMove}
        onWheel={e => { e.preventDefault(); setScale(s => Math.min(4, Math.max(0.3, s - e.deltaY * 0.002))); }}
      >
        {imgSrc && (
          <img src={imgSrc} alt="crop"
            style={{ position:'absolute', width: imgRef.current.naturalWidth ? imgRef.current.naturalWidth * scale : 'auto', height:'auto', left:'50%', top:'50%', transform:`translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`, pointerEvents:'none', maxWidth:'none' }}
            onLoad={e => { setScale(CROP_SIZE / Math.max(e.target.naturalWidth, e.target.naturalHeight)); }}
          />
        )}
        {/* Grid overlay */}
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize:`${CROP_SIZE/3}px ${CROP_SIZE/3}px`, pointerEvents:'none' }} />
      </div>

      {/* Zoom slider */}
      <div style={{ display:'flex', alignItems:'center', gap:12, width:CROP_SIZE }}>
        <span style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>🔍</span>
        <input type="range" min="0.3" max="4" step="0.05" value={scale}
          onChange={e => setScale(parseFloat(e.target.value))}
          style={{ flex:1, accentColor:'var(--gold)' }} />
        <span style={{ fontSize:'0.8rem', color:'var(--gold)', minWidth:40, fontFamily:'var(--font-heading)' }}>{Math.round(scale*100)}%</span>
      </div>

      {/* Buttons */}
      <div style={{ display:'flex', gap:12 }}>
        <button onClick={onCancel} className="btn btn-ghost" style={{ padding:'10px 24px' }}>Cancel</button>
        <button onClick={handleCrop} className="btn btn-primary" style={{ padding:'10px 28px' }}>
          ✓ Apply Crop
        </button>
      </div>
    </div>
  );
};

export default ImageCropper;
