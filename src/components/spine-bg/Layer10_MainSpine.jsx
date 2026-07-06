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
        className="hero-main-spine animate-floatSpineLight"
      />
    </div>
  );
}
