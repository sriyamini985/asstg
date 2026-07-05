import React from 'react';
import spineModel3d from '../../assets/images/spine_model_3d.png';

export default function Layer10MainSpine() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      {/* 3D Spine image positioned exactly concentric with the blueprint rings (CX=1160, 23.3% from right edge) */}
      {/* Sized up to width: 210px, height: 86% for a more impressive and prominent display */}
      <img
        src={spineModel3d}
        alt="3D Spine Model"
        className="absolute animate-floatSpineLight"
        style={{
          right: 'calc(23.3% - 105px)', // concentric alignment centered exactly with the rings (width=210px, half-width=105px)
          top: '25px',                 // spacing from top boundary
          height: '86%',               // slightly taller for better emphasis
          width: '210px',              // increased width from 180px
          objectFit: 'contain',
          filter: 'drop-shadow(8px 16px 28px rgba(126,147,181,0.25))',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}
