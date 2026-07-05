// Layer 08 — Hyderabad skyline with the Charminar monument, drawn as thin
// vector outlines in the lower-right. Strokes only, no fills.
const COLORS = {
  blue: "#8AAFDD",
  faint: "#AAC6E8",
};

const r2 = (n) => Math.round(n * 100) / 100;

// A single minaret: tapered shaft, two balcony tiers, onion dome and finial.
function Minaret({ x, baseY, topY, w }) {
  const half = w / 2;
  const domeW = half + 4;
  const b1 = topY + (baseY - topY) * 0.32;
  const b2 = topY + (baseY - topY) * 0.62;
  return (
    <g>
      {/* shaft */}
      <line x1={r2(x - half)} y1={baseY} x2={r2(x - half + 2)} y2={topY} />
      <line x1={r2(x + half)} y1={baseY} x2={r2(x + half - 2)} y2={topY} />
      {/* balcony tiers */}
      <line x1={r2(x - half - 3)} y1={b1} x2={r2(x + half + 3)} y2={b1} />
      <line x1={r2(x - half - 3)} y1={b2} x2={r2(x + half + 3)} y2={b2} />
      <line x1={r2(x - half - 3)} y1={r2(b1 + 5)} x2={r2(x + half + 3)} y2={r2(b1 + 5)} />
      {/* onion dome */}
      <path
        d={`M${r2(x - domeW)} ${topY} Q${r2(x - domeW)} ${r2(topY - domeW * 1.2)} ${x} ${r2(topY - domeW * 1.9)} Q${r2(x + domeW)} ${r2(topY - domeW * 1.2)} ${r2(x + domeW)} ${topY} Z`}
      />
      {/* finial */}
      <line x1={x} y1={r2(topY - domeW * 1.9)} x2={x} y2={r2(topY - domeW * 2.6)} />
      <circle cx={x} cy={r2(topY - domeW * 2.6)} r="1.8" />
    </g>
  );
}

// A pointed (ogee) arch opening.
function Arch({ x, y, w, h }) {
  const half = w / 2;
  return (
    <path
      d={`M${r2(x - half)} ${y} V${r2(y - h * 0.55)} Q${r2(x - half)} ${r2(y - h)} ${x} ${r2(y - h * 1.05)} Q${r2(x + half)} ${r2(y - h)} ${r2(x + half)} ${r2(y - h * 0.55)} V${y}`}
    />
  );
}

export default function Layer08City() {
  const plinthY = 650;
  const baseLineY = 690;
  const bodyY = 520;
  
  return (
    <svg
      viewBox="0 0 1512 720"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Faint generic skyline across the lower band */}
      <g fill="none" stroke={COLORS.faint} strokeWidth="1.1" opacity="0.25" strokeLinejoin="round">
        <line x1="0" y1={baseLineY} x2="1512" y2={baseLineY} />
        <path d={`M60 ${baseLineY} V620 H120 V590 H170 V${baseLineY}`} />
        <path d={`M210 ${baseLineY} V570 H270 V600 H320 V${baseLineY}`} />
        <path d={`M360 ${baseLineY} V630 H420 V${baseLineY}`} />
        <path d={`M900 ${baseLineY} V590 H960 V620 H1010 V${baseLineY}`} />
        <path d={`M1050 ${baseLineY} V610 H1110 V${baseLineY}`} />
        {/* slender towers */}
        <line x1="930" y1="590" x2="930" y2="530" />
        <line x1="975" y1="620" x2="975" y2="560" />
      </g>

      {/* Charminar monument (lower-right) */}
      <g fill="none" stroke={COLORS.blue} strokeWidth="1.3" opacity="0.5" strokeLinejoin="round">
        {/* base plinth */}
        <rect x="1230" y={plinthY} width="262" height="40" />
        {/* main cubic body */}
        <rect x="1252" y={bodyY} width="218" height="130" />
        {/* upper parapet with small merlons */}
        <line x1="1252" y1={bodyY} x2="1470" y2={bodyY} />
        <path d={`M1262 ${bodyY} v-12 h10 v12 M1292 ${bodyY} v-12 h10 v12 M1322 ${bodyY} v-12 h10 v12 M1392 ${bodyY} v-12 h10 v12 M1422 ${bodyY} v-12 h10 v12 M1452 ${bodyY} v-12 h10 v12`} />

        {/* grand central pointed arch */}
        <Arch x={1361} y={plinthY} w={92} h={120} />
        {/* flanking smaller arches */}
        <Arch x={1282} y={plinthY} w={36} h={70} />
        <Arch x={1440} y={plinthY} w={36} h={70} />

        {/* secondary tier band */}
        <line x1="1252" y1="578" x2="1470" y2="578" />

        {/* four corner minarets */}
        <Minaret x={1246} baseY={bodyY} topY={410} w={20} />
        <Minaret x={1476} baseY={bodyY} topY={410} w={20} />
        <Minaret x={1300} baseY={bodyY} topY={432} w={16} />
        <Minaret x={1422} baseY={bodyY} topY={432} w={16} />

        {/* central crowning dome */}
        <path d={`M1336 ${bodyY} Q1336 478 1361 462 Q1386 478 1386 ${bodyY} Z`} />
        <line x1="1361" y1="462" x2="1361" y2="444" />
        <circle cx="1361" cy="442" r="2" />
      </g>
    </svg>
  );
}
