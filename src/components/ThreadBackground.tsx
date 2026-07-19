export function ThreadBackground() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="thread-grad" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.78 0.14 220)" stopOpacity="0.6" />
          <stop offset="50%" stopColor="oklch(0.72 0.18 285)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="oklch(0.65 0.2 320)" stopOpacity="0.3" />
        </linearGradient>
        <radialGradient id="node-grad">
          <stop offset="0%" stopColor="oklch(0.85 0.15 260)" stopOpacity="1" />
          <stop offset="100%" stopColor="oklch(0.85 0.15 260)" stopOpacity="0" />
        </radialGradient>
      </defs>
      {Array.from({ length: 14 }).map((_, i) => (
        <line
          key={i}
          x1={i * 90 + 40}
          y1="0"
          x2={i * 90 - 100}
          y2="800"
          stroke="url(#thread-grad)"
          strokeWidth="0.5"
          className="pulse-thread"
          style={{ animationDelay: `${i * 0.3}s` }}
        />
      ))}
      {Array.from({ length: 10 }).map((_, i) => (
        <line
          key={`h-${i}`}
          x1="0"
          y1={i * 90 + 40}
          x2="1200"
          y2={i * 90 + 120}
          stroke="url(#thread-grad)"
          strokeWidth="0.3"
          className="pulse-thread"
          style={{ animationDelay: `${i * 0.5}s` }}
        />
      ))}
      {[
        [200, 180],
        [600, 240],
        [950, 160],
        [320, 520],
        [780, 580],
        [1050, 460],
      ].map(([cx, cy], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r="40"
          fill="url(#node-grad)"
          className="drift"
          style={{ animationDelay: `${i * 1.5}s` }}
        />
      ))}
    </svg>
  );
}
