import React from 'react';
import spineModel3d from '../../assets/images/spine_model_3d.png';

export default function Layer06LeftSpineWatermark() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      {/* Mirrored, floating faint 3D spine watermark on the far-left edge */}
      <img
        src={spineModel3d}
        alt="Spine Watermark Left"
        style={{
          left: '-20px',                 // Moved to the far-left edge
          top: '30px',                   // Spacing from top
          height: '84%',                 // Matches vertical height of main spine
          width: 'auto',
          objectFit: 'contain',
          opacity: 0.08,                 // High-fidelity low-opacity watermark
          transform: 'scaleX(1)',        // Flipped opposite (natural curve) to contrast main spine
          filter: 'contrast(0.85) brightness(1.1)', // Softer look
          pointerEvents: 'none',
          animationDelay: '-3s'          // Out-of-phase float delay for organic motion
        }}
        className="absolute animate-floatSpineLight"
      />
    </div>
  );
}
