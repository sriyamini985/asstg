// Layer 05 — Technical medical decorations: hexagon molecule clusters, dotted
// grids in the corners and connector nodes.
const COLORS = {
  blue: "#8FB4E2",
  faint: "#B6CFEC",
  gold: "#D9B25C",
};

const r2 = (n) => Math.round(n * 100) / 100;

function Hexagon({ cx, cy, r, stroke, width, opacity }) {
  const x = parseFloat(cx);
  const y = parseFloat(cy);
  const radius = parseFloat(r);
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    pts.push(`${r2(x + Math.cos(a) * radius)},${r2(y + Math.sin(a) * radius)}`);
  }
  return <polygon points={pts.join(" ")} fill="none" stroke={stroke} strokeWidth={width} opacity={opacity} />;
}

function DottedGrid({ x, y, cols, rows, gap, r, fill, opacity }) {
  const dots = [];
  for (let c = 0; c < cols; c++) {
    for (let rw = 0; rw < rows; rw++) {
      dots.push(
        <circle key={`${c}-${rw}`} cx={r2(x + c * gap)} cy={r2(y + rw * gap)} r={r} fill={fill} opacity={opacity} />
      );
    }
  }
  return <g>{dots}</g>;
}

export default function Layer05MedicalElements() {
  return (
    <svg
      viewBox="0 0 1512 720"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Hexagon molecule cluster (upper center-left, shifted to avoid text) */}
      <g opacity="0.55">
        <Hexagon cx="580" cy="220" r="38" stroke={COLORS.gold} width="1" opacity="0.55" />
        <Hexagon cx="540" cy="270" r="24" stroke={COLORS.faint} width="1" opacity="0.5" />
        <line x1="562" y1="248" x2="530" y2="290" stroke={COLORS.faint} strokeWidth="0.8" opacity="0.5" />
        <circle cx="580" cy="182" r="2.2" fill={COLORS.gold} opacity="0.7" />
        <circle cx="515" cy="250" r="2.2" fill={COLORS.blue} opacity="0.6" />
      </g>

      {/* Connector / molecule node string (left-center) */}
      <g opacity="0.5" fill="none" stroke={COLORS.blue} strokeWidth="0.9">
        <path d="M380 370 L460 410 L540 390 L600 440" />
        <circle cx="380" cy="370" r="2.5" fill={COLORS.blue} stroke="none" />
        <circle cx="460" cy="410" r="2.5" fill={COLORS.faint} stroke="none" />
        <circle cx="540" cy="390" r="2.5" fill={COLORS.gold} stroke="none" opacity="0.8" />
        <circle cx="600" cy="440" r="2.5" fill={COLORS.blue} stroke="none" />
      </g>

      {/* Dotted grids - scaled heights */}
      <DottedGrid x="1380" y="50" cols={7} rows={4} gap={14} r={2} fill={COLORS.gold} opacity={0.5} />
      <DottedGrid x="500" y="80" cols={6} rows={4} gap={13} r={1.8} fill={COLORS.blue} opacity={0.35} />
      <DottedGrid x="30" y="650" cols={6} rows={3} gap={13} r={2} fill={COLORS.blue} opacity={0.4} />

      {/* Corner registration marks */}
      <g stroke={COLORS.gold} strokeWidth="1" fill="none" opacity="0.45">
        <path d="M1470 450 h22 v22" />
        <path d="M80 660 v-22 h22" />
      </g>
    </svg>
  );
}
