import { INTENSITIES, type Intensity, type IntensityId } from "./intensities";
import type { IntensityScores } from "./scoring";

/**
 * Intensity Translation Layer.
 *
 * Translates raw OE scores into:
 *  - per-channel readings (what this current actually is)
 *  - fuel vs. overload (the same channel, used or flooded)
 *  - inner movement (translated Dąbrowski level reflection — where growth is working)
 *
 * Surface language is Cognitive Layer's own; the named framework is
 * credited in `framework` for the detail surface.
 */

export type Heat = "quiet" | "present" | "hot";

export interface IntensityReading {
  intensity: Intensity;
  score: number;
  heat: Heat;
  asFuel: string;     // what this channel gives you
  asOverload: string; // what it costs when flooded
}

export type InnerMovement =
  | "settled"
  | "horizontal-pull"
  | "vertical-climb"
  | "reorganizing";

export interface InnerMovementReading {
  id: InnerMovement;
  label: string;
  reading: string;
  framework: string; // Dąbrowski credit, shown on detail view only
}

export interface IntensityTranslation {
  readings: IntensityReading[];
  dominant: IntensityReading[];   // top 1–2 channels
  movement: InnerMovementReading;
  totalHeat: number;              // 0..1 average across channels
  framework: {
    name: string;
    note: string;
  };
}

function heat(v: number): Heat {
  if (v >= 0.62) return "hot";
  if (v <= 0.38) return "quiet";
  return "present";
}

const FUEL: Record<IntensityId, string> = {
  drive: "Kinetic energy as a thinking medium — your best ideas land in motion, not in stillness.",
  sense: "A direct line from aesthetics to insight — the right room is genuine equipment for your mind.",
  mind: "An engine that refuses shallow answers — you arrive at first principles others skip.",
  vision: "A symbolic layer running alongside reality — you see possibility, metaphor, and pattern as readable surfaces.",
  heart: "Emotion as high-bandwidth information — you read rooms, people, and meaning that others can't yet name.",
};

const OVERLOAD: Record<IntensityId, string> = {
  drive: "Without an outlet, the current loops back as agitation, insomnia, or compulsive starting.",
  sense: "Wrong environments don't annoy you — they actively scramble your ability to think.",
  mind: "Thought spirals colonize sleep and feeling; the engine forgets it has an off-switch.",
  vision: "Imagination becomes escape; the inner world starts feeling more workable than the outer.",
  heart: "Other people's weather floods yours; emotional memory holds on past usefulness.",
};

function pickMovement(scores: IntensityScores): InnerMovementReading {
  const avg = Object.values(scores).reduce((a, b) => a + b, 0) / 5;
  const high = Object.values(scores).filter((v) => v >= 0.62).length;
  const tension = scores.heart >= 0.55 && scores.mind >= 0.55;
  const climb = tension && scores.vision >= 0.55;

  const framework =
    "Reflects Dąbrowski's Theory of Positive Disintegration — inner conflict as the engine of growth, not a malfunction.";

  if (avg < 0.4 && high === 0)
    return {
      id: "settled",
      label: "Settled current",
      reading:
        "Your intensities are running quietly. The nervous system is not generating much friction right now — growth, if it comes, is likely to come from outside conditions rather than inner pressure.",
      framework,
    };

  if (climb)
    return {
      id: "vertical-climb",
      label: "Vertical climb",
      reading:
        "Heart, Mind, and Vision are all live at once. That combination tends to organize itself upward — feeling, thinking, and imagining converge into values you can act on. The inner conflict is doing real work; let it.",
      framework,
    };

  if (tension)
    return {
      id: "reorganizing",
      label: "Reorganizing",
      reading:
        "Mind and Heart are both turned up. This is the productive tension — analysis and feeling pulling at the same problem. Something inside is rearranging; that's not malfunction, it's structure forming.",
      framework,
    };

  return {
    id: "horizontal-pull",
    label: "Horizontal pull",
    reading:
      "Your intensities are active but pulling sideways — competing demands rather than a single climb. The work is to notice which channel is loudest in the moment, and let that one lead before the others arrive.",
    framework,
  };
}

export function translateIntensities(scores: IntensityScores): IntensityTranslation {
  const readings: IntensityReading[] = INTENSITIES.map((it) => {
    const v = scores[it.id];
    return {
      intensity: it,
      score: v,
      heat: heat(v),
      asFuel: FUEL[it.id],
      asOverload: OVERLOAD[it.id],
    };
  });

  const dominant = [...readings]
    .sort((a, b) => b.score - a.score)
    .filter((r) => r.heat === "hot")
    .slice(0, 2);

  const totalHeat = readings.reduce((a, r) => a + r.score, 0) / readings.length;
  const movement = pickMovement(scores);

  return {
    readings,
    dominant,
    movement,
    totalHeat,
    framework: {
      name: "Dąbrowski's Overexcitabilities",
      note:
        "The Intensities layer adapts Kazimierz Dąbrowski's five overexcitabilities into Cognitive Layer's own language. The structural model is his; the framing here is non-clinical and descriptive.",
    },
  };
}