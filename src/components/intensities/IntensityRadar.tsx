import { INTENSITIES } from "@/lib/intensities/intensities";
import type { IntensityScores } from "@/lib/intensities/scoring";

interface Props {
  scores: IntensityScores;
  size?: number;
}

/**
 * Intensity Radar — sibling of the cognitive radar, but warmer.
 * Five channels arranged as a pentagon.
 */
export function IntensityRadar({ scores, size = 360 }: Props) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = (size / 2) * 0.74;
  const dims = INTENSITIES;
  const angleFor = (i: number) => (Math.PI * 2 * i) / dims.length - Math.PI / 2;

  const point = (i: number, v: number) => {
    const a = angleFor(i);
    return [cx + Math.cos(a) * radius * v, cy + Math.sin(a) * radius * v] as const;
  };

  const polygon = dims
    .map((d, i) => {
      const [x, y] = point(i, Math.max(0.08, scores[d.id]));
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Intensities radar">
      <defs>
        <radialGradient id="intFill" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="oklch(0.86 0.16 35)" stopOpacity="0.55" />
          <stop offset="60%" stopColor="oklch(0.78 0.22 290)" stopOpacity="0.30" />
          <stop offset="100%" stopColor="oklch(0.74 0.22 325)" stopOpacity="0.05" />
        </radialGradient>
        <linearGradient id="intStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="oklch(0.86 0.16 35)" />
          <stop offset="50%" stopColor="oklch(0.78 0.22 290)" />
          <stop offset="100%" stopColor="oklch(0.74 0.22 325)" />
        </linearGradient>
        <filter id="intGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {[0.25, 0.5, 0.75, 1].map((r, idx) => (
        <polygon
          key={idx}
          points={dims.map((_, i) => { const [x, y] = point(i, r); return `${x.toFixed(2)},${y.toFixed(2)}`; }).join(" ")}
          fill="none"
          stroke="oklch(0.55 0.05 280 / 0.18)"
          strokeWidth={1}
        />
      ))}
      {dims.map((_, i) => {
        const [x, y] = point(i, 1);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="oklch(0.55 0.05 280 / 0.18)" strokeWidth={1} />;
      })}

      <polygon points={polygon} fill="url(#intFill)" stroke="url(#intStroke)" strokeWidth={1.5} filter="url(#intGlow)" />

      {dims.map((d, i) => {
        const [x, y] = point(i, Math.max(0.08, scores[d.id]));
        return <circle key={d.id} cx={x} cy={y} r={4} fill="oklch(0.96 0.02 280)" stroke="oklch(0.78 0.22 290)" strokeWidth={1.5} />;
      })}

      {dims.map((d, i) => {
        const a = angleFor(i);
        const lx = cx + Math.cos(a) * (radius + 22);
        const ly = cy + Math.sin(a) * (radius + 22);
        const anchor = Math.cos(a) > 0.3 ? "start" : Math.cos(a) < -0.3 ? "end" : "middle";
        return (
          <text key={d.id} x={lx} y={ly} fill="oklch(0.82 0.04 280)" fontSize={10.5} letterSpacing="0.18em" textAnchor={anchor} dominantBaseline="middle" style={{ textTransform: "uppercase" }}>
            {d.label}
          </text>
        );
      })}
    </svg>
  );
}