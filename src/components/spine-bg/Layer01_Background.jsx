// Layer 01 — Base background: soft cool white wash with subtle blue/lavender
// tint and a faint warm glow lower-right. Full-bleed cover.
const COLORS = {
  top: "#FCFDFF",
  mid: "#F1F5FC",
  bottom: "#E7EEF8",
  glow: "#FFFFFF",
  warm: "#F3ECDD",
};

export default function Layer01Background() {
  return (
    <svg
      viewBox="0 0 1512 720"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="bg_base" x1="0" y1="0" x2="0.25" y2="1">
          <stop offset="0%" stopColor={COLORS.top} />
          <stop offset="55%" stopColor={COLORS.mid} />
          <stop offset="100%" stopColor={COLORS.bottom} />
        </linearGradient>

        {/* Bright halo behind the blueprint rings (center-right) */}
        <radialGradient id="bg_halo" cx="68%" cy="45%" r="45%">
          <stop offset="0%" stopColor={COLORS.glow} stopOpacity="0.9" />
          <stop offset="60%" stopColor={COLORS.glow} stopOpacity="0.25" />
          <stop offset="100%" stopColor={COLORS.glow} stopOpacity="0" />
        </radialGradient>

        {/* Faint warm wash behind the Charminar (lower-right) */}
        <radialGradient id="bg_warm" cx="86%" cy="85%" r="30%">
          <stop offset="0%" stopColor={COLORS.warm} stopOpacity="0.5" />
          <stop offset="100%" stopColor={COLORS.warm} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="1512" height="720" fill="url(#bg_base)" />
      <rect x="0" y="0" width="1512" height="720" fill="url(#bg_halo)" />
      <rect x="0" y="0" width="1512" height="720" fill="url(#bg_warm)" />
    </svg>
  );
}
