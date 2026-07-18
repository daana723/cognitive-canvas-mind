/**
 * SPARK Reflection Facets
 *
 * Seven facets a nonlinear thinker might notice about their own cognition.
 * These are descriptive prompts for recognition — not traits, scores,
 * dimensions, or a profile. The user recognizes; the studio never assigns.
 */

export type FacetId =
  "attention" | "rhythm" | "feeling" | "sensing" | "understanding" | "making" | "deciding";

export interface Facet {
  id: FacetId;
  label: string;
  essence: string;
  description: string;
  poles: { low: string; high: string };
}

export const FACETS: Facet[] = [
  {
    id: "attention",
    label: "How attention moves",
    essence: "The shape of your focus across the day.",
    description:
      "Whether your attention darts between many possibilities or drops deep into one current at a time.",
    poles: { low: "Exploratory", high: "Immersive" },
  },
  {
    id: "rhythm",
    label: "How energy arrives",
    essence: "The rhythm of your working current.",
    description:
      "Whether your energy moves as a steady stream or arrives in waves of surge and rest.",
    poles: { low: "Wave-shaped", high: "Sustained" },
  },
  {
    id: "feeling",
    label: "How feeling shows up",
    essence: "How emotion carries information for you.",
    description:
      "Whether feelings arrive quickly and at volume, or settle slowly and reveal themselves in retrospect.",
    poles: { low: "Reflective", high: "Resonant" },
  },
  {
    id: "sensing",
    label: "How the world arrives",
    essence: "The aperture your senses hold open.",
    description:
      "Whether the room filters gently or comes in at high resolution — light, sound, texture, atmosphere.",
    poles: { low: "Filtered", high: "High-resolution" },
  },
  {
    id: "understanding",
    label: "How things land",
    essence: "The shape of how understanding takes hold.",
    description:
      "Whether new ideas arrive through sequence and steps, or through association and pattern.",
    poles: { low: "Sequential", high: "Associative" },
  },
  {
    id: "making",
    label: "How you make",
    essence: "How new things take form through you.",
    description:
      "Whether you refine deeply within a frame, or compose by bringing distant things into one room.",
    poles: { low: "Refining", high: "Synthesizing" },
  },
  {
    id: "deciding",
    label: "How choices land",
    essence: "How decisions crystallize.",
    description:
      "Whether you decide through structured analysis, or through felt sense and quiet knowing.",
    poles: { low: "Analytical", high: "Intuitive" },
  },
];

export const getFacet = (id: FacetId) => FACETS.find((f) => f.id === id)!;
