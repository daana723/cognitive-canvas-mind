import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AuroraField } from "@/components/AuroraField";
import { WorkflowTemplateView } from "@/components/studio/WorkflowTemplate";
import { WORKFLOWS, workflowsFor } from "@/lib/modes/workflows";
import { MODES, getMode, type ModeId } from "@/lib/modes/modes";
import { studioStore } from "@/lib/studio/store";

export const Route = createFileRoute("/workflows")({
  head: () => ({
    meta: [
      { title: "Workflows — Creative Studio" },
      {
        name: "description",
        content: "Active Loom workflows for unfreezing, shaping, and shipping creative work.",
      },
    ],
  }),
  component: WorkflowsPage,
});

function WorkflowsPage() {
  const [mode, setMode] = useState<ModeId | undefined>();
  useEffect(() => {
    setMode(studioStore.load().currentMode);
  }, []);

  const list = mode ? workflowsFor(mode) : WORKFLOWS;
  const m = mode ? getMode(mode) : null;

  return (
    <main className="relative min-h-screen overflow-hidden pb-32">
      <AuroraField />
      <header className="relative z-10 mx-auto flex max-w-4xl items-center justify-between px-6 py-8">
        <Link to="/" className="flex items-center gap-3">
          <span
            className="h-2 w-2 rounded-full breathe"
            style={{ background: "var(--gradient-thread)" }}
          />
          <span className="font-display text-base tracking-wide">Creative Studio</span>
        </Link>
        <Link
          to="/modes"
          className="text-xs tracking-[0.22em] uppercase text-muted-foreground hover:text-foreground transition-calm"
        >
          Modes →
        </Link>
      </header>

      <section className="relative z-10 mx-auto max-w-3xl px-6 pt-8">
        <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-4 fade-up">
          Unfreeze studio
        </p>
        <h1
          className="font-display text-5xl leading-[1.05] fade-up"
          style={{ animationDelay: "60ms" }}
        >
          Workflows for{" "}
          <span className="text-thread italic">
            {m ? m.label.toLowerCase() : "getting unstuck"}
          </span>
          .
        </h1>
        <p
          className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground fade-up"
          style={{ animationDelay: "160ms" }}
        >
          Bring the messy thought, the too-many-options field, or the almost-ready draft. Each card
          now runs through Loom and returns a structured next move, not just a checklist.
        </p>
      </section>

      <section className="relative z-10 mx-auto mt-8 max-w-3xl px-6">
        <div className="glass-panel rounded-2xl p-4">
          <p className="mb-3 text-[10px] tracking-[0.28em] uppercase text-muted-foreground">
            Choose a lens
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setMode(undefined);
                studioStore.update((s) => ({ ...s, currentMode: undefined }));
              }}
              className={
                "rounded-full px-4 py-2 text-[11px] tracking-[0.2em] uppercase transition-calm " +
                (mode
                  ? "border border-border/60 text-muted-foreground hover:text-foreground"
                  : "text-foreground")
              }
              style={
                mode
                  ? undefined
                  : { background: "var(--gradient-thread)", color: "oklch(0.14 0.04 270)" }
              }
            >
              All
            </button>
            {MODES.map((opt) => {
              const active = opt.id === mode;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setMode(opt.id);
                    studioStore.update((s) => ({ ...s, currentMode: opt.id }));
                  }}
                  className="rounded-full px-4 py-2 text-[11px] tracking-[0.2em] uppercase transition-calm"
                  style={
                    active
                      ? { background: opt.accent, color: "oklch(0.14 0.04 270)" }
                      : { border: "1px solid oklch(0.55 0.05 280 / 0.4)" }
                  }
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto mt-8 max-w-3xl space-y-5 px-6">
        {list.map((w, i) => (
          <div key={w.id} className="fade-up" style={{ animationDelay: `${i * 60}ms` }}>
            <WorkflowTemplateView template={w} />
          </div>
        ))}
        {list.length === 0 && (
          <p className="text-center text-sm italic text-muted-foreground">
            No active workflows for this lens yet.
          </p>
        )}
      </section>
    </main>
  );
}
