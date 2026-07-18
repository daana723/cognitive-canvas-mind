import type { CurrentId } from "./currents";
import type { Resonance } from "./prompts";

/**
 * Currents prompts — 3 per current. Optional second reflection.
 * Same resonance scale as the main reflection.
 */

export interface CurrentPrompt {
  id: string;
  current: CurrentId;
  prompt: string;
  reverse?: boolean;
}

export const CURRENT_PROMPTS: CurrentPrompt[] = [
  { id: "c-fx1", current: "flux", prompt: "I'd rather open five doors than walk through one." },
  {
    id: "c-fx2",
    current: "flux",
    prompt: "I notice signals from many channels at once, and that feels natural.",
  },
  {
    id: "c-fx3",
    current: "flux",
    prompt: "Committing to a single direction usually feels premature.",
  },

  {
    id: "c-dp1",
    current: "depth",
    prompt: "I can't let go of a question once it's lodged — I'll chase it across days.",
  },
  {
    id: "c-dp2",
    current: "depth",
    prompt: "Shallow answers bother me more than an unfinished task.",
  },
  {
    id: "c-dp3",
    current: "depth",
    prompt: "My best thinking happens after everyone else has stopped.",
  },

  {
    id: "c-sg1",
    current: "signal",
    prompt: "Reducing a sprawling thing to its spine is deeply satisfying.",
  },
  { id: "c-sg2", current: "signal", prompt: "I like naming things until they hold their shape." },
  {
    id: "c-sg3",
    current: "signal",
    prompt: "I'd rather ship a rough smaller version than polish a bigger one that isn't out.",
  },

  {
    id: "c-my1",
    current: "myth",
    prompt: "I think in metaphors, images, and scenes as much as in words.",
  },
  {
    id: "c-my2",
    current: "myth",
    prompt: "Dreams or imagined worlds stay with me long after they end.",
  },
  {
    id: "c-my3",
    current: "myth",
    prompt: "I often find the shape of a thing as a figure before I can explain it.",
  },

  {
    id: "c-pl1",
    current: "pulse",
    prompt: "Sitting still without something to work on feels louder than working.",
  },
  {
    id: "c-pl2",
    current: "pulse",
    prompt: "I gesture, pace, or move my hands while I'm working through an idea.",
  },
  {
    id: "c-pl3",
    current: "pulse",
    prompt: "Motion — walking, making, iterating — clarifies my thinking faster than sitting does.",
  },
];

export type CurrentResponses = Record<string, Resonance>;

export function currentHeatFrom(responses: CurrentResponses): Partial<Record<CurrentId, number>> {
  const buckets: Record<CurrentId, number[]> = {
    flux: [],
    depth: [],
    signal: [],
    myth: [],
    pulse: [],
  };
  for (const p of CURRENT_PROMPTS) {
    const raw = responses[p.id];
    if (!raw) continue;
    const normalized = p.reverse ? 6 - raw : raw;
    buckets[p.current].push((normalized - 1) / 4);
  }
  const out: Partial<Record<CurrentId, number>> = {};
  for (const cid of Object.keys(buckets) as CurrentId[]) {
    const vals = buckets[cid];
    if (vals.length) out[cid] = vals.reduce((a, b) => a + b, 0) / vals.length;
  }
  return out;
}

export const currentCompletion = (r: CurrentResponses) =>
  Object.keys(r).length / CURRENT_PROMPTS.length;
