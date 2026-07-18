import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AuroraField } from "@/components/AuroraField";
import { NarrativeMap } from "@/components/studio/NarrativeMap";
import { PhaseRibbon } from "@/components/modes/PhaseRibbon";
import { studioStore } from "@/lib/studio/store";
import type { PhaseId } from "@/lib/modes/phases";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Map — Creative Studio" },
      {
        name: "description",
        content:
          "Describe your current creative state in your own words. The studio holds it, never interprets it.",
      },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const [phase, setPhase] = useState<PhaseId | undefined>();
  useEffect(() => {
    setPhase(studioStore.load().currentPhase);
  }, []);
  const pick = (id: PhaseId) => {
    setPhase(id);
    studioStore.update((s) => ({ ...s, currentPhase: id }));
  };

  return (
    <main className="relative min-h-screen overflow-hidden pb-32">
      <AuroraField />
      <header className="relative z-10 mx-auto flex max-w-4xl items-center justify-between px-6 py-8">
        <Link to="/" className="flex items-center gap-3">
          <span
            className="h-2 w-2 rounded-full breathe"
            style={{ background: "var(--gradient-thread)" }}
          />
          <span className="font-display text-base tracking-wide">Creative Studio</span>
        </Link>
        <Link
          to="/reflections"
          className="text-xs tracking-[0.22em] uppercase text-muted-foreground hover:text-foreground transition-calm"
        >
          Reflections →
        </Link>
      </header>

      <section className="relative z-10 mx-auto max-w-3xl px-6 pt-8">
        <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-4 fade-up">
          Narrative mapping
        </p>
        <h1
          className="font-display text-5xl leading-[1.05] fade-up"
          style={{ animationDelay: "60ms" }}
        >
          Tell the studio <span className="text-thread italic">where you are.</span>
        </h1>
        <p
          className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground fade-up"
          style={{ animationDelay: "160ms" }}
        >
          Describe the work in your own words. Add threads as they arrive. Choose the phase that
          fits the story right now. No analysis is performed; the studio only stores what you put
          in.
        </p>
      </section>

      <section className="relative z-10 mx-auto mt-10 max-w-3xl px-6">
        <PhaseRibbon current={phase} onSelect={pick} />
      </section>

      <section className="relative z-10 mx-auto mt-8 max-w-3xl px-6">
        <NarrativeMap />
      </section>
    </main>
  );
}
