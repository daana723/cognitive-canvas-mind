import { useState } from "react";
import type { WorkflowTemplate } from "@/lib/modes/workflows";

export function WorkflowTemplateView({ template }: { template: WorkflowTemplate }) {
  const [done, setDone] = useState<Record<number, boolean>>({});
  return (
    <article className="glass-panel rounded-3xl p-6 sm:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="font-display text-2xl text-foreground">{template.title}</h3>
        <span className="text-[10px] tracking-[0.26em] uppercase text-muted-foreground">
          {template.duration}
        </span>
      </div>
      <p className="mt-2 text-sm italic text-muted-foreground">{template.intent}</p>
      <ol className="mt-6 space-y-3">
        {template.steps.map((s, i) => {
          const checked = !!done[i];
          return (
            <li
              key={i}
              className="flex items-start gap-4 rounded-xl border border-border/40 bg-black/15 p-4"
            >
              <button
                type="button"
                onClick={() => setDone({ ...done, [i]: !checked })}
                aria-pressed={checked}
                className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-calm"
                style={{
                  borderColor: checked ? "transparent" : "oklch(0.55 0.05 280 / 0.5)",
                  background: checked ? "var(--gradient-thread)" : "transparent",
                }}
              >
                {checked && <span className="h-1.5 w-1.5 rounded-full bg-black" />}
              </button>
              <div>
                <div className="text-sm font-medium text-foreground">{s.title}</div>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </article>
  );
}
