import { ResonanceScale } from "./ResonanceScale";
import { getCurrent } from "@/lib/spark/currents";
import type { CurrentPrompt } from "@/lib/spark/currentPrompts";
import type { Resonance } from "@/lib/spark/prompts";

interface Props {
  prompt: CurrentPrompt;
  value: Resonance | undefined;
  onChange: (v: Resonance) => void;
}

export function CurrentCard({ prompt, value, onChange }: Props) {
  const c = getCurrent(prompt.current);
  return (
    <article className="glass-panel relative rounded-3xl px-6 py-10 sm:px-12 sm:py-14 fade-up">
      <div className="mb-8 flex items-center gap-3">
        <span className="h-2 w-2 rounded-full breathe" style={{ background: "var(--gradient-thread)" }} />
        <span className="text-[11px] tracking-[0.24em] uppercase text-muted-foreground">
          The {c.label} current
        </span>
      </div>
      <h2 className="font-display text-2xl sm:text-4xl leading-tight text-foreground">
        {prompt.prompt}
      </h2>
      <p className="mt-4 text-sm text-muted-foreground italic">{c.essence}</p>
      <div className="mt-12">
        <ResonanceScale value={value} onChange={onChange} />
      </div>
    </article>
  );
}
