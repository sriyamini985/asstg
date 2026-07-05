import React from 'react';

export default function PageBackground() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* 1. Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F8FBFF] via-[#FFFFFF] to-[#F5F9FF]" style={{ zIndex: -2 }} />
      
      {/* 2. SVG overlay containing medical grids, dots, plus signs, waves, hexagons */}
      <svg
        viewBox="0 0 1440 1080"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMin slice"
        className="absolute inset-0 opacity-[0.032]" // Strictly under 4% opacity (3.2%)
        xmlns="http://www.w3.org/2000/svg"
        style={{ zIndex: -1 }}
      >
        <defs>
          {/* Repeating Grid Pattern */}
          <pattern id="medicalGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#123E87" strokeWidth="0.8" />
            <circle cx="0" cy="0" r="1.5" fill="#D4A53A" />
          </pattern>
        </defs>

        {/* Apply grid pattern */}
        <rect width="100%" height="100%" fill="url(#medicalGrid)" />

        {/* Faint wave lines (sweeping bottom left to top right very softly) */}
        <path
          d="M-50 900 C 300 850, 500 700, 800 750 S 1100 650, 1500 600"
          fill="none"
          stroke="#123E87"
          strokeWidth="1.2"
        />
        <path
          d="M-50 930 C 280 880, 480 730, 780 780 S 1080 680, 1500 630"
          fill="none"
          stroke="#D4A53A"
          strokeWidth="0.9"
        />

        {/* Occasional Plus Icons */}
        <g stroke="#123E87" strokeWidth="1.5" fill="none">
          <path d="M120 180 h10 M125 175 v10" />
          <path d="M1300 240 h10 M1305 235 v10" />
          <path d="M450 780 h10 M455 775 v10" />
          <path d="M980 920 h10 M985 915 v10" />
          <path d="M880 150 h10 M885 145 v10" />
        </g>

        {/* Faint Hexagon Molecules */}
        <g stroke="#123E87" strokeWidth="1" fill="none">
          {/* Hex 1 */}
          <polygon points="200,450 220,438 240,450 240,472 220,484 200,472" />
          <line x1="220" y1="438" x2="220" y2="425" />
          <circle cx="220" cy="424" r="2.5" fill="#D4A53A" stroke="none" />
          
          {/* Hex 2 */}
          <polygon points="1150,550 1170,538 1190,550 1190,572 1170,584 1150,572" />
          
          {/* Hex 3 */}
          <polygon points="750,300 765,291 780,300 780,318 765,327 750,318" />
        </g>
      </svg>
    </div>
  );
}
