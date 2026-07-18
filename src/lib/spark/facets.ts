/**
 * SPARK — 5-dimension 2E framework.
 *
 * From ND-cognitive-OS SPARK_FRAMEWORK. Each dimension is scored 0–4
 * (averaged from Likert responses). The five together produce a
 * Spark Index (0–20) and a profile type. The user still recognizes;
 * the framework surfaces a pattern, not a verdict.
 *
 * Legacy note: the previous 7-facet vocabulary lives on only as the
 * type name `FacetId` for backward compatibility with existing code
 * paths — the IDs are the SPARK dimensions.
 */

export type FacetId =
  | "CI" // Cognitive Intensity
  | "ER" // Emotional Resonance
  | "SA" // Sensory Amplification
  | "CD" // Creative Divergence
  | "ED"; // Existential Drive

export type DimensionId = FacetId;

export interface Facet {
  id: FacetId;
  short: string;
  label: string;
  essence: string;
  description: string;
  accent: string;
  glyph: "triangle" | "circle" | "radiate" | "branch" | "spiral";
}

export const FACETS: Facet[] = [
  {
    id: "CI",
    short: "Cognitive Intensity",
    label: "Depth of processing",
    essence: "Pattern sensitivity, associative speed, hyperfocus capacity.",
    description:
      "How deeply your mind drops into a topic, how fast associations form, how absorbing focus becomes.",
    accent: "oklch(0.78 0.16 260)",
    glyph: "triangle",
  },
  {
    id: "ER",
    short: "Emotional Resonance",
    label: "Depth of feeling",
    essence: "Emotional depth, empathy, reactivity, existential sensitivity.",
    description:
      "How strongly feelings arrive, how much emotional information you carry from a room, a story, or another person.",
    accent: "oklch(0.76 0.17 20)",
    glyph: "circle",
  },
  {
    id: "SA",
    short: "Sensory Amplification",
    label: "Aperture of the senses",
    essence: "Sensory sensitivity, environmental overload, aesthetic perception.",
    description:
      "How much of the room reaches you — light, sound, texture, atmosphere — and how much it shapes your thinking.",
    accent: "oklch(0.82 0.14 195)",
    glyph: "radiate",
  },
  {
    id: "CD",
    short: "Creative Divergence",
    label: "Originality of thought",
    essence: "Nonlinear thinking, symbolic cognition, idea generation.",
    description:
      "How readily ideas arrive in unusual combinations, in metaphors and images rather than fixed steps.",
    accent: "oklch(0.80 0.16 310)",
    glyph: "branch",
  },
  {
    id: "ED",
    short: "Existential Drive",
    label: "Search for meaning",
    essence: "Meaning-seeking, philosophical depth, identity exploration, inner transformation.",
    description:
      "How present the questions of meaning, self, and transformation are in your daily inner life.",
    accent: "oklch(0.85 0.14 90)",
    glyph: "spiral",
  },
];

export const getFacet = (id: FacetId) => FACETS.find((f) => f.id === id)!;
export const getDimension = getFacet;

export interface SparkProfileType {
  key: "quiet" | "flickering" | "burning" | "wildfire";
  name: string;
  range: [number, number];
  description: string;
  note: string;
}

export const SPARK_PROFILES: SparkProfileType[] = [
  {
    key: "quiet",
    name: "The Quiet Spark",
    range: [0, 6],
    description:
      "Low activation. Neurodivergent traits present but dormant or gently held. The current is there — it may not be running warm right now.",
    note: "There is nothing to prove here. A quiet spark is still a spark.",
  },
  {
    key: "flickering",
    name: "The Flickering Spark",
    range: [7, 12],
    description:
      "Moderate intensity. Traits arrive situationally, then recede. Often misunderstood by systems built for the middle of the curve.",
    note: "Notice the conditions that turn the flicker into a steady flame.",
  },
  {
    key: "burning",
    name: "The Burning Spark",
    range: [13, 16],
    description:
      "High intensity across multiple dimensions. A clear 2E profile — the mind and the nervous system both run hot. Systems built for neurotypical rhythms will not fit; the work is to build ones that do.",
    note: "The intensity is a resource. It becomes a cost when the environment does not meet it.",
  },
  {
    key: "wildfire",
    name: "The Wildfire",
    range: [17, 20],
    description:
      "Extreme intensity across most dimensions. Dabrowski Level 3–4 territory — disintegration and transformation happen in the same season. Great creative range; real risk of overwhelm.",
    note: "The wildfire needs both fuel and firebreaks. Both are on you to design.",
  },
];

export function profileFromIndex(index: number): SparkProfileType {
  return SPARK_PROFILES.find((p) => index >= p.range[0] && index <= p.range[1]) ?? SPARK_PROFILES[0];
}