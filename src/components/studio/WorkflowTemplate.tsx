import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import type { WorkflowTemplate } from "@/lib/modes/workflows";
import { studioStore, newId, type WorkflowProgress } from "@/lib/studio/store";

export function WorkflowTemplateView({ template }: { template: WorkflowTemplate }) {
  const [done, setDone] = useState<number[]>([]);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const p: WorkflowProgress | undefined = studioStore.load().workflowProgress?.[template.id];
    if (p) {
      setDone(p.steps ?? []);
      setNote(p.note ?? "");
    }
    setReady(true);
  }, [template.id]);

  const persist = (steps: number[], nextNote: string) => {
    studioStore.update((s) => ({
      ...s,
      workflowProgress: {
        ...s.workflowProgress,
        [template.id]: { steps, note: nextNote, updatedAt: new Date().toISOString() },
      },
    }));
  };

  const toggle = (i: number) => {
    const steps = done.includes(i) ? done.filter((x) => x !== i) : [...done, i];
    setDone(steps);
    persist(steps, note);
  };

  const reset = () => {
    setDone([]);
    setNote("");
    setSaved(false);
    persist([], "");
  };

  const keepNote = () => {
    const body = note.trim();
    if (!body) return;
    persist(done, body);
    studioStore.update((s) => ({
      ...s,
      snapshots: [
        {
          id: newId(),
          mode: template.mode,
          note: `${template.title} — ${body}`,
          createdAt: new Date().toISOString(),
        },
        ...s.snapshots,
      ],
    }));
    setSaved(true);
  };

  const count = done.length;
  const total = template.steps.length;

  return (
    <article className="glass-panel rounded-3xl p-6 sm:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="font-display text-2xl text-foreground">{template.title}</h3>
        <span className="text-[10px] tracking-[0.26em] uppercase text-muted-foreground">
          {template.duration}
        </span>
      </div>
      <p className="mt-2 text-sm italic text-muted-foreground">{template.intent}</p>

      <div className="mt-4 flex items-center gap-3">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full transition-calm"
            style={{ width: `${(count / total) * 100}%`, background: "var(--gradient-thread)" }}
          />
        </div>
        <span className="text-[10px] tracking-[0.24em] uppercase text-muted-foreground">
          {count} of {total}
        </span>
        {count > 0 && (
          <button
            type="button"
            onClick={reset}
            className="text-[10px] tracking-[0.24em] uppercase text-muted-foreground hover:text-foreground transition-calm"
          >
            Reset
          </button>
        )}
      </div>

      <ol className="mt-6 space-y-3">
        {template.steps.map((s, i) => {
          const checked = done.includes(i);
          return (
            <li
              key={i}
              className="flex items-start gap-4 rounded-xl border border-border/40 bg-black/15 p-4"
            >
              <button
                type="button"
                onClick={() => toggle(i)}
                aria-pressed={checked}
                aria-label={`Mark step ${i + 1} ${checked ? "undone" : "done"}`}
                className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-calm"
                style={{
                  borderColor: checked ? "transparent" : "oklch(0.55 0.05 280 / 0.5)",
                  background: checked ? "var(--gradient-thread)" : "transparent",
                }}
              >
                {checked && <span className="h-1.5 w-1.5 rounded-full bg-black" />}
              </button>
              <div>
                <div className="text-sm font-medium text-foreground">{s.title}</div>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-6 rounded-2xl border border-border/40 bg-black/10 p-4">
        <p className="text-[10px] tracking-[0.24em] uppercase text-muted-foreground">
          What did this give you?
        </p>
        <textarea
          rows={2}
          value={note}
          disabled={!ready}
          onChange={(e) => { setNote(e.target.value); setSaved(false); }}
          placeholder="One line. It becomes a snapshot you can revisit."
          className="mt-2 w-full resize-none rounded-xl bg-background/40 p-3 text-sm outline-none ring-1 ring-border/40 focus:ring-2 focus:ring-thread/60 transition-calm"
        />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={keepNote}
            disabled={!note.trim()}
            className="rounded-full border border-border/70 px-4 py-2 text-[10px] tracking-[0.22em] uppercase text-foreground hover:bg-white/5 disabled:opacity-40 transition-calm"
          >
            Keep as snapshot
          </button>
          {saved && (
            <Link to="/snapshots" className="text-[10px] tracking-[0.22em] uppercase text-thread">
              Saved · see snapshots →
            </Link>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          to="/loom/$moduleId"
          params={{ moduleId: template.moduleId }}
          search={{ seed: `${template.seed}\n${note.trim()}`.trim() }}
          className="rounded-full px-5 py-2.5 text-[11px] tracking-[0.22em] uppercase transition-calm"
          style={{ background: "var(--gradient-thread)", color: "oklch(0.14 0.04 270)" }}
        >
          Run this in the Loom →
        </Link>
        <Link
          to="/map"
          className="rounded-full border border-border/70 px-5 py-2.5 text-[11px] tracking-[0.22em] uppercase text-foreground hover:bg-white/5 transition-calm"
        >
          Map a state
        </Link>
      </div>
    </article>
  );
}
