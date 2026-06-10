import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AuroraField } from "@/components/AuroraField";
import { ToolCard } from "@/components/toolkit/ToolCard";
import { TOOLS } from "@/lib/toolkit/tools";
import { localStore } from "@/lib/storage/local-store";
import { scoreResponses, type Responses } from "@/lib/spark/scoring";
import { translate } from "@/lib/spark/translation";

export const Route = createFileRoute("/toolkit")({
  head: () => ({
    meta: [
      { title: "Adaptive Toolkit — Cognitive Layer" },
      { name: "description", content: "Six interactive cognitive supports, tuned to your SPARK profile." },
    ],
  }),
  component: ToolkitPage,
});

function ToolkitPage() {
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
          <h1 className="font-display text-4xl sm:text-5xl">The toolkit reads from your profile.</h1>
          <p className="mt-6 text-muted-foreground">
            Complete the SPARK reflection first — every tool tunes itself to the signature you share.
          </p>
          <Link
            to="/assessment"
            className="mt-10 inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm tracking-[0.18em] uppercase transition-calm"
            style={{ background: "var(--gradient-thread)", color: "oklch(0.14 0.04 270)", boxShadow: "var(--shadow-glow)" }}
          >
            Begin the reflection →
          </Link>
        </div>
      </main>
    );
  }

  const scores = scoreResponses(responses);
  const translation = translate(scores);

  return (
    <main className="relative min-h-screen overflow-hidden pb-32">
      <AuroraField />

      <header className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-6 py-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full breathe" style={{ background: "var(--gradient-thread)" }} />
          <span className="font-display text-base tracking-wide">Cognitive Layer</span>
        </Link>
        <Link to="/profile" className="text-xs tracking-[0.22em] uppercase text-muted-foreground hover:text-foreground transition-calm">
          Profile
        </Link>
      </header>

      <section className="relative z-10 mx-auto max-w-3xl px-6 pt-12 text-center">
        <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-6 fade-up">
          The adaptive toolkit
        </p>
        <h1 className="font-display text-5xl sm:text-6xl leading-[1.05] fade-up" style={{ animationDelay: "80ms" }}>
          Supports tuned to <span className="text-thread italic">your signature.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground leading-relaxed fade-up" style={{ animationDelay: "160ms" }}>
          Each tool reads from your translation layer and adjusts its prompts to fit
          how you actually move. Open one when the moment calls for it.
        </p>
      </section>

      <section className="relative z-10 mx-auto max-w-3xl px-6 pt-16">
        <div className="space-y-4">
          {TOOLS.map((tool, i) => (
            <div key={tool.id} className="fade-up" style={{ animationDelay: `${i * 60}ms` }}>
              <ToolCard tool={tool} scores={scores} translation={translation} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}