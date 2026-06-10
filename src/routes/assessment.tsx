import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AuroraField } from "@/components/AuroraField";
import { ProgressThread } from "@/components/assessment/ProgressThread";
import { QuestionCard } from "@/components/assessment/QuestionCard";
import { QUESTIONS, type LikertValue } from "@/lib/spark/questions";
import { initialState, transition, type AssessmentState } from "@/lib/state-machine/assessment-machine";
import { localStore, upsertResponses } from "@/lib/storage/local-store";
import type { Responses } from "@/lib/spark/scoring";

export const Route = createFileRoute("/assessment")({
  head: () => ({
    meta: [
      { title: "The Reflection — Cognitive Layer" },
      { name: "description", content: "A calm, descriptive reflection across seven cognitive dimensions." },
    ],
  }),
  component: AssessmentPage,
});

function AssessmentPage() {
  const navigate = useNavigate();
  const [state, setState] = useState<AssessmentState>(initialState);
  const [responses, setResponses] = useState<Responses>({});

  // Hydrate from local-first storage
  useEffect(() => {
    const stored = localStore.loadProfile();
    if (stored?.responses) {
      setResponses(stored.responses);
      const answered = Object.keys(stored.responses).length;
      if (answered > 0) {
        setState((s) => ({
          ...s,
          phase: answered >= QUESTIONS.length ? "review" : "in_progress",
          index: Math.min(answered, QUESTIONS.length - 1),
        }));
      }
    }
  }, []);

  const current = QUESTIONS[state.index];
  const value = current ? responses[current.id] : undefined;
  const answeredCount = useMemo(() => Object.keys(responses).length, [responses]);

  const onAnswer = (v: LikertValue) => {
    const next = { ...responses, [current.id]: v };
    setResponses(next);
    upsertResponses(next);
    // gentle delay so the selection registers visually
    setTimeout(() => setState((s) => transition(s, { type: "ANSWER" })), 280);
  };

  const onBack = () => setState((s) => transition(s, { type: "BACK" }));

  const onComplete = () => {
    upsertResponses(responses, { complete: true });
    navigate({ to: "/profile" });
  };

  return (
    <main className="relative min-h-screen overflow-hidden pb-24">
      <AuroraField />

      <header className="relative z-10 mx-auto flex max-w-3xl items-center justify-between px-6 py-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full breathe" style={{ background: "var(--gradient-thread)" }} />
          <span className="font-display text-base tracking-wide">Cognitive Layer</span>
        </Link>
        <Link to="/" className="text-xs tracking-[0.22em] uppercase text-muted-foreground hover:text-foreground transition-calm">
          Pause
        </Link>
      </header>

      <div className="relative z-10 mx-auto max-w-3xl px-6 pt-6">
        {state.phase === "intro" && (
          <section className="glass-panel rounded-3xl p-10 sm:p-14 text-center fade-up">
            <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-6">
              Before we begin
            </p>
            <h1 className="font-display text-3xl sm:text-5xl leading-tight">
              There are no right answers.
              <br />
              <span className="text-thread italic">Only honest ones.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground leading-relaxed">
              You'll see {QUESTIONS.length} short reflections, one at a time. Answer
              based on the version of you that's most often true — not the version
              you wish you were. Your responses live only on this device.
            </p>
            <button
              onClick={() => setState((s) => transition(s, { type: "BEGIN" }))}
              className="mt-10 inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm tracking-[0.18em] uppercase transition-calm"
              style={{
                background: "var(--gradient-thread)",
                color: "oklch(0.14 0.04 270)",
                boxShadow: "var(--shadow-glow)",
              }}
            >
              {answeredCount > 0 ? "Continue" : "Begin"} →
            </button>
          </section>
        )}

        {state.phase === "in_progress" && current && (
          <div className="space-y-8">
            <ProgressThread current={state.index + 1} total={QUESTIONS.length} />
            <QuestionCard question={current} value={value} onChange={onAnswer} />
            <div className="flex items-center justify-between text-xs tracking-[0.18em] uppercase">
              <button
                onClick={onBack}
                disabled={state.index === 0}
                className="text-muted-foreground hover:text-foreground disabled:opacity-30 transition-calm"
              >
                ← Back
              </button>
              <span className="text-muted-foreground italic">
                {value ? "Recording…" : "Choose what most rings true"}
              </span>
            </div>
          </div>
        )}

        {state.phase === "review" && (
          <section className="glass-panel rounded-3xl p-10 sm:p-14 text-center fade-up">
            <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-6">
              Reflection complete
            </p>
            <h2 className="font-display text-3xl sm:text-5xl leading-tight">
              Your signature is
              <br />
              <span className="text-thread italic">taking shape.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground leading-relaxed">
              {answeredCount} of {QUESTIONS.length} reflections recorded. Continue to
              see the cognitive profile we've translated from your answers.
            </p>
            <div className="mt-10 flex flex-col items-center gap-3">
              <button
                onClick={onComplete}
                className="inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm tracking-[0.18em] uppercase transition-calm"
                style={{
                  background: "var(--gradient-thread)",
                  color: "oklch(0.14 0.04 270)",
                  boxShadow: "var(--shadow-glow)",
                }}
              >
                See your profile →
              </button>
              <button
                onClick={() => setState((s) => ({ ...s, phase: "in_progress", index: 0 }))}
                className="text-xs tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground transition-calm"
              >
                Revisit reflections
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}