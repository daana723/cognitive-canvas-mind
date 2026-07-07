import { PHASES, type PhaseId } from "@/lib/modes/phases";

interface Props {
  current?: PhaseId;
  onSelect: (id: PhaseId) => void;
}

export function PhaseRibbon({ current, onSelect }: Props) {
  return (
    <div className="glass-panel rounded-2xl p-4">
      <p className="mb-3 text-[10px] tracking-[0.28em] uppercase text-muted-foreground">
        Where in the story · you choose
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {PHASES.map((p) => {
          const active = current === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelect(p.id)}
              className="rounded-xl px-3 py-3 text-left transition-calm"
              style={{
                background: active
                  ? "var(--gradient-thread)"
                  : "oklch(0.22 0.05 278 / 0.5)",
                color: active ? "oklch(0.14 0.04 270)" : undefined,
              }}
            >
              <div className="text-sm font-medium">{p.label}</div>
              <div className={"mt-0.5 text-[11px] " + (active ? "opacity-80" : "text-muted-foreground")}>
                {p.essence}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
