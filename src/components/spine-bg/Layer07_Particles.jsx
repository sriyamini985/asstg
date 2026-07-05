// Layer 07 — Floating particles: deterministic dots, gold accent points and a
// few sparkle stars scattered across the canvas.
const COLORS = {
  blue: "#8FB4E2",
  gold: "#D9B25C",
  white: "#FFFFFF",
};

const r2 = (n) => Math.round(n * 100) / 100;

// Deterministic pseudo-random generator (mulberry32-style) for stable SSR.
function makeRng(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Star({ cx, cy, r, fill, opacity }) {
  const x = parseFloat(cx);
  const y = parseFloat(cy);
  const radius = parseFloat(r);
  const pts = [];
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI / 4) * i;
    const rad = i % 2 === 0 ? radius : radius * 0.4;
    pts.push(`${r2(x + Math.cos(a) * rad)},${r2(y + Math.sin(a) * rad)}`);
  }
  return <polygon points={pts.join(" ")} fill={fill} opacity={opacity} />;
}

export default function Layer07Particles() {
  const rng = makeRng(20260628);
  const dots = [];
  for (let i = 0; i < 55; i++) { // slightly reduced count
    const x = r2(rng() * 1512);
    const y = r2(rng() * 720); // y limits to 720
    const r = r2(0.5 + rng() * 1.5);
    const gold = rng() > 0.8;
    dots.push(
      <circle
        key={i}
        cx={x}
        cy={y}
        r={r}
        fill={gold ? COLORS.gold : COLORS.blue}
        opacity={r2(0.18 + rng() * 0.4)}
      />
    );
  }

  const stars = [
    { cx: 360, cy: 200, r: 6 },
    { cx: 880, cy: 380, r: 5 },
    { cx: 1180, cy: 180, r: 5 },
    { cx: 980, cy: 500, r: 5 },
    { cx: 520, cy: 520, r: 4.5 },
  ];

  return (
    <svg
      viewBox="0 0 1512 720"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>{dots}</g>
      <g>
        {stars.map((s, i) => (
          <Star key={i} cx={s.cx} cy={s.cy} r={s.r} fill={COLORS.white} opacity={0.8} />
        ))}
      </g>
    </svg>
  );
}
