import { createFileRoute, Link } from "@tanstack/react-router";
import { AuroraField } from "@/components/AuroraField";
import { ReflectionEditor } from "@/components/studio/ReflectionEditor";

export const Route = createFileRoute("/reflections")({
  head: () => ({
    meta: [
      { title: "Reflections — Creative Studio" },
      {
        name: "description",
        content: "A reflection space. You write; the studio holds. Nothing is interpreted.",
      },
    ],
  }),
  component: ReflectionsPage,
});

function ReflectionsPage() {
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
          to="/snapshots"
          className="text-xs tracking-[0.22em] uppercase text-muted-foreground hover:text-foreground transition-calm"
        >
          Snapshots →
        </Link>
      </header>

      <section className="relative z-10 mx-auto max-w-3xl px-6 pt-8">
        <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-4 fade-up">
          Reflection space
        </p>
        <h1
          className="font-display text-5xl leading-[1.05] fade-up"
          style={{ animationDelay: "60ms" }}
        >
          Notes to <span className="text-thread italic">yourself.</span>
        </h1>
        <p
          className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground fade-up"
          style={{ animationDelay: "160ms" }}
        >
          A quiet surface for whatever is worth keeping. The studio will not respond, analyze, or
          interpret. The reflection is yours.
        </p>
      </section>

      <section className="relative z-10 mx-auto mt-10 max-w-3xl px-6">
        <ReflectionEditor />
      </section>
    </main>
  );
}
