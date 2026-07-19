import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Sigil } from "@/components/Sigil";
import loomClient from "@/lib/api/loomClient";
import { dataAdapter } from "@/lib/data/adapter";
import type { WeavePlan } from "@/lib/loom/orchestrator";

export const Route = createFileRoute("/loom/")({
  head: () => ({
    meta: [
      { title: "Loom - Nonlinear Studio" },
      {
        name: "description",
        content: "A local-first orchestrator for nonlinear creative work.",
      },
    ],
  }),
  component: LoomIndex,
});

function LoomIndex() {
  const [intention, setIntention] = useState("");
  const [tags, setTags] = useState("");
  const [plan, setPlan] = useState<WeavePlan | null>(null);

  const runWeave = async () => {
    const result = await loomClient.weave({
      intention: intention || "I need the next clear thread.",
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    });
    if (result.ok) {
      setPlan(result.data);
      await dataAdapter.saveWeave(result.data);
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-6 pt-10">
      <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-start">
        <div>
          <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-5 fade-up">
            The weaving
          </p>
          <h1 className="font-display text-5xl sm:text-6xl leading-[1.05] fade-up">
            The Loom holds <span className="text-thread italic">the thread.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground fade-up">
            Bring a spark, knot, question, or scattered field. The Loom routes it through a calm
            constellation of local agents. No external APIs. No inference about you. Just structure
            you can shape.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/loom/constellation"
              className="rounded-full border border-border/70 px-5 py-2.5 text-[11px] tracking-[0.22em] uppercase text-foreground hover:bg-white/5 transition-calm"
            >
              View constellation
            </Link>
            <Link
              to="/workflows"
              className="rounded-full border border-border/70 px-5 py-2.5 text-[11px] tracking-[0.22em] uppercase text-foreground hover:bg-white/5 transition-calm"
            >
              Existing workflows
            </Link>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <Sigil variant="loom" className="h-8 w-8 text-thread" />
            <div>
              <p className="text-[10px] tracking-[0.28em] uppercase text-muted-foreground">
                Bring an intention
              </p>
              <p className="font-display text-2xl">Local weave</p>
            </div>
          </div>
          <label className="mt-6 block text-xs tracking-[0.2em] uppercase text-muted-foreground">
            Intention
          </label>
          <textarea
            value={intention}
            onChange={(event) => setIntention(event.target.value)}
            className="mt-3 min-h-36 w-full rounded-2xl border border-border/60 bg-card/60 p-4 text-sm text-foreground outline-none transition-calm focus:border-thread/70"
            placeholder="I have too many ideas for this launch and need the first clear thread."
          />
          <label className="mt-5 block text-xs tracking-[0.2em] uppercase text-muted-foreground">
            Signals
          </label>
          <input
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            className="mt-3 w-full rounded-full border border-border/60 bg-card/60 px-4 py-3 text-sm text-foreground outline-none transition-calm focus:border-thread/70"
            placeholder="content, avatar, product"
          />
          <button
            type="button"
            onClick={runWeave}
            className="mt-6 w-full rounded-full px-6 py-3 text-sm tracking-[0.18em] uppercase transition-calm"
            style={{
              background: "var(--gradient-thread)",
              color: "oklch(0.14 0.04 270)",
              boxShadow: "var(--shadow-glow)",
            }}
          >
            Weave the intention
          </button>
        </div>
      </div>

      {plan && (
        <section className="mt-12 space-y-5 pb-12">
          <div className="glass-panel rounded-3xl p-6 sm:p-8">
            <p className="text-[10px] tracking-[0.28em] uppercase text-muted-foreground">
              Loom return
            </p>
            <h2 className="mt-3 font-display text-3xl">{plan.summary}</h2>
            <p className="mt-4 text-sm italic text-muted-foreground">{plan.accessNote}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {plan.steps.map((step) => (
              <Link
                key={step.agentId}
                to="/loom/$moduleId"
                params={{ moduleId: agentModuleId(step.agentId) }}
                className="glass-panel rounded-2xl p-5 transition-calm hover:-translate-y-1"
              >
                <p className="text-[10px] tracking-[0.24em] uppercase text-muted-foreground">
                  {step.role}
                </p>
                <h3 className="mt-2 font-display text-2xl">{step.name}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{step.reason}</p>
                <ul className="mt-4 space-y-2 text-xs text-foreground/80">
                  {step.expectedArtifacts.map((artifact) => (
                    <li key={artifact}>{artifact}</li>
                  ))}
                </ul>
              </Link>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}

function agentModuleId(agentId: string) {
  const map: Record<string, string> = {
    loom: "weave-intention",
    research: "research-brief",
    content: "content-draft",
    product: "product-vessel",
    marketing: "marketing-signal",
    avatar: "avatar-voice",
    operations: "ops-tending",
  };

  return map[agentId] ?? "weave-intention";
}
