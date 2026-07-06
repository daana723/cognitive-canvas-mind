import type { FacetId } from "./facets";

/**
 * Reflection prompts — 3 per facet. Each is a first-person recognition
 * statement. The user chooses how much it rings true. Nothing is scored
 * or evaluated — resonance is stored so patterns can be surfaced later.
 */

export type Resonance = 1 | 2 | 3 | 4 | 5;

export interface Prompt {
  id: string;
  facet: FacetId;
  prompt: string;
  reverse?: boolean;
}

export const PROMPTS: Prompt[] = [
  { id: "a1", facet: "attention", prompt: "When something interests me, I can lose track of hours inside it." },
  { id: "a2", facet: "attention", prompt: "My mind moves between many ideas at once, and that feels natural.", reverse: true },
  { id: "a3", facet: "attention", prompt: "Switching tasks before I'm 'done' costs me real effort." },

  { id: "r1", facet: "rhythm", prompt: "My energy comes in waves — bursts of intensity followed by quiet recovery.", reverse: true },
  { id: "r2", facet: "rhythm", prompt: "I can hold a steady working rhythm across a full day." },
  { id: "r3", facet: "rhythm", prompt: "Forcing output when the wave isn't there usually backfires.", reverse: true },

  { id: "f1", facet: "feeling", prompt: "Emotions arrive quickly and at high volume." },
  { id: "f2", facet: "feeling", prompt: "I often feel a situation before I can name what it is." },
  { id: "f3", facet: "feeling", prompt: "I tend to process feelings later, in retrospect.", reverse: true },

  { id: "s1", facet: "sensing", prompt: "Lighting, sound, and texture shape my ability to think clearly." },
  { id: "s2", facet: "sensing", prompt: "Background noise that others don't notice can occupy my attention." },
  { id: "s3", facet: "sensing", prompt: "I generally don't notice subtle changes in my environment.", reverse: true },

  { id: "u1", facet: "understanding", prompt: "I understand new things by connecting them to other things I already know." },
  { id: "u2", facet: "understanding", prompt: "Step-by-step instructions feel clearer to me than a big picture.", reverse: true },
  { id: "u3", facet: "understanding", prompt: "I often see how unrelated fields share an underlying pattern." },

  { id: "m1", facet: "making", prompt: "My best ideas come from combining things that don't usually meet." },
  { id: "m2", facet: "making", prompt: "I'd rather refine one thing deeply than start something new.", reverse: true },
  { id: "m3", facet: "making", prompt: "I think in metaphors, images, or systems more than in lists." },

  { id: "d1", facet: "deciding", prompt: "I often know an answer before I can explain why." },
  { id: "d2", facet: "deciding", prompt: "I trust structured analysis over a gut feeling.", reverse: true },
  { id: "d3", facet: "deciding", prompt: "Big decisions land in my body as much as in my thinking." },
];

export const RESONANCE_LABELS: Record<Resonance, string> = {
  1: "Not me",
  2: "Rarely",
  3: "Sometimes",
  4: "Often",
  5: "Deeply me",
};