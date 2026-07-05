import React, { useEffect, useState, useRef } from 'react';
import spineWatermark from '../assets/images/spine_model_3d.png';

export default function BackgroundEffects() {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      targetRef.current.x = ((e.clientX / window.innerWidth) - 0.5) * 10;
      targetRef.current.y = ((e.clientY / window.innerHeight) - 0.5) * 10;
    };
    const tick = () => {
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.055;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.055;
      setMouseOffset({ x: +currentRef.current.x.toFixed(2), y: +currentRef.current.y.toFixed(2) });
      rafRef.current = requestAnimationFrame(tick);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    rafRef.current = requestAnimationFrame(tick);
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(rafRef.current); };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">

      {/* ── LAYER 1: Clean white → light blue gradient ── */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(145deg, #ffffff 0%, #f8fbff 45%, #edf3fe 80%, #e0ecff 100%)'
      }} />

      {/* Soft radial bloom — right side, behind spine */}
      <div className="absolute" style={{
        right: '2%', top: '5%',
        width: '52%', height: '90%',
        background: 'radial-gradient(ellipse 55% 65% at 55% 48%, rgba(186,213,255,0.38) 0%, rgba(219,234,254,0.18) 42%, transparent 75%)',
        filter: 'blur(60px)',
      }} />

      {/* ── PARALLAX wrapper (hexagons shift with mouse) ── */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{ transform: `translate3d(${mouseOffset.x}px,${mouseOffset.y}px,0)`, willChange: 'transform' }}
      >
        {/* ── LAYER 4: Minimal hex outlines — LEFT side only, NO connection lines ── */}
        <svg
          className="absolute hidden lg:block"
          style={{ left: '0%', top: '0%', width: '48%', height: '100%' }}
          viewBox="0 0 480 520"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Hexagon 1 — upper left */}
          <polygon points="72,72 100,57 128,72 128,102 100,117 72,102"
            stroke="#123E87" strokeWidth="0.8" strokeOpacity="0.10" />
          {/* Hexagon 2 — lower left */}
          <polygon points="48,340 84,320 120,340 120,380 84,400 48,380"
            stroke="#123E87" strokeWidth="0.7" strokeOpacity="0.09" />
          {/* Hexagon 3 — small gold, mid-left */}
          <polygon points="170,260 192,248 214,260 214,284 192,296 170,284"
            stroke="#D4A53A" strokeWidth="0.6" strokeOpacity="0.11" />

          {/* Small node dots only — NO connecting lines */}
          <circle cx="72" cy="72" r="2" fill="#123E87" fillOpacity="0.16" />
          <circle cx="128" cy="72" r="1.8" fill="#D4A53A" fillOpacity="0.22" />
          <circle cx="84" cy="320" r="2" fill="#123E87" fillOpacity="0.15" />
          <circle cx="192" cy="248" r="1.8" fill="#D4A53A" fillOpacity="0.20" />

          {/* Hollow ring indicators — very subtle */}
          <circle cx="240" cy="150" r="6" stroke="#123E87" strokeWidth="0.4" strokeOpacity="0.08" />
          <circle cx="240" cy="150" r="2.5" fill="#123E87" fillOpacity="0.08" />
          <circle cx="310" cy="310" r="7" stroke="#D4A53A" strokeWidth="0.4" strokeOpacity="0.09" />
          <circle cx="310" cy="310" r="2.5" fill="#D4A53A" fillOpacity="0.10" />

          {/* A few scattered small gold dots */}
          <circle cx="200" cy="130" r="2" fill="#D4A53A" fillOpacity="0.22" />
          <circle cx="350" cy="200" r="1.8" fill="#D4A53A" fillOpacity="0.18" />
          <circle cx="140" cy="420" r="2" fill="#123E87" fillOpacity="0.14" />
        </svg>
      </div>

      {/* ── LAYER 5: Dot-grid watermarks ── */}
      {/* Top-left corner dot grid */}
      <div className="absolute hidden lg:block" style={{
        top: 0, left: 0, width: '15%', height: '40%',
        backgroundImage: 'radial-gradient(circle, rgba(18,62,135,0.06) 1px, transparent 1px)',
        backgroundSize: '10px 10px',
        maskImage: 'linear-gradient(135deg, rgba(0,0,0,0.45) 0%, transparent 60%)',
        WebkitMaskImage: 'linear-gradient(135deg, rgba(0,0,0,0.45) 0%, transparent 60%)',
      }} />

      {/* Bottom-right corner dot grid */}
      <div className="absolute hidden lg:block" style={{
        bottom: 0, right: 0, width: '14%', height: '35%',
        backgroundImage: 'radial-gradient(circle, rgba(18,62,135,0.055) 1px, transparent 1px)',
        backgroundSize: '10px 10px',
        maskImage: 'linear-gradient(315deg, rgba(0,0,0,0.4) 0%, transparent 60%)',
        WebkitMaskImage: 'linear-gradient(315deg, rgba(0,0,0,0.4) 0%, transparent 60%)',
      }} />

      {/* Very faint spine watermark — far left */}
      <div className="absolute left-0 top-0 h-full hidden lg:block" style={{
        width: '8%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: 0.018, filter: 'grayscale(1)',
        maskImage: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, transparent 100%)',
      }}>
        <img src={spineWatermark} alt="" className="h-[80%] w-auto object-contain" />
      </div>

      {/* ── Floating particles — minimal, just 5 ── */}
      {[
        { left: '20%', top: '20%', size: 2.5, color: '#123E87', op: 0.16, dur: '8s' },
        { left: '40%', top: '70%', size: 2,   color: '#D4A53A', op: 0.18, dur: '11s' },
        { left: '55%', top: '25%', size: 2,   color: '#123E87', op: 0.13, dur: '9s' },
        { left: '72%', top: '65%', size: 2,   color: '#D4A53A', op: 0.15, dur: '13s' },
        { left: '14%', top: '55%', size: 2.5, color: '#123E87', op: 0.14, dur: '10s' },
      ].map((p, i) => (
        <div key={i} className="absolute rounded-full" style={{
          left: p.left, top: p.top,
          width: p.size, height: p.size,
          backgroundColor: p.color,
          opacity: p.op,
          boxShadow: `0 0 4px 1px ${p.color}20`,
          animation: `floatNormal ${p.dur} ease-in-out infinite ${i * 1.5}s`,
        }} />
      ))}

    </div>
  );
}
