import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ThreadProgress } from "@/components/spark/ThreadProgress";
import { TWOE_PROMPTS, LIKERT_LABELS, type Likert } from "@/lib/twoe/prompts";
import { getOE } from "@/lib/twoe/oes";
import { twoeResponsesStore } from "@/lib/twoe/store";
import type { OEResponses } from "@/lib/twoe/scoring";

export const Route = createFileRoute("/twoe/assessment")({
  head: () => ({
    meta: [
      { title: "2E assessment — Nonlinear Studio" },
      { name: "description", content: "Rate 40 prompts across the five Dabrowski Overexcitabilities." },
    ],
  }),
  component: TwoEAssessment,
});

const VALUES: Likert[] = [1, 2, 3, 4, 5];

function TwoEAssessment() {
  const navigate = useNavigate();
  const [responses, setResponses] = useState<OEResponses>({});
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = twoeResponsesStore.load();
    setResponses(stored);
    const answered = Object.keys(stored).length;
    setIndex(Math.min(answered, TWOE_PROMPTS.length - 1));
    setReady(true);
  }, []);

  const current = TWOE_PROMPTS[index];
  const value = current ? responses[current.id] : undefined;
  const isLast = index >= TWOE_PROMPTS.length - 1;
  const oe = current ? getOE(current.oe) : undefined;

  const onAnswer = (v: Likert) => {
    const next = { ...responses, [current.id]: v };
    setResponses(next);
    twoeResponsesStore.save(next);
    setTimeout(() => {
      if (isLast) navigate({ to: "/twoe/results" });
      else setIndex(index + 1);
    }, 260);
  };

  if (!ready || !current || !oe) return null;

  return (
    <section className="mx-auto max-w-3xl px-6 pt-6">
      <div className="space-y-8">
        <ThreadProgress current={index + 1} total={TWOE_PROMPTS.length} label="Prompt" />
        <article className="glass-panel rounded-3xl px-6 py-10 sm:px-12 sm:py-14 fade-up">
          <div className="mb-8 flex items-center gap-3">
            <span className="h-2 w-2 rounded-full breathe" style={{ background: oe.accent }} />
            <span className="text-[11px] tracking-[0.24em] uppercase" style={{ color: oe.accent }}>
              {oe.label} · Overexcitability
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl leading-tight text-foreground">
            {current.prompt}
          </h2>
          <div className="mt-12 grid grid-cols-5 gap-2 sm:gap-3">
            {VALUES.map((v) => {
              const active = value === v;
              const size = 36 + Math.abs(v - 3) * 6;
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => onAnswer(v)}
                  className="group flex flex-col items-center gap-3 outline-none"
                  aria-label={LIKERT_LABELS[v]}
                  aria-pressed={active}
                >
                  <span
                    className="relative inline-flex items-center justify-center rounded-full border transition-calm"
                    style={{
                      width: size, height: size,
                      borderColor: active ? "transparent" : "oklch(0.55 0.05 280 / 0.4)",
                      background: active ? "var(--gradient-thread)" : "oklch(0.24 0.05 278 / 0.4)",
                      boxShadow: active ? "0 0 28px oklch(0.74 0.16 285 / 0.55)" : undefined,
                    }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: active ? "oklch(0.16 0.04 275)" : "oklch(0.7 0.06 280 / 0.6)" }} />
                  </span>
                  <span className={"text-[10px] sm:text-xs tracking-wide transition-calm " + (active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground/80")}>
                    {LIKERT_LABELS[v]}
                  </span>
                </button>
              );
            })}
          </div>
        </article>
        <div className="flex items-center justify-between text-xs tracking-[0.18em] uppercase">
          <button
            onClick={() => setIndex(Math.max(0, index - 1))}
            disabled={index === 0}
            className="text-muted-foreground hover:text-foreground disabled:opacity-30 transition-calm"
          >
            ← Back
          </button>
          <span className="text-muted-foreground italic">
            {value ? "Recording…" : "Choose what feels most true"}
          </span>
          {Object.keys(responses).length >= TWOE_PROMPTS.length ? (
            <Link to="/twoe/results" className="text-thread hover:text-foreground transition-calm">
              See profile →
            </Link>
          ) : (
            <span className="opacity-0">·</span>
          )}
        </div>
      </div>
    </section>
  );
}