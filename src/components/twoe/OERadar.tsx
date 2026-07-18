import { OES, type OEId } from "@/lib/twoe/oes";

interface Props {
  profile: Record<OEId, number>; // 0..100
  size?: number;
}

export function OERadar({ profile, size = 320 }: Props) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.36;
  const n = OES.length;
  const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const pt = (i: number, mag: number) => {
    const a = angle(i);
    return [cx + Math.cos(a) * r * mag, cy + Math.sin(a) * r * mag] as const;
  };
  const rings = [0.25, 0.5, 0.75, 1];
  const polyPoints = OES.map((o, i) => {
    const mag = Math.max(0.02, Math.min(1, profile[o.id] / 100));
    const [x, y] = pt(i, mag);
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(" ");
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="max-w-full h-auto">
      <defs>
        <radialGradient id="oeFill" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="oklch(0.82 0.14 285)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="oklch(0.62 0.16 260)" stopOpacity="0.25" />
        </radialGradient>
      </defs>
      {rings.map((rr, i) => (
        <polygon
          key={i}
          points={OES.map((_, k) => {
            const [x, y] = pt(k, rr);
            return `${x.toFixed(2)},${y.toFixed(2)}`;
          }).join(" ")}
          fill="none"
          stroke="oklch(0.7 0.05 285 / 0.18)"
          strokeWidth={1}
        />
      ))}
      {OES.map((_, i) => {
        const [x, y] = pt(i, 1);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="oklch(0.7 0.05 285 / 0.18)" strokeWidth={1} />;
      })}
      <polygon
        points={polyPoints}
        fill="url(#oeFill)"
        stroke="oklch(0.85 0.14 285)"
        strokeWidth={1.5}
        style={{ filter: "drop-shadow(0 0 12px oklch(0.74 0.16 285 / 0.5))" }}
      />
      {OES.map((o, i) => {
        const mag = Math.max(0.02, Math.min(1, profile[o.id] / 100));
        const [x, y] = pt(i, mag);
        return <circle key={o.id} cx={x} cy={y} r={3.5} fill={o.accent} />;
      })}
      {OES.map((o, i) => {
        const [lx, ly] = pt(i, 1.24);
        return (
          <text
            key={o.id}
            x={lx}
            y={ly}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={10}
            letterSpacing="0.16em"
            fill="oklch(0.85 0.03 285)"
            style={{ textTransform: "uppercase" }}
          >
            {o.label}
          </text>
        );
      })}
    </svg>
  );
}