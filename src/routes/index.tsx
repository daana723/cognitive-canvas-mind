import { createFileRoute, Link } from "@tanstack/react-router";
import { AuroraField } from "@/components/AuroraField";
import { MODES } from "@/lib/modes/modes";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nonlinear Studio — a creative cognitive layer" },
      { name: "description", content: "A creative cognitive layer for nonlinear thinkers. Two doors: SPARK, a reflective mirror; Loom, a practical workspace. Local-first. Non-diagnostic." },
      { property: "og:title", content: "Nonlinear Studio" },
      { property: "og:description", content: "SPARK reflection · Loom workspace. A studio for nonlinear thinkers, not a verdict about them." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <AuroraField />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-8">
        <Link to="/" className="flex items-center gap-3 group">
          <span className="h-2.5 w-2.5 rounded-full breathe" style={{ background: "var(--gradient-thread)" }} />
          <span className="font-display text-lg tracking-wide">Nonlinear Studio</span>
        </Link>
        <nav className="hidden gap-7 sm:flex">
          {[
            { to: "/spark", label: "SPARK" },
            { to: "/twoe", label: "2E" },
            { to: "/loom", label: "Loom" },
            { to: "/modes", label: "Modes" },
            { to: "/map", label: "Map" },
            { to: "/workflows", label: "Workflows" },
            { to: "/reflections", label: "Reflections" },
            { to: "/snapshots", label: "Snapshots" },
          ].map((l) => (
            <Link key={l.to} to={l.to} className="text-[11px] tracking-[0.22em] uppercase text-muted-foreground hover:text-foreground transition-calm">
              {l.label}
            </Link>
          ))}
        </nav>
      </header>

      <section className="relative z-10 mx-auto max-w-4xl px-6 pt-16 pb-24 sm:pt-28 text-center">
        <p className="mb-8 inline-flex items-center gap-2 text-[11px] tracking-[0.32em] uppercase text-muted-foreground fade-up">
          <span className="h-px w-8 bg-border" />
          a creative cognitive layer
          <span className="h-px w-8 bg-border" />
        </p>
        <h1 className="font-display text-5xl sm:text-7xl leading-[1.05] fade-up" style={{ animationDelay: "60ms" }}>
          A studio for
          <br />
          <span className="text-thread italic">nonlinear thinkers.</span>
        </h1>
        <p className="mx-auto mt-8 max-w-2xl text-lg sm:text-xl leading-relaxed text-muted-foreground fade-up" style={{ animationDelay: "180ms" }}>
          Two equal doors. SPARK is a reflective mirror — a deep, guided
          reflection for recognizing patterns in how you create, sense, decide,
          and move through ideas. Loom is a practical workspace — for turning
          scattered ideas into finished outputs. Nothing is inferred about you.
        </p>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 fade-up" style={{ animationDelay: "280ms" }}>
          <Link
            to="/spark"
            className="glass-panel group relative rounded-3xl p-8 text-left transition-calm hover:-translate-y-1"
          >
            <p className="text-[10px] tracking-[0.28em] uppercase text-muted-foreground">
              The reflective door
            </p>
            <h2 className="mt-3 font-display text-3xl">
              Take the <span className="text-thread italic">SPARK</span> reflection
            </h2>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              A guided reflective mirror. Recognize patterns in how you create,
              sense, decide, and move through ideas. Deep, careful, non-diagnostic.
            </p>
            <p className="mt-6 text-[10px] tracking-[0.24em] uppercase text-thread group-hover:translate-x-1 transition-calm">
              Enter the reflection →
            </p>
          </Link>
          <Link
            to="/loom"
            className="glass-panel group relative rounded-3xl p-8 text-left transition-calm hover:-translate-y-1"
          >
            <p className="text-[10px] tracking-[0.28em] uppercase text-muted-foreground">
              The practical door
            </p>
            <h2 className="mt-3 font-display text-3xl">
              Open the <span className="text-thread italic">Loom</span> workspace
            </h2>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Bring a messy creative intention. The Loom reads the thread and
              lights the right agents — Research, Content, Product, Marketing,
              Avatar, Operations — and returns a structured plan.
            </p>
            <p className="mt-6 text-[10px] tracking-[0.24em] uppercase text-thread group-hover:translate-x-1 transition-calm">
              Weave an intention →
            </p>
          </Link>
        </div>
        <div className="mt-6 grid gap-6 fade-up" style={{ animationDelay: "360ms" }}>
          <Link
            to="/twoe"
            className="glass-panel group relative rounded-3xl p-8 text-left transition-calm hover:-translate-y-1"
          >
            <p className="text-[10px] tracking-[0.28em] uppercase text-muted-foreground">
              The framework door
            </p>
            <h2 className="mt-3 font-display text-3xl">
              Map your <span className="text-thread italic">2E overexcitabilities</span>
            </h2>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-2xl">
              A 40-prompt self-recognition assessment built on Dabrowski's five
              Overexcitabilities — intellectual, emotional, imaginational, psychomotor,
              sensual. Radar profile, dominant channel, and strengths / shadow readings.
              Non-diagnostic, local-first.
            </p>
            <p className="mt-6 text-[10px] tracking-[0.24em] uppercase text-thread group-hover:translate-x-1 transition-calm">
              Begin the assessment →
            </p>
          </Link>
        </div>
        <p className="mt-10 text-xs text-muted-foreground">
          Local-first · nothing leaves your device
        </p>
      </section>

      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-3">
              Five creative currents
            </p>
            <h2 className="font-display text-3xl sm:text-4xl">Modes you choose — never modes assigned.</h2>
          </div>
          <p className="hidden max-w-sm text-sm text-muted-foreground sm:block">
            The studio organizes ideas, projects, and creative states. It does not
            categorize you. Each mode is a symbolic current — pick whichever fits
            this moment.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {MODES.map((m, i) => (
            <Link
              key={m.id}
              to="/modes"
              className="glass-panel group relative overflow-hidden rounded-2xl transition-calm hover:-translate-y-1 fade-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="relative h-36 w-full overflow-hidden">
                <img src={m.image} alt="" className="h-full w-full object-cover transition-calm group-hover:scale-105" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 30%, oklch(0.14 0.05 275 / 0.95) 100%)" }} />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 text-[10px] tracking-[0.24em] uppercase" style={{ color: m.accent }}>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: m.accent }} />
                  Mode
                </div>
                <h3 className="mt-2 font-display text-lg">{m.label}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{m.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-3xl px-6 pb-32 text-center">
        <p className="text-[11px] tracking-[0.32em] uppercase text-muted-foreground mb-6">
          The orientation
        </p>
        <p className="font-display text-2xl sm:text-3xl leading-relaxed text-foreground/90">
          Choose <span className="text-muted-foreground">→</span> Map{" "}
          <span className="text-muted-foreground">→</span> Make{" "}
          <span className="text-muted-foreground">→</span> Notice.
        </p>
        <p className="mt-6 text-base text-muted-foreground leading-relaxed">
          Replace certainty with exploration. Replace labels with narratives.
          Replace prescriptions with experiments. A reflective guide, not an assessment tool.
        </p>
      </section>

      <footer className="relative z-10 border-t border-border/30 py-10 text-center text-xs tracking-[0.18em] uppercase text-muted-foreground">
        Creative Studio · a workspace, not a verdict
      </footer>
    </main>
  );
}
