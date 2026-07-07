import { ResonanceScale } from "./ResonanceScale";
import { getFacet } from "@/lib/spark/facets";
import type { Prompt, Resonance } from "@/lib/spark/prompts";

interface Props {
  prompt: Prompt;
  value: Resonance | undefined;
  onChange: (v: Resonance) => void;
}

export function ReflectionCard({ prompt, value, onChange }: Props) {
  const facet = getFacet(prompt.facet);
  return (
    <article className="glass-panel relative rounded-3xl px-6 py-10 sm:px-12 sm:py-14 fade-up">
      <div className="mb-8 flex items-center gap-3">
        <span className="h-2 w-2 rounded-full breathe" style={{ background: "var(--gradient-thread)" }} />
        <span className="text-[11px] tracking-[0.24em] uppercase text-muted-foreground">
          {facet.label}
        </span>
      </div>
      <h2 className="font-display text-2xl sm:text-4xl leading-tight text-foreground">
        {prompt.prompt}
      </h2>
      <p className="mt-4 text-sm text-muted-foreground italic">{facet.essence}</p>
      <div className="mt-12">
        <ResonanceScale value={value} onChange={onChange} />
      </div>
      <p className="mt-6 text-[10px] tracking-[0.22em] uppercase text-muted-foreground/70 text-center">
        Choose what most rings true — nothing is right or wrong
      </p>
    </article>
  );
}
