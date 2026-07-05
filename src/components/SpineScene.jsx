import React from 'react';
import { motion } from 'framer-motion';
import spineImage from '../assets/images/spine_model_3d.png';

export default function SpineScene() {
  return (
    <div
      className="relative w-full h-full flex items-center justify-center overflow-visible"
      style={{ mixBlendMode: 'multiply' }}
    >

      {/* ── RINGS SVG — centered on spine, redesigned UI ─────────── */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ overflow: 'visible', mixBlendMode: 'normal', zIndex: 0 }}
      >
        <svg
          viewBox="0 0 600 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: 'absolute',
            width: '105%',
            height: '105%',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            overflow: 'visible',
          }}
        >
          <defs>
            {/* Glow gradient for inner ring */}
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#bfdbfe" stopOpacity="0.70" />
              <stop offset="40%"  stopColor="#dbeafe" stopOpacity="0.38" />
              <stop offset="75%"  stopColor="#eff6ff" stopOpacity="0.12" />
              <stop offset="100%" stopColor="white"   stopOpacity="0" />
            </radialGradient>
            {/* Glow filter for orbit dots */}
            <filter id="dotGlow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Soft background glow ellipse */}
          <ellipse cx="300" cy="300" rx="170" ry="200" fill="url(#centerGlow)" />

          {/* ── Ring 6 — outermost, slow 360s CW, thin dashed ── */}
          <g style={{ transformOrigin: '300px 300px', animation: 'spinClockwise 360s linear infinite' }}>
            <circle cx="300" cy="300" r="204"
              stroke="#123E87" strokeWidth="0.8" strokeOpacity="0.22"
              strokeDasharray="24 10" />
            {/* Cardinal tick marks */}
            <line x1="300" y1="96"  x2="300" y2="112" stroke="#123E87" strokeWidth="1.5" strokeOpacity="0.30" />
            <line x1="300" y1="490" x2="300" y2="504" stroke="#123E87" strokeWidth="1.5" strokeOpacity="0.30" />
            <line x1="96"  y1="300" x2="112" y2="300" stroke="#123E87" strokeWidth="1.5" strokeOpacity="0.30" />
            <line x1="490" y1="300" x2="504" y2="300" stroke="#123E87" strokeWidth="1.5" strokeOpacity="0.30" />
            {/* Gold orbit dots with glow */}
            <circle cx="300" cy="96"  r="4.5" fill="#D4A53A" fillOpacity="0.65" filter="url(#dotGlow)" />
            <circle cx="504" cy="300" r="4"   fill="#D4A53A" fillOpacity="0.55" filter="url(#dotGlow)" />
            {/* Small tick at 45° intervals */}
            {[45, 135, 225, 315].map((deg) => {
              const rad = deg * Math.PI / 180;
              return (
                <line key={deg}
                  x1={300 + 204 * Math.sin(rad)} y1={300 - 204 * Math.cos(rad)}
                  x2={300 + 195 * Math.sin(rad)} y2={300 - 195 * Math.cos(rad)}
                  stroke="#123E87" strokeWidth="0.9" strokeOpacity="0.20" />
              );
            })}
          </g>

          {/* ── Ring 5 — 260s CCW, medium dashed ── */}
          <g style={{ transformOrigin: '300px 300px', animation: 'spinCounterClockwise 260s linear infinite' }}>
            <circle cx="300" cy="300" r="168"
              stroke="#123E87" strokeWidth="0.7" strokeOpacity="0.20"
              strokeDasharray="18 8 3 8" />
            <line x1="300" y1="132" x2="300" y2="144" stroke="#123E87" strokeWidth="1.3" strokeOpacity="0.26" />
            <line x1="300" y1="456" x2="300" y2="468" stroke="#123E87" strokeWidth="1.3" strokeOpacity="0.26" />
            <line x1="132" y1="300" x2="144" y2="300" stroke="#123E87" strokeWidth="1.3" strokeOpacity="0.26" />
            <line x1="456" y1="300" x2="468" y2="300" stroke="#123E87" strokeWidth="1.3" strokeOpacity="0.26" />
            <circle cx="300" cy="132" r="3.5" fill="#123E87" fillOpacity="0.40" filter="url(#dotGlow)" />
            <circle cx="132" cy="300" r="3.5" fill="#123E87" fillOpacity="0.36" filter="url(#dotGlow)" />
            <circle cx="468" cy="300" r="3.5" fill="#D4A53A" fillOpacity="0.55" filter="url(#dotGlow)" />
          </g>

          {/* ── Ring 4 — 200s CW, solid with 45° ticks ── */}
          <g style={{ transformOrigin: '300px 300px', animation: 'spinClockwise 200s linear infinite' }}>
            <circle cx="300" cy="300" r="132"
              stroke="#123E87" strokeWidth="0.85" strokeOpacity="0.24" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
              const rad = deg * Math.PI / 180;
              const r = 132;
              return (
                <line key={deg}
                  x1={300 + r * Math.sin(rad)}       y1={300 - r * Math.cos(rad)}
                  x2={300 + (r - 9) * Math.sin(rad)} y2={300 - (r - 9) * Math.cos(rad)}
                  stroke="#123E87" strokeWidth="1.1" strokeOpacity="0.28" />
              );
            })}
            <circle cx="300" cy="168" r="3.5" fill="#D4A53A" fillOpacity="0.60" filter="url(#dotGlow)" />
            <circle cx="432" cy="300" r="3"   fill="#123E87" fillOpacity="0.40" filter="url(#dotGlow)" />
          </g>

          {/* ── Ring 3 — 155s CCW, double ring ── */}
          <g style={{ transformOrigin: '300px 300px', animation: 'spinCounterClockwise 155s linear infinite' }}>
            <circle cx="300" cy="300" r="96"
              stroke="#123E87" strokeWidth="0.75" strokeOpacity="0.22"
              strokeDasharray="9 4" />
            {/* Outer halo ring just inside */}
            <circle cx="300" cy="300" r="102"
              stroke="#123E87" strokeWidth="0.30" strokeOpacity="0.10" />
            <circle cx="300" cy="204" r="3"   fill="#123E87" fillOpacity="0.38" filter="url(#dotGlow)" />
            <circle cx="396" cy="300" r="3"   fill="#D4A53A" fillOpacity="0.50" filter="url(#dotGlow)" />
            <circle cx="204" cy="300" r="3"   fill="#123E87" fillOpacity="0.34" filter="url(#dotGlow)" />
            <circle cx="300" cy="396" r="2.5" fill="#D4A53A" fillOpacity="0.42" filter="url(#dotGlow)" />
          </g>

          {/* ── Ring 2 — 120s CW, crosshair ring ── */}
          <g style={{ transformOrigin: '300px 300px', animation: 'spinClockwise 120s linear infinite' }}>
            <circle cx="300" cy="300" r="60"
              stroke="#123E87" strokeWidth="0.70" strokeOpacity="0.26"
              strokeDasharray="6 3" />
            {/* Crosshair lines inside */}
            <line x1="300" y1="242" x2="300" y2="358" stroke="#123E87" strokeWidth="0.35" strokeOpacity="0.14" />
            <line x1="242" y1="300" x2="358" y2="300" stroke="#123E87" strokeWidth="0.35" strokeOpacity="0.14" />
          </g>

          {/* ── Ring 1 — innermost, 80s CCW, glowing ── */}
          <g style={{ transformOrigin: '300px 300px', animation: 'spinCounterClockwise 80s linear infinite' }}>
            <circle cx="300" cy="300" r="36"
              stroke="#123E87" strokeWidth="0.80" strokeOpacity="0.30"
              strokeDasharray="4 3" />
            {/* Inner solid ring */}
            <circle cx="300" cy="300" r="30"
              stroke="#123E87" strokeWidth="0.40" strokeOpacity="0.15" />
          </g>

          {/* Center crosshair */}
          <line x1="290" y1="300" x2="310" y2="300" stroke="#123E87" strokeWidth="0.5" strokeOpacity="0.22" />
          <line x1="300" y1="290" x2="300" y2="310" stroke="#123E87" strokeWidth="0.5" strokeOpacity="0.22" />
          <circle cx="300" cy="300" r="4"   fill="#123E87" fillOpacity="0.18" />
          <circle cx="300" cy="300" r="1.8" fill="#123E87" fillOpacity="0.38" />
        </svg>
      </div>

      {/* ── Spine soft glow ─────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none animate-radialPulse"
        style={{
          background: 'radial-gradient(ellipse 48% 58% at 52% 48%, rgba(186,213,255,0.42) 0%, rgba(219,234,255,0.18) 42%, transparent 72%)',
          filter: 'blur(22px)',
          zIndex: 1,
          mixBlendMode: 'normal',
        }}
      />

      {/* ── Framer Motion entry + float ─────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: 55, rotateY: -8 }}
        animate={{ opacity: 1, x: 0, rotateY: 0 }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        className="relative w-full h-full flex items-center justify-center"
        style={{ zIndex: 2 }}
      >
        <div className="w-full h-full flex items-center justify-center animate-floatSpineLight">
          <img
            src={spineImage}
            alt="3D Spine Model"
            style={{
              height: '90%',
              width: 'auto',
              maxWidth: '88%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 16px 36px rgba(18,62,135,0.11)) drop-shadow(0 4px 10px rgba(18,62,135,0.07))',
              display: 'block',
            }}
            draggable={false}
          />
        </div>
      </motion.div>

    </div>
  );
}
