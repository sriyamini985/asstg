// Layer 04 — Flowing wave lines sweeping across the bottom of the hero banner,
// reduced density for a cleaner look.
const COLORS = {
  blue: "#A7C4E8",
  gold: "#D9B25C",
};

const r2 = (n) => Math.round(n * 100) / 100;

// Build a smooth left-to-right wave path offset vertically by `dy` inside 720px viewBox.
function wavePath(baseY, amp, dy) {
  const y = baseY + dy;
  return (
    `M-20 ${r2(y + 50)} ` +
    `C 220 ${r2(y + 50 - amp)}, 380 ${r2(y - amp)}, 620 ${r2(y - amp * 0.2)} ` +
    `S 980 ${r2(y + amp * 1.1)}, 1200 ${r2(y - amp * 0.3)} ` +
    `S 1460 ${r2(y - amp * 1.0)}, 1540 ${r2(y - amp * 1.3)}`
  );
}

export default function Layer04Waves() {
  const blue = [];
  // Reduced to 3 elegant blue lines, placed lower (baseY=630)
  for (let i = 0; i < 3; i++) {
    blue.push(
      <path
        key={`b${i}`}
        d={wavePath(630, 32, i * 12)}
        fill="none"
        stroke={COLORS.blue}
        strokeWidth="1.1"
        opacity={r2(0.35 - i * 0.08)}
      />
    );
  }
  const gold = [];
  // Reduced to 2 elegant gold lines, placed lower (baseY=655)
  for (let i = 0; i < 2; i++) {
    gold.push(
      <path
        key={`g${i}`}
        d={wavePath(655, 26, i * 10)}
        fill="none"
        stroke={COLORS.gold}
        strokeWidth="1"
        opacity={r2(0.42 - i * 0.12)}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 1512 720"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>{blue}</g>
      <g>{gold}</g>
    </svg>
  );
}
