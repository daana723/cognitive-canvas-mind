import { createFileRoute, Link } from "@tanstack/react-router";
import { Sigil } from "@/components/Sigil";
import { LOOM_AGENTS } from "@/lib/loom/agents";

export const Route = createFileRoute("/loom/constellation")({
  head: () => ({
    meta: [{ title: "Loom constellation - Nonlinear Studio" }],
  }),
  component: LoomConstellation,
});

function LoomConstellation() {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-10 pb-16">
      <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-5">
        One orchestrator, a constellation of agents
      </p>
      <h1 className="font-display text-5xl sm:text-6xl leading-[1.05]">
        Each agent has a role.{" "}
        <span className="text-thread italic">The Loom holds the thread.</span>
      </h1>

      <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/30 sm:grid-cols-2 lg:grid-cols-3">
        {LOOM_AGENTS.map((agent) => (
          <Link
            key={agent.id}
            to="/loom/$moduleId"
            params={{ moduleId: agentModuleId(agent.id) }}
            className={
              "group bg-card/60 p-8 backdrop-blur-sm transition-calm hover:bg-card/90 " +
              (agent.id === "loom" ? "sm:col-span-2 lg:col-span-1 lg:row-span-2" : "")
            }
          >
            <div className="flex items-start justify-between gap-4">
              <Sigil
                variant={agent.sigil}
                className={
                  "transition-calm group-hover:scale-110 " +
                  (agent.id === "loom" ? "h-14 w-14 text-thread" : "h-10 w-10 text-accent")
                }
              />
              <span className="rounded-full border border-border/60 px-3 py-1 text-[10px] tracking-[0.22em] uppercase text-muted-foreground">
                {agent.access}
              </span>
            </div>
            <div className="mt-8">
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                {agent.role}
              </p>
              <h2 className="mt-2 font-display text-2xl">{agent.name}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{agent.essence}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {agent.capabilities.map((capability) => (
                  <span
                    key={capability}
                    className="rounded-full border border-thread/30 px-3 py-1 text-[10px] text-foreground/80"
                  >
                    {capability}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function agentModuleId(agentId: string) {
  const map: Record<string, string> = {
    loom: "weave-intention",
    research: "research-brief",
    content: "content-draft",
    product: "product-vessel",
    marketing: "marketing-signal",
    avatar: "avatar-voice",
    operations: "ops-tending",
  };

  return map[agentId] ?? "weave-intention";
}
