import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AuroraField } from "@/components/AuroraField";
import { ModeSelector } from "@/components/modes/ModeSelector";
import { MODES, getMode, type ModeId } from "@/lib/modes/modes";
import { studioStore } from "@/lib/studio/store";

export const Route = createFileRoute("/modes")({
  head: () => ({
    meta: [
      { title: "Modes — Creative Studio" },
      { name: "description", content: "Five symbolic creative currents. You pick the one that fits this moment." },
    ],
  }),
  component: ModesPage,
});

function ModesPage() {
  const [current, setCurrent] = useState<ModeId | undefined>();

  useEffect(() => { setCurrent(studioStore.load().currentMode); }, []);

  const select = (id: ModeId) => {
    setCurrent(id);
    studioStore.update((s) => ({ ...s, currentMode: id }));
  };

  const m = current ? getMode(current) : null;

  return (
    <main className="relative min-h-screen overflow-hidden pb-32">
      <AuroraField />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full breathe" style={{ background: "var(--gradient-thread)" }} />
          <span className="font-display text-base tracking-wide">Creative Studio</span>
        </Link>
        <Link to="/workflows" className="text-xs tracking-[0.22em] uppercase text-muted-foreground hover:text-foreground transition-calm">
          Workflows →
        </Link>
      </header>

      <section className="relative z-10 mx-auto max-w-3xl px-6 pt-8 text-center">
        <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-6 fade-up">
          Creative modes selector
        </p>
        <h1 className="font-display text-5xl sm:text-6xl leading-[1.05] fade-up" style={{ animationDelay: "60ms" }}>
          Choose your <span className="text-thread italic">current.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground fade-up" style={{ animationDelay: "160ms" }}>
          {MODES.length} symbolic modes. Pick whichever fits the moment. You can
          switch any time. The studio doesn't measure you — it just remembers what you chose.
        </p>
      </section>

      {m && (
        <section className="relative z-10 mx-auto mt-12 max-w-3xl px-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-8" style={{ boxShadow: `0 0 0 1px ${m.accent}` }}>
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full" style={{ background: m.accent }} />
              <span className="text-[10px] tracking-[0.26em] uppercase" style={{ color: m.accent }}>
                Currently chosen
              </span>
            </div>
            <h2 className="mt-3 font-display text-3xl">{m.label}</h2>
            <p className="mt-2 text-sm italic text-muted-foreground">{m.tagline}</p>
            <p className="mt-4 text-base leading-relaxed text-foreground/90">{m.invitation}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/workflows" className="rounded-full px-5 py-2.5 text-[11px] tracking-[0.22em] uppercase transition-calm" style={{ background: "var(--gradient-thread)", color: "oklch(0.14 0.04 270)" }}>
                Open workflows →
              </Link>
              <Link to="/map" className="rounded-full border border-border/70 px-5 py-2.5 text-[11px] tracking-[0.22em] uppercase text-foreground hover:bg-white/5 transition-calm">
                Map a state
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="relative z-10 mx-auto mt-12 max-w-6xl px-6">
        <ModeSelector current={current} onSelect={select} />
      </section>
    </main>
  );
}
