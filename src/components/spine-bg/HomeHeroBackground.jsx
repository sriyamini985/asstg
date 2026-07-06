// HomeHeroBackground — stacks all ten SVG layers.
// Uses a full-bleed container for background color wash and glows,
// and a centered max-width container for the detailed vector elements.
// Handles responsive layouts natively by toggling layer visibility using Tailwind display utility classes.
import React from 'react';
import Layer01Background from "./Layer01_Background.jsx";
import Layer02Glow from "./Layer02_Glow.jsx";
import Layer03Rings from "./Layer03_Rings.jsx";
import Layer04Waves from "./Layer04_Waves.jsx";
import Layer06LeftSpineWatermark from "./Layer06_LeftSpineWatermark.jsx";
import Layer10MainSpine from "./Layer10_MainSpine.jsx";

const layerStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
};

export default function HomeHeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
      
      {/* ── 1. FULL-BLEED GRADIENT WASH & GLOWS ── */}
      <div style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: -1 }}>
        <div style={layerStyle}>
          <Layer01Background />
        </div>
        <div style={layerStyle}>
          <Layer02Glow />
        </div>
      </div>

      {/* ── 2. CENTERED DETAILED VECTOR LAYERS (MAX-W 1440PX) ── */}
      <div style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: "1440px",
        height: "100%",
        zIndex: 1,
      }}>
        {/* Mobile: Hide large blueprint rings, waves, city, icons, watermark */}
        
        {/* Rings (Layer 03) — Hidden on mobile, shown on tablet/desktop */}
        <div className="hidden sm:block" style={layerStyle}>
          <Layer03Rings />
        </div>

        {/* Waves (Layer 04) — Hidden on mobile, shown on tablet/desktop */}
        <div className="hidden md:block" style={layerStyle}>
          <Layer04Waves />
        </div>

        {/* Left Spine Watermark (Layer 06) — Hidden on mobile, shown on tablet/desktop */}
        <div className="hidden md:block" style={layerStyle}>
          <Layer06LeftSpineWatermark />
        </div>

        {/* Main Spine (Layer 10) — Shown always */}
        <div style={layerStyle}>
          <Layer10MainSpine />
        </div>
      </div>

    </div>
  );
}
