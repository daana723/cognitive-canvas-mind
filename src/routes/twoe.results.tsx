import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { OERadar } from "@/components/twoe/OERadar";
import { OES, getOE } from "@/lib/twoe/oes";
import { readingFrom, type OEReading } from "@/lib/twoe/scoring";
import { twoeResponsesStore } from "@/lib/twoe/store";

export const Route = createFileRoute("/twoe/results")({
  head: () => ({
    meta: [
      { title: "Your OE profile — 2E · Nonlinear Studio" },
      { name: "description", content: "Your Overexcitabilities profile across the five Dabrowski dimensions." },
    ],
  }),
  component: TwoEResults,
});

function TwoEResults() {
  const [reading, setReading] = useState<OEReading | null>(null);
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    const responses = twoeResponsesStore.load();
    if (Object.keys(responses).length === 0) {
      setEmpty(true);
      return;
    }
    setReading(readingFrom(responses));
  }, []);

  if (empty) {
    return (
      <section className="mx-auto max-w-3xl px-6 pt-6">
        <div className="glass-panel rounded-3xl p-10 sm:p-14 text-center fade-up">
          <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-6">
            Nothing to profile yet
          </p>
          <h1 className="font-display text-3xl leading-tight">
            Start the assessment first.
          </h1>
          <Link
            to="/twoe/assessment"
            className="mt-8 inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm tracking-[0.18em] uppercase transition-calm"
            style={{ background: "var(--gradient-thread)", color: "oklch(0.14 0.04 270)", boxShadow: "var(--shadow-glow)" }}
          >
            Begin the assessment →
          </Link>
        </div>
      </section>
    );
  }

  if (!reading) return null;
  const dom = getOE(reading.dominant);
  const sec = getOE(reading.secondary);

  return (
    <section className="mx-auto max-w-3xl px-6 pt-6 space-y-10">
      <div className="text-center fade-up">
        <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-4">
          Your OE profile
        </p>
        <h1 className="font-display text-4xl sm:text-5xl leading-tight">
          Five channels, <span className="text-thread italic">one nervous system.</span>
        </h1>
      </div>

      <div className="glass-panel rounded-3xl p-6 sm:p-10 fade-up">
        <div className="grid gap-8 sm:grid-cols-[auto_1fr] items-center">
          <div className="flex justify-center">
            <OERadar profile={reading.profile} size={340} />
          </div>
          <div>
            <p className="text-[10px] tracking-[0.28em] uppercase text-muted-foreground mb-3">
              Overall intensity · {reading.intensity} / 100
            </p>
            <h2 className="font-display text-2xl">{reading.bandLabel}</h2>
            <p className="mt-3 text-sm text-foreground/90 leading-relaxed">
              {reading.bandNote}
            </p>
            <div className="mt-6 space-y-3">
              <div className="rounded-2xl border border-border/40 p-4">
                <p className="text-[10px] tracking-[0.24em] uppercase" style={{ color: dom.accent }}>
                  Dominant OE
                </p>
                <p className="mt-1 font-display text-lg">{dom.label}</p>
                <p className="text-xs text-muted-foreground italic">{dom.tagline}</p>
              </div>
              <div className="rounded-2xl border border-border/40 p-4">
                <p className="text-[10px] tracking-[0.24em] uppercase" style={{ color: sec.accent }}>
                  Secondary OE
                </p>
                <p className="mt-1 font-display text-lg">{sec.label}</p>
                <p className="text-xs text-muted-foreground italic">{sec.tagline}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-3xl p-6 sm:p-10 fade-up">
        <p className="text-[10px] tracking-[0.28em] uppercase text-muted-foreground mb-6">
          The five channels, scored
        </p>
        <ul className="space-y-5">
          {OES.map((o) => {
            const v = reading.profile[o.id];
            return (
              <li key={o.id}>
                <div className="flex items-baseline justify-between gap-4">
                  <p className="font-display text-lg" style={{ color: o.accent }}>{o.label}</p>
                  <p className="text-xs tabular-nums text-muted-foreground">{v}/100</p>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-secondary/50 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${v}%`, background: `linear-gradient(90deg, ${o.accent}, oklch(0.85 0.14 285))` }} />
                </div>
                <div className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                  <p><span className="uppercase tracking-[0.18em] text-foreground/70">Strengths · </span>{o.strengths}</p>
                  <p><span className="uppercase tracking-[0.18em] text-foreground/70">Shadow · </span>{o.shadow}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="glass-panel rounded-3xl p-6 sm:p-10 text-center fade-up">
        <p className="text-[10px] tracking-[0.28em] uppercase text-muted-foreground mb-4">
          A note to sit with
        </p>
        <p className="font-display text-xl sm:text-2xl leading-relaxed text-foreground/90">
          Your OEs are not symptoms. They are the channels through which your
          nervous system meets the world. The work is not to lower them —
          it is to design an environment that can hold them.
        </p>
      </div>

      <div className="flex flex-col items-center gap-3 pb-8">
        <Link
          to="/spark"
          className="inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm tracking-[0.18em] uppercase transition-calm"
          style={{ background: "var(--gradient-thread)", color: "oklch(0.14 0.04 270)", boxShadow: "var(--shadow-glow)" }}
        >
          Also take SPARK →
        </Link>
        <Link
          to="/modes"
          className="text-xs tracking-[0.22em] uppercase text-muted-foreground hover:text-foreground transition-calm"
        >
          Open the Loom workspace →
        </Link>
      </div>
    </section>
  );
}