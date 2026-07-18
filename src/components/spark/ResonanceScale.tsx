import { RESONANCE_LABELS, type Resonance } from "@/lib/spark/prompts";

interface Props {
  value: Resonance | undefined;
  onChange: (v: Resonance) => void;
}

const VALUES: Resonance[] = [1, 2, 3, 4, 5];

export function ResonanceScale({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-5 gap-2 sm:gap-3">
      {VALUES.map((v) => {
        const active = value === v;
        const size = 36 + Math.abs(v - 3) * 6;
        return (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className="group flex flex-col items-center gap-3 outline-none"
            aria-label={RESONANCE_LABELS[v]}
            aria-pressed={active}
          >
            <span
              className="relative inline-flex items-center justify-center rounded-full border transition-calm"
              style={{
                width: size,
                height: size,
                borderColor: active ? "transparent" : "oklch(0.55 0.05 280 / 0.4)",
                background: active ? "var(--gradient-thread)" : "oklch(0.24 0.05 278 / 0.4)",
                boxShadow: active ? "0 0 28px oklch(0.74 0.16 285 / 0.55)" : undefined,
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full transition-calm"
                style={{
                  background: active ? "oklch(0.16 0.04 275)" : "oklch(0.7 0.06 280 / 0.6)",
                }}
              />
            </span>
            <span
              className={
                "text-[10px] sm:text-xs tracking-wide transition-calm " +
                (active
                  ? "text-foreground"
                  : "text-muted-foreground group-hover:text-foreground/80")
              }
            >
              {RESONANCE_LABELS[v]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
