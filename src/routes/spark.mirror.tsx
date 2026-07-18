import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { CurrentsRing } from "@/components/spark/CurrentsRing";
import { SparkRadar } from "@/components/spark/SparkRadar";
import { PROMPTS } from "@/lib/spark/prompts";
import { leansFrom, dimensionScoresFrom } from "@/lib/spark/resonance";
import { FACETS } from "@/lib/spark/facets";
import { currentHeatFrom } from "@/lib/spark/currentPrompts";
import { buildMirror, type MirrorReading } from "@/lib/spark/mirror";
import { sparkResponsesStore, currentResponsesStore } from "@/lib/spark/store";
import { dataAdapter } from "@/lib/data/adapter";
import type { SparkSketch } from "@/lib/data/types";
import { getMode } from "@/lib/modes/modes";

export const Route = createFileRoute("/spark/mirror")({
  head: () => ({
    meta: [
      { title: "Your pattern sketch — SPARK" },
      { name: "description", content: "A mirror of motifs, currents, and symbolic modes you may recognize." },
    ],
  }),
  component: MirrorPage,
});

function MirrorPage() {
  const [mirror, setMirror] = useState<MirrorReading | null>(null);
  const [saved, setSaved] = useState(false);
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    const responses = sparkResponsesStore.load();
    const currents = currentResponsesStore.load();
    if (Object.keys(responses).length === 0 && Object.keys(currents).length === 0) {
      setEmpty(true);
      return;
    }
    const leans = leansFrom(responses);
    const scores = dimensionScoresFrom(responses);
    const heat = currentHeatFrom(currents);
    setMirror(buildMirror(leans, heat, scores));
  }, []);

  const affinities = useMemo(() => {
    if (!mirror) return {} as SparkSketch["modeAffinities"];
    const out: SparkSketch["modeAffinities"] = {};
    for (const m of mirror.symbolicModes) out[m.mode] = m.weight;
    return out;
  }, [mirror]);

  const saveSketch = async () => {
    if (!mirror) return;
    const sketch: SparkSketch = {
      motifs: mirror.motifs.map((m) => m.label),
      modeAffinities: affinities,
      currentHeat: mirror.currentHeat,
      takenAt: new Date().toISOString(),
      version: 1,
    };
    await dataAdapter.saveSparkSketch(sketch);
    setSaved(true);
  };

  if (empty) {
    return (
      <section className="mx-auto max-w-3xl px-6 pt-6">
        <div className="glass-panel rounded-3xl p-10 sm:p-14 text-center fade-up">
          <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-6">
            Nothing to mirror yet
          </p>
          <h1 className="font-display text-3xl leading-tight">
            The reflection is where the mirror begins.
          </h1>
          <Link
            to="/spark/reflect"
            className="mt-8 inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm tracking-[0.18em] uppercase transition-calm"
            style={{ background: "var(--gradient-thread)", color: "oklch(0.14 0.04 270)", boxShadow: "var(--shadow-glow)" }}
          >
            Enter the reflection →
          </Link>
        </div>
      </section>
    );
  }

  if (!mirror) return null;

  return (
    <section className="mx-auto max-w-3xl px-6 pt-6 space-y-10">
      <div className="text-center fade-up">
        <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-4">
          Your pattern sketch
        </p>
        <h1 className="font-display text-4xl sm:text-5xl leading-tight">
          What you <span className="text-thread italic">may recognize.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground italic">
          A mirror, not a verdict. Read what resonates; leave what doesn't. Nothing here evaluates you.
        </p>
      </div>

      <div className="glass-panel rounded-3xl p-6 sm:p-10 fade-up">
        <div className="grid gap-8 sm:grid-cols-[auto_1fr] items-center">
          <div className="flex justify-center">
            <SparkRadar scores={mirror.scores} size={340} />
          </div>
          <div>
            <p className="text-[10px] tracking-[0.28em] uppercase text-muted-foreground mb-3">
              Spark Index · {mirror.index} of 20
            </p>
            <h2 className="font-display text-3xl leading-tight">
              {mirror.profile.name}
            </h2>
            <p className="mt-4 text-sm text-foreground/90 leading-relaxed">
              {mirror.profile.description}
            </p>
            <p className="mt-4 text-xs italic text-muted-foreground leading-relaxed">
              {mirror.profile.note}
            </p>
            <ul className="mt-6 space-y-2 text-xs text-muted-foreground">
              {FACETS.map((f) => (
                <li key={f.id} className="flex items-center gap-3">
                  <span className="inline-flex h-5 w-8 items-center justify-center rounded-full text-[9px] tracking-[0.18em]"
                        style={{ background: `${f.accent} / 0.12`, color: f.accent, border: `1px solid ${f.accent}` }}>
                    {f.id}
                  </span>
                  <span className="flex-1">{f.short}</span>
                  <span className="tabular-nums text-foreground/90">{mirror.scores[f.id].toFixed(1)} / 4</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-3xl p-6 sm:p-10 flex flex-col items-center fade-up">
        <p className="text-[10px] tracking-[0.28em] uppercase text-muted-foreground mb-4">
          Current heat
        </p>
        <CurrentsRing heat={mirror.currentHeat} />
        <p className="mt-4 max-w-md text-center text-xs text-muted-foreground italic">
          Weight, not measurement. Where the five currents seem to run warm right now.
        </p>
      </div>

      {mirror.motifs.length > 0 && (
        <div className="glass-panel rounded-3xl p-6 sm:p-10 fade-up">
          <p className="text-[10px] tracking-[0.28em] uppercase text-muted-foreground mb-6">
            Motifs surfacing
          </p>
          <ul className="space-y-5">
            {mirror.motifs.map((m) => (
              <li key={m.id}>
                <p className="font-display text-xl">{m.label}</p>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{m.reading}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="glass-panel rounded-3xl p-6 sm:p-10 fade-up">
        <p className="text-[10px] tracking-[0.28em] uppercase text-muted-foreground mb-6">
          Symbolic modes you may recognize
        </p>
        <div className="space-y-6">
          {mirror.symbolicModes.map((s) => {
            const mode = getMode(s.mode);
            return (
              <div key={s.mode} className="flex gap-4 items-start">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border/40">
                  <img src={mode.image} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] tracking-[0.24em] uppercase" style={{ color: mode.accent }}>
                    You may recognize
                  </p>
                  <p className="mt-1 font-display text-xl">{mode.label}</p>
                  <p className="mt-1 text-sm text-muted-foreground italic">{mode.tagline}</p>
                  <p className="mt-2 text-sm text-foreground/90 leading-relaxed">{s.invitation}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="glass-panel rounded-3xl p-6 sm:p-10 text-center fade-up">
        <p className="text-[10px] tracking-[0.28em] uppercase text-muted-foreground mb-4">
          A note to sit with
        </p>
        <p className="font-display text-xl sm:text-2xl leading-relaxed text-foreground/90">
          {mirror.note}
        </p>
      </div>

      <div className="flex flex-col items-center gap-3 pb-8">
        <button
          type="button"
          onClick={saveSketch}
          disabled={saved}
          className="inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm tracking-[0.18em] uppercase transition-calm disabled:opacity-60"
          style={{ background: "var(--gradient-thread)", color: "oklch(0.14 0.04 270)", boxShadow: "var(--shadow-glow)" }}
        >
          {saved ? "Kept as a sketch" : "Keep this sketch"}
        </button>
        <Link
          to="/modes"
          className="text-xs tracking-[0.22em] uppercase text-muted-foreground hover:text-foreground transition-calm"
        >
          Open the Loom workspace →
        </Link>
      </div>
    </section>
  );
}
