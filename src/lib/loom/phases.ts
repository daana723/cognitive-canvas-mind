export interface WeavingPhase {
  id: "intention" | "delegation" | "return" | "automation" | "flow";
  label: string;
  essence: string;
}

export const WEAVING_PHASES: WeavingPhase[] = [
  {
    id: "intention",
    label: "Intention",
    essence: "Bring the messy thread. Say what you're reaching for.",
  },
  {
    id: "delegation",
    label: "Delegation",
    essence: "The Loom reads the thread and lights the right agents.",
  },
  {
    id: "return",
    label: "Return",
    essence: "Each agent returns a structured piece of the plan.",
  },
  {
    id: "automation",
    label: "Automation",
    essence: "Repeat weaves become templates you can re-run.",
  },
  {
    id: "flow",
    label: "Flow",
    essence: "The work moves without you holding every strand.",
  },
];