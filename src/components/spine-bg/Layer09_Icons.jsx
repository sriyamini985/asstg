// Layer 09 — Three medical/education icons in circular outline shells on the
// right edge, linked by a faint dotted connector.
const COLORS = {
  blue: "#5C8AD0",
  faint: "#A9C6EC",
};

const CX = 1392;

function Shell({ cy, children }) {
  return (
    <g>
      <circle cx={CX} cy={cy} r="34" fill="#FFFFFF" opacity="0.7" />
      <circle cx={CX} cy={cy} r="34" fill="none" stroke={COLORS.blue} strokeWidth="1.4" opacity="0.7" />
      <g stroke={COLORS.blue} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </g>
    </g>
  );
}

export default function Layer09Icons() {
  return (
    <svg
      viewBox="0 0 1512 720"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* connector */}
      <line x1={CX} y1="194" x2={CX} y2="286" stroke={COLORS.faint} strokeWidth="1" strokeDasharray="2 6" opacity="0.6" />
      <line x1={CX} y1="354" x2={CX} y2="446" stroke={COLORS.faint} strokeWidth="1" strokeDasharray="2 6" opacity="0.6" />

      {/* Caduceus / rod of Asclepius (top) */}
      <Shell cy={160}>
        <line x1={CX} y1={142} x2={CX} y2={178} />
        <path d={`M${CX} 148 q8 6 0 12 q-8 6 0 12`} />
        <path d={`M${CX} 148 q-8 6 0 12 q8 6 0 12`} />
        <circle cx={CX} cy={140} r="2" />
      </Shell>

      {/* Medical cross (middle) */}
      <Shell cy={320}>
        <path d={`M${CX - 4} 304 h8 v8 h8 v8 h-8 v-8 h-8 v-8 h8 z`} />
      </Shell>

      {/* Graduation cap (bottom) */}
      <Shell cy={480}>
        <path d={`M${CX - 16} 474 L${CX} 467 L${CX + 16} 474 L${CX} 481 Z`} />
        <path d={`M${CX - 9} 477 v9 q9 5 18 0 v-9`} />
        <line x1={CX + 16} y1="474" x2={CX + 16} y2="485" />
        <circle cx={CX + 16} cy="486" r="1.6" />
      </Shell>
    </svg>
  );
}
