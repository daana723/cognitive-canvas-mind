import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sigil } from "@/components/loom/Sigil";
import { AGENTS, getAgent } from "@/lib/loom/agents";
import { loomClient } from "@/lib/api/loomClient";
import { dataAdapter } from "@/lib/data/adapter";
import { WEAVING_PHASES } from "@/lib/loom/phases";
import type { WeavePlan } from "@/lib/data/types";

export const Route = createFileRoute("/loom/")({
  component: LoomEntry,
});

const SUGGESTIONS = [
  "I have a scattered essay draft, three half-launched ideas, and no through-line for the week.",
  "I want to launch a small offer next week but I keep rewriting the pitch and losing the shape.",
  "I have research notes and adjacent references piling up and I don't know what they add up to.",
  "I need to reshape one long piece into a newsletter, a thread, and a landing page without flattening it.",
];

function LoomEntry() {
  const navigate = useNavigate();
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [plan, setPlan] = useState<WeavePlan | null>(null);
  const [weaving, setWeaving] = useState(false);

  async function onWeave() {
    if (!body.trim()) return;
    setWeaving(true);
    const tagList = tags.split(",").map((t) => t.trim()).filter(Boolean);
    const res = await loomClient.weave({ body, tags: tagList });
    if (res.ok) {
      setPlan(res.value);
      await dataAdapter.saveWeave(res.value);
    }
    setWeaving(false);
  }

  const lit = new Set(plan?.agents ?? []);

  return (
    <section className="mx-auto max-w-5xl px-6 pt-8 pb-24">
      <p className="text-[11px] tracking-[0.32em] uppercase text-muted-foreground">
        Phase · Intention → Delegation → Return
      </p>
      <h1 className="mt-4 font-display text-4xl sm:text-6xl leading-[1.05]">
        Bring the messy thread.
        <br />
        <span className="text-thread italic">The Loom will weave it.</span>
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
        Say what you're reaching for. The Loom reads the thread and lights the
        agents that belong to it — then returns a structured plan you can act on.
      </p>

      <div className="mt-10 glass-panel rounded-3xl p-6 sm:p-8">
        <label className="text-[11px] tracking-[0.24em] uppercase text-muted-foreground">
          The intention
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="I have a scattered field of… I want to reach… what I keep avoiding is…"
          rows={6}
          className="mt-3 w-full resize-none rounded-2xl bg-background/40 p-4 text-base leading-relaxed outline-none ring-1 ring-border/40 focus:ring-2 focus:ring-thread/60 transition-calm"
        />

        <label className="mt-6 block text-[11px] tracking-[0.24em] uppercase text-muted-foreground">
          Optional tags <span className="normal-case tracking-normal text-muted-foreground/70">(comma-separated)</span>
        </label>
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="essay, launch, newsletter, week…"
          className="mt-3 w-full rounded-xl bg-background/40 p-3 text-sm outline-none ring-1 ring-border/40 focus:ring-2 focus:ring-thread/60 transition-calm"
        />

        <div className="mt-6 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setBody(s)}
              className="rounded-full border border-border/40 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-thread/60 transition-calm"
            >
              {s.slice(0, 48)}…
            </button>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            Deterministic · local-first · nothing leaves your device.
          </p>
          <button
            type="button"
            onClick={onWeave}
            disabled={weaving || !body.trim()}
            className="rounded-full px-6 py-3 text-sm tracking-[0.22em] uppercase disabled:opacity-40 transition-calm"
            style={{ background: "var(--gradient-thread)", color: "oklch(0.14 0.05 275)" }}
          >
            {weaving ? "Weaving…" : "Weave the thread"}
          </button>
        </div>
      </div>

      {/* Constellation preview — lights up after weaving */}
      <div className="mt-14">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl">The constellation</h2>
          <Link to="/loom/constellation" className="text-[11px] tracking-[0.22em] uppercase text-muted-foreground hover:text-foreground transition-calm">
            Explore all agents →
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {AGENTS.map((a) => {
            const active = plan ? lit.has(a.id) : false;
            return (
              <div
                key={a.id}
                className="glass-panel rounded-2xl p-4 text-center transition-calm"
                style={{
                  color: active ? a.accent : "oklch(0.65 0.02 275)",
                  boxShadow: active ? `0 0 32px -8px ${a.accent}` : undefined,
                  opacity: plan && !active ? 0.4 : 1,
                }}
              >
                <Sigil variant={a.sigil} className="mx-auto h-10 w-10" />
                <p className="mt-2 font-display text-sm">{a.label}</p>
                <p className="mt-1 text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
                  {a.role}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {plan && (
        <div className="mt-14 fade-up">
          <h2 className="font-display text-2xl">Woven plan</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
            The Loom lit {plan.agents.length - 1} agent{plan.agents.length - 1 === 1 ? "" : "s"} for this intention. Each step opens a module you can run.
          </p>

          <div className="mt-6 grid gap-4">
            {plan.steps.map((step) => {
              const agent = getAgent(step.agentId);
              return (
                <Link
                  key={step.moduleId}
                  to="/loom/$moduleId"
                  params={{ moduleId: step.moduleId }}
                  className="glass-panel group rounded-2xl p-5 transition-calm hover:-translate-y-0.5 flex items-start gap-4"
                >
                  <div style={{ color: agent?.accent }}>
                    <Sigil variant={agent?.sigil ?? "node"} className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] tracking-[0.24em] uppercase text-muted-foreground">
                      {agent?.label} · {agent?.role}
                    </p>
                    <p className="mt-1 text-base">{step.why}</p>
                  </div>
                  <span className="text-[10px] tracking-[0.24em] uppercase text-thread self-center group-hover:translate-x-1 transition-calm">
                    Open →
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="mt-6 glass-panel rounded-2xl p-5">
            <p className="text-[11px] tracking-[0.24em] uppercase text-muted-foreground">Artifacts this weave will produce</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {plan.artifacts.map((a) => (
                <li key={a} className="rounded-full border border-border/40 px-3 py-1 text-xs">{a}</li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={() => navigate({ to: "/loom/constellation" })}
            className="mt-8 text-[11px] tracking-[0.24em] uppercase text-muted-foreground hover:text-foreground transition-calm"
          >
            See the full constellation →
          </button>
        </div>
      )}

      {/* Phase legend */}
      <div className="mt-20 glass-panel rounded-3xl p-6 sm:p-8">
        <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground">
          How the Loom moves
        </p>
        <ol className="mt-4 grid gap-4 sm:grid-cols-5">
          {WEAVING_PHASES.map((p, i) => (
            <li key={p.id}>
              <p className="font-display text-thread text-lg">{i + 1}. {p.label}</p>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{p.essence}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}