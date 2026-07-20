import type { AgentId } from "@/lib/data/types";

export type SigilVariant = "loom" | "node" | "spiral" | "eye" | "weave" | "vessel" | "crown";

export interface AgentDef {
  id: AgentId;
  label: string;
  role: string;
  sigil: SigilVariant;
  essence: string;
  accent: string;
  /** IDs into LOOM_MODULES. Empty for pure orchestrators. */
  moduleIds: string[];
  /** Keywords the orchestrator uses to light this agent up. */
  keywords: string[];
}

export const AGENTS: AgentDef[] = [
  {
    id: "loom",
    label: "The Loom",
    role: "Orchestrator",
    sigil: "loom",
    essence: "Receives intention. Weaves direction.",
    accent: "oklch(0.78 0.20 290)",
    moduleIds: [],
    keywords: [],
  },
  {
    id: "research",
    label: "Research",
    role: "Listens to the field",
    sigil: "eye",
    essence: "Surfaces patterns and adjacent signals.",
    accent: "oklch(0.75 0.16 220)",
    moduleIds: ["signal-collapse", "serendipity-lab"],
    keywords: [
      "research",
      "explore",
      "understand",
      "study",
      "signal",
      "pattern",
      "scattered",
      "messy",
      "field",
      "collect",
      "notes",
      "reading",
      "adjacent",
      "inspiration",
      "reference",
    ],
  },
  {
    id: "content",
    label: "Content",
    role: "Translates signal into form",
    sigil: "weave",
    essence: "Shapes rough material into publishable form without flattening it.",
    accent: "oklch(0.78 0.18 320)",
    moduleIds: ["editorial"],
    keywords: [
      "write",
      "essay",
      "article",
      "post",
      "draft",
      "edit",
      "editorial",
      "voice",
      "tone",
      "story",
      "narrative",
      "publish",
      "newsletter",
      "content",
      "copy",
    ],
  },
  {
    id: "product",
    label: "Product",
    role: "Shapes vessels for the work",
    sigil: "vessel",
    essence: "Assembles the small artifacts a release actually needs.",
    accent: "oklch(0.76 0.17 200)",
    moduleIds: ["launch-packets"],
    keywords: [
      "product",
      "ship",
      "launch",
      "release",
      "offer",
      "package",
      "site",
      "landing",
      "artifact",
      "asset",
      "kit",
    ],
  },
  {
    id: "marketing",
    label: "Marketing",
    role: "Carries the signal outward",
    sigil: "spiral",
    essence: "Reshapes one piece per platform without losing its spine.",
    accent: "oklch(0.74 0.19 340)",
    moduleIds: ["platform-adapter"],
    keywords: [
      "market",
      "audience",
      "reach",
      "share",
      "distribute",
      "platform",
      "twitter",
      "x",
      "linkedin",
      "instagram",
      "social",
      "thread",
      "adapt",
      "channel",
    ],
  },
  {
    id: "avatar",
    label: "Avatar",
    role: "Holds the faceless presence",
    sigil: "crown",
    essence: "Coherence across every surface - voice, look, feel.",
    accent: "oklch(0.80 0.14 275)",
    moduleIds: ["personas"],
    keywords: [
      "brand",
      "identity",
      "avatar",
      "persona",
      "presence",
      "voice",
      "faceless",
      "aesthetic",
      "look",
      "feel",
      "coherence",
    ],
  },
  {
    id: "operations",
    label: "Operations",
    role: "Tends the quiet machinery",
    sigil: "node",
    essence: "Turns scattered activity into the next concrete moves.",
    accent: "oklch(0.72 0.14 250)",
    moduleIds: ["creative-operator"],
    keywords: [
      "operations",
      "system",
      "workflow",
      "process",
      "plan",
      "week",
      "schedule",
      "next",
      "move",
      "backlog",
      "organize",
      "log",
      "quarter",
      "month",
    ],
  },
];

export const getAgent = (id: AgentId): AgentDef | undefined => AGENTS.find((a) => a.id === id);

export const agentForModule = (moduleId: string): AgentDef | undefined =>
  AGENTS.find((a) => a.moduleIds.includes(moduleId));
