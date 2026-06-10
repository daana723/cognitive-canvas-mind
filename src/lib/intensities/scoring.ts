import { INTENSITIES, type IntensityId } from "./intensities";
import { INTENSITY_QUESTIONS } from "./questions";
import type { LikertValue } from "../spark/questions";

export type IntensityResponses = Record<string, LikertValue>;
export type IntensityScores = Record<IntensityId, number>; // 0..1

export function scoreIntensities(responses: IntensityResponses): IntensityScores {
  const buckets: Record<IntensityId, number[]> = {
    drive: [], sense: [], mind: [], vision: [], heart: [],
  };
  for (const q of INTENSITY_QUESTIONS) {
    const raw = responses[q.id];
    if (!raw) continue;
    const normalized = q.reverse ? 6 - raw : raw;
    buckets[q.intensity].push((normalized - 1) / 4);
  }
  const out = {} as IntensityScores;
  for (const it of INTENSITIES) {
    const vals = buckets[it.id];
    out[it.id] = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0.5;
  }
  return out;
}

export function intensityCompletion(responses: IntensityResponses): number {
  return Object.keys(responses).length / INTENSITY_QUESTIONS.length;
}