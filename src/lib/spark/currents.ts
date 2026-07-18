/**
 * The five currents that run through the studio: Flux, Depth, Signal, Myth,
 * Pulse. Currents describe where energy tends to gather in your creative
 * life. They are recognized, not assigned. Everyone carries all five to
 * some degree — the heat shifts across seasons.
 */

import type { ModeId } from "@/lib/modes/modes";

export type CurrentId = ModeId;

export interface Current {
  id: CurrentId;
  label: string;
  essence: string;
  description: string;
  asFuel: string;
  asOverload: string;
  signature: string;
}

export const CURRENTS: Current[] = [
  {
    id: "flux",
    label: "Flux",
    essence: "A wide aperture — many possibilities at once.",
    description:
      "A current of openness. Ideas multiply before any commit. The world arrives in parallel rather than in sequence.",
    asFuel: "You catch signals others miss because your attention holds many frames at once.",
    asOverload: "Everything stays possible; nothing lands. Choice becomes heavier than making.",
    signature: "Many browser tabs, cross-domain jumps, discomfort with a single path.",
  },
  {
    id: "depth",
    label: "Depth",
    essence: "Slow current — going into rather than looking at.",
    description:
      "A pull toward what sits underneath the obvious version. Sitting with one thread until it shows what it touches.",
    asFuel:
      "You arrive at first principles others skip; feeling and pattern become high-bandwidth information.",
    asOverload:
      "Thought spirals colonize sleep; the analysis outruns the moment it was meant to serve.",
    signature:
      "Long dwell time on one question; late-night research; discomfort with shallow answers.",
  },
  {
    id: "signal",
    label: "Signal",
    essence: "The current narrows — structure emerges.",
    description:
      "A pull toward clarity: naming, sorting, sequencing, finishing. The spine of a thing surfaces.",
    asFuel: "You can turn sprawl into a load-bearing structure others can walk on.",
    asOverload: "Structure hardens too early; the alive thing gets pruned before it has arrived.",
    signature:
      "Outlines, cuts, one-sentence promises, an appetite for shipping the smallest version.",
  },
  {
    id: "myth",
    label: "Myth",
    essence: "The symbolic surface runs parallel to the literal one.",
    description:
      "A current of image, metaphor, and story. The literal form isn't ready yet — the figure is.",
    asFuel:
      "You see the shape of a thing before its explanation, and can translate between symbolic and literal.",
    asOverload:
      "The inner world becomes more workable than the outer; symbol substitutes for step.",
    signature:
      "Vivid imagery, easy metaphor, dreams that linger, work that arrives as figure first.",
  },
  {
    id: "pulse",
    label: "Pulse",
    essence: "Short loops — make, show, adjust.",
    description: "A current of motion. Rough versions on purpose. Momentum as a way of thinking.",
    asFuel: "You learn by making; each rough loop tells you what the next one should be.",
    asOverload: "Constant motion becomes agitation; you start faster than you can finish.",
    signature: "Pacing, gesturing, working in bursts, exercise as regulation, many small starts.",
  },
];

export const getCurrent = (id: CurrentId) => CURRENTS.find((c) => c.id === id)!;
