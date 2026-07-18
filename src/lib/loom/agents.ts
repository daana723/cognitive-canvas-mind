import { LOOM_MODULES } from "@/lib/loom/modules";

export type SigilVariant = "loom" | "node" | "spiral" | "eye" | "weave" | "vessel" | "crown";

export type LoomAgentId =
  "loom" | "research" | "content" | "product" | "marketing" | "avatar" | "operations";

export interface LoomAgent {
  id: LoomAgentId;
  label: string;
  role: string;
  sigil: SigilVariant;
  essence: string;
  accent: string;
  moduleIds: string[];
  capabilities: string[];
}

export const LOOM_AGENTS: LoomAgent[] = [
  {
    id: "loom",
    label: "The Loom",
    role: "Orchestrator",
    sigil: "loom",
    essence:
      "Receives the intention, holds the thread, and decides which parts of the constellation should light up first.",
    accent: "oklch(0.84 0.16 215)",
    moduleIds: [],
    capabilities: ["read the thread", "sequence the work", "return a clear next path"],
  },
  {
    id: "research",
    label: "Research",
    role: "Pattern scout",
    sigil: "eye",
    essence:
      "Surfaces the field, the hidden tension, and the non-obvious bridge inside scattered material.",
    accent: "oklch(0.78 0.15 225)",
    moduleIds: ["signal-collapse", "serendipity-lab"],
    capabilities: ["collapse signal", "cross-pollinate ideas", "name useful patterns"],
  },
  {
    id: "content",
    label: "Content",
    role: "Signal translator",
    sigil: "weave",
    essence: "Turns inner signal into language, structure, voice, and publishable creative form.",
    accent: "oklch(0.78 0.2 290)",
    moduleIds: ["editorial", "creative-personas"],
    capabilities: ["shape drafts", "test voices", "turn raw notes into form"],
  },
  {
    id: "product",
    label: "Product",
    role: "Vessel maker",
    sigil: "vessel",
    essence: "Shapes the work into something people can use, receive, revisit, or carry forward.",
    accent: "oklch(0.76 0.16 155)",
    moduleIds: ["launch-packets"],
    capabilities: ["package releases", "define the vessel", "spot missing artifacts"],
  },
  {
    id: "marketing",
    label: "Marketing",
    role: "Gentle signal carrier",
    sigil: "spiral",
    essence: "Carries the signal outward without flattening it into performance or pressure.",
    accent: "oklch(0.82 0.14 35)",
    moduleIds: ["platform-adapter"],
    capabilities: ["adapt by platform", "preserve the spine", "make the signal legible"],
  },
  {
    id: "avatar",
    label: "Avatar",
    role: "Coherent presence",
    sigil: "crown",
    essence:
      "Holds faceless or semi-faceless presence with recognizable voice, boundaries, and rhythm.",
    accent: "oklch(0.82 0.14 320)",
    moduleIds: [],
    capabilities: [
      "link to SPARK reflection",
      "hold voice coherence",
      "protect creative boundaries",
    ],
  },
  {
    id: "operations",
    label: "Operations",
    role: "Quiet machinery",
    sigil: "node",
    essence:
      "Tends the next moves, energy fit, stop rules, and the practical underneath of creative work.",
    accent: "oklch(0.74 0.1 250)",
    moduleIds: ["creative-operator"],
    capabilities: ["choose next moves", "reduce load", "make the week workable"],
  },
];

export const getLoomAgent = (id: string) => LOOM_AGENTS.find((agent) => agent.id === id);

export const modulesForAgent = (agent: LoomAgent) =>
  agent.moduleIds
    .map((moduleId) => LOOM_MODULES.find((module) => module.id === moduleId))
    .filter(Boolean);
