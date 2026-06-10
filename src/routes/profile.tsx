import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AuroraField } from "@/components/AuroraField";
import { localStore } from "@/lib/storage/local-store";
import { scoreResponses, type Responses } from "@/lib/spark/scoring";
import { resolveArchetype } from "@/lib/spark/archetypes";
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
  const translation = translate(scores);

  return (
    <main className="relative min-h-screen overflow-hidden pb-32">
      <AuroraField />

      <header className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-6 py-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full breathe" style={{ background: "var(--gradient-thread)" }} />
          <span className="font-display text-base tracking-wide">Cognitive Layer</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link to="/toolkit" className="text-xs tracking-[0.22em] uppercase text-muted-foreground hover:text-foreground transition-calm">
            Toolkit
          </Link>
          <Link to="/assessment" className="text-xs tracking-[0.22em] uppercase text-muted-foreground hover:text-foreground transition-calm">
            Revisit
          </Link>
        </nav>
      </header>

      {/* Archetype hero */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 pt-12 text-center">
        <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-6 fade-up">
          Your primary archetype
        </p>
        <div className="mx-auto mb-10 h-44 w-44 sm:h-56 sm:w-56 rounded-full overflow-hidden fade-up relative" style={{ boxShadow: "var(--shadow-glow)", animationDelay: "40ms", border: "1px solid oklch(1 0 0 / 0.12)" }}>
          <img src={primary.archetype.image} alt={`${primary.archetype.name} illustration`} className="h-full w-full object-cover" style={{ filter: "saturate(1.15) contrast(1.05)" }} width={1024} height={1024} />
          <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle at 50% 30%, transparent 55%, oklch(0.13 0.05 275 / 0.55) 100%)" }} />
        </div>
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

      {/* Cognitive radar */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 pt-20">
        <div className="mb-8 text-center">
          <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-3">
            The radar
          </p>
          <h2 className="font-display text-3xl sm:text-4xl">Your cognitive signature, at a glance</h2>
        </div>
        <div className="glass-panel rounded-3xl p-6 sm:p-10 flex items-center justify-center fade-up">
          <RadarChart scores={scores} size={460} />
        </div>
      </section>

      {/* Translation — what this means */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 pt-24">
        <div className="mb-10 text-center">
          <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-3">
            What this means
          </p>
          <h2 className="font-display text-3xl sm:text-4xl">Translated, dimension by dimension</h2>
        </div>
        <div className="space-y-3">
          {translation.readings.map((r, i) => (
            <article key={r.dimension.id} className="glass-panel rounded-2xl px-6 py-5 fade-up" style={{ animationDelay: `${i * 40}ms` }}>
              <div className="flex flex-wrap items-baseline justify-between gap-3 mb-2">
                <span className="font-display text-lg">{r.dimension.label}</span>
                <span className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground">
                  Leans {r.lean === "high" ? r.dimension.poles.high : r.lean === "low" ? r.dimension.poles.low : "balanced"}
                </span>
              </div>
              <p className="text-base leading-relaxed text-foreground/90">{r.meaning}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Strengths */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 pt-24">
        <div className="mb-10 text-center">
          <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-3">
            What's strong
          </p>
          <h2 className="font-display text-3xl sm:text-4xl">Your native capacities</h2>
        </div>
        {translation.strengths.length === 0 ? (
          <p className="text-center text-muted-foreground italic">Your strengths are spread evenly — no single capacity dominates the others.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {translation.strengths.map((s, i) => (
              <article key={s.id} className="glass-panel rounded-2xl p-6 fade-up" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--gradient-thread)" }} />
                  <span className="text-[10px] tracking-[0.24em] uppercase text-muted-foreground">{s.source}</span>
                </div>
                <h3 className="font-display text-xl">{s.label}</h3>
                <p className="mt-2 text-sm text-foreground/80 leading-relaxed">{s.description}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Challenges — reframed */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 pt-24">
        <div className="mb-10 text-center">
          <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-3">
            What costs more
          </p>
          <h2 className="font-display text-3xl sm:text-4xl">Reframed, with supports</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground italic">
            Each of these is the cost of a capacity, not a deficit. Translation, not diagnosis.
          </p>
        </div>
        {translation.challenges.length === 0 ? (
          <p className="text-center text-muted-foreground italic">Your profile doesn't surface heavy challenge patterns — supports remain available in the toolkit.</p>
        ) : (
          <div className="space-y-3">
            {translation.challenges.map((c, i) => (
              <article key={c.id} className="glass-panel rounded-2xl p-6 fade-up" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="flex flex-wrap items-baseline justify-between gap-3 mb-3">
                  <h3 className="font-display text-xl">{c.label}</h3>
                  <span className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground">{c.source}</span>
                </div>
                <p className="text-base text-foreground/90 leading-relaxed">{c.description}</p>
                <p className="mt-4 text-sm text-foreground/80 italic leading-relaxed">
                  <span className="text-thread not-italic tracking-[0.18em] uppercase text-[10px] mr-2">Reframe</span>
                  {c.reframe}
                </p>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  <span className="text-thread tracking-[0.18em] uppercase text-[10px] mr-2">Support</span>
                  {c.support}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Cognitive Operating Manual */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 pt-24">
        <div className="mb-10 text-center">
          <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-3">
            Your personal manual
          </p>
          <h2 className="font-display text-3xl sm:text-5xl">The Cognitive Operating Manual</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground italic">
            A one-page reading of how your system actually wants to run.
          </p>
        </div>
        <div className="glass-panel rounded-3xl p-8 sm:p-12 fade-up space-y-10">
          <ManualBlock title="You thrive in" items={translation.manual.thrivesIn} />
          <ManualBlock title="You struggle in" items={translation.manual.strugglesIn} />
          <ManualBlock title="To function well, you need" items={translation.manual.needsToFunction} />
          <ManualBlock title="If overwhelmed" items={translation.manual.ifOverwhelmed} />
          <div className="grid gap-6 sm:grid-cols-2">
            <ManualLine title="Decision pattern" line={translation.manual.decisionPattern} />
            <ManualLine title="Working rhythm" line={translation.manual.workingRhythm} />
          </div>
        </div>
      </section>

      {/* Toolkit entry */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 pt-24 text-center">
        <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-4">
          From profile to practice
        </p>
        <h2 className="font-display text-3xl sm:text-4xl leading-tight">
          Six supports, <span className="text-thread italic">tuned to you.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground leading-relaxed">
          The Adaptive Toolkit reads from your translation layer. Every prompt
          inside it is adjusted to fit the signature above.
        </p>
        <Link
          to="/toolkit"
          className="mt-10 inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm tracking-[0.18em] uppercase transition-calm"
          style={{ background: "var(--gradient-thread)", color: "oklch(0.14 0.04 270)", boxShadow: "var(--shadow-glow)" }}
        >
          Open the toolkit →
        </Link>
      </section>

      {/* Roadmap */}
      <section className="relative z-10 mx-auto max-w-3xl px-6 pt-24 text-center">
        <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-4">
          The road unfolding
        </p>
        <h2 className="font-display text-3xl sm:text-4xl leading-tight">
          A mirror that <span className="text-thread italic">grows with you.</span>
        </h2>
        <p className="mt-6 text-base text-muted-foreground leading-relaxed">
          The further horizons are pattern detection and a cognitive companion that learns
          the texture of how you move.
        </p>

        <ol className="mt-10 grid gap-3 text-left sm:grid-cols-2">
          {[
            { step: "01", label: "SPARK Reflection", state: "Complete" },
            { step: "02", label: "Cognitive Profile", state: "Complete" },
            { step: "03", label: "Translation Layer", state: "Complete" },
            { step: "04", label: "Cognitive Operating Manual", state: "You are here" },
            { step: "05", label: "Adaptive Toolkit", state: "Open" },
            { step: "06", label: "Pattern Engine", state: "Forming" },
            { step: "07", label: "AI Cognitive Companion", state: "Horizon" },
            { step: "08", label: "Personal Operating System", state: "Horizon" },
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

function ManualBlock({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div>
      <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-4">{title}</p>
      <ul className="space-y-3">
        {items.map((it, i) => (
          <li key={i} className="flex gap-3 text-base leading-relaxed text-foreground/90">
            <span className="mt-2 inline-block h-1 w-3 shrink-0 rounded-full" style={{ background: "var(--gradient-thread)" }} />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ManualLine({ title, line }: { title: string; line: string }) {
  return (
    <div>
      <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-3">{title}</p>
      <p className="text-base text-foreground/90 leading-relaxed italic">{line}</p>
    </div>
  );
}