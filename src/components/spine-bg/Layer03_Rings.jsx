// Layer 03 — Blueprint rings: concentric technical circles, dashed orbits and
// radial tick marks centered behind the spine (center-right).
const COLORS = {
  blue: "#7FA8DC",
  faint: "#A9C6EC",
  gold: "#D9B25C",
};

const r2 = (n) => Math.round(n * 100) / 100;

const CX = 1160; // Shifted right from 1030 for exact alignment
const CY = 360;

// Radial tick marks generator.
function Ticks({ radius, inner, count, stroke, width, opacity }) {
  const ticks = [];
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const x1 = r2(CX + Math.cos(a) * inner);
    const y1 = r2(CY + Math.sin(a) * inner);
    const x2 = r2(CX + Math.cos(a) * radius);
    const y2 = r2(CY + Math.sin(a) * radius);
    ticks.push(
      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth={width} opacity={opacity} />
    );
  }
  return <g>{ticks}</g>;
}

export default function Layer03Rings() {
  return (
    <svg
      viewBox="0 0 1512 720"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="none">
        {/* Solid concentric circles - increased opacities */}
        <circle cx={CX} cy={CY} r="75" stroke={COLORS.blue} strokeWidth="1" opacity="0.65" />
        <circle cx={CX} cy={CY} r="115" stroke={COLORS.faint} strokeWidth="1.2" opacity="0.55" />
        <circle cx={CX} cy={CY} r="160" stroke={COLORS.blue} strokeWidth="1.4" opacity="0.6" />
        <circle cx={CX} cy={CY} r="210" stroke={COLORS.faint} strokeWidth="1.2" opacity="0.5" />
        <circle cx={CX} cy={CY} r="255" stroke={COLORS.faint} strokeWidth="1" opacity="0.45" />

        {/* Dashed orbit rings - accelerated spinning using high-compatibility CSS classes */}
        <g className="spin-cw-35">
          <circle cx={CX} cy={CY} r="135" stroke={COLORS.blue} strokeWidth="1.2" strokeDasharray="3 7" opacity="0.7" />
        </g>
        <g className="spin-ccw-45">
          <circle cx={CX} cy={CY} r="185" stroke={COLORS.gold} strokeWidth="1.4" strokeDasharray="4 10" opacity="0.65" />
        </g>
        <g className="spin-cw-55">
          <circle cx={CX} cy={CY} r="235" stroke={COLORS.blue} strokeWidth="1" strokeDasharray="2 12" opacity="0.6" />
        </g>

        {/* Inner measurement ticks - rotating dynamically */}
        <g className="spin-cw-65">
          <Ticks radius={96} inner={86} count={72} stroke={COLORS.blue} width="0.9" opacity="0.55" />
        </g>
        <g className="spin-ccw-80">
          <Ticks radius={172} inner={160} count={60} stroke={COLORS.faint} width="0.9" opacity="0.5" />
        </g>
        <g className="spin-cw-100">
          <Ticks radius={255} inner={242} count={90} stroke={COLORS.faint} width="0.8" opacity="0.45" />
        </g>

        {/* Crosshair + node accents - rotating dynamically */}
        <g className="spin-cw-25">
          <circle cx={CX} cy={CY} r="4.5" fill={COLORS.blue} opacity="0.85" stroke="none" />
          <circle cx={r2(CX + 160)} cy={CY} r="5" fill={COLORS.gold} opacity="0.9" stroke="none" />
          <circle cx={CX} cy={r2(CY - 210)} r="4" fill={COLORS.blue} opacity="0.8" stroke="none" />
          <circle cx={r2(CX - 115)} cy={r2(CY + 50)} r="4" fill={COLORS.gold} opacity="0.8" stroke="none" />
        </g>
      </g>
    </svg>
  );
}
