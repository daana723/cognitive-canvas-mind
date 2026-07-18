import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TWOE_PROMPTS } from "@/lib/twoe/prompts";
import { twoeResponsesStore } from "@/lib/twoe/store";

export const Route = createFileRoute("/twoe/")({
  head: () => ({
    meta: [
      { title: "The 2E assessment — Dabrowski Overexcitabilities" },
      { name: "description", content: "A self-recognition assessment for neurodivergent, gifted, and twice-exceptional adults, built on Dabrowski's five Overexcitabilities. Local-first, non-diagnostic." },
      { property: "og:title", content: "The 2E assessment — Nonlinear Studio" },
      { property: "og:description", content: "Map your Overexcitabilities across five dimensions. A tool for self-understanding, not a verdict." },
    ],
  }),
  component: TwoEIntro,
});

function TwoEIntro() {
  const [answered, setAnswered] = useState(0);
  useEffect(() => setAnswered(Object.keys(twoeResponsesStore.load()).length), []);
  const resuming = answered > 0;
  return (
    <section className="mx-auto max-w-3xl px-6 pt-6">
      <div className="glass-panel rounded-3xl p-10 sm:p-14 text-center fade-up">
        <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-6">
          2E · Dabrowski Overexcitabilities
        </p>
        <h1 className="font-display text-3xl sm:text-5xl leading-tight">
          The five channels of
          <br />
          <span className="text-thread italic">high-intensity living.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground leading-relaxed">
          Intellectual · Emotional · Imaginational · Psychomotor · Sensual.
          A self-recognition assessment for neurodivergent, gifted, and
          twice-exceptional adults, built on Kazimierz Dabrowski's Theory of
          Positive Disintegration. {TWOE_PROMPTS.length} short prompts,
          8–12 minutes.
        </p>
        <ul className="mx-auto mt-8 max-w-md space-y-2 text-left text-sm text-muted-foreground">
          <li>· Rate each prompt on a 1–5 Likert scale.</li>
          <li>· No diagnosis. No comparison to a norm.</li>
          <li>· Stored only on this device. Leave and resume at any time.</li>
        </ul>
        <div className="mt-10 flex flex-col items-center gap-3">
          <Link
            to="/twoe/assessment"
            className="inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm tracking-[0.18em] uppercase transition-calm"
            style={{ background: "var(--gradient-thread)", color: "oklch(0.14 0.04 270)", boxShadow: "var(--shadow-glow)" }}
          >
            {resuming ? "Continue the assessment" : "Begin the assessment"} →
          </Link>
          {answered >= TWOE_PROMPTS.length && (
            <Link to="/twoe/results" className="text-xs tracking-[0.22em] uppercase text-muted-foreground hover:text-foreground transition-calm">
              See your OE profile
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}