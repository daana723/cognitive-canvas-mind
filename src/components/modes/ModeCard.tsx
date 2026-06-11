import type { CreativeMode } from "@/lib/modes/modes";

interface Props {
  mode: CreativeMode;
  active?: boolean;
  onSelect?: () => void;
}

export function ModeCard({ mode, active, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="group glass-panel relative w-full overflow-hidden rounded-3xl p-0 text-left transition-calm hover:-translate-y-1"
      style={{
        boxShadow: active ? `0 0 0 1px ${mode.accent}, 0 0 60px ${mode.accent}` : undefined,
      }}
    >
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={mode.image}
          alt=""
          className="h-full w-full object-cover transition-calm group-hover:scale-105"
          style={{ filter: "saturate(1.15) contrast(1.05)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, transparent 30%, oklch(0.14 0.05 275 / 0.95) 100%)`,
          }}
        />
        <div
          className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-3 py-1 text-[10px] tracking-[0.26em] uppercase"
          style={{ color: mode.accent }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: mode.accent }} />
          {active ? "current" : "mode"}
        </div>
      </div>
      <div className="space-y-3 p-6">
        <h3 className="font-display text-2xl text-foreground">{mode.label}</h3>
        <p className="text-sm text-muted-foreground">{mode.tagline}</p>
        <p className="text-sm leading-relaxed text-foreground/80 italic">{mode.essence}</p>
        <div className="pt-2 text-[11px] tracking-[0.22em] uppercase text-muted-foreground group-hover:text-foreground transition-calm">
          {active ? "Currently chosen →" : "Enter this mode →"}
        </div>
      </div>
    </button>
  );
}
