import { createFileRoute, Link } from "@tanstack/react-router";
import { AuroraField } from "@/components/AuroraField";
import { DIMENSIONS } from "@/lib/spark/dimensions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cognitive Layer — A mirror for how you think" },
      { name: "description", content: "A cognitive translation platform for neurodivergent and non-linear thinkers. Understand how you think, feel, learn, regulate, create, and work." },
      { property: "og:title", content: "Cognitive Layer" },
      { property: "og:description", content: "A cognitive mirror for non-linear thinkers." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <AuroraField />

      {/* Nav */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-8">
        <Link to="/" className="flex items-center gap-3 group">
          <span
            className="h-2.5 w-2.5 rounded-full breathe"
            style={{ background: "var(--gradient-thread)" }}
          />
          <span className="font-display text-lg tracking-wide">Cognitive Layer</span>
        </Link>
        <Link
          to="/assessment"
          className="text-xs tracking-[0.22em] uppercase text-muted-foreground hover:text-foreground transition-calm"
        >
          Begin →
        </Link>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 pt-16 pb-28 sm:pt-28 sm:pb-40 text-center">
        <p className="mb-8 inline-flex items-center gap-2 text-[11px] tracking-[0.32em] uppercase text-muted-foreground fade-up">
          <span className="h-px w-8 bg-border" />
          A cognitive translation platform
          <span className="h-px w-8 bg-border" />
        </p>

        <h1 className="font-display text-5xl sm:text-7xl leading-[1.05] text-foreground fade-up" style={{ animationDelay: "60ms" }}>
          A mirror for the way
          <br />
          <span className="text-thread italic">you actually think.</span>
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-lg sm:text-xl leading-relaxed text-muted-foreground fade-up" style={{ animationDelay: "180ms" }}>
          Cognitive Layer translates how your attention, energy, emotion, and perception
          actually move — into language you can use. Not a diagnosis. Not a productivity
          system. A reflection of the cognitive signature already running inside you.
        </p>

        <div className="mt-12 flex flex-col items-center gap-4 fade-up" style={{ animationDelay: "280ms" }}>
          <Link
            to="/assessment"
            className="group inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm tracking-[0.18em] uppercase transition-calm"
            style={{
              background: "var(--gradient-thread)",
              color: "oklch(0.14 0.04 270)",
              boxShadow: "var(--shadow-glow)",
            }}
          >
            Begin the reflection
            <span className="transition-calm group-hover:translate-x-1">→</span>
          </Link>
          <span className="text-xs text-muted-foreground">
            ~5 minutes · private, stored only on your device
          </span>
        </div>
      </section>

      {/* Dimensions preview */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-32">
        <div className="mb-12 flex items-end justify-between gap-6">
          <div>
            <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-3">
              What we listen for
            </p>
            <h2 className="font-display text-3xl sm:text-4xl">Seven cognitive dimensions</h2>
          </div>
          <p className="hidden sm:block max-w-sm text-sm text-muted-foreground">
            Each is a descriptive spectrum, never a deficit. Together they sketch the
            shape of how you process the world.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DIMENSIONS.map((d, i) => (
            <article
              key={d.id}
              className="glass-panel rounded-2xl p-6 transition-calm hover:-translate-y-0.5 fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="mb-4 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--gradient-thread)" }} />
                <span className="text-[10px] tracking-[0.24em] uppercase text-muted-foreground">
                  {d.poles.low} · {d.poles.high}
                </span>
              </div>
              <h3 className="font-display text-xl text-foreground">{d.label}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed italic">
                {d.essence}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Philosophy */}
      <section className="relative z-10 mx-auto max-w-3xl px-6 pb-40 text-center">
        <p className="text-[11px] tracking-[0.32em] uppercase text-muted-foreground mb-6">
          The orientation
        </p>
        <p className="font-display text-2xl sm:text-3xl leading-relaxed text-foreground/90">
          Experience <span className="text-muted-foreground">→</span> Meaning{" "}
          <span className="text-muted-foreground">→</span> Insight{" "}
          <span className="text-muted-foreground">→</span> Action.
        </p>
        <p className="mt-6 text-base text-muted-foreground leading-relaxed">
          Built for ADHD, 2E, autistic, and non-linear minds. No streaks. No deficit
          framing. No clinical edge. Just a calm surface that lets you see yourself
          clearly enough to move.
        </p>
      </section>

      <footer className="relative z-10 border-t border-border/30 py-10 text-center text-xs tracking-[0.18em] uppercase text-muted-foreground">
        Cognitive Layer · a mirror, not a measure
      </footer>
    </main>
  );
}
