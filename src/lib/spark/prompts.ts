import type { FacetId } from "./facets";

/**
 * SPARK prompts — 5 per dimension, 25 total. Each prompt is a first-person
 * recognition statement. The 1–5 Likert resonance is stored per prompt and
 * then averaged into a per-dimension score (0–4) at read time.
 */

export type Resonance = 1 | 2 | 3 | 4 | 5;

export interface Prompt {
  id: string;
  facet: FacetId; // SPARK dimension id (CI/ER/SA/CD/ED)
  prompt: string;
  reverse?: boolean;
}

export const PROMPTS: Prompt[] = [
  // D1 — Cognitive Intensity
  { id: "ci1", facet: "CI", prompt: "I can spend hours absorbed in a single topic without noticing time passing." },
  { id: "ci2", facet: "CI", prompt: "I often see connections between things that seem unrelated to others." },
  { id: "ci3", facet: "CI", prompt: "My mind races with ideas faster than I can express them." },
  { id: "ci4", facet: "CI", prompt: "I prefer deep, complex topics over simple, straightforward ones." },
  { id: "ci5", facet: "CI", prompt: "I understand new things by linking them to a wider web of what I already know." },

  // D2 — Emotional Resonance
  { id: "er1", facet: "ER", prompt: "I feel others' emotions as if they were my own." },
  { id: "er2", facet: "ER", prompt: "I have experienced grief or joy so intense it felt physical." },
  { id: "er3", facet: "ER", prompt: "I can be moved to tears by music, art, or stories." },
  { id: "er4", facet: "ER", prompt: "I sometimes feel overwhelmed by the suffering in the world." },
  { id: "er5", facet: "ER", prompt: "My emotional responses are often stronger than others expect." },

  // D3 — Sensory Amplification
  { id: "sa1", facet: "SA", prompt: "Certain textures, sounds, or smells can overwhelm me." },
  { id: "sa2", facet: "SA", prompt: "I am deeply affected by my physical environment." },
  { id: "sa3", facet: "SA", prompt: "I notice sensory details that others seem to miss." },
  { id: "sa4", facet: "SA", prompt: "I have strong preferences about food, clothing, or aesthetics." },
  { id: "sa5", facet: "SA", prompt: "Bright lights, loud noises, or strong smells can be painful." },

  // D4 — Creative Divergence
  { id: "cd1", facet: "CD", prompt: "I often think in metaphors and images rather than words." },
  { id: "cd2", facet: "CD", prompt: "I come up with ideas that others find strange or unusual." },
  { id: "cd3", facet: "CD", prompt: "I see multiple possible solutions to every problem." },
  { id: "cd4", facet: "CD", prompt: "I sometimes struggle to explain my thinking process to others." },
  { id: "cd5", facet: "CD", prompt: "I prefer to find my own way rather than follow instructions." },

  // D5 — Existential Drive
  { id: "ed1", facet: "ED", prompt: "I often think about the meaning and purpose of life." },
  { id: "ed2", facet: "ED", prompt: "I feel a strong need to understand myself at a deep level." },
  { id: "ed3", facet: "ED", prompt: "I sometimes feel like I don't fit into the world around me." },
  { id: "ed4", facet: "ED", prompt: "I have experienced periods of intense inner transformation." },
  { id: "ed5", facet: "ED", prompt: "Big questions about existence show up in my day-to-day thinking." },
];

export const RESONANCE_LABELS: Record<Resonance, string> = {
  1: "Not me",
  2: "Rarely",
  3: "Sometimes",
  4: "Often",
  5: "Deeply me",
};