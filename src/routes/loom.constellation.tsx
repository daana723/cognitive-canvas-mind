import { createFileRoute, Link } from "@tanstack/react-router";
import { Sigil } from "@/components/loom/Sigil";
import { LOOM_AGENTS, modulesForAgent } from "@/lib/loom/agents";

export const Route = createFileRoute("/loom/constellation")({
  component: LoomConstellationPage,
});

function LoomConstellationPage() {
  return (
    <section className="relative z-10 mx-auto max-w-6xl px-6 pt-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground">Seven roles, one thread</p>
        <h1 className="mt-4 font-display text-5xl leading-[1.05] sm:text-6xl">
          The <span className="text-thread italic">agent constellation</span>.
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground">
          Each agent is a view over the local Loom modules. The Loom orchestrates; the modules return structured creative artifacts.
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {LOOM_AGENTS.map((agent) => {
          const modules = modulesForAgent(agent);
          return (
            <article key={agent.id} className="glass-panel rounded-2xl p-5 transition-calm hover:-translate-y-1" style={{ borderColor: agent.accent }}>
              <div className="flex items-start gap-4">
                <div className="rounded-2xl border border-border/50 p-3" style={{ color: agent.accent }}>
                  <Sigil variant={agent.sigil} className={agent.id === "loom" ? "h-16 w-16" : "h-12 w-12"} />
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.24em] uppercase text-muted-foreground">{agent.role}</p>
                  <h2 className="font-display text-3xl">{agent.label}</h2>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{agent.essence}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {agent.capabilities.map((capability) => (
                  <span key={capability} className="rounded-full border border-border/50 px-3 py-1 text-xs text-muted-foreground">
                    {capability}
                  </span>
                ))}
              </div>
              <div className="mt-5 space-y-2">
                {modules.map((module) => module && (
                  <Link key={module.id} to="/loom/$moduleId" params={{ moduleId: module.id }} className="block rounded-xl border border-border/50 p-3 transition-calm hover:border-primary/60">
                    <p className="font-display text-xl">{module.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{module.blurb}</p>
                  </Link>
                ))}
                {modules.length === 0 && (
                  <Link to={agent.id === "avatar" ? "/spark" : "/loom"} className="block rounded-xl border border-border/50 p-3 text-sm text-muted-foreground transition-calm hover:border-primary/60">
                    {agent.id === "avatar" ? "Avatar coherence is held through SPARK reflection for now." : "The Loom owns orchestration rather than a single module."}
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
