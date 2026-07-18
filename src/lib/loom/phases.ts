export type WeavingPhaseId = "intention" | "delegation" | "return" | "automation" | "flow";

export interface WeavingPhase {
  id: WeavingPhaseId;
  label: string;
  shortLabel: string;
  description: string;
}

export const WEAVING_PHASES: WeavingPhase[] = [
  {
    id: "intention",
    label: "Intention",
    shortLabel: "Name",
    description: "The thread begins as a plain-language intention. No pressure to be polished; the Loom can hold a messy beginning.",
  },
  {
    id: "delegation",
    label: "Delegation",
    shortLabel: "Light",
    description: "The Loom lights the agents whose roles match the signal, then sequences the work so the mind does not have to hold all doors open at once.",
  },
  {
    id: "return",
    label: "Return",
    shortLabel: "Gather",
    description: "Each agent returns a small, structured artifact: a pattern, draft, vessel, adaptation, or next move.",
  },
  {
    id: "automation",
    label: "Automation",
    shortLabel: "Optional",
    description: "Nothing runs away with the thread. Automation is optional, inspectable, and only added when the user chooses it.",
  },
  {
    id: "flow",
    label: "Flow",
    shortLabel: "Move",
    description: "The output becomes a gentle next path: clear enough to act on, loose enough to remain alive.",
  },
];
