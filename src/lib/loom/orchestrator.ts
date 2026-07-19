import { LOOM_AGENTS, type LoomAgentId } from "@/lib/loom/agents";
import { LOOM_PHASES } from "@/lib/loom/phases";

export interface WeaveInput {
  intention: string;
  tags?: string[];
}

export interface WeaveAgentStep {
  agentId: LoomAgentId;
  name: string;
  role: string;
  reason: string;
  expectedArtifacts: string[];
}

export interface WeavePlan {
  id: string;
  intention: string;
  summary: string;
  steps: WeaveAgentStep[];
  phases: typeof LOOM_PHASES;
  accessNote: string;
  createdAt: string;
}

const ROUTING: Record<Exclude<LoomAgentId, "loom">, string[]> = {
  research: ["research", "trend", "market", "audience", "pattern", "question", "context"],
  content: ["content", "draft", "post", "article", "script", "newsletter", "write"],
  product: ["product", "offer", "template", "course", "tool", "system", "package"],
  marketing: ["launch", "market", "platform", "social", "signal", "campaign", "audience"],
  avatar: ["avatar", "persona", "voice", "brand", "faceless", "identity", "presence"],
  operations: ["plan", "workflow", "ops", "organize", "schedule", "system", "next"],
};

const ARTIFACTS: Record<Exclude<LoomAgentId, "loom">, string[]> = {
  research: ["pattern notes", "clarifying questions", "field map"],
  content: ["draft spine", "tone notes", "publishable outline"],
  product: ["offer container", "scope edges", "first version checklist"],
  marketing: ["signal angle", "platform bridge", "soft launch steps"],
  avatar: ["voice anchors", "presence rules", "persona coherence notes"],
  operations: ["next three moves", "low-friction cadence", "maintenance list"],
};

const getWords = (input: WeaveInput) =>
  `${input.intention} ${(input.tags ?? []).join(" ")}`.toLowerCase();

const scoreAgent = (agentId: Exclude<LoomAgentId, "loom">, text: string) =>
  ROUTING[agentId].reduce((score, keyword) => score + (text.includes(keyword) ? 1 : 0), 0);

export function weave(input: WeaveInput): WeavePlan {
  const intention = input.intention.trim();
  const text = getWords(input);
  const scored = (Object.keys(ROUTING) as Exclude<LoomAgentId, "loom">[])
    .map((agentId) => ({ agentId, score: scoreAgent(agentId, text) }))
    .sort((a, b) => b.score - a.score);

  const selected = scored.filter((item) => item.score > 0).slice(0, 3);
  const fallback =
    selected.length > 0
      ? selected
      : [
          { agentId: "research" as const, score: 0 },
          { agentId: "operations" as const, score: 0 },
        ];

  const steps = fallback.map(({ agentId, score }) => {
    const agent = LOOM_AGENTS.find((item) => item.id === agentId);
    if (!agent) throw new Error(`Unknown Loom agent: ${agentId}`);

    return {
      agentId,
      name: agent.name,
      role: agent.role,
      reason:
        score > 0
          ? `${agent.name} matched the strongest signal in this intention.`
          : `${agent.name} will hold the first clear questions while the thread settles.`,
      expectedArtifacts: ARTIFACTS[agentId],
    };
  });

  return {
    id: `weave-${Date.now()}`,
    intention,
    summary:
      "The Loom holds the thread: start with clarity, then let the right agents return material you can shape.",
    steps,
    phases: LOOM_PHASES,
    accessNote:
      "This local weave is free. Creator Studio output workflows are marked for future paid access, but no payment wall is active yet.",
    createdAt: new Date().toISOString(),
  };
}
