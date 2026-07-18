import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ThreadProgress } from "@/components/spark/ThreadProgress";
import { ReflectionCard } from "@/components/spark/ReflectionCard";
import { PROMPTS, type Resonance } from "@/lib/spark/prompts";
import { sparkResponsesStore } from "@/lib/spark/store";
import type { Responses } from "@/lib/spark/resonance";

export const Route = createFileRoute("/spark/reflect")({
  head: () => ({
    meta: [
      { title: "SPARK reflection — Nonlinear Studio" },
      { name: "description", content: "A guided reflection, one prompt at a time." },
    ],
  }),
  component: ReflectPage,
});

function ReflectPage() {
  const navigate = useNavigate();
  const [responses, setResponses] = useState<Responses>({});
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = sparkResponsesStore.load();
    setResponses(stored);
    const answered = Object.keys(stored).length;
    setIndex(Math.min(answered, PROMPTS.length - 1));
    setReady(true);
  }, []);

  const current = PROMPTS[index];
  const value = current ? responses[current.id] : undefined;
  const answeredCount = Object.keys(responses).length;
  const isLast = index >= PROMPTS.length - 1;

  const onAnswer = (v: Resonance) => {
    const next = { ...responses, [current.id]: v };
    setResponses(next);
    sparkResponsesStore.save(next);
    setTimeout(() => {
      if (isLast) navigate({ to: "/spark/currents" });
      else setIndex(index + 1);
    }, 280);
  };

  if (!ready) return null;

  return (
    <section className="mx-auto max-w-3xl px-6 pt-6">
      <div className="space-y-8">
        <ThreadProgress current={index + 1} total={PROMPTS.length} />
        <ReflectionCard prompt={current} value={value} onChange={onAnswer} />
        <div className="flex items-center justify-between text-xs tracking-[0.18em] uppercase">
          <button
            onClick={() => setIndex(Math.max(0, index - 1))}
            disabled={index === 0}
            className="text-muted-foreground hover:text-foreground disabled:opacity-30 transition-calm"
          >
            ← Back
          </button>
          <span className="text-muted-foreground italic">
            {value ? "Recording…" : "Choose what most rings true"}
          </span>
          {answeredCount >= PROMPTS.length ? (
            <Link
              to="/spark/currents"
              className="text-thread hover:text-foreground transition-calm"
            >
              Continue →
            </Link>
          ) : (
            <span className="opacity-0">·</span>
          )}
        </div>
      </div>
    </section>
  );
}
