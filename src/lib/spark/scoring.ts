import { DIMENSIONS, type DimensionId } from "./dimensions";
import { QUESTIONS, type LikertValue } from "./questions";

export type Responses = Record<string, LikertValue>;
export type DimensionScores = Record<DimensionId, number>; // 0..1 normalized

/**
 * Compute a 0..1 score per dimension from raw Likert responses.
 * Reverse-keyed questions are inverted before averaging.
 */
export function scoreResponses(responses: Responses): DimensionScores {
  const buckets: Record<DimensionId, number[]> = {
    attention: [], energy: [], emotion: [], sensory: [],
    learning: [], creative: [], decision: [],
  };

  for (const q of QUESTIONS) {
    const raw = responses[q.id];
    if (!raw) continue;
    const normalized = q.reverse ? 6 - raw : raw; // invert reverse-keyed
    buckets[q.dimension].push((normalized - 1) / 4); // 0..1
  }

  const out = {} as DimensionScores;
  for (const d of DIMENSIONS) {
    const vals = buckets[d.id];
    out[d.id] = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0.5;
  }
  return out;
}

export function completionRatio(responses: Responses): number {
  return Object.keys(responses).length / QUESTIONS.length;
}