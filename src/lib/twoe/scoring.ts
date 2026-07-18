import { OES, type OEId } from "./oes";
import { TWOE_PROMPTS, type Likert } from "./prompts";

export type OEResponses = Record<string, Likert>;

/** Per-OE score normalized to 0..100. */
export type OEProfile = Record<OEId, number>;

export function oeProfileFrom(responses: OEResponses): OEProfile {
  const buckets: Record<OEId, number[]> = {
    intellectual: [], emotional: [], imaginational: [], psychomotor: [], sensual: [],
  };
  for (const p of TWOE_PROMPTS) {
    const v = responses[p.id];
    if (v) buckets[p.oe].push(v);
  }
  const out = {} as OEProfile;
  for (const oe of OES) {
    const vals = buckets[oe.id];
    if (!vals.length) {
      out[oe.id] = 0;
      continue;
    }
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length; // 1..5
    out[oe.id] = Math.round(((avg - 1) / 4) * 100); // 0..100
  }
  return out;
}

export interface OEReading {
  profile: OEProfile;
  dominant: OEId;
  secondary: OEId;
  intensity: number; // 0..100 average
  band: "low" | "medium" | "high" | "very-high";
  bandLabel: string;
  bandNote: string;
}

const BANDS: Array<{ band: OEReading["band"]; label: string; note: string; max: number }> = [
  { band: "low", label: "Mild overexcitabilities", max: 30,
    note: "OEs are present but held quietly. The nervous system is running near baseline." },
  { band: "medium", label: "Moderate intensity", max: 60,
    note: "OEs come and go with context. Design your environment around what turns them up or down." },
  { band: "high", label: "Strong overexcitabilities", max: 80,
    note: "OEs are a defining feature of daily life. Environments built for neurotypical rhythms will chafe." },
  { band: "very-high", label: "Very intense — may need support", max: 100,
    note: "OEs run near their ceiling. Great creative range; real risk of overwhelm without protective structure." },
];

export function readingFrom(responses: OEResponses): OEReading {
  const profile = oeProfileFrom(responses);
  const ranked = (Object.keys(profile) as OEId[])
    .map((id) => ({ id, v: profile[id] }))
    .sort((a, b) => b.v - a.v);
  const intensity = Math.round(
    ranked.reduce((s, r) => s + r.v, 0) / ranked.length,
  );
  const band = BANDS.find((b) => intensity <= b.max) ?? BANDS[BANDS.length - 1];
  return {
    profile,
    dominant: ranked[0].id,
    secondary: ranked[1].id,
    intensity,
    band: band.band,
    bandLabel: band.label,
    bandNote: band.note,
  };
}

export const twoeCompletion = (r: OEResponses) =>
  Object.keys(r).length / TWOE_PROMPTS.length;