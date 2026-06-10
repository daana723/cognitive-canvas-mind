/**
 * SPARK Assessment — Cognitive Dimensions
 *
 * Seven dimensions that together describe a cognitive signature.
 * These are descriptive, not diagnostic — translation language only.
 */

export type DimensionId =
  | "attention"
  | "energy"
  | "emotion"
  | "sensory"
  | "learning"
  | "creative"
  | "decision";

export interface Dimension {
  id: DimensionId;
  label: string;
  essence: string;        // one-line poetic summary
  description: string;    // a sentence of plain language
  poles: { low: string; high: string }; // descriptive endpoints
}

export const DIMENSIONS: Dimension[] = [
  {
    id: "attention",
    label: "Attention Style",
    essence: "How your focus moves through the world.",
    description:
      "Whether your attention darts between possibilities or locks into deep currents.",
    poles: { low: "Exploratory", high: "Immersive" },
  },
  {
    id: "energy",
    label: "Energy Pattern",
    essence: "The rhythm of your cognitive tides.",
    description:
      "Whether your energy moves in steady streams or arrives in surges and stillness.",
    poles: { low: "Pulsed", high: "Sustained" },
  },
  {
    id: "emotion",
    label: "Emotional Processing",
    essence: "How feeling becomes information.",
    description:
      "Whether emotion arrives quickly and vividly, or settles slowly into the background.",
    poles: { low: "Reflective", high: "Resonant" },
  },
  {
    id: "sensory",
    label: "Sensory Sensitivity",
    essence: "How the world arrives at your edges.",
    description:
      "Whether your senses filter gently or carry the room in full resolution.",
    poles: { low: "Filtered", high: "High-resolution" },
  },
  {
    id: "learning",
    label: "Learning Style",
    essence: "The shape of how understanding lands.",
    description:
      "Whether knowledge arrives through linear sequence or through association and pattern.",
    poles: { low: "Sequential", high: "Associative" },
  },
  {
    id: "creative",
    label: "Creative Style",
    essence: "How new things take form through you.",
    description:
      "Whether you refine within a frame or compose by recombining across worlds.",
    poles: { low: "Refining", high: "Synthesizing" },
  },
  {
    id: "decision",
    label: "Decision-Making",
    essence: "How choices crystallize.",
    description:
      "Whether you decide through analysis and structure, or through intuition and felt sense.",
    poles: { low: "Analytical", high: "Intuitive" },
  },
];

export const getDimension = (id: DimensionId) =>
  DIMENSIONS.find((d) => d.id === id)!;