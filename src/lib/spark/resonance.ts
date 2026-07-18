import { FACETS, profileFromIndex, type FacetId, type SparkProfileType } from "./facets";
import { PROMPTS, type Resonance } from "./prompts";

export type Responses = Record<string, Resonance>;

/** 0..1 recognition weight per dimension (legacy consumer API, e.g. motifs). */
export type FacetLean = Record<FacetId, number>;

/** SPARK dimension score 0..4 (framework units). */
export type DimensionScores = Record<FacetId, number>;

function bucketsFrom(responses: Responses): Record<FacetId, number[]> {
  const buckets: Record<FacetId, number[]> = {
    CI: [], ER: [], SA: [], CD: [], ED: [],
  };
  for (const p of PROMPTS) {
    const raw = responses[p.id];
    if (!raw) continue;
    const normalized = p.reverse ? 6 - raw : raw;
    buckets[p.facet].push(normalized); // 1..5
  }
  return buckets;
}

/** Recognition weight per dimension (0..1). Consumed by mirror motifs. */
export function leansFrom(responses: Responses): FacetLean {
  const buckets = bucketsFrom(responses);
  const out = {} as FacetLean;
  for (const f of FACETS) {
    const vals = buckets[f.id];
    out[f.id] = vals.length
      ? vals.reduce((a, b) => a + b, 0) / vals.length / 5 // 0..1
      : 0.5;
  }
  return out;
}

/** Per-dimension SPARK score, 0..4 (avg of Likert minus 1). */
export function dimensionScoresFrom(responses: Responses): DimensionScores {
  const buckets = bucketsFrom(responses);
  const out = {} as DimensionScores;
  for (const f of FACETS) {
    const vals = buckets[f.id];
    out[f.id] = vals.length
      ? vals.reduce((a, b) => a + b, 0) / vals.length - 1 // 0..4
      : 0;
  }
  return out;
}

/** Spark Index — sum of 5 dimension scores, rounded, range 0..20. */
export function sparkIndex(scores: DimensionScores): number {
  const raw = FACETS.reduce((sum, f) => sum + scores[f.id], 0);
  return Math.round(Math.min(20, Math.max(0, raw)));
}

export function sparkProfile(index: number): SparkProfileType {
  return profileFromIndex(index);
}

export const completion = (r: Responses) => Object.keys(r).length / PROMPTS.length;