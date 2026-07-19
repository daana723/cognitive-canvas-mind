import type { SigilVariant } from "@/components/Sigil";
import type { AccessTier } from "@/lib/data/types";

export type LoomAgentId =
  "loom" | "research" | "content" | "product" | "marketing" | "avatar" | "operations";

export interface LoomAgent {
  id: LoomAgentId;
  name: string;
  role: string;
  sigil: SigilVariant;
  essence: string;
  access: AccessTier;
  capabilities: string[];
}

export const LOOM_AGENTS: LoomAgent[] = [
  {
    id: "loom",
    name: "The Loom",
    role: "Orchestrator",
    sigil: "loom",
    essence: "Receives intention, holds the thread, and delegates without hurry.",
    access: "free",
    capabilities: ["intention-weaving", "agent-routing", "flow-shaping"],
  },
  {
    id: "research",
    name: "Research",
    role: "Pattern scout",
    sigil: "eye",
    essence: "Listens to the field and surfaces the useful signal.",
    access: "free",
    capabilities: ["pattern-scan", "question-framing", "context-map"],
  },
  {
    id: "content",
    name: "Content",
    role: "Form weaver",
    sigil: "weave",
    essence: "Translates inner signal into clear drafts and publishable shapes.",
    access: "studio",
    capabilities: ["drafting", "editorial-shaping", "content-series"],
  },
  {
    id: "product",
    name: "Product",
    role: "Vessel maker",
    sigil: "vessel",
    essence: "Shapes containers for ideas to become offerings, templates, or tools.",
    access: "studio",
    capabilities: ["offer-architecture", "template-design", "scope-clarity"],
  },
  {
    id: "marketing",
    name: "Marketing",
    role: "Signal carrier",
    sigil: "spiral",
    essence: "Carries the signal outward gently, without urgency or performance pressure.",
    access: "studio",
    capabilities: ["launch-copy", "platform-adaptation", "audience-bridge"],
  },
  {
    id: "avatar",
    name: "Avatar",
    role: "Presence keeper",
    sigil: "crown",
    essence: "Holds faceless presence, voice, and symbolic coherence.",
    access: "plus",
    capabilities: ["voice-system", "persona-map", "visual-presence"],
  },
  {
    id: "operations",
    name: "Operations",
    role: "Quiet machinery",
    sigil: "node",
    essence: "Tends the small systems beneath the work so flow can stay spacious.",
    access: "plus",
    capabilities: ["next-actions", "cadence", "system-maintenance"],
  },
];

export const getLoomAgent = (id: LoomAgentId) => LOOM_AGENTS.find((agent) => agent.id === id);
