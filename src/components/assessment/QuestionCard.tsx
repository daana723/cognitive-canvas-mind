import { LikertScale } from "./LikertScale";
import type { Question, LikertValue } from "@/lib/spark/questions";
import { getDimension } from "@/lib/spark/dimensions";

interface Props {
  question: Question;
  value: LikertValue | undefined;
  onChange: (v: LikertValue) => void;
}

export function QuestionCard({ question, value, onChange }: Props) {
  const dim = getDimension(question.dimension);
  return (
    <article
      key={question.id}
      className="glass-panel relative rounded-3xl px-6 py-10 sm:px-12 sm:py-14 fade-up"
    >
      <div className="mb-8 flex items-center gap-3">
        <span
          className="h-2 w-2 rounded-full breathe"
          style={{ background: "var(--gradient-thread)" }}
        />
        <span className="text-[11px] tracking-[0.24em] uppercase text-muted-foreground">
          {dim.label}
        </span>
      </div>

      <h2 className="font-display text-2xl sm:text-4xl leading-tight text-foreground">
        {question.prompt}
      </h2>

      <p className="mt-4 text-sm text-muted-foreground italic">{dim.essence}</p>

      <div className="mt-12">
        <LikertScale value={value} onChange={onChange} />
      </div>
    </article>
  );
}