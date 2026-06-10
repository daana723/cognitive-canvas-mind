import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AuroraField } from "@/components/AuroraField";
import { localStore } from "@/lib/storage/local-store";
import { scoreResponses, type Responses } from "@/lib/spark/scoring";
import { resolveArchetype } from "@/lib/spark/archetypes";
import { translate } from "@/lib/spark/translation";
import { scoreIntensities, type IntensityResponses } from "@/lib/intensities/scoring";
import { translateIntensities } from "@/lib/intensities/translation";
import { analyzeTwoE } from "@/lib/twoe/analysis";
import { buildPatternMap } from "@/lib/patterns/engine";
import { RadarChart } from "@/components/profile/RadarChart";
import { IntensityRadar } from "@/components/intensities/IntensityRadar";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "The Cognitive Map — Cognitive Layer" },
      { name: "description", content: "Your unified cognitive map: SPARK, Intensities, and the twice-exceptional pattern reading, connected by the Pattern Engine." },
      { property: "og:title", content: "The Cognitive Map — Cognitive Layer" },
      { property: "og:description", content: "A unified mirror of how you think, feel, and run hot." },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const [responses, setResponses] = useState<Responses | null>(null);
  const [intensities, setIntensities] = useState<IntensityResponses | null>(null);

  useEffect(() => {
    const stored = localStore.loadProfile();
    if (stored?.responses && Object.keys(stored.responses).length) setResponses(stored.responses);
    if (stored?.intensities && Object.keys(stored.intensities).length) setIntensities(stored.intensities);
  }, []);

  const data = useMemo(() => {
    if (!responses) return null;
    const spark = scoreResponses(responses);
    const translation = translate(spark);
    const { primary, secondary } = resolveArchetype(spark);
    const intScores = intensities ? scoreIntensities(intensities) : null;
    const intTranslation = intScores ? translateIntensities(intScores) : null;
    const twoE = analyzeTwoE(spark, intScores ?? undefined);
    const map = buildPatternMap({
      spark,
      intensities: intScores,
      translation,
      intensityTranslation: intTranslation,
      twoE,
    });
    return { spark, translation, primary, secondary, intScores, intTranslation, twoE, map };
  }, [responses, intensities]);

  if (!data) {
    return (
      <main className="relative min-h-screen overflow-hidden">
        <AuroraField />
        <div className="relative z-10 mx-auto max-w-2xl px-6 pt-32 text-center">
          <h1 className="font-display text-4xl sm:text-5xl">The map needs a reading first.</h1>
          <p className="mt-6 text-muted-foreground">
            Begin with the SPARK reflection. The map will form as each layer comes online.
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

  const { spark, primary, intScores, intTranslation, twoE, map } = data;

  return (
    <main className="relative min-h-screen overflow-hidden pb-32">
      <AuroraField />

      <header className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-6 py-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full breathe" style={{ background: "var(--gradient-thread)" }} />
          <span className="font-display text-base tracking-wide">Cognitive Layer</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link to="/profile" className="text-xs tracking-[0.22em] uppercase text-muted-foreground hover:text-foreground transition-calm">Profile</Link>
          <Link to="/intensities" className="text-xs tracking-[0.22em] uppercase text-muted-foreground hover:text-foreground transition-calm">Intensities</Link>
          <Link to="/toolkit" className="text-xs tracking-[0.22em] uppercase text-muted-foreground hover:text-foreground transition-calm">Toolkit</Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 pt-12 text-center">
        <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-6 fade-up">
          The cognitive map
        </p>
        <h1 className="font-display text-5xl sm:text-7xl leading-[1.05] fade-up" style={{ animationDelay: "80ms" }}>
          <span className="text-thread italic">{primary.archetype.name}</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-foreground/90 fade-up" style={{ animationDelay: "180ms" }}>
          {map.throughline}
        </p>
      </section>

      {/* Twin radars */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pt-16">
        <div className="grid gap-6 md:grid-cols-2">
          <article className="glass-panel rounded-3xl p-6 sm:p-8 fade-up">
            <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-2">SPARK</p>
            <h2 className="font-display text-2xl mb-6">Cognitive signature</h2>
            <div className="flex items-center justify-center">
              <RadarChart scores={spark} size={360} />
            </div>
          </article>

          <article className="glass-panel rounded-3xl p-6 sm:p-8 fade-up" style={{ animationDelay: "100ms" }}>
            <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-2">Intensities</p>
            <h2 className="font-display text-2xl mb-6">Where the current runs hot</h2>
            {intScores ? (
              <div className="flex items-center justify-center">
                <IntensityRadar scores={intScores} size={360} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground italic mb-6">
                  This layer hasn't formed yet. Complete the Intensities reflection to see the second half of the map.
                </p>
                <Link
                  to="/intensities"
                  className="inline-flex items-center gap-3 rounded-full px-6 py-3 text-xs tracking-[0.18em] uppercase transition-calm"
                  style={{ background: "var(--gradient-thread)", color: "oklch(0.14 0.04 270)", boxShadow: "var(--shadow-glow)" }}
                >
                  Open the Intensities →
                </Link>
              </div>
            )}
          </article>
        </div>
      </section>

      {/* 2E reading */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 pt-20">
        <div className="mb-8 text-center">
          <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-3">
            The twice-exceptional reading
          </p>
          <h2 className="font-display text-3xl sm:text-4xl">{twoE.headline}</h2>
        </div>
        <article className="glass-panel rounded-3xl p-8 sm:p-10 fade-up space-y-6">
          <p className="text-base sm:text-lg leading-relaxed text-foreground/90">{twoE.description}</p>

          <div className="grid gap-4 sm:grid-cols-3">
            <Meter label="Capacity" value={twoE.capacityScore} />
            <Meter label="Load" value={twoE.loadScore} />
            <Meter label="Asynchrony" value={twoE.asynchrony} />
          </div>

          {twoE.contradictions.length > 0 && (
            <div>
              <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-3">The contradictions</p>
              <ul className="space-y-2">
                {twoE.contradictions.map((c, i) => (
                  <li key={i} className="flex gap-3 text-base text-foreground/90 leading-relaxed">
                    <span className="mt-2 inline-block h-1 w-3 shrink-0 rounded-full" style={{ background: "var(--gradient-thread)" }} />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {twoE.recognitions.length > 0 && (
            <div>
              <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-3">What tends to be true</p>
              <ul className="space-y-2">
                {twoE.recognitions.map((r, i) => (
                  <li key={i} className="text-base text-foreground/80 italic leading-relaxed">— {r}</li>
                ))}
              </ul>
            </div>
          )}
        </article>
      </section>

      {/* Inner movement (Dąbrowski translated) */}
      {intTranslation && (
        <section className="relative z-10 mx-auto max-w-4xl px-6 pt-20">
          <div className="mb-8 text-center">
            <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-3">
              Inner movement
            </p>
            <h2 className="font-display text-3xl sm:text-4xl">{intTranslation.movement.label}</h2>
          </div>
          <article className="glass-panel rounded-3xl p-8 sm:p-10 fade-up space-y-4">
            <p className="text-base sm:text-lg leading-relaxed text-foreground/90">{intTranslation.movement.reading}</p>
            <p className="text-xs text-muted-foreground italic pt-4 border-t border-border/40">
              {intTranslation.movement.framework}
            </p>
          </article>
        </section>
      )}

      {/* Pattern motifs */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 pt-20">
        <div className="mb-10 text-center">
          <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-3">
            The pattern engine
          </p>
          <h2 className="font-display text-3xl sm:text-4xl">Recurring motifs</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground italic">
            Where two or more layers agree on what your system actually wants.
          </p>
        </div>
        {map.motifs.length === 0 ? (
          <p className="text-center text-muted-foreground italic">
            No motifs strong enough to surface yet. Complete both reflections to see the engine connect them.
          </p>
        ) : (
          <div className="space-y-3">
            {map.motifs.map((m, i) => (
              <article key={m.id} className="glass-panel rounded-2xl p-6 fade-up" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-display text-xl">{m.title}</h3>
                  <span className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground">
                    {m.sources.join(" × ")}
                  </span>
                </div>
                <p className="text-base text-foreground/90 leading-relaxed">{m.reading}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Edges */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 pt-20">
        <div className="grid gap-4 sm:grid-cols-2">
          <article className="glass-panel rounded-2xl p-6 sm:p-8 fade-up">
            <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-3">Growth edge</p>
            <p className="text-base text-foreground/90 leading-relaxed">{map.growthEdge}</p>
          </article>
          <article className="glass-panel rounded-2xl p-6 sm:p-8 fade-up" style={{ animationDelay: "80ms" }}>
            <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-3">Guard edge</p>
            <p className="text-base text-foreground/90 leading-relaxed">{map.guardEdge}</p>
          </article>
        </div>
      </section>

      {/* Toolkit CTA */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 pt-20 text-center">
        <h2 className="font-display text-3xl sm:text-4xl leading-tight">
          Move from map to <span className="text-thread italic">practice.</span>
        </h2>
        <Link
          to="/toolkit"
          className="mt-10 inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm tracking-[0.18em] uppercase transition-calm"
          style={{ background: "var(--gradient-thread)", color: "oklch(0.14 0.04 270)", boxShadow: "var(--shadow-glow)" }}
        >
          Open the toolkit →
        </Link>
      </section>
    </main>
  );
}

function Meter({ label, value }: { label: string; value: number }) {
  const pct = Math.round(value * 100);
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-[10px] tracking-[0.24em] uppercase text-muted-foreground">{label}</span>
        <span className="text-thread text-sm">{pct}%</span>
      </div>
      <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-secondary/50">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-calm"
          style={{ width: `${pct}%`, background: "var(--gradient-thread)", boxShadow: "0 0 12px oklch(0.78 0.20 290 / 0.55)" }}
        />
      </div>
    </div>
  );
}