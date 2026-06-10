interface Props {
  current: number;
  total: number;
}

export function ProgressThread({ current, total }: Props) {
  const pct = Math.min(100, Math.max(0, (current / total) * 100));
  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between text-xs tracking-[0.18em] uppercase text-muted-foreground">
        <span>Reflection {current} of {total}</span>
        <span className="text-thread">{Math.round(pct)}%</span>
      </div>
      <div className="relative h-[2px] w-full overflow-hidden rounded-full bg-secondary/50">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-calm"
          style={{
            width: `${pct}%`,
            background: "var(--gradient-thread)",
            boxShadow: "0 0 12px oklch(0.74 0.16 285 / 0.6)",
          }}
        />
      </div>
    </div>
  );
}