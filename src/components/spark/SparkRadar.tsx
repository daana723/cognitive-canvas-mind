import { FACETS, type FacetId } from "@/lib/spark/facets";

interface Props {
  scores: Record<FacetId, number>; // 0..4
  size?: number;
}

/** Five-axis SPARK radar. Axis values 0..4 mapped to a normalized polygon. */
export function SparkRadar({ scores, size = 320 }: Props) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.36;
  const n = FACETS.length;

  const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const pt = (i: number, mag: number) => {
    const a = angle(i);
    return [cx + Math.cos(a) * r * mag, cy + Math.sin(a) * r * mag] as const;
  };

  const rings = [0.25, 0.5, 0.75, 1];

  const polyPoints = FACETS.map((f, i) => {
    const mag = Math.max(0.02, Math.min(1, scores[f.id] / 4));
    const [x, y] = pt(i, mag);
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(" ");

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="max-w-full h-auto">
      <defs>
        <radialGradient id="sparkFill" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="oklch(0.82 0.14 285)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="oklch(0.62 0.16 260)" stopOpacity="0.25" />
        </radialGradient>
      </defs>

      {rings.map((rr, i) => {
        const pts = FACETS.map((_, k) => {
          const [x, y] = pt(k, rr);
          return `${x.toFixed(2)},${y.toFixed(2)}`;
        }).join(" ");
        return (
          <polygon
            key={i}
            points={pts}
            fill="none"
            stroke="oklch(0.7 0.05 285 / 0.18)"
            strokeWidth={1}
          />
        );
      })}

      {FACETS.map((_, i) => {
        const [x, y] = pt(i, 1);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={x}
            y2={y}
            stroke="oklch(0.7 0.05 285 / 0.18)"
            strokeWidth={1}
          />
        );
      })}

      <polygon
        points={polyPoints}
        fill="url(#sparkFill)"
        stroke="oklch(0.85 0.14 285)"
        strokeWidth={1.5}
        style={{ filter: "drop-shadow(0 0 12px oklch(0.74 0.16 285 / 0.5))" }}
      />

      {FACETS.map((f, i) => {
        const mag = Math.max(0.02, Math.min(1, scores[f.id] / 4));
        const [x, y] = pt(i, mag);
        return (
          <circle key={f.id} cx={x} cy={y} r={3.5} fill={f.accent} />
        );
      })}

      {FACETS.map((f, i) => {
        const [lx, ly] = pt(i, 1.22);
        return (
          <text
            key={f.id}
            x={lx}
            y={ly}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={11}
            fontFamily="var(--font-display)"
            letterSpacing="0.14em"
            fill="oklch(0.85 0.03 285)"
            style={{ textTransform: "uppercase" }}
          >
            {f.id}
          </text>
        );
      })}
    </svg>
  );
}