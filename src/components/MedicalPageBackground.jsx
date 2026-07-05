import React from 'react';
import './MedicalPageBackground.css';

export default function MedicalPageBackground() {
  // Generate coordinates for 28 vertebrae segments along a gentle vertical spine curve (Left Edge)
  const segments = [];
  for (let i = 0; i <= 27; i++) {
    const y = 20 + i * 38;
    const x = 50 + Math.sin(y / 110) * 16;
    segments.push({ x, y });
  }

  // Generate smooth SVG Bezier path linking the vertebral canal
  let spinalCordPath = `M ${segments[0].x} ${segments[0].y}`;
  for (let i = 1; i < segments.length; i++) {
    const prev = segments[i - 1];
    const curr = segments[i];
    const cpY1 = prev.y + 19;
    const cpY2 = curr.y - 19;
    spinalCordPath += ` C ${prev.x} ${cpY1}, ${curr.x} ${cpY2}, ${curr.x} ${curr.y}`;
  }

  return (
    <div className="medical-page-bg">
      
      {/* ── Light Radial Blue Gradient (Behind content for depth) ── */}
      <div className="bg-radial-light" />

      {/* ── Left-Aligned Spine Column Watermark (5% Opacity, very close to edge) ── */}
      <div className="spine-watermark-left">
        <svg className="w-full h-full" viewBox="0 0 200 1080" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Spinal Cord Canal Path */}
          <path d={spinalCordPath} stroke="#123E87" strokeWidth="2.5" opacity="0.3" strokeLinecap="round" />
          <path d={spinalCordPath} stroke="#D4A53A" strokeWidth="0.8" strokeDasharray="3,5" opacity="0.4" strokeLinecap="round" />

          {/* Vertebrae body segments and process curves */}
          {segments.map((pt, i) => {
            const isGold = i % 3 === 0;
            const themeColor = isGold ? '#D4A53A' : '#123E87';
            return (
              <g key={i} opacity={isGold ? 0.7 : 0.45}>
                {/* Transverse Process curves */}
                <path 
                  d={`M ${pt.x - 22} ${pt.y} C ${pt.x - 22} ${pt.y - 7}, ${pt.x + 22} ${pt.y - 7}, ${pt.x + 22} ${pt.y}`} 
                  stroke={themeColor} 
                  strokeWidth="1" 
                  fill="none" 
                  opacity="0.35"
                />
                {/* Vertebral body */}
                <rect 
                  x={pt.x - 12} 
                  y={pt.y - 4} 
                  width="24" 
                  height="8" 
                  rx="3.5" 
                  fill={themeColor} 
                />
                {/* Spacer node dot */}
                <circle 
                  cx={pt.x} 
                  cy={pt.y} 
                  r="1.5" 
                  fill={isGold ? '#ffffff' : '#D4A53A'} 
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* ── UNIFIED ABOUT US BACKGROUND ELEMENTS FOR ALL SUBPAGES ── */}
      {/* Rotating Blueprint Circle (Top-Right, opacity 6%) */}
      <div className="blueprint-circle-tr">
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="45" stroke="#123E87" strokeWidth="1.5" />
          <circle cx="50" cy="50" r="35" stroke="#D4A53A" strokeWidth="1" strokeDasharray="3,3" />
          <circle cx="50" cy="50" r="22" stroke="#123E87" strokeWidth="0.8" />
        </svg>
      </div>

      {/* 2 Small Hexagon Outlines (Well outside center, 6% opacity) */}
      <div className="absolute left-8 top-28 w-28 h-28 pointer-events-none z-0 opacity-[0.06]">
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50,10 85,30 85,70 50,90 15,70 15,30" stroke="#123E87" strokeWidth="1.5" />
          <polygon points="50,22 78,38 78,62 50,78 22,62 22,38" stroke="#D4A53A" strokeWidth="1" strokeDasharray="2,2" />
        </svg>
      </div>

      <div className="absolute right-16 bottom-36 w-20 h-20 pointer-events-none z-0 opacity-[0.06]">
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50,12 83,31 83,69 50,88 17,69 17,31" stroke="#123E87" strokeWidth="1.2" />
        </svg>
      </div>

      {/* Tiny Molecular Network (Bottom-Left corner, 6% opacity) */}
      <div className="absolute left-10 bottom-44 w-24 h-24 pointer-events-none z-0 opacity-[0.06]">
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="35" r="3" fill="#123E87" />
          <circle cx="75" cy="25" r="3" fill="#D4A53A" />
          <circle cx="45" cy="75" r="3" fill="#123E87" />
          <line x1="20" y1="35" x2="75" y2="25" stroke="#123E87" strokeWidth="1.0" />
          <line x1="75" y1="25" x2="45" y2="75" stroke="#123E87" strokeWidth="1.0" />
          <line x1="20" y1="35" x2="45" y2="75" stroke="#D4A53A" strokeWidth="0.8" strokeDasharray="2,2" />
        </svg>
      </div>

      {/* ── Thin Flowing Blue-Gold Wave (Bottom Edge only, 6% opacity) ── */}
      <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none z-0 opacity-[0.06]">
        <svg className="w-full h-full" viewBox="0 0 1440 80" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,45 C360,15 720,75 1080,45 T1440,45" stroke="#123E87" strokeWidth="1.5" />
          <path d="M0,53 C360,23 720,83 1080,53 T1440,53" stroke="#D4A53A" strokeWidth="1" strokeDasharray="3,6" />
        </svg>
      </div>

      {/* ── Tiny Blue & Gold Floating Glow Particles (Subtle glow) ── */}
      <div className="tiny-particles-container">
        <div className="tiny-particle tiny-particle--blue w-[5px] h-[5px]" style={{ top: '25%', left: '8%', animationDelay: '0s' }} />
        <div className="tiny-particle tiny-particle--gold w-[4px] h-[4px]" style={{ top: '42%', right: '10%', animationDelay: '2s' }} />
        <div className="tiny-particle tiny-particle--blue w-[4px] h-[4px]" style={{ bottom: '32%', left: '12%', animationDelay: '4s' }} />
        <div className="tiny-particle tiny-particle--gold w-[5px] h-[5px]" style={{ bottom: '18%', right: '6%', animationDelay: '6s' }} />
      </div>

    </div>
  );
}
