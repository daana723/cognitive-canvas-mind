import type { DimensionScores, FacetLean } from "./resonance";
import { sparkIndex, sparkProfile } from "./resonance";
import type { SparkProfileType } from "./facets";
import type { CurrentId } from "./currents";
import type { ModeId } from "@/lib/modes/modes";
import { MODES } from "@/lib/modes/modes";

/**
 * Mirror — the pattern sketch surfaced from a reflection.
 *
 * Nothing here evaluates the user. It surfaces motifs the user may
 * recognize, weighs the five currents, and lifts one to three symbolic
 * modes that may resonate. Language is careful: "you may recognize",
 * "this may point toward", never "you are".
 */

export interface Motif {
  id: string;
  label: string;
  reading: string;
}

export interface SymbolicModeMatch {
  mode: ModeId;
  label: string;
  weight: number;   // 0..1 recognition weight, not a score
  invitation: string;
}

export interface MirrorReading {
  motifs: Motif[];
  currentHeat: Partial<Record<CurrentId, number>>;
  symbolicModes: SymbolicModeMatch[];
  note: string;
  scores: DimensionScores;
  index: number;
  profile: SparkProfileType;
}

const MOTIF_TEMPLATES: Array<{
  id: string;
  label: string;
  reading: string;
  when: (l: FacetLean) => boolean;
}> = [
  {
    id: "immersive-focus",
    label: "Immersive focus",
    reading:
      "You may recognize the pull to drop into one thing fully. Switching out costs real energy — this may point toward attention that runs deep rather than wide.",
    when: (l) => l.CI >= 0.62,
  },
  {
    id: "resonant-feeling",
    label: "Feeling as information",
    reading:
      "You may recognize emotion arriving fast and at volume, often before it can be named. This may point toward feeling that carries data, not noise.",
    when: (l) => l.ER >= 0.6,
  },
  {
    id: "high-resolution-sensing",
    label: "High-resolution sensing",
    reading:
      "You may recognize how the room shapes your thinking — light, sound, texture. This may point toward a sensory aperture that runs wide open.",
    when: (l) => l.SA >= 0.6,
  },
  {
    id: "cross-domain-making",
    label: "Divergent making",
    reading:
      "You may recognize the pull to combine things that don't usually meet. This may point toward creative work that lives at intersections.",
    when: (l) => l.CD >= 0.6,
  },
  {
    id: "meaning-seeking",
    label: "Meaning-seeking mind",
    reading:
      "You may recognize a life shaped by questions of meaning, self, and transformation. This may point toward existential drive as a defining current.",
    when: (l) => l.ED >= 0.6,
  },
  {
    id: "quiet-signal",
    label: "Quiet signal",
    reading:
      "You may recognize a steadier baseline — intensity is present but held quietly. Systems that ask you to perform intensity may not serve you.",
    when: (l) => l.CI + l.ER + l.SA + l.CD + l.ED <= 1.6,
  },
];

function symbolicModeMatches(
  leans: FacetLean,
  heat: Partial<Record<CurrentId, number>>,
): SymbolicModeMatch[] {
  // Weight each mode from dimension leans; blend with current heat when present.
  const w: Record<ModeId, number> = {
    flux: leans.CD * 0.6 + leans.CI * 0.4,
    depth: leans.CI * 0.5 + leans.ED * 0.3 + leans.ER * 0.2,
    signal: (1 - leans.SA) * 0.4 + (1 - leans.CD) * 0.3 + leans.CI * 0.3,
    myth: leans.CD * 0.4 + leans.ED * 0.35 + leans.ER * 0.25,
    pulse: leans.SA * 0.5 + leans.ER * 0.3 + leans.CD * 0.2,
  };
  for (const id of Object.keys(w) as ModeId[]) {
    const h = heat[id];
    if (typeof h === "number") w[id] = w[id] * 0.6 + h * 0.4;
  }
  const ranked = (Object.keys(w) as ModeId[])
    .map((id) => ({ id, weight: w[id] }))
    .sort((a, b) => b.weight - a.weight);

  const top = ranked.slice(0, 3).filter((r, i) => r.weight >= 0.5 || i === 0);

  return top.map((r) => {
    const m = MODES.find((mm) => mm.id === r.id)!;
    return {
      mode: r.id,
      label: m.label,
      weight: r.weight,
      invitation: m.invitation,
    };
  });
}

function pickNote(leans: FacetLean, matches: SymbolicModeMatch[]): string {
  const primary = matches[0]?.mode;
  const noteByMode: Record<ModeId, string> = {
    flux: "This reading holds many open doors. Notice which one still feels alive an hour from now, and let that be enough of a signal.",
    depth: "This reading sits with depth. Consider giving one thread more time before asking it to become useful.",
    signal: "This reading leans toward structure. Notice whether any of the beats you'd cut are actually the ones carrying the work.",
    myth: "This reading arrives through image. Consider letting the symbol lead one small literal step, rather than the other way around.",
    pulse: "This reading moves in loops. Consider stopping after the next small loop to notice what it taught, before starting another.",
  };
  const base = primary ? noteByMode[primary] : "Notice which of these motifs still resonates a week from now.";
  const feeling = leans.ER >= 0.65
    ? " If feeling arrives at high volume, let the wave move through before deciding what it means."
    : "";
  return base + feeling;
}

export function buildMirror(
  leans: FacetLean,
  heat: Partial<Record<CurrentId, number>>,
  scores: DimensionScores,
): MirrorReading {
  const motifs = MOTIF_TEMPLATES.filter((t) => t.when(leans)).map((t) => ({
    id: t.id,
    label: t.label,
    reading: t.reading,
  }));
  const symbolicModes = symbolicModeMatches(leans, heat);
  const note = pickNote(leans, symbolicModes);
  const index = sparkIndex(scores);
  const profile = sparkProfile(index);
  return { motifs, currentHeat: heat, symbolicModes, note, scores, index, profile };
}