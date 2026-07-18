import { LOOM_AGENTS, type LoomAgentId } from "@/lib/loom/agents";
import { getLoomModule } from "@/lib/loom/modules";
import { WEAVING_PHASES } from "@/lib/loom/phases";
import { normalizeTags, weaveIntentionRequestSchema } from "@/lib/loom/schemas";
import { createIdempotencyKey } from "@/lib/loom/execute";
import type {
  LoomExecutionMetadata,
  LoomModuleId,
  LoomRunOptions,
  WeaveIntentionRequest,
  WeavePlan,
} from "@/lib/loom/types";

const DEFAULT_TIMEOUT_MS = 2000;
const DEFAULT_MAX_RETRIES = 0;

const now = () => new Date().toISOString();

const createMetadata = (
  options: LoomRunOptions | undefined,
  payload: unknown,
  queuedAt: string,
  startedAt: string,
  completedAt: string,
): LoomExecutionMetadata => ({
  idempotencyKey: options?.idempotencyKey ?? createIdempotencyKey("weave", payload),
  providerId: options?.providerId ?? "local-deterministic",
  status: "succeeded",
  attempts: 1,
  maxRetries: options?.maxRetries ?? DEFAULT_MAX_RETRIES,
  timeoutMs: options?.timeoutMs ?? DEFAULT_TIMEOUT_MS,
  queuedAt,
  startedAt,
  completedAt,
  durationMs: Math.max(0, Date.parse(completedAt) - Date.parse(startedAt)),
  externalCalls: [],
});

const RULES: Array<{
  agentId: LoomAgentId;
  moduleIds: LoomModuleId[];
  keywords: string[];
  tags: string[];
  why: string;
}> = [
  {
    agentId: "research",
    moduleIds: ["signal-collapse", "serendipity-lab"],
    keywords: [
      "research",
      "pattern",
      "messy",
      "scattered",
      "unclear",
      "signal",
      "idea",
      "ideas",
      "trend",
      "field",
      "angle",
    ],
    tags: ["research", "signal", "ideas", "clarity"],
    why: "The intention asks for a clearer signal from a wide field.",
  },
  {
    agentId: "content",
    moduleIds: ["editorial", "creative-personas"],
    keywords: [
      "write",
      "draft",
      "content",
      "post",
      "article",
      "newsletter",
      "voice",
      "persona",
      "script",
      "story",
      "copy",
    ],
    tags: ["content", "writing", "voice"],
    why: "The thread wants language, structure, or a voice that can carry it.",
  },
  {
    agentId: "product",
    moduleIds: ["launch-packets"],
    keywords: [
      "product",
      "offer",
      "template",
      "tool",
      "build",
      "launch",
      "ship",
      "release",
      "package",
      "bundle",
    ],
    tags: ["product", "launch", "build"],
    why: "The work needs a vessel people can receive or use.",
  },
  {
    agentId: "marketing",
    moduleIds: ["platform-adapter"],
    keywords: [
      "market",
      "platform",
      "linkedin",
      "instagram",
      "substack",
      "youtube",
      "tiktok",
      "audience",
      "share",
      "promote",
    ],
    tags: ["marketing", "platform", "audience"],
    why: "The signal needs to travel outward without losing its spine.",
  },
  {
    agentId: "avatar",
    moduleIds: [],
    keywords: [
      "avatar",
      "faceless",
      "presence",
      "brand",
      "identity",
      "self",
      "mirror",
      "spark",
      "coherence",
    ],
    tags: ["avatar", "presence", "spark"],
    why: "The intention touches presence, self-trust, or coherent creative identity.",
  },
  {
    agentId: "operations",
    moduleIds: ["creative-operator"],
    keywords: [
      "plan",
      "next",
      "system",
      "routine",
      "workflow",
      "organize",
      "overwhelm",
      "week",
      "energy",
      "priority",
    ],
    tags: ["ops", "workflow", "planning"],
    why: "The thread needs fewer open loops and a workable next sequence.",
  },
];

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9\s-]/g, " ");

const wordsFrom = (value: string) => new Set(normalize(value).split(/\s+/).filter(Boolean));

const scoreRule = (rule: (typeof RULES)[number], words: Set<string>, tags: string[]) => {
  const keywordScore = rule.keywords.reduce(
    (score, keyword) => score + (words.has(keyword) ? 2 : 0),
    0,
  );
  const tagScore = rule.tags.reduce((score, tag) => score + (tags.includes(tag) ? 3 : 0), 0);
  return keywordScore + tagScore;
};

const artifactFor = (moduleId: LoomModuleId) => {
  const module = getLoomModule(moduleId);
  if (!module) return "A held thread note";
  switch (moduleId) {
    case "signal-collapse":
      return "A signal collapse brief";
    case "serendipity-lab":
      return "A cross-pollination experiment";
    case "editorial":
      return "An editorial frame";
    case "creative-personas":
      return "A persona voice set";
    case "launch-packets":
      return "A launch packet checklist";
    case "platform-adapter":
      return "A platform adaptation";
    case "creative-operator":
      return "A three-move operator plan";
    default:
      return module.label;
  }
};

export const weave = (request: WeaveIntentionRequest): WeavePlan => {
  const queuedAt = now();
  const startedAt = queuedAt;
  const parsed = weaveIntentionRequestSchema.parse(request);
  const intention = parsed.body.trim();
  const tags = normalizeTags(parsed.tags);
  const words = wordsFrom(`${intention} ${tags.join(" ")}`);

  const ranked = RULES.map((rule) => ({ rule, score: scoreRule(rule, words, tags) }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score);

  const chosen =
    ranked.length > 0
      ? ranked.slice(0, 4).map((entry) => entry.rule)
      : [RULES[0], RULES[1], RULES[5]];
  const agentIds = Array.from(
    new Set<LoomAgentId>(["loom", ...chosen.map((rule) => rule.agentId)]),
  );

  const steps = chosen.flatMap((rule) => {
    const agent = LOOM_AGENTS.find((item) => item.id === rule.agentId);
    if (!agent || rule.moduleIds.length === 0) return [];
    return rule.moduleIds.map((moduleId, index) => {
      const module = getLoomModule(moduleId);
      return {
        id: `${rule.agentId}:${moduleId}:${index + 1}`,
        agentId: rule.agentId,
        agentLabel: agent.label,
        moduleId,
        moduleLabel: module?.label ?? moduleId,
        why: rule.why,
      };
    });
  });

  const completedAt = now();
  const payload = { body: intention, tags };
  const meta = createMetadata(parsed.options, payload, queuedAt, startedAt, completedAt);

  return {
    weaveId: `weave-${meta.idempotencyKey}`,
    intention: intention || "A quiet unnamed intention",
    tags,
    agents: agentIds,
    steps,
    artifacts: steps.map((step) => artifactFor(step.moduleId)),
    phases: WEAVING_PHASES,
    summary: `The Loom holds the thread through ${agentIds.length - 1} lit agent${agentIds.length === 2 ? "" : "s"}: ${agentIds.slice(1).join(", ") || "research"}.`,
    nextAction:
      steps.length > 0
        ? "Return the action plan by running the lit modules in sequence."
        : "Begin with SPARK or add one clearer intention tag.",
    createdAt: completedAt,
    metadata: meta,
    externalCalls: [],
  };
};
