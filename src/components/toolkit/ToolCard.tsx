import { useState } from "react";
import type { ToolDefinition } from "@/lib/toolkit/tools";
import type { DimensionScores } from "@/lib/spark/scoring";
import type { Translation } from "@/lib/spark/translation";

interface Props {
  tool: ToolDefinition;
  scores: DimensionScores;
  translation: Translation;
}

export function ToolCard({ tool, scores, translation }: Props) {
  const [open, setOpen] = useState(false);
  const prompts = tool.prompts(scores, translation);

  return (
    <article
      className={
        "glass-panel rounded-2xl transition-calm " +
        (open ? "p-8" : "p-6 hover:-translate-y-0.5")
      }
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-4 text-left outline-none"
      >
        <div className="min-w-0">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--gradient-thread)" }} />
            <span className="text-[10px] tracking-[0.24em] uppercase text-muted-foreground">
              Tuned to your profile
            </span>
          </div>
          <h3 className="font-display text-2xl text-foreground">{tool.name}</h3>
          <p className="mt-2 text-sm text-muted-foreground italic">{tool.essence}</p>
        </div>
        <span
          className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs transition-calm"
          style={{
            borderColor: "oklch(0.55 0.05 280 / 0.4)",
            transform: open ? "rotate(45deg)" : "none",
          }}
          aria-hidden
        >
          +
        </span>
      </button>

      {open && (
        <div className="mt-8 space-y-6 fade-up">
          <p className="text-sm text-foreground/80 leading-relaxed">{tool.description}</p>
          <ol className="space-y-4">
            {prompts.map((p, i) => (
              <li key={i} className="flex gap-4">
                <span
                  className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] tracking-wider"
                  style={{
                    background: "oklch(0.24 0.05 278 / 0.6)",
                    border: "1px solid oklch(0.55 0.05 280 / 0.4)",
                    color: "oklch(0.78 0.04 280)",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-base leading-relaxed text-foreground/90">{p}</p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </article>
  );
}