import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ThreadProgress } from "@/components/spark/ThreadProgress";
import { CurrentCard } from "@/components/spark/CurrentCard";
import { CURRENT_PROMPTS } from "@/lib/spark/currentPrompts";
import type { Resonance } from "@/lib/spark/prompts";
import type { CurrentResponses } from "@/lib/spark/currentPrompts";
import { currentResponsesStore } from "@/lib/spark/store";

export const Route = createFileRoute("/spark/currents")({
  head: () => ({
    meta: [
      { title: "The five currents — SPARK" },
      { name: "description", content: "An optional second reading: where the five currents run warm." },
    ],
  }),
  component: CurrentsPage,
});

function CurrentsPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<"intro" | "in_progress">("intro");
  const [responses, setResponses] = useState<CurrentResponses>({});
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = currentResponsesStore.load();
    setResponses(stored);
    const answered = Object.keys(stored).length;
    if (answered > 0) {
      setPhase("in_progress");
      setIndex(Math.min(answered, CURRENT_PROMPTS.length - 1));
    }
    setReady(true);
  }, []);

  const current = CURRENT_PROMPTS[index];
  const value = current ? responses[current.id] : undefined;
  const isLast = index >= CURRENT_PROMPTS.length - 1;

  const onAnswer = (v: Resonance) => {
    const next = { ...responses, [current.id]: v };
    setResponses(next);
    currentResponsesStore.save(next);
    setTimeout(() => {
      if (isLast) navigate({ to: "/spark/mirror" });
      else setIndex(index + 1);
    }, 280);
  };

  if (!ready) return null;

  if (phase === "intro") {
    return (
      <section className="mx-auto max-w-3xl px-6 pt-6">
        <div className="glass-panel rounded-3xl p-10 sm:p-14 text-center fade-up">
          <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-6">
            Optional · the five currents
          </p>
          <h1 className="font-display text-3xl sm:text-5xl leading-tight">
            Where the currents
            <br />
            <span className="text-thread italic">run warm right now.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground leading-relaxed">
            A shorter second reading. Flux, Depth, Signal, Myth, Pulse — the
            five currents that run through creative life. This step is
            optional. You can skip straight to the mirror; it will surface
            what your first reflection already carries.
          </p>
          <div className="mt-10 flex flex-col items-center gap-3">
            <button
              onClick={() => setPhase("in_progress")}
              className="inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm tracking-[0.18em] uppercase transition-calm"
              style={{ background: "var(--gradient-thread)", color: "oklch(0.14 0.04 270)", boxShadow: "var(--shadow-glow)" }}
            >
              Continue with currents →
            </button>
            <Link
              to="/spark/mirror"
              className="text-xs tracking-[0.22em] uppercase text-muted-foreground hover:text-foreground transition-calm"
            >
              Skip to the mirror
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-6 pt-6">
      <div className="space-y-8">
        <ThreadProgress current={index + 1} total={CURRENT_PROMPTS.length} label="Current" />
        <CurrentCard prompt={current} value={value} onChange={onAnswer} />
        <div className="flex items-center justify-between text-xs tracking-[0.18em] uppercase">
          <button
            onClick={() => setIndex(Math.max(0, index - 1))}
            disabled={index === 0}
            className="text-muted-foreground hover:text-foreground disabled:opacity-30 transition-calm"
          >
            ← Back
          </button>
          <Link to="/spark/mirror" className="text-muted-foreground hover:text-foreground transition-calm">
            Skip to the mirror →
          </Link>
        </div>
      </div>
    </section>
  );
}
