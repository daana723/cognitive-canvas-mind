import { FACETS, type FacetId } from "./facets";
import { PROMPTS, type Resonance } from "./prompts";

export type Responses = Record<string, Resonance>;
export type FacetLean = Record<FacetId, number>; // 0..1 — recognition weight, never a score

/**
 * Convert raw resonance into a lean per facet. Reverse-keyed prompts
 * are inverted. This is a weight for recognition — it is not a score
 * or an evaluation of the person.
 */
export function leansFrom(responses: Responses): FacetLean {
  const buckets: Record<FacetId, number[]> = {
    attention: [], rhythm: [], feeling: [], sensing: [],
    understanding: [], making: [], deciding: [],
  };
  for (const p of PROMPTS) {
    const raw = responses[p.id];
    if (!raw) continue;
    const normalized = p.reverse ? 6 - raw : raw;
    buckets[p.facet].push((normalized - 1) / 4);
  }
  const out = {} as FacetLean;
  for (const f of FACETS) {
    const vals = buckets[f.id];
    out[f.id] = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0.5;
  }
  return out;
}

export const completion = (r: Responses) => Object.keys(r).length / PROMPTS.length;