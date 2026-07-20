import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Sigil } from "@/components/loom/Sigil";
import { getLoomModule } from "@/lib/loom/modules";
import { agentForModule } from "@/lib/loom/agents";
import { loomClient } from "@/lib/api/loomClient";
import { dataAdapter } from "@/lib/data/adapter";
import type { LoomModule, LoomModuleInput, ModuleRunOutput } from "@/lib/data/types";

export const Route = createFileRoute("/loom/$moduleId")({
  loader: ({ params }) => {
    const mod = getLoomModule(params.moduleId);
    if (!mod) throw notFound();
    return { module: mod };
  },
  component: ModuleRunner,
  notFoundComponent: () => (
    <section className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="font-display text-3xl">No such module.</h1>
      <p className="mt-4 text-muted-foreground">
        <Link to="/loom/constellation" className="text-thread">
          Return to the constellation →
        </Link>
      </p>
    </section>
  ),
  errorComponent: ({ error }) => (
    <section className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="font-display text-3xl">Something in the weave broke.</h1>
      <p className="mt-4 text-muted-foreground">{String(error)}</p>
    </section>
  ),
});

function ModuleRunner() {
  const { module: mod } = Route.useLoaderData() as { module: LoomModule };
  const agent = agentForModule(mod.id);

  const [values, setValues] = useState<Record<string, unknown>>(() => {
    const seed: Record<string, unknown> = {};
    for (const input of mod.inputs) seed[input.id] = input.kind === "tags" ? "" : "";
    return seed;
  });
  const [output, setOutput] = useState<ModuleRunOutput | null>(null);
  const [running, setRunning] = useState(false);

  const filled = useMemo(
    () => mod.inputs.some((i: LoomModuleInput) => String(values[i.id] ?? "").trim().length > 0),
    [mod.inputs, values],
  );

  async function onRun() {
    setRunning(true);
    const inputs: Record<string, unknown> = {};
    for (const input of mod.inputs) {
      const raw = String(values[input.id] ?? "");
      inputs[input.id] =
        input.kind === "tags"
          ? raw
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : raw;
    }
    const res = await loomClient.run({ moduleId: mod.id, inputs });
    if (res.ok) {
      setOutput(res.data.output);
      await dataAdapter.saveModuleRun({
        moduleId: mod.id,
        inputs,
        output: res.data.output,
        ranAt: res.data.ranAt,
      });
    }
    setRunning(false);
  }

  return (
    <section className="mx-auto max-w-4xl px-6 pt-8 pb-24">
      <Link
        to="/loom/constellation"
        className="text-[11px] tracking-[0.24em] uppercase text-muted-foreground hover:text-foreground transition-calm"
      >
        ← Constellation
      </Link>

      <div className="mt-6 flex items-start gap-5">
        {agent && (
          <div style={{ color: agent.accent }}>
            <Sigil variant={agent.sigil} className="h-12 w-12" />
          </div>
        )}
        <div>
          <p className="text-[11px] tracking-[0.24em] uppercase text-muted-foreground">
            {agent?.label ?? "Loom module"}
          </p>
          <h1 className="mt-1 font-display text-4xl">{mod.label}</h1>
          <p className="mt-2 text-muted-foreground max-w-2xl">{mod.blurb}</p>
        </div>
      </div>

      <div className="mt-10 glass-panel rounded-3xl p-6 sm:p-8">
        <div className="grid gap-5">
          {mod.inputs.map((input: LoomModuleInput) => (
            <label key={input.id} className="block">
              <span className="text-[11px] tracking-[0.24em] uppercase text-muted-foreground">
                {input.label}
              </span>
              {input.kind === "longtext" ? (
                <textarea
                  rows={5}
                  value={String(values[input.id] ?? "")}
                  placeholder={input.placeholder}
                  onChange={(e) => setValues((v) => ({ ...v, [input.id]: e.target.value }))}
                  className="mt-2 w-full resize-none rounded-2xl bg-background/40 p-4 text-sm outline-none ring-1 ring-border/40 focus:ring-2 focus:ring-thread/60 transition-calm"
                />
              ) : input.kind === "select" ? (
                <select
                  value={String(values[input.id] ?? "")}
                  onChange={(e) => setValues((v) => ({ ...v, [input.id]: e.target.value }))}
                  className="mt-2 w-full rounded-xl bg-background/40 p-3 text-sm outline-none ring-1 ring-border/40 focus:ring-2 focus:ring-thread/60 transition-calm"
                >
                  <option value="">Choose…</option>
                  {(input.options ?? []).map((o: string) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  value={String(values[input.id] ?? "")}
                  placeholder={input.placeholder}
                  onChange={(e) => setValues((v) => ({ ...v, [input.id]: e.target.value }))}
                  className="mt-2 w-full rounded-xl bg-background/40 p-3 text-sm outline-none ring-1 ring-border/40 focus:ring-2 focus:ring-thread/60 transition-calm"
                />
              )}
            </label>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Local - LM Studio when enabled - saved to your device.
          </p>
          <button
            type="button"
            onClick={onRun}
            disabled={running || !filled}
            className="rounded-full px-6 py-3 text-sm tracking-[0.22em] uppercase disabled:opacity-40 transition-calm"
            style={{ background: "var(--gradient-thread)", color: "oklch(0.14 0.05 275)" }}
          >
            {running ? "Running…" : "Run module"}
          </button>
        </div>
      </div>

      {output && (
        <div className="mt-10 fade-up">
          <p className="text-[11px] tracking-[0.24em] uppercase text-muted-foreground">Return</p>
          <h2 className="mt-2 font-display text-2xl">{output.summary}</h2>

          <div className="mt-6 grid gap-4">
            {output.sections.map((s) => (
              <div key={s.heading} className="glass-panel rounded-2xl p-5">
                <p className="text-[10px] tracking-[0.24em] uppercase text-thread">{s.heading}</p>
                <ul className="mt-3 space-y-2">
                  {s.bullets.map((b, i) => (
                    <li key={i} className="text-sm leading-relaxed text-foreground/90">
                      — {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {output.nextMoves.length > 0 && (
            <div className="mt-6 glass-panel rounded-2xl p-5">
              <p className="text-[10px] tracking-[0.24em] uppercase text-thread">Next moves</p>
              <ol className="mt-3 space-y-2 list-decimal list-inside">
                {output.nextMoves.map((n, i) => (
                  <li key={i} className="text-sm leading-relaxed text-foreground/90">
                    {n}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
