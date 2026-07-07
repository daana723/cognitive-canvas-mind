import { createFileRoute, Link } from "@tanstack/react-router";
import { PROMPTS } from "@/lib/spark/prompts";
import { CURRENT_PROMPTS } from "@/lib/spark/currentPrompts";
import { sparkResponsesStore, currentResponsesStore } from "@/lib/spark/store";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/spark/")({
  head: () => ({
    meta: [
      { title: "SPARK — a reflective mirror for nonlinear thinkers" },
      { name: "description", content: "A guided reflection. Recognize patterns in how you create, sense, decide, and move through ideas. Not a quiz, not an assessment." },
      { property: "og:title", content: "SPARK — a reflective mirror" },
      { property: "og:description", content: "A deep reflection for nonlinear thinkers. Non-diagnostic. Local-first." },
    ],
  }),
  component: SparkIntro,
});

function SparkIntro() {
  const [answered, setAnswered] = useState(0);
  const [answeredCurrents, setAnsweredCurrents] = useState(0);
  useEffect(() => {
    setAnswered(Object.keys(sparkResponsesStore.load()).length);
    setAnsweredCurrents(Object.keys(currentResponsesStore.load()).length);
  }, []);
  const resuming = answered > 0;
  return (
    <section className="mx-auto max-w-3xl px-6 pt-6">
      <div className="glass-panel rounded-3xl p-10 sm:p-14 text-center fade-up">
        <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-6">
          SPARK · a reflective mirror
        </p>
        <h1 className="font-display text-3xl sm:text-5xl leading-tight">
          Recognize the patterns
          <br />
          <span className="text-thread italic">already moving through you.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground leading-relaxed">
          A guided reflection for nonlinear thinkers. Not a quiz, not an
          assessment. You'll move through {PROMPTS.length} short prompts, then
          an optional {CURRENT_PROMPTS.length}-prompt reading of the five
          currents. What surfaces at the end is a pattern sketch — motifs and
          symbolic modes you may recognize, never modes assigned.
        </p>
        <ul className="mx-auto mt-8 max-w-md space-y-2 text-left text-sm text-muted-foreground">
          <li>· Choose what most rings true. Nothing is right or wrong.</li>
          <li>· Nothing is analyzed, scored, or interpreted about you.</li>
          <li>· Stored only on this device. Leave and resume at any time.</li>
        </ul>
        <div className="mt-10 flex flex-col items-center gap-3">
          <Link
            to="/spark/reflect"
            className="inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm tracking-[0.18em] uppercase transition-calm"
            style={{ background: "var(--gradient-thread)", color: "oklch(0.14 0.04 270)", boxShadow: "var(--shadow-glow)" }}
          >
            {resuming ? "Continue the reflection" : "Enter the reflection"} →
          </Link>
          {(answered >= PROMPTS.length || answeredCurrents > 0) && (
            <Link to="/spark/mirror" className="text-xs tracking-[0.22em] uppercase text-muted-foreground hover:text-foreground transition-calm">
              See the mirror
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
