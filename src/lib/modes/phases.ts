/**
 * Narrative Phases — story-based, non-hierarchical.
 * The user picks the phase that fits where they currently are.
 * No progression is implied; phases recur and overlap.
 */

export type PhaseId = "initiation" | "expansion" | "integration" | "synthesis";

export interface NarrativePhase {
  id: PhaseId;
  label: string;
  essence: string;
  story: string;
}

export const PHASES: NarrativePhase[] = [
  {
    id: "initiation",
    label: "Initiation",
    essence: "Something is beginning.",
    story:
      "A first thread arrives. You don't fully know what it is yet — only that you're now holding it.",
  },
  {
    id: "expansion",
    label: "Expansion",
    essence: "The territory is widening.",
    story:
      "More threads appear. The shape is unclear because there are still many shapes possible.",
  },
  {
    id: "integration",
    label: "Integration",
    essence: "The pieces are finding each other.",
    story:
      "Threads start to recognize each other. Patterns settle. The work becomes coherent without becoming small.",
  },
  {
    id: "synthesis",
    label: "Synthesis",
    essence: "Something whole emerges.",
    story:
      "The work speaks in its own voice. You're not steering it anymore — you're following it home.",
  },
];

export const getPhase = (id: PhaseId) => PHASES.find((p) => p.id === id)!;
