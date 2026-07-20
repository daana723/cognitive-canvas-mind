import { AGENTS } from "@/lib/loom/agents";
import { LOOM_MODULES } from "@/lib/loom/modules";
import type { AgentId, WeavePlan, WeaveStep } from "@/lib/data/types";

export interface WeaveRequest {
  body: string;
  tags?: string[];
}

const tokenize = (s: string): string[] => s.toLowerCase().match(/[a-z]{3,}/g) ?? [];

/**
 * Deterministic, inspectable orchestrator. No LLM. No network.
 * Codex can swap this implementation later; the shape is the boundary.
 */
export function weave(req: WeaveRequest): WeavePlan {
  const body = req.body ?? "";
  const tags = (req.tags ?? []).map((t) => t.toLowerCase().trim()).filter(Boolean);
  const tokens = new Set([...tokenize(body), ...tags]);

  // Score each agent by keyword overlap.
  const scored = AGENTS.filter((a) => a.id !== "loom").map((a) => {
    let score = 0;
    for (const k of a.keywords) if (tokens.has(k)) score += 1;
    for (const t of tags) if (a.keywords.includes(t)) score += 2;
    return { agent: a, score };
  });

  let lit = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score);

  // Fallback: if nothing matched, light the default trio.
  if (lit.length === 0) {
    lit = ["research", "content", "operations"].map((id) => ({
      agent: AGENTS.find((a) => a.id === id)!,
      score: 0,
    }));
  }

  const steps: WeaveStep[] = [];
  for (const { agent } of lit) {
    for (const moduleId of agent.moduleIds) {
      const mod = LOOM_MODULES.find((m) => m.id === moduleId);
      if (!mod) continue;
      steps.push({
        agentId: agent.id,
        moduleId,
        why: `${agent.label} - ${mod.label}: ${mod.blurb}`,
      });
      break; // one lead module per agent keeps the plan legible
    }
  }

  const artifacts = steps.map((s) => {
    const mod = LOOM_MODULES.find((m) => m.id === s.moduleId);
    return mod ? `${mod.label} scaffold` : s.moduleId;
  });

  const agentsInOrder: AgentId[] = ["loom", ...lit.map((s) => s.agent.id)];

  return {
    intention: body.trim(),
    tags,
    agents: agentsInOrder,
    steps,
    artifacts,
    wovenAt: new Date().toISOString(),
  };
}
