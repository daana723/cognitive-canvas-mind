import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Sigil } from "@/components/loom/Sigil";
import { loomClient } from "@/lib/api/loomClient";
import dataAdapter from "@/lib/data/adapter";
import { LOOM_AGENTS } from "@/lib/loom/agents";
import { getLoomModule } from "@/lib/loom/modules";
import type { LoomRunResponse } from "@/lib/data/types";

export const Route = createFileRoute("/loom/$moduleId")({
  component: LoomModulePage,
});

const stringifyValue = (value: unknown) => {
  if (Array.isArray(value)) return value.join("\n");
  if (value && typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value ?? "");
};

function LoomModulePage() {
  const { moduleId } = Route.useParams();
  const module = getLoomModule(moduleId);
  const agent = useMemo(() => LOOM_AGENTS.find((item) => item.moduleIds.includes(moduleId)), [moduleId]);
  const initialInputs = useMemo(() => {
    if (!module) return {};
    return Object.fromEntries(module.inputs.map((input) => {
      if (input.kind === "select") return [input.id, input.options?.[0] ?? ""];
      if (input.kind === "tags") return [input.id, "loom, local-first"];
      return [input.id, ""];
    }));
  }, [module]);
  const [inputs, setInputs] = useState<Record<string, unknown>>(initialInputs);
  const [run, setRun] = useState<LoomRunResponse | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  if (!module) {
    return (
      <section className="relative z-10 mx-auto max-w-3xl px-6 pt-12">
        <div className="glass-panel rounded-2xl p-6 text-center">
          <h1 className="font-display text-4xl">Thread not found.</h1>
          <p className="mt-3 text-sm text-muted-foreground">No Loom module is registered for {moduleId}.</p>
          <Link to="/loom/constellation" className="mt-5 inline-block text-[10px] tracking-[0.24em] uppercase text-thread">
            Return to constellation
          </Link>
        </div>
      </section>
    );
  }

  const updateInput = (id: string, value: string) => {
    setInputs((current) => ({ ...current, [id]: value }));
  };

  const runCurrentModule = async () => {
    setIsRunning(true);
    const normalizedInputs = Object.fromEntries(
      module.inputs.map((input) => {
        const value = inputs[input.id];
        if (input.kind === "tags" && typeof value === "string") {
          return [input.id, value.split(",").map((tag) => tag.trim()).filter(Boolean)];
        }
        return [input.id, value];
      }),
    );
    const result = await loomClient.run({ moduleId: module.id, inputs: normalizedInputs, context: { source: "loom-module-route" } });
    if (result.ok) {
      setRun(result.data);
      await dataAdapter.saveModuleRun({
        id: result.data.runId,
        createdAt: new Date().toISOString(),
        moduleId: module.id,
        inputs: normalizedInputs,
        response: result.data,
      });
    }
    setIsRunning(false);
  };

  return (
    <section className="relative z-10 mx-auto max-w-5xl px-6 pt-8">
      <Link to="/loom/constellation" className="text-[10px] tracking-[0.24em] uppercase text-muted-foreground hover:text-foreground transition-calm">
        Back to constellation
      </Link>
      <div className="mt-6 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="glass-panel rounded-2xl p-5">
          {agent && (
            <div className="mb-5 flex items-center gap-4">
              <div className="rounded-2xl border border-border/50 p-3" style={{ color: agent.accent }}>
                <Sigil variant={agent.sigil} className="h-12 w-12" />
              </div>
              <div>
                <p className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground">{agent.label}</p>
                <p className="font-display text-2xl">{agent.role}</p>
              </div>
            </div>
          )}
          <h1 className="font-display text-4xl">{module.label}</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{module.blurb}</p>
          <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
            This module runs locally and returns structured output. No external API calls are made.
          </p>
        </aside>

        <div className="glass-panel rounded-2xl p-5">
          <p className="text-[10px] tracking-[0.26em] uppercase text-muted-foreground">Module input</p>
          <div className="mt-4 space-y-4">
            {module.inputs.map((input) => (
              <label key={input.id} className="block">
                <span className="text-xs tracking-[0.18em] uppercase text-muted-foreground">{input.label}</span>
                {input.kind === "longtext" ? (
                  <textarea
                    value={String(inputs[input.id] ?? "")}
                    onChange={(event) => updateInput(input.id, event.target.value)}
                    placeholder={input.placeholder}
                    className="mt-2 min-h-32 w-full rounded-xl border border-border/60 bg-background/55 p-3 text-sm outline-none transition-calm focus:border-primary/70"
                  />
                ) : input.kind === "select" ? (
                  <select
                    value={String(inputs[input.id] ?? "")}
                    onChange={(event) => updateInput(input.id, event.target.value)}
                    className="mt-2 w-full rounded-xl border border-border/60 bg-background/80 p-3 text-sm outline-none transition-calm focus:border-primary/70"
                  >
                    {(input.options ?? []).map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                ) : (
                  <input
                    value={String(inputs[input.id] ?? "")}
                    onChange={(event) => updateInput(input.id, event.target.value)}
                    placeholder={input.placeholder}
                    className="mt-2 w-full rounded-xl border border-border/60 bg-background/55 p-3 text-sm outline-none transition-calm focus:border-primary/70"
                  />
                )}
              </label>
            ))}
          </div>
          <button
            type="button"
            onClick={runCurrentModule}
            disabled={isRunning}
            className="mt-5 rounded-full px-5 py-3 text-[11px] tracking-[0.24em] uppercase transition-calm disabled:opacity-50"
            style={{ background: "var(--gradient-thread)", color: "oklch(0.14 0.04 270)" }}
          >
            {isRunning ? "Running..." : "Run module"}
          </button>
        </div>
      </div>

      {run && (
        <article className="mt-8 glass-panel rounded-2xl p-5">
          <p className="text-[10px] tracking-[0.26em] uppercase text-muted-foreground">Structured return</p>
          <h2 className="mt-2 font-display text-3xl">{run.summary}</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {Object.entries(run.outputs).map(([key, value]) => (
              <div key={key} className="rounded-xl border border-border/50 p-3">
                <p className="text-[10px] tracking-[0.2em] uppercase text-thread">{key}</p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{stringifyValue(value)}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm text-foreground">Next: {run.nextAction}</p>
        </article>
      )}
    </section>
  );
}
