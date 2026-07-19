import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import loomClient, { type LoomRunPacket } from "@/lib/api/loomClient";
import { getLoomModule } from "@/lib/loom/modules";

export const Route = createFileRoute("/loom/$moduleId")({
  head: () => ({
    meta: [{ title: "Loom module - Nonlinear Studio" }],
  }),
  component: LoomModulePage,
});

function LoomModulePage() {
  const { moduleId } = Route.useParams();
  const module = getLoomModule(moduleId);
  const initialInputs = useMemo(() => {
    const values: Record<string, string> = {};
    module?.inputs.forEach((input) => {
      values[input.id] = input.kind === "select" ? (input.options?.[0] ?? "") : "";
    });
    return values;
  }, [module]);
  const [inputs, setInputs] = useState(initialInputs);
  const [packet, setPacket] = useState<LoomRunPacket | null>(null);

  if (!module) {
    return (
      <section className="mx-auto max-w-3xl px-6 pt-10">
        <div className="glass-panel rounded-3xl p-8 text-center">
          <h1 className="font-display text-3xl">This thread is not registered yet.</h1>
          <Link to="/loom/constellation" className="mt-6 inline-block text-thread">
            Return to the constellation
          </Link>
        </div>
      </section>
    );
  }

  const runModule = async () => {
    const result = await loomClient.run({ moduleId: module.id, inputs });
    if (result.ok) setPacket(result.data);
  };

  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-6 pt-10 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-5">
          {module.access ?? "free"} module
        </p>
        <h1 className="font-display text-5xl leading-[1.05]">{module.label}</h1>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground">{module.blurb}</p>
        <p className="mt-5 text-sm italic text-muted-foreground">
          This is a local placeholder workflow. No external APIs are called.
        </p>
      </div>

      <div className="glass-panel rounded-3xl p-6 sm:p-8">
        <div className="space-y-5">
          {module.inputs.map((input) => (
            <label key={input.id} className="block">
              <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
                {input.label}
              </span>
              {input.kind === "longtext" ? (
                <textarea
                  value={inputs[input.id] ?? ""}
                  onChange={(event) =>
                    setInputs((current) => ({ ...current, [input.id]: event.target.value }))
                  }
                  className="mt-3 min-h-32 w-full rounded-2xl border border-border/60 bg-card/60 p-4 text-sm outline-none transition-calm focus:border-thread/70"
                  placeholder={input.placeholder}
                />
              ) : input.kind === "select" ? (
                <select
                  value={inputs[input.id] ?? input.options?.[0] ?? ""}
                  onChange={(event) =>
                    setInputs((current) => ({ ...current, [input.id]: event.target.value }))
                  }
                  className="mt-3 w-full rounded-full border border-border/60 bg-card/60 px-4 py-3 text-sm outline-none transition-calm focus:border-thread/70"
                >
                  {input.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  value={inputs[input.id] ?? ""}
                  onChange={(event) =>
                    setInputs((current) => ({ ...current, [input.id]: event.target.value }))
                  }
                  className="mt-3 w-full rounded-full border border-border/60 bg-card/60 px-4 py-3 text-sm outline-none transition-calm focus:border-thread/70"
                  placeholder={input.placeholder}
                />
              )}
            </label>
          ))}
        </div>
        <button
          type="button"
          onClick={runModule}
          className="mt-7 w-full rounded-full px-6 py-3 text-sm tracking-[0.18em] uppercase transition-calm"
          style={{
            background: "var(--gradient-thread)",
            color: "oklch(0.14 0.04 270)",
            boxShadow: "var(--shadow-glow)",
          }}
        >
          Run local module
        </button>
      </div>

      {packet && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 lg:col-span-2">
          <p className="text-[10px] tracking-[0.28em] uppercase text-muted-foreground">
            Structured return
          </p>
          <h2 className="mt-3 font-display text-3xl">{packet.output.title}</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {packet.output.summary}
          </p>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-xs tracking-[0.22em] uppercase text-muted-foreground">
                Artifacts
              </h3>
              <ul className="mt-3 space-y-2 text-sm">
                {packet.output.artifacts.map((artifact) => (
                  <li key={artifact}>{artifact}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs tracking-[0.22em] uppercase text-muted-foreground">
                Next moves
              </h3>
              <ul className="mt-3 space-y-2 text-sm">
                {packet.output.nextSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
