import type { DimensionScores } from "./scoring";

/**
 * Cognitive Archetypes — narrative shapes derived from the SPARK profile.
 * These are mirrors, not labels. Each profile lights one primary archetype.
 */

export interface Archetype {
  id: string;
  name: string;
  tagline: string;
  essence: string;
  match: (s: DimensionScores) => number; // 0..1 fit score
}

export const ARCHETYPES: Archetype[] = [
  {
    id: "weaver",
    name: "The Weaver",
    tagline: "Finds the thread between unrelated worlds.",
    essence:
      "You think by connection. Ideas, people, and disciplines arrange themselves into a fabric only you can see.",
    match: (s) => (s.learning + s.creative + s.decision) / 3,
  },
  {
    id: "deepwell",
    name: "The Deep Well",
    tagline: "Goes further than the room expects.",
    essence:
      "You drop into ideas with quiet intensity. What looks like silence from outside is depth underneath.",
    match: (s) => (s.attention + (1 - s.energy) + s.emotion) / 3,
  },
  {
    id: "tuner",
    name: "The Tuner",
    tagline: "Reads the room before words begin.",
    essence:
      "Your senses are wide open. You translate atmosphere and feeling into information others miss entirely.",
    match: (s) => (s.sensory + s.emotion + s.decision) / 3,
  },
  {
    id: "cartographer",
    name: "The Cartographer",
    tagline: "Maps systems while standing inside them.",
    essence:
      "You see structure where others see noise. You build models of complexity and quietly hand them to people.",
    match: (s) => (s.learning + (1 - s.decision) + s.attention) / 3,
  },
  {
    id: "ember",
    name: "The Ember",
    tagline: "Burns brightest in surges of meaning.",
    essence:
      "Your energy is wave-shaped. When something matters, you generate disproportionate light — and then you rest.",
    match: (s) => ((1 - s.energy) + s.creative + s.emotion) / 3,
  },
];

export function resolveArchetype(scores: DimensionScores) {
  const ranked = ARCHETYPES.map((a) => ({ archetype: a, score: a.match(scores) }))
    .sort((x, y) => y.score - x.score);
  return { primary: ranked[0], secondary: ranked[1] };
}