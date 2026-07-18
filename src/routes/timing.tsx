import { createFileRoute, Link } from "@tanstack/react-router";
import { AuroraField } from "@/components/AuroraField";

export const Route = createFileRoute("/timing")({
  head: () => ({
    meta: [
      { title: "Timing — Creative Studio" },
      { name: "description", content: "Symbolic timing cues. Metaphor, not prediction." },
    ],
  }),
  component: TimingPage,
});

const CUES = [
  {
    label: "Slow tide",
    note: "A good moment for Depth or Myth Mode. Wide focus narrows naturally; don't force Pulse.",
  },
  {
    label: "Bright window",
    note: "Conditions favor Signal or Pulse. Use the clarity while it's open.",
  },
  {
    label: "Branching weather",
    note: "Flux feels natural; resist the urge to converge too early.",
  },
  { label: "Held breath", note: "The work is between phases. Initiation may be quietly underway." },
];

function TimingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden pb-32">
      <AuroraField />
      <header className="relative z-10 mx-auto flex max-w-3xl items-center justify-between px-6 py-8">
        <Link to="/" className="flex items-center gap-3">
          <span
            className="h-2 w-2 rounded-full breathe"
            style={{ background: "var(--gradient-thread)" }}
          />
          <span className="font-display text-base tracking-wide">Creative Studio</span>
        </Link>
        <Link
          to="/modes"
          className="text-xs tracking-[0.22em] uppercase text-muted-foreground hover:text-foreground transition-calm"
        >
          Modes →
        </Link>
      </header>

      <section className="relative z-10 mx-auto max-w-3xl px-6 pt-8">
        <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-4 fade-up">
          Symbolic timing · metaphor only
        </p>
        <h1
          className="font-display text-5xl leading-[1.05] fade-up"
          style={{ animationDelay: "60ms" }}
        >
          Cues for <span className="text-thread italic">the weather.</span>
        </h1>
        <p
          className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground fade-up"
          style={{ animationDelay: "160ms" }}
        >
          These cues are metaphors — atmospheric labels you can pick to mark how the work feels
          right now. They are not predictions, not guidance, and not derived from anything other
          than your choice.
        </p>
      </section>

      <section className="relative z-10 mx-auto mt-10 grid max-w-3xl gap-4 px-6 sm:grid-cols-2">
        {CUES.map((c, i) => (
          <article
            key={c.label}
            className="glass-panel rounded-2xl p-6 fade-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <h3 className="font-display text-xl">{c.label}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.note}</p>
          </article>
        ))}
      </section>

      <p className="relative z-10 mx-auto mt-10 max-w-2xl px-6 text-center text-xs italic text-muted-foreground">
        Symbolic only. The studio does not generate predictions, horoscopes, or guidance.
      </p>
    </main>
  );
}
