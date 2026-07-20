import { useMemo, useState } from "react";
import { getLocalCognitiveContext } from "@/lib/cognition/context";
import { patternMemoryStore } from "@/lib/cognition/memory";
import { cognitiveStateStore } from "@/lib/cognition/state";
import { loomClient } from "@/lib/api/loomClient";
import { dataAdapter } from "@/lib/data/adapter";
import type { ModuleRunOutput } from "@/lib/data/types";
import type { WorkflowTemplate } from "@/lib/modes/workflows";

const KIND_TO_MODULE: Record<WorkflowTemplate["kind"], string> = {
  unfreeze: "signal-collapse",
  "choose-thread": "creative-operator",
  "shape-pattern": "creative-operator",
  "resonance-angle": "personas",
  "ship-tiny": "platform-adapter",
};

function inputsFor(template: WorkflowTemplate, primary: string, secondary: string) {
  switch (template.kind) {
    case "unfreeze":
      return {
        field: primary,
        constraint: secondary || "find the smallest useful next move",
      };
    case "choose-thread":
      return {
        log: primary,
        horizon: "this week",
        energy: secondary || "steady",
      };
    case "shape-pattern":
      return {
        log: `${primary}\n\nWhat to understand: ${secondary || "the recurring pattern"}`,
        horizon: "this month",
        energy: "steady",
      };
    case "resonance-angle":
      return {
        topic: primary,
        voices: secondary || "maker, mentor, beginner",
      };
    case "ship-tiny":
      return {
        source: primary,
        platform: secondary || "linkedin",
        constraint: "keep it small, clear, and publishable without over-polishing",
      };
  }
}

export function WorkflowTemplateView({ template }: { template: WorkflowTemplate }) {
  const [primary, setPrimary] = useState("");
  const [secondary, setSecondary] = useState("");
  const [output, setOutput] = useState<ModuleRunOutput | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const moduleId = KIND_TO_MODULE[template.kind];

  const canRun = useMemo(() => primary.trim().length > 0 && !running, [primary, running]);

  async function runWorkflow() {
    if (!canRun) return;
    setRunning(true);
    setError(null);

    const cognitiveState = cognitiveStateStore.save(cognitiveStateStore.load());
    const inputs = inputsFor(template, primary, secondary);
    const result = await loomClient.run({
      moduleId,
      inputs,
      cognitiveContext: getLocalCognitiveContext(),
    });

    if (result.ok) {
      setOutput(result.data.output);
      await dataAdapter.saveModuleRun({
        moduleId,
        inputs,
        output: result.data.output,
        ranAt: result.data.ranAt,
      });
      patternMemoryStore.add({
        source: "loom-run",
        moduleId,
        mode: cognitiveState.mode,
        observation: `${template.title} while ${cognitiveState.mode}: ${result.data.output.summary}`,
      });
    } else {
      setError(result.message);
    }

    setRunning(false);
  }

  return (
    <article className="glass-panel rounded-3xl p-6 sm:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="font-display text-2xl text-foreground">{template.title}</h3>
        <span className="text-[10px] tracking-[0.26em] uppercase text-muted-foreground">
          {template.duration}
        </span>
      </div>
      <p className="mt-2 text-sm italic text-muted-foreground">{template.intent}</p>
      <p className="mt-4 rounded-2xl border border-border/40 bg-black/10 p-4 text-xs leading-relaxed text-muted-foreground">
        {template.sparkLens}
      </p>

      <ol className="mt-6 grid gap-3 sm:grid-cols-3">
        {template.steps.map((s, i) => (
          <li key={s.title} className="rounded-xl border border-border/40 bg-black/15 p-4">
            <div className="text-[10px] tracking-[0.2em] uppercase text-thread">0{i + 1}</div>
            <div className="mt-2 text-sm font-medium text-foreground">{s.title}</div>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.body}</p>
          </li>
        ))}
      </ol>

      <div className="mt-6 grid gap-4">
        <label className="block">
          <span className="text-[11px] tracking-[0.24em] uppercase text-muted-foreground">
            {template.promptLabel}
          </span>
          <textarea
            rows={5}
            value={primary}
            placeholder={template.promptPlaceholder}
            onChange={(event) => setPrimary(event.target.value)}
            className="mt-2 w-full resize-none rounded-2xl bg-background/40 p-4 text-sm outline-none ring-1 ring-border/40 transition-calm focus:ring-2 focus:ring-thread/60"
          />
        </label>

        {template.secondaryLabel && (
          <label className="block">
            <span className="text-[11px] tracking-[0.24em] uppercase text-muted-foreground">
              {template.secondaryLabel}
            </span>
            <input
              value={secondary}
              placeholder={template.secondaryPlaceholder}
              onChange={(event) => setSecondary(event.target.value)}
              className="mt-2 w-full rounded-xl bg-background/40 p-3 text-sm outline-none ring-1 ring-border/40 transition-calm focus:ring-2 focus:ring-thread/60"
            />
          </label>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-md text-xs text-muted-foreground">
          Runs through Loom with your local cognitive context. Saves a small pattern memory on this
          device.
        </p>
        <button
          type="button"
          onClick={runWorkflow}
          disabled={!canRun}
          className="rounded-full px-6 py-3 text-sm tracking-[0.22em] uppercase disabled:opacity-40 transition-calm"
          style={{ background: "var(--gradient-thread)", color: "oklch(0.14 0.05 275)" }}
        >
          {running ? "Holding..." : "Run workflow"}
        </button>
      </div>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      {output && (
        <div className="mt-8 border-t border-border/30 pt-6 fade-up">
          <p className="text-[11px] tracking-[0.24em] uppercase text-muted-foreground">
            Loom return
          </p>
          <h4 className="mt-2 font-display text-2xl">{output.summary}</h4>

          <div className="mt-5 grid gap-4">
            {output.sections.map((section) => (
              <div
                key={section.heading}
                className="rounded-2xl border border-border/40 bg-black/15 p-5"
              >
                <p className="text-[10px] tracking-[0.24em] uppercase text-thread">
                  {section.heading}
                </p>
                <ul className="mt-3 space-y-2">
                  {section.bullets.map((bullet, index) => (
                    <li key={index} className="text-sm leading-relaxed text-foreground/90">
                      - {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {output.nextMoves.length > 0 && (
            <div className="mt-5 rounded-2xl border border-thread/30 bg-black/15 p-5">
              <p className="text-[10px] tracking-[0.24em] uppercase text-thread">Next moves</p>
              <ol className="mt-3 list-decimal list-inside space-y-2">
                {output.nextMoves.map((move, index) => (
                  <li key={index} className="text-sm leading-relaxed text-foreground/90">
                    {move}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
