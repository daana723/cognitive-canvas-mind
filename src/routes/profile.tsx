import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AuroraField } from "@/components/AuroraField";
import { localStore } from "@/lib/storage/local-store";
import { scoreResponses } from "@/lib/spark/scoring";
import { DIMENSIONS } from "@/lib/spark/dimensions";
import { resolveArchetype } from "@/lib/spark/archetypes";
import type { Responses } from "@/lib/spark/scoring";
import { translate } from "@/lib/spark/translation";
import { RadarChart } from "@/components/profile/RadarChart";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your Cognitive Profile — Cognitive Layer" },
      { name: "description", content: "A descriptive translation of how your attention, energy, and perception actually move." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const [responses, setResponses] = useState<Responses | null>(null);

  useEffect(() => {
    const stored = localStore.loadProfile();
    if (stored?.responses) setResponses(stored.responses);
  }, []);

  if (!responses) {
    return (
      <main className="relative min-h-screen overflow-hidden">
        <AuroraField />
        <div className="relative z-10 mx-auto max-w-2xl px-6 pt-32 text-center">
          <h1 className="font-display text-4xl sm:text-5xl">No reflection yet.</h1>
          <p className="mt-6 text-muted-foreground">
            Begin the SPARK reflection to see your cognitive profile take shape.
          </p>
          <Link
            to="/assessment"
            className="mt-10 inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm tracking-[0.18em] uppercase transition-calm"
            style={{ background: "var(--gradient-thread)", color: "oklch(0.14 0.04 270)", boxShadow: "var(--shadow-glow)" }}
          >
            Begin →
          </Link>
        </div>
      </main>
    );
  }

  const scores = scoreResponses(responses);
  const { primary, secondary } = resolveArchetype(scores);

  return (
    <main className="relative min-h-screen overflow-hidden pb-32">
      <AuroraField />

      <header className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-6 py-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full breathe" style={{ background: "var(--gradient-thread)" }} />
          <span className="font-display text-base tracking-wide">Cognitive Layer</span>
        </Link>
        <Link to="/assessment" className="text-xs tracking-[0.22em] uppercase text-muted-foreground hover:text-foreground transition-calm">
          Revisit reflection
        </Link>
      </header>

      {/* Archetype hero */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 pt-12 text-center">
        <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-6 fade-up">
          Your primary archetype
        </p>
        <h1 className="font-display text-5xl sm:text-7xl leading-[1.05] fade-up" style={{ animationDelay: "80ms" }}>
          <span className="text-thread italic">{primary.archetype.name}</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground italic fade-up" style={{ animationDelay: "160ms" }}>
          {primary.archetype.tagline}
        </p>
        <p className="mx-auto mt-8 max-w-2xl text-base sm:text-lg leading-relaxed text-foreground/90 fade-up" style={{ animationDelay: "240ms" }}>
          {primary.archetype.essence}
        </p>
        <p className="mt-6 text-xs tracking-[0.22em] uppercase text-muted-foreground fade-up" style={{ animationDelay: "320ms" }}>
          With echoes of <span className="text-foreground">{secondary.archetype.name}</span>
        </p>
      </section>

      {/* Dimensions */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 pt-24">
        <div className="mb-10 text-center">
          <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-3">
            Your cognitive dimensions
          </p>
          <h2 className="font-display text-3xl sm:text-4xl">The shape, in seven readings</h2>
        </div>

        <div className="space-y-3">
          {DIMENSIONS.map((d, i) => {
            const v = scores[d.id];
            const pct = Math.round(v * 100);
            const pole = v >= 0.5 ? d.poles.high : d.poles.low;
            return (
              <article
                key={d.id}
                className="glass-panel rounded-2xl px-6 py-5 fade-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-display text-lg">{d.label}</span>
                      <span className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground">
                        Leans {pole}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground italic">{d.essence}</p>
                  </div>
                  <div className="hidden sm:block w-40 shrink-0">
                    <div className="flex items-center justify-between text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2">
                      <span>{d.poles.low}</span><span>{d.poles.high}</span>
                    </div>
                    <div className="relative h-[2px] w-full overflow-hidden rounded-full bg-secondary/50">
                      <div className="absolute inset-y-0 left-0" style={{ width: `${pct}%`, background: "var(--gradient-thread)" }} />
                      <div
                        className="absolute -top-1 h-3 w-3 -translate-x-1/2 rounded-full"
                        style={{ left: `${pct}%`, background: "oklch(0.94 0.02 280)", boxShadow: "0 0 12px oklch(0.74 0.16 285 / 0.7)" }}
                      />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Next horizon — no dead end */}
      <section className="relative z-10 mx-auto max-w-3xl px-6 pt-24 text-center">
        <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-4">
          What's forming next
        </p>
        <h2 className="font-display text-3xl sm:text-4xl leading-tight">
          The translation layer is <span className="text-thread italic">listening.</span>
        </h2>
        <p className="mt-6 text-base text-muted-foreground leading-relaxed">
          From this profile, Cognitive Layer is preparing your strengths map, challenge
          translations, and adaptive toolkit. They unlock as the platform grows around
          your signature — this is the beginning of the mirror, not the end.
        </p>

        <ol className="mt-10 grid gap-3 text-left sm:grid-cols-2">
          {[
            { step: "01", label: "SPARK Reflection", state: "Complete" },
            { step: "02", label: "Cognitive Profile", state: "You are here" },
            { step: "03", label: "Strengths & Challenge Translation", state: "Soon" },
            { step: "04", label: "Adaptive Toolkit", state: "Soon" },
            { step: "05", label: "Cognitive Map", state: "Forming" },
            { step: "06", label: "AI Cognitive Companion", state: "Horizon" },
          ].map((s) => (
            <li key={s.step} className="glass-panel rounded-xl px-5 py-4">
              <div className="text-[10px] tracking-[0.24em] uppercase text-muted-foreground">{s.step} · {s.state}</div>
              <div className="mt-1 font-display text-lg">{s.label}</div>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex flex-col items-center gap-3">
          <Link
            to="/assessment"
            className="text-xs tracking-[0.22em] uppercase text-muted-foreground hover:text-foreground transition-calm"
          >
            Refine your reflection →
          </Link>
        </div>
      </section>
    </main>
  );
}