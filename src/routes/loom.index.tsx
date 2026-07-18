import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Sigil } from "@/components/loom/Sigil";
import { loomClient } from "@/lib/api/loomClient";
import dataAdapter from "@/lib/data/adapter";
import { LOOM_AGENTS, getLoomAgent } from "@/lib/loom/agents";
import { getLoomModule } from "@/lib/loom/modules";
import type { LoomRunResponse } from "@/lib/data/types";
import type { WeavePlan } from "@/lib/loom/orchestrator";

export const Route = createFileRoute("/loom/")({
  component: LoomEntryPage,
});

const TAGS = ["clarity", "content", "voice", "launch", "platform", "planning", "research"];

const defaultInputsFor = (moduleId: string, intention: string): Record<string, unknown> => {
  const module = getLoomModule(moduleId);
  if (!module) return { intention };
  return Object.fromEntries(
    module.inputs.map((input) => {
      if (input.kind === "tags") return [input.id, ["loom", "local-first"]];
      if (input.kind === "select") return [input.id, input.options?.[0] ?? "steady"];
      if (input.kind === "longtext") return [input.id, intention];
      return [input.id, intention.slice(0, 120) || "A creative thread"];
    }),
  );
};

function LoomEntryPage() {
  const [body, setBody] = useState("I have scattered ideas for a creative offer, but I need the signal, voice, launch shape, and next moves.");
  const [tags, setTags] = useState<string[]>(["clarity", "content", "launch"]);
  const [plan, setPlan] = useState<WeavePlan | null>(null);
  const [runs, setRuns] = useState<LoomRunResponse[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const litAgents = useMemo(() => new Set(plan?.agents ?? []), [plan]);

  const toggleTag = (tag: string) => {
    setTags((current) => current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]);
  };

  const createWeave = async () => {
    const result = await loomClient.weave({ body, tags });
    if (!result.ok) return;
    setPlan(result.data);
    setRuns([]);
    await dataAdapter.saveWeave({
      id: result.data.weaveId,
      createdAt: result.data.createdAt,
      intention: result.data.intention,
      tags: result.data.tags,
      plan: result.data,
    });
  };

  const returnActionPlan = async () => {
    if (!plan) return;
    setIsRunning(true);
    const nextRuns: LoomRunResponse[] = [];
    for (const step of plan.steps) {
      const req = {
        moduleId: step.moduleId,
        inputs: defaultInputsFor(step.moduleId, plan.intention),
        context: { weaveId: plan.weaveId, agentId: step.agentId },
      };
      const result = await loomClient.run(req);
      if (result.ok) {
        nextRuns.push(result.data);
        await dataAdapter.saveModuleRun({
          id: result.data.runId,
          createdAt: new Date().toISOString(),
          moduleId: step.moduleId,
          inputs: req.inputs,
          response: result.data,
        });
      }
    }
    setRuns(nextRuns);
    setIsRunning(false);
  };

  return (
    <section className="relative z-10 mx-auto max-w-6xl px-6 pt-8">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div>
          <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground fade-up">The weaving</p>
          <h1 className="mt-4 font-display text-5xl leading-[1.05] sm:text-6xl fade-up" style={{ animationDelay: "80ms" }}>
            Bring a messy <span className="text-thread italic">creative intention</span>.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground fade-up" style={{ animationDelay: "160ms" }}>
            The Loom holds the thread, lights the right agents, and returns a structured action plan. Local-first, deterministic, and calm on purpose.
          </p>

          <div className="mt-8 glass-panel rounded-2xl p-5 fade-up" style={{ animationDelay: "240ms" }}>
            <label className="text-[10px] tracking-[0.26em] uppercase text-muted-foreground" htmlFor="loom-intention">
              Intention
            </label>
            <textarea
              id="loom-intention"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              className="mt-3 min-h-40 w-full rounded-xl border border-border/60 bg-background/55 p-4 text-sm leading-relaxed text-foreground outline-none transition-calm focus:border-primary/70"
              placeholder="Paste the scattered thread: notes, friction, ideas, question, possible output."
            />
            <div className="mt-4 flex flex-wrap gap-2">
              {TAGS.map((tag) => {
                const active = tags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className="rounded-full px-3 py-2 text-[10px] tracking-[0.2em] uppercase transition-calm"
                    style={active ? { background: "var(--gradient-thread)", color: "oklch(0.14 0.04 270)" } : { border: "1px solid oklch(0.55 0.05 280 / 0.4)" }}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={createWeave}
              className="mt-5 rounded-full px-5 py-3 text-[11px] tracking-[0.24em] uppercase transition-calm hover:-translate-y-0.5"
              style={{ background: "var(--gradient-thread)", color: "oklch(0.14 0.04 270)" }}
            >
              Weave intention
            </button>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 fade-up" style={{ animationDelay: "320ms" }}>
          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="text-[10px] tracking-[0.26em] uppercase text-muted-foreground">Constellation</p>
            <Link to="/loom/constellation" className="text-[10px] tracking-[0.22em] uppercase text-thread">Open grid</Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {LOOM_AGENTS.map((agent) => {
              const lit = litAgents.has(agent.id);
              return (
                <div key={agent.id} className="rounded-xl border p-3 transition-calm" style={{ borderColor: lit ? agent.accent : "oklch(1 0 0 / 0.1)", color: lit ? agent.accent : undefined }}>
                  <Sigil variant={agent.sigil} className="h-10 w-10" />
                  <p className="mt-2 font-display text-lg text-foreground">{agent.label}</p>
                  <p className="text-xs text-muted-foreground">{agent.role}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {plan && (
        <section className="mt-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="glass-panel rounded-2xl p-5">
            <p className="text-[10px] tracking-[0.26em] uppercase text-muted-foreground">Weave plan</p>
            <h2 className="mt-3 font-display text-3xl">{plan.summary}</h2>
            <div className="mt-5 space-y-3">
              {plan.phases.map((phase) => (
                <div key={phase.id} className="rounded-xl border border-border/50 p-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-thread">{phase.label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{phase.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-[10px] tracking-[0.26em] uppercase text-muted-foreground">Lit sequence</p>
              <button
                type="button"
                onClick={returnActionPlan}
                disabled={isRunning || plan.steps.length === 0}
                className="rounded-full px-4 py-2 text-[10px] tracking-[0.22em] uppercase transition-calm disabled:opacity-50"
                style={{ background: "var(--gradient-thread)", color: "oklch(0.14 0.04 270)" }}
              >
                {isRunning ? "Returning..." : "Return action plan"}
              </button>
            </div>
            <div className="mt-5 space-y-3">
              {plan.steps.map((step, index) => {
                const agent = getLoomAgent(step.agentId);
                return (
                  <Link key={step.id} to="/loom/$moduleId" params={{ moduleId: step.moduleId }} className="block rounded-xl border border-border/50 p-4 transition-calm hover:-translate-y-0.5 hover:border-primary/50">
                    <div className="flex items-start gap-3">
                      {agent && <Sigil variant={agent.sigil} className="mt-1 h-8 w-8" />}
                      <div>
                        <p className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground">Step {index + 1} - {step.agentLabel}</p>
                        <h3 className="font-display text-2xl">{step.moduleLabel}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{step.why}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {runs.length > 0 && (
        <section className="mt-8 space-y-4">
          <p className="text-[10px] tracking-[0.26em] uppercase text-muted-foreground">Returned action plan</p>
          {runs.map((run) => (
            <article key={run.runId} className="glass-panel rounded-2xl p-5">
              <h3 className="font-display text-3xl">{run.label}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{run.summary}</p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {Object.entries(run.outputs).map(([key, value]) => (
                  <div key={key} className="rounded-xl border border-border/50 p-3">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-thread">{key}</p>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{Array.isArray(value) ? value.join("\n") : String(value)}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-foreground">Next: {run.nextAction}</p>
            </article>
          ))}
        </section>
      )}
    </section>
  );
}
