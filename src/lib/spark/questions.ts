import type { DimensionId } from "./dimensions";

/**
 * Question bank — 3 prompts per dimension.
 * Each prompt is descriptive, not deficit-framed.
 * A high agreement (5) leans toward the dimension's "high" pole.
 */

export interface Question {
  id: string;
  dimension: DimensionId;
  prompt: string;
  reverse?: boolean; // if true, agreement leans toward "low" pole
}

export const QUESTIONS: Question[] = [
  // Attention
  { id: "a1", dimension: "attention", prompt: "When something interests me, I can lose track of hours inside it." },
  { id: "a2", dimension: "attention", prompt: "My mind moves between many ideas at once, and that feels natural.", reverse: true },
  { id: "a3", dimension: "attention", prompt: "Switching tasks before I'm 'done' costs me real effort." },

  // Energy
  { id: "e1", dimension: "energy", prompt: "My energy comes in waves — bursts of intensity followed by quiet recovery.", reverse: true },
  { id: "e2", dimension: "energy", prompt: "I can hold a steady working rhythm across a full day." },
  { id: "e3", dimension: "energy", prompt: "Forcing output when the wave isn't there usually backfires.", reverse: true },

  // Emotion
  { id: "em1", dimension: "emotion", prompt: "Emotions arrive quickly and at high volume." },
  { id: "em2", dimension: "emotion", prompt: "I often feel a situation before I can name what it is." },
  { id: "em3", dimension: "emotion", prompt: "I tend to process feelings later, in retrospect.", reverse: true },

  // Sensory
  { id: "s1", dimension: "sensory", prompt: "Lighting, sound, and texture shape my ability to think clearly." },
  { id: "s2", dimension: "sensory", prompt: "Background noise that others don't notice can occupy my attention." },
  { id: "s3", dimension: "sensory", prompt: "I generally don't notice subtle changes in my environment.", reverse: true },

  // Learning
  { id: "l1", dimension: "learning", prompt: "I understand new things by connecting them to other things I already know." },
  { id: "l2", dimension: "learning", prompt: "Step-by-step instructions feel clearer to me than a big picture.", reverse: true },
  { id: "l3", dimension: "learning", prompt: "I often see how unrelated fields share an underlying pattern." },

  // Creative
  { id: "c1", dimension: "creative", prompt: "My best ideas come from combining things that don't usually meet." },
  { id: "c2", dimension: "creative", prompt: "I'd rather refine one thing deeply than start something new.", reverse: true },
  { id: "c3", dimension: "creative", prompt: "I think in metaphors, images, or systems more than in lists." },

  // Decision
  { id: "d1", dimension: "decision", prompt: "I often know an answer before I can explain why." },
  { id: "d2", dimension: "decision", prompt: "I trust structured analysis over a gut feeling.", reverse: true },
  { id: "d3", dimension: "decision", prompt: "Big decisions land in my body as much as in my thinking." },
];

export type LikertValue = 1 | 2 | 3 | 4 | 5;

export const LIKERT_LABELS: Record<LikertValue, string> = {
  1: "Not me",
  2: "Rarely",
  3: "Sometimes",
  4: "Often",
  5: "Deeply me",
};