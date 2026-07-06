import type { FacetLean } from "./resonance";
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
    when: (l) => l.attention >= 0.62,
  },
  {
    id: "parallel-attention",
    label: "Parallel attention",
    reading:
      "You may recognize the sense of holding many channels at once. This may point toward an attention that moves in width rather than depth.",
    when: (l) => l.attention <= 0.38,
  },
  {
    id: "wave-energy",
    label: "Wave-shaped energy",
    reading:
      "You may recognize surges of intensity followed by real recovery. This may point toward a rhythm shaped by waves, not a steady stream.",
    when: (l) => l.rhythm <= 0.42,
  },
  {
    id: "steady-current",
    label: "Steady current",
    reading:
      "You may recognize the capacity to hold a working rhythm across long stretches. This may point toward energy that arrives as a stream.",
    when: (l) => l.rhythm >= 0.6,
  },
  {
    id: "resonant-feeling",
    label: "Feeling as information",
    reading:
      "You may recognize emotion arriving fast and at volume, often before it can be named. This may point toward feeling that carries data, not noise.",
    when: (l) => l.feeling >= 0.6,
  },
  {
    id: "high-resolution-sensing",
    label: "High-resolution sensing",
    reading:
      "You may recognize how the room shapes your thinking — light, sound, texture. This may point toward a sensory aperture that runs wide open.",
    when: (l) => l.sensing >= 0.6,
  },
  {
    id: "associative-mind",
    label: "Associative understanding",
    reading:
      "You may recognize how new ideas land by linking to a web of what you already know. This may point toward thinking that connects rather than stacks.",
    when: (l) => l.understanding >= 0.55,
  },
  {
    id: "cross-domain-making",
    label: "Cross-domain making",
    reading:
      "You may recognize the pull to combine things that don't usually meet. This may point toward creative work that lives at intersections.",
    when: (l) => l.making >= 0.6,
  },
  {
    id: "intuitive-knowing",
    label: "Intuitive knowing",
    reading:
      "You may recognize decisions that arrive before the reasoning. This may point toward choices that land in the body as much as the mind.",
    when: (l) => l.deciding >= 0.6,
  },
  {
    id: "analytical-clarity",
    label: "Analytical clarity",
    reading:
      "You may recognize the pull toward structured reasoning and explicit weighing. This may point toward decisions that hold up when you show your work.",
    when: (l) => l.deciding <= 0.4,
  },
];

function symbolicModeMatches(
  leans: FacetLean,
  heat: Partial<Record<CurrentId, number>>,
): SymbolicModeMatch[] {
  // Weight each mode from facet leans; blend with current heat when present.
  const w: Record<ModeId, number> = {
    flux: (1 - leans.attention) * 0.6 + (leans.making) * 0.4,
    depth: leans.attention * 0.5 + leans.feeling * 0.3 + leans.understanding * 0.2,
    signal: (1 - leans.deciding) * 0.5 + (1 - leans.making) * 0.3 + leans.rhythm * 0.2,
    myth: leans.making * 0.4 + leans.feeling * 0.3 + leans.understanding * 0.3,
    pulse: (1 - leans.rhythm) * 0.6 + leans.deciding * 0.4,
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
  const feeling = leans.feeling >= 0.65
    ? " If feeling arrives at high volume, let the wave move through before deciding what it means."
    : "";
  return base + feeling;
}

export function buildMirror(
  leans: FacetLean,
  heat: Partial<Record<CurrentId, number>>,
): MirrorReading {
  const motifs = MOTIF_TEMPLATES.filter((t) => t.when(leans)).map((t) => ({
    id: t.id,
    label: t.label,
    reading: t.reading,
  }));
  const symbolicModes = symbolicModeMatches(leans, heat);
  const note = pickNote(leans, symbolicModes);
  return { motifs, currentHeat: heat, symbolicModes, note };
}