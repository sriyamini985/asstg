// Layer 02 — Soft blurred glow accents to add depth without hard edges.
const COLORS = {
  blue: "#9CC2EF",
  gold: "#D9B25C",
  white: "#FFFFFF",
};

export default function Layer02Glow() {
  return (
    <svg
      viewBox="0 0 1512 720"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="glow_core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={COLORS.white} stopOpacity="0.85" />
          <stop offset="55%" stopColor={COLORS.blue} stopOpacity="0.18" />
          <stop offset="100%" stopColor={COLORS.blue} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="glow_gold" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={COLORS.gold} stopOpacity="0.16" />
          <stop offset="100%" stopColor={COLORS.gold} stopOpacity="0" />
        </radialGradient>
        <filter id="glow_blur" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="40" />
        </filter>
      </defs>

      <g filter="url(#glow_blur)">
        <circle cx="1030" cy="360" r="240" fill="url(#glow_core)" />
        <circle cx="1350" cy="620" r="160" fill="url(#glow_gold)" />
        <circle cx="300" cy="580" r="180" fill="url(#glow_core)" opacity="0.5" />
      </g>
    </svg>
  );
}
