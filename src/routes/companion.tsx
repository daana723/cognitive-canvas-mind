import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ThreadBackground } from "@/components/loom/ThreadBackground";
import { getLocalCognitiveContext } from "@/lib/cognition/context";
import { patternMemoryStore } from "@/lib/cognition/memory";
import { cognitiveStateStore } from "@/lib/cognition/state";
import {
  COGNITIVE_MODE_DESCRIPTIONS,
  DEFAULT_COGNITIVE_STATE,
  COGNITIVE_MODE_LABELS,
  type CognitiveState,
  type PatternMemoryEntry,
} from "@/lib/cognition/types";
import { loomClient } from "@/lib/api/loomClient";
import type { ModuleRunOutput } from "@/lib/data/types";

export const Route = createFileRoute("/companion")({
  head: () => ({
    meta: [
      { title: "Companion - Nonlinear Studio" },
      {
        name: "description",
        content:
          "A local-first ND-aware companion for creative guidance, state awareness, and small next steps.",
      },
    ],
  }),
  component: CompanionRoute,
});

const SUPPORT_NEEDS: Array<{ value: CognitiveState["supportNeed"]; label: string }> = [
  { value: "structure", label: "Structure" },
  { value: "micro-steps", label: "Micro-steps" },
  { value: "decision-help", label: "Decision help" },
  { value: "encouragement", label: "Encouragement" },
  { value: "decompression", label: "Decompression" },
];

const STARTER_PROMPTS = [
  "I have too many ideas and cannot choose the next one.",
  "Help me turn this messy thread into one clear next action.",
  "I am avoiding something important and need a gentle starting point.",
];

function CompanionRoute() {
  const [question, setQuestion] = useState(STARTER_PROMPTS[0]);
  const [state, setState] = useState<CognitiveState>(DEFAULT_COGNITIVE_STATE);
  const [output, setOutput] = useState<ModuleRunOutput | null>(null);
  const [memories, setMemories] = useState<PatternMemoryEntry[]>([]);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setState(cognitiveStateStore.load());
    setMemories(patternMemoryStore.list(6));
  }, []);

  const canAsk = useMemo(() => question.trim().length > 0 && !running, [question, running]);

  async function askCompanion() {
    if (!canAsk) return;
    setRunning(true);
    setError(null);
    const savedState = cognitiveStateStore.save(state);
    setState(savedState);
    const result = await loomClient.askCompanion({
      question,
      cognitiveContext: getLocalCognitiveContext(),
    });
    if (result.ok) {
      setOutput(result.data);
      patternMemoryStore.add({
        source: "companion",
        mode: savedState.mode,
        observation: `Companion asked while ${savedState.mode}: ${result.data.summary}`,
      });
      setMemories(patternMemoryStore.list(6));
    } else {
      setError(result.message);
    }
    setRunning(false);
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "var(--gradient-aurora, radial-gradient(1200px 800px at 20% 10%, oklch(0.28 0.08 285 / 0.6), transparent), radial-gradient(900px 700px at 90% 90%, oklch(0.25 0.09 220 / 0.5), transparent))",
        }}
      />
      <ThreadBackground />

      <section className="relative z-10 mx-auto max-w-6xl px-6 py-8">
        <a
          href="/"
          className="inline-flex items-center gap-3 text-[11px] tracking-[0.24em] uppercase text-muted-foreground hover:text-foreground transition-calm"
        >
          &lt;- Studio
        </a>

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
          <div>
            <p className="text-[11px] tracking-[0.32em] uppercase text-muted-foreground">
              Ask your ND companion
            </p>
            <h1 className="mt-4 font-display text-5xl leading-tight sm:text-6xl">
              A companion that learns your creative weather.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
              The Companion holds your current state, recent patterns, and creative intention in one
              place. It gives guidance for the next humane move, not a verdict about who you are.
            </p>

            <div className="mt-8 glass-panel rounded-3xl p-5 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-[11px] tracking-[0.24em] uppercase text-muted-foreground">
                    Current state
                  </span>
                  <select
                    value={state.mode}
                    onChange={(event) =>
                      setState((current) => ({
                        ...current,
                        mode: event.target.value as CognitiveState["mode"],
                      }))
                    }
                    className="mt-2 w-full rounded-xl bg-background/40 p-3 text-sm outline-none ring-1 ring-border/40 focus:ring-2 focus:ring-thread/60 transition-calm"
                  >
                    {Object.entries(COGNITIVE_MODE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {COGNITIVE_MODE_DESCRIPTIONS[state.mode]}
                  </p>
                </label>

                <label className="block">
                  <span className="text-[11px] tracking-[0.24em] uppercase text-muted-foreground">
                    Support need
                  </span>
                  <select
                    value={state.supportNeed}
                    onChange={(event) =>
                      setState((current) => ({
                        ...current,
                        supportNeed: event.target.value as CognitiveState["supportNeed"],
                      }))
                    }
                    className="mt-2 w-full rounded-xl bg-background/40 p-3 text-sm outline-none ring-1 ring-border/40 focus:ring-2 focus:ring-thread/60 transition-calm"
                  >
                    {SUPPORT_NEEDS.map((need) => (
                      <option key={need.value} value={need.value}>
                        {need.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {[
                  ["energy", "Energy"],
                  ["focus", "Focus"],
                  ["overwhelm", "Overwhelm"],
                ].map(([key, label]) => (
                  <label key={key} className="block">
                    <span className="flex justify-between text-[11px] tracking-[0.18em] uppercase text-muted-foreground">
                      {label}
                      <span>{state[key as "energy" | "focus" | "overwhelm"]}/5</span>
                    </span>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={state[key as "energy" | "focus" | "overwhelm"]}
                      onChange={(event) =>
                        setState((current) => ({ ...current, [key]: Number(event.target.value) }))
                      }
                      className="mt-2 w-full accent-[color:var(--thread)]"
                    />
                  </label>
                ))}
              </div>

              <label className="mt-5 block">
                <span className="text-[11px] tracking-[0.24em] uppercase text-muted-foreground">
                  Context note
                </span>
                <input
                  value={state.note ?? ""}
                  onChange={(event) =>
                    setState((current) => ({ ...current, note: event.target.value }))
                  }
                  placeholder="A tiny note about what is happening right now."
                  className="mt-2 w-full rounded-xl bg-background/40 p-3 text-sm outline-none ring-1 ring-border/40 focus:ring-2 focus:ring-thread/60 transition-calm"
                />
              </label>
            </div>

            <div className="mt-6 glass-panel rounded-3xl p-5 sm:p-6">
              <div className="mb-4 flex flex-wrap gap-2">
                {STARTER_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => setQuestion(prompt)}
                    className="rounded-full border border-border/40 px-3 py-2 text-xs text-muted-foreground transition-calm hover:border-thread/60 hover:text-foreground"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
              <label className="block">
                <span className="text-[11px] tracking-[0.24em] uppercase text-muted-foreground">
                  What should the Companion hold with you?
                </span>
                <textarea
                  rows={6}
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  className="mt-2 w-full resize-none rounded-2xl bg-background/40 p-4 text-sm leading-relaxed outline-none ring-1 ring-border/40 focus:ring-2 focus:ring-thread/60 transition-calm"
                />
              </label>
              <div className="mt-5 flex items-center justify-between gap-4">
                <p className="text-xs text-muted-foreground">
                  Local memory first. LM Studio only when enabled.
                </p>
                <button
                  type="button"
                  onClick={askCompanion}
                  disabled={!canAsk}
                  className="rounded-full px-6 py-3 text-sm tracking-[0.22em] uppercase disabled:opacity-40 transition-calm"
                  style={{ background: "var(--gradient-thread)", color: "oklch(0.14 0.05 275)" }}
                >
                  {running ? "Listening..." : "Ask Companion"}
                </button>
              </div>
              {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
            </div>
          </div>

          <aside className="space-y-5">
            <div className="glass-panel rounded-3xl p-5 sm:p-6">
              <p className="text-[11px] tracking-[0.24em] uppercase text-muted-foreground">
                Pattern memory
              </p>
              <div className="mt-4 space-y-3">
                {memories.length ? (
                  memories.map((memory) => (
                    <div key={memory.id} className="rounded-2xl border border-border/30 p-4">
                      <p className="text-sm leading-relaxed text-foreground/90">
                        {memory.observation}
                      </p>
                      <p className="mt-2 text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
                        {memory.source} {memory.mode ? `- ${memory.mode}` : ""}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    No saved patterns yet. The first few runs will become small orientation stars.
                  </p>
                )}
              </div>
            </div>

            {output && (
              <div className="glass-panel rounded-3xl p-5 sm:p-6 fade-up">
                <p className="text-[11px] tracking-[0.24em] uppercase text-muted-foreground">
                  Companion return
                </p>
                <h2 className="mt-3 font-display text-2xl">{output.summary}</h2>
                <div className="mt-5 space-y-4">
                  {output.sections.map((section) => (
                    <div key={section.heading}>
                      <p className="text-[10px] tracking-[0.24em] uppercase text-thread">
                        {section.heading}
                      </p>
                      <ul className="mt-2 space-y-2">
                        {section.bullets.map((bullet, index) => (
                          <li key={index} className="text-sm leading-relaxed text-foreground/90">
                            - {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                {output.nextMoves.length > 0 && (
                  <div className="mt-5 border-t border-border/30 pt-4">
                    <p className="text-[10px] tracking-[0.24em] uppercase text-thread">
                      Next moves
                    </p>
                    <ol className="mt-2 list-decimal list-inside space-y-2">
                      {output.nextMoves.map((move, index) => (
                        <li key={index} className="text-sm leading-relaxed text-foreground/90">
                          {move}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}
