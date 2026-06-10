import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AuroraField } from "@/components/AuroraField";
import { ProgressThread } from "@/components/assessment/ProgressThread";
import { IntensityQuestionCard } from "@/components/intensities/IntensityQuestionCard";
import { INTENSITY_QUESTIONS } from "@/lib/intensities/questions";
import type { LikertValue } from "@/lib/spark/questions";
import { localStore, upsertIntensities } from "@/lib/storage/local-store";
import type { IntensityResponses } from "@/lib/intensities/scoring";

export const Route = createFileRoute("/intensities")({
  head: () => ({
    meta: [
      { title: "The Intensities — Cognitive Layer" },
      { name: "description", content: "A second reflection: the five channels where your nervous system runs hot. A translation of Dąbrowski's overexcitabilities into Cognitive Layer's own language." },
      { property: "og:title", content: "The Intensities — Cognitive Layer" },
      { property: "og:description", content: "The five channels where your nervous system runs hot." },
    ],
  }),
  component: IntensitiesPage,
});

type Phase = "intro" | "in_progress" | "review";

function IntensitiesPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [responses, setResponses] = useState<IntensityResponses>({});

  useEffect(() => {
    const stored = localStore.loadProfile();
    if (stored?.intensities) {
      setResponses(stored.intensities);
      const answered = Object.keys(stored.intensities).length;
      if (answered > 0) {
        setPhase(answered >= INTENSITY_QUESTIONS.length ? "review" : "in_progress");
        setIndex(Math.min(answered, INTENSITY_QUESTIONS.length - 1));
      }
    }
  }, []);

  const current = INTENSITY_QUESTIONS[index];
  const value = current ? responses[current.id] : undefined;
  const answeredCount = useMemo(() => Object.keys(responses).length, [responses]);

  const onAnswer = (v: LikertValue) => {
    const next = { ...responses, [current.id]: v };
    setResponses(next);
    upsertIntensities(next);
    setTimeout(() => {
      const ni = index + 1;
      if (ni >= INTENSITY_QUESTIONS.length) setPhase("review");
      else setIndex(ni);
    }, 280);
  };

  const onBack = () => setIndex((i) => Math.max(0, i - 1));

  const onComplete = () => {
    upsertIntensities(responses, { complete: true });
    navigate({ to: "/map" });
  };

  return (
    <main className="relative min-h-screen overflow-hidden pb-24">
      <AuroraField />

      <header className="relative z-10 mx-auto flex max-w-3xl items-center justify-between px-6 py-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full breathe" style={{ background: "var(--gradient-thread)" }} />
          <span className="font-display text-base tracking-wide">Cognitive Layer</span>
        </Link>
        <Link to="/profile" className="text-xs tracking-[0.22em] uppercase text-muted-foreground hover:text-foreground transition-calm">
          Profile
        </Link>
      </header>

      <div className="relative z-10 mx-auto max-w-3xl px-6 pt-6">
        {phase === "intro" && (
          <section className="glass-panel rounded-3xl p-10 sm:p-14 text-center fade-up">
            <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-6">
              A second reflection
            </p>
            <h1 className="font-display text-3xl sm:text-5xl leading-tight">
              Where your system
              <br />
              <span className="text-thread italic">runs hot.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground leading-relaxed">
              SPARK described <em>how</em> you think. The Intensities describe
              <em> where the current is.</em> Five channels — Drive, Sense, Mind,
              Vision, Heart — that ND minds often carry at higher amplitude than
              the rooms around them expect.
            </p>
            <p className="mx-auto mt-4 max-w-xl text-xs text-muted-foreground italic">
              {INTENSITY_QUESTIONS.length} short reflections. Stored only on this device.
            </p>
            <button
              onClick={() => setPhase("in_progress")}
              className="mt-10 inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm tracking-[0.18em] uppercase transition-calm"
              style={{ background: "var(--gradient-thread)", color: "oklch(0.14 0.04 270)", boxShadow: "var(--shadow-glow)" }}
            >
              {answeredCount > 0 ? "Continue" : "Begin"} →
            </button>
          </section>
        )}

        {phase === "in_progress" && current && (
          <div className="space-y-8">
            <ProgressThread current={index + 1} total={INTENSITY_QUESTIONS.length} />
            <IntensityQuestionCard question={current} value={value} onChange={onAnswer} />
            <div className="flex items-center justify-between text-xs tracking-[0.18em] uppercase">
              <button onClick={onBack} disabled={index === 0} className="text-muted-foreground hover:text-foreground disabled:opacity-30 transition-calm">
                ← Back
              </button>
              <span className="text-muted-foreground italic">
                {value ? "Recording…" : "Choose what most rings true"}
              </span>
            </div>
          </div>
        )}

        {phase === "review" && (
          <section className="glass-panel rounded-3xl p-10 sm:p-14 text-center fade-up">
            <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-6">
              Both readings complete
            </p>
            <h2 className="font-display text-3xl sm:text-5xl leading-tight">
              Two layers, <span className="text-thread italic">one map.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground leading-relaxed">
              SPARK and the Intensities can now be cross-read. The Pattern Engine
              connects them into a single Cognitive Map.
            </p>
            <div className="mt-10 flex flex-col items-center gap-3">
              <button
                onClick={onComplete}
                className="inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm tracking-[0.18em] uppercase transition-calm"
                style={{ background: "var(--gradient-thread)", color: "oklch(0.14 0.04 270)", boxShadow: "var(--shadow-glow)" }}
              >
                Open the cognitive map →
              </button>
              <button
                onClick={() => { setPhase("in_progress"); setIndex(0); }}
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