import { createFileRoute, Link } from "@tanstack/react-router";
import { Sigil } from "@/components/loom/Sigil";
import { AGENTS } from "@/lib/loom/agents";
import { LOOM_MODULES } from "@/lib/loom/modules";

export const Route = createFileRoute("/loom/constellation")({
  component: Constellation,
});

function Constellation() {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-8 pb-24">
      <p className="text-[11px] tracking-[0.32em] uppercase text-muted-foreground">
        The constellation
      </p>
      <h1 className="mt-4 font-display text-4xl sm:text-5xl">
        Seven agents. <span className="text-thread italic">One Loom.</span>
      </h1>
      <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
        The Loom is the orchestrator. Six specialist agents carry the work. Each
        agent owns one or more Loom modules — the practical scaffolds you can
        run directly, without a weave.
      </p>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {AGENTS.map((a) => {
          const mods = LOOM_MODULES.filter((m) => a.moduleIds.includes(m.id));
          return (
            <article
              key={a.id}
              className="glass-panel rounded-3xl p-6 transition-calm"
              style={{ boxShadow: `0 0 24px -12px ${a.accent}` }}
            >
              <div style={{ color: a.accent }}>
                <Sigil variant={a.sigil} className="h-12 w-12" />
              </div>
              <p className="mt-4 text-[10px] tracking-[0.24em] uppercase text-muted-foreground">
                {a.role}
              </p>
              <h2 className="mt-1 font-display text-2xl">{a.label}</h2>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {a.essence}
              </p>

              {mods.length > 0 ? (
                <ul className="mt-5 space-y-2">
                  {mods.map((m) => (
                    <li key={m.id}>
                      <Link
                        to="/loom/$moduleId"
                        params={{ moduleId: m.id }}
                        className="group flex items-center justify-between rounded-xl border border-border/40 px-3 py-2 hover:border-thread/60 transition-calm"
                      >
                        <span className="text-sm">{m.label}</span>
                        <span className="text-[10px] tracking-[0.24em] uppercase text-muted-foreground group-hover:text-thread transition-calm">
                          Open →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-5 text-xs italic text-muted-foreground">
                  Orchestrator only — no direct module. Reached through weaves.
                </p>
              )}
            </article>
          );
        })}
      </div>

      <div className="mt-16 glass-panel rounded-3xl p-6 sm:p-8">
        <p className="text-[11px] tracking-[0.24em] uppercase text-muted-foreground">
          The Codex seam
        </p>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-3xl">
          Every agent, every module, and every weave is deterministic and local
          today. The Loom exposes a single seam — <code className="text-thread">loomClient</code> —
          that a Codex backend can take over without changing a single component.
          The constellation is stable. The intelligence behind it is swappable.
        </p>
      </div>
    </section>
  );
}