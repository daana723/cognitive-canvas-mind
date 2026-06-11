import { useEffect, useState } from "react";
import { studioStore, newId, type Snapshot } from "@/lib/studio/store";
import { MODES, type ModeId, getMode } from "@/lib/modes/modes";
import { PHASES, type PhaseId, getPhase } from "@/lib/modes/phases";

export function SnapshotList() {
  const [items, setItems] = useState<Snapshot[]>([]);
  const [mode, setMode] = useState<ModeId>("flux");
  const [phase, setPhase] = useState<PhaseId | "">("");
  const [note, setNote] = useState("");

  useEffect(() => {
    const s = studioStore.load();
    setItems(s.snapshots);
    if (s.currentMode) setMode(s.currentMode);
    if (s.currentPhase) setPhase(s.currentPhase);
  }, []);

  const save = () => {
    const snap: Snapshot = {
      id: newId(),
      mode,
      phase: (phase || undefined) as PhaseId | undefined,
      note: note.trim(),
      createdAt: new Date().toISOString(),
    };
    const next = [snap, ...items];
    setItems(next);
    setNote("");
    studioStore.update((s) => ({ ...s, snapshots: next }));
  };

  const remove = (id: string) => {
    const next = items.filter((i) => i.id !== id);
    setItems(next);
    studioStore.update((s) => ({ ...s, snapshots: next }));
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <p className="text-[10px] tracking-[0.28em] uppercase text-muted-foreground">
          Take a snapshot · you choose the labels
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs text-muted-foreground">Mode</span>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as ModeId)}
              className="mt-1 w-full rounded-xl border border-border/60 bg-black/20 px-3 py-2.5 text-sm outline-none focus:border-foreground/40"
            >
              {MODES.map((m) => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs text-muted-foreground">Phase (optional)</span>
            <select
              value={phase}
              onChange={(e) => setPhase(e.target.value as PhaseId | "")}
              className="mt-1 w-full rounded-xl border border-border/60 bg-black/20 px-3 py-2.5 text-sm outline-none focus:border-foreground/40"
            >
              <option value="">—</option>
              {PHASES.map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
          </label>
        </div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="A line about this moment — what you're doing, what you're holding."
          className="w-full resize-none rounded-xl border border-border/60 bg-black/20 p-4 text-sm outline-none focus:border-foreground/40"
        />
        <div className="flex justify-end">
          <button
            type="button"
            onClick={save}
            className="rounded-full px-6 py-2.5 text-xs tracking-[0.22em] uppercase transition-calm"
            style={{ background: "var(--gradient-thread)", color: "oklch(0.14 0.04 270)" }}
          >
            Save snapshot
          </button>
        </div>
      </div>

      {items.length === 0 && (
        <p className="text-center text-sm italic text-muted-foreground">
          No snapshots yet. Save one whenever a moment feels worth marking.
        </p>
      )}

      <div className="space-y-3">
        {items.map((s) => {
          const m = getMode(s.mode);
          const p = s.phase ? getPhase(s.phase) : null;
          return (
            <article key={s.id} className="glass-panel rounded-2xl p-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="rounded-full px-3 py-1 text-[10px] tracking-[0.24em] uppercase"
                    style={{ background: m.accent, color: "oklch(0.14 0.04 270)" }}
                  >
                    {m.label}
                  </span>
                  {p && (
                    <span className="rounded-full border border-border/60 px-3 py-1 text-[10px] tracking-[0.24em] uppercase text-muted-foreground">
                      {p.label}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => remove(s.id)}
                  className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground hover:text-foreground transition-calm"
                >
                  Release
                </button>
              </div>
              {s.note && <p className="text-sm leading-relaxed text-foreground/90">{s.note}</p>}
              <p className="mt-3 text-[10px] tracking-[0.24em] uppercase text-muted-foreground">
                {new Date(s.createdAt).toLocaleString()}
              </p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
