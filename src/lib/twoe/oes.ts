/**
 * Dabrowski Overexcitabilities — the five OEs, translated for the studio.
 *
 * Framework: Kazimierz Dabrowski's Theory of Positive Disintegration.
 * Used here as a self-recognition tool for neurodivergent, gifted, and
 * 2E adults. The results are not a diagnosis; they surface a pattern
 * the user may recognize and want to work with.
 */

export type OEId =
  | "intellectual"
  | "emotional"
  | "imaginational"
  | "psychomotor"
  | "sensual";

export interface OE {
  id: OEId;
  label: string;
  tagline: string;
  strengths: string;
  shadow: string;
  accent: string;
}

export const OES: OE[] = [
  {
    id: "intellectual",
    label: "Intellectual",
    tagline: "Deep thinking. Questioning everything. Insatiable curiosity.",
    strengths:
      "Analysis, pattern recognition, theoretical thinking, moral reasoning, long research arcs.",
    shadow:
      "Overthinking, pedantry, arriving as ‘too intense’ in conversation, analysis loops that stall action.",
    accent: "oklch(0.78 0.16 260)",
  },
  {
    id: "emotional",
    label: "Emotional",
    tagline: "Intense feelings, deep empathy, strong responses.",
    strengths:
      "Empathy, compassion, deep attachment, moral courage, the ability to be moved and to move others.",
    shadow:
      "Overwhelm, ‘too sensitive,’ absorbing others’ states, emotional exhaustion, moodiness under stress.",
    accent: "oklch(0.76 0.17 20)",
  },
  {
    id: "imaginational",
    label: "Imaginational",
    tagline: "Rich fantasy life, vivid dreams, visual metaphor.",
    strengths:
      "Creative synthesis, symbolic thinking, elaborate inner worlds, seeing what isn't obvious.",
    shadow:
      "Spacing out, blending truth and fiction, escaping into imagination when reality is too much.",
    accent: "oklch(0.80 0.16 310)",
  },
  {
    id: "psychomotor",
    label: "Psychomotor",
    tagline: "High energy, restlessness, rapid speech, love of motion.",
    strengths:
      "Kinetic thinking, momentum, physical stamina, thinking-through-doing, urgency that gets things built.",
    shadow:
      "Restlessness that reads as hyperactivity, inability to sit still, impulsivity, ‘too much energy.’",
    accent: "oklch(0.85 0.14 90)",
  },
  {
    id: "sensual",
    label: "Sensual",
    tagline: "Heightened senses, aesthetic depth, sensory pleasure.",
    strengths:
      "Aesthetic perception, deep sensory pleasure, taste, atmosphere-building, embodied presence.",
    shadow:
      "Sensory overload, pickiness, ‘too particular,’ nervous system flooded by ordinary environments.",
    accent: "oklch(0.82 0.14 195)",
  },
];

export const getOE = (id: OEId) => OES.find((o) => o.id === id)!;