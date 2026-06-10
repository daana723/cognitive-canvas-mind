import { DIMENSIONS } from "@/lib/spark/dimensions";
import type { DimensionScores } from "@/lib/spark/scoring";

interface Props {
  scores: DimensionScores;
  size?: number;
}

/**
 * Cognitive Radar — soft, glowing SVG radar.
 * Premium feel: no axis numbers, no clinical edge — only the shape itself.
 */
export function RadarChart({ scores, size = 420 }: Props) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = (size / 2) * 0.78;
  const dims = DIMENSIONS;
  const angleFor = (i: number) => (Math.PI * 2 * i) / dims.length - Math.PI / 2;

  const ringSteps = [0.25, 0.5, 0.75, 1];

  const point = (i: number, v: number) => {
    const a = angleFor(i);
    return [cx + Math.cos(a) * radius * v, cy + Math.sin(a) * radius * v] as const;
  };

  const polygon = dims
    .map((d, i) => {
      const [x, y] = point(i, Math.max(0.05, scores[d.id]));
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <div className="relative inline-block">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="block"
        role="img"
        aria-label="Cognitive profile radar"
      >
        <defs>
          <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.74 0.16 285)" stopOpacity="0.45" />
            <stop offset="60%" stopColor="oklch(0.80 0.12 220)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="oklch(0.70 0.18 320)" stopOpacity="0.05" />
          </radialGradient>
          <linearGradient id="radarStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.80 0.12 220)" />
            <stop offset="50%" stopColor="oklch(0.74 0.16 285)" />
            <stop offset="100%" stopColor="oklch(0.70 0.18 320)" />
          </linearGradient>
          <filter id="radarGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* concentric rings */}
        {ringSteps.map((r, idx) => (
          <polygon
            key={idx}
            points={dims
              .map((_, i) => {
                const [x, y] = point(i, r);
                return `${x.toFixed(2)},${y.toFixed(2)}`;
              })
              .join(" ")}
            fill="none"
            stroke="oklch(0.55 0.05 280 / 0.18)"
            strokeWidth={1}
          />
        ))}

        {/* spokes */}
        {dims.map((_, i) => {
          const [x, y] = point(i, 1);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke="oklch(0.55 0.05 280 / 0.18)"
              strokeWidth={1}
            />
          );
        })}

        {/* shape */}
        <polygon
          points={polygon}
          fill="url(#radarFill)"
          stroke="url(#radarStroke)"
          strokeWidth={1.5}
          filter="url(#radarGlow)"
        />

        {/* points */}
        {dims.map((d, i) => {
          const [x, y] = point(i, Math.max(0.05, scores[d.id]));
          return (
            <circle
              key={d.id}
              cx={x}
              cy={y}
              r={4}
              fill="oklch(0.96 0.02 280)"
              stroke="oklch(0.74 0.16 285)"
              strokeWidth={1.5}
            />
          );
        })}

        {/* labels */}
        {dims.map((d, i) => {
          const a = angleFor(i);
          const lx = cx + Math.cos(a) * (radius + 26);
          const ly = cy + Math.sin(a) * (radius + 26);
          const anchor =
            Math.cos(a) > 0.3 ? "start" : Math.cos(a) < -0.3 ? "end" : "middle";
          return (
            <text
              key={d.id}
              x={lx}
              y={ly}
              fill="oklch(0.78 0.04 280)"
              fontSize={10.5}
              letterSpacing="0.18em"
              textAnchor={anchor}
              dominantBaseline="middle"
              style={{ textTransform: "uppercase" }}
            >
              {d.label.replace(" Style", "").replace(" Processing", "").replace(" Sensitivity", "").replace(" Pattern", "").replace("-Making", "")}
            </text>
          );
        })}
      </svg>
    </div>
  );
}