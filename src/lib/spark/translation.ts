import { DIMENSIONS, type DimensionId, type Dimension } from "./dimensions";
import type { DimensionScores } from "./scoring";

/**
 * Cognitive Translation Layer
 *
 * Converts numeric SPARK scores into plain-language meaning, strengths,
 * challenges (reframed, non-deficit), and an operating manual.
 *
 * This is the layer that sits between Assessment and Toolkit — every
 * recommendation and tool surface reads from here.
 */

export type Lean = "low" | "balanced" | "high";

export interface DimensionReading {
  dimension: Dimension;
  score: number;        // 0..1
  lean: Lean;
  meaning: string;      // "what this means" plain language
}

export interface StrengthInsight {
  id: string;
  label: string;
  source: DimensionId;
  description: string;
}

export interface ChallengeInsight {
  id: string;
  label: string;
  source: DimensionId;
  description: string;
  reframe: string;   // not deficit — the cost of a strength
  support: string;   // a concrete cognitive support
}

export interface OperatingManual {
  thrivesIn: string[];
  strugglesIn: string[];
  needsToFunction: string[];
  ifOverwhelmed: string[];
  decisionPattern: string;
  workingRhythm: string;
}

export interface Translation {
  readings: DimensionReading[];
  strengths: StrengthInsight[];
  challenges: ChallengeInsight[];
  manual: OperatingManual;
}

function lean(score: number): Lean {
  if (score >= 0.62) return "high";
  if (score <= 0.38) return "low";
  return "balanced";
}

// ---------- Meaning per dimension ----------

const MEANING: Record<DimensionId, Record<Lean, string>> = {
  attention: {
    high: "You process information through immersion. Once you're inside something, you go deep — and switching out costs real cognitive energy.",
    low: "Your attention is exploratory. You scan, connect, and move — the world arrives in parallel rather than in sequence.",
    balanced: "Your attention moves between depth and exploration, depending on what the moment calls for.",
  },
  energy: {
    high: "You can sustain a steady working rhythm across long stretches. Consistency is a native mode for you.",
    low: "Your energy is wave-shaped. You generate disproportionate output in surges, then need genuine recovery — this is a pattern, not a failure of will.",
    balanced: "Your energy alternates between sustained focus and pulsed bursts. You're neither purely steady nor purely surge-driven.",
  },
  emotion: {
    high: "You feel quickly and vividly. Emotion arrives as information — often before words can name it.",
    low: "You process emotion in retrospect. Feelings settle over time and reveal themselves once the moment is past.",
    balanced: "You hold feeling and analysis side by side. Emotion informs you without overwhelming the room.",
  },
  sensory: {
    high: "Your sensory bandwidth is wide open. Lighting, sound, and texture shape your ability to think — this isn't preference, it's signal.",
    low: "Your senses filter gently. You can work across many environments without the room interrupting your thinking.",
    balanced: "You notice the room without being captured by it. Sensory input registers but rarely dominates.",
  },
  learning: {
    high: "You understand through association. New ideas land by linking to a web of things you already know — visual systems and analogies outperform linear lists for you.",
    low: "You understand sequentially. Clear steps and structured order let knowledge settle the most clearly.",
    balanced: "You move between sequential and associative learning. You can follow a path or trace a web, depending on the material.",
  },
  creative: {
    high: "You create through synthesis — by combining things that don't usually meet. Cross-domain pattern-finding is a core engine.",
    low: "You create through refinement. You stay inside a frame and make it deeper, sharper, more exact.",
    balanced: "You both synthesize and refine. You can open new territory and also bring it to finish.",
  },
  decision: {
    high: "You decide through felt sense. You often know an answer before you can explain it — your body is part of your reasoning.",
    low: "You decide through analysis. Structured reasoning, frameworks, and explicit weighing produce the cleanest decisions for you.",
    balanced: "You decide using both analysis and intuition. Neither is trusted alone.",
  },
};

// ---------- Strengths ----------

const STRENGTH_TEMPLATES: Array<{
  id: string;
  label: string;
  source: DimensionId;
  when: (s: DimensionScores) => boolean;
  description: string;
}> = [
  {
    id: "hyperfocus", label: "Hyperfocus Capacity", source: "attention",
    when: (s) => s.attention >= 0.62,
    description: "An ability to drop into deep work with disproportionate intensity and produce results others find inexplicable.",
  },
  {
    id: "parallel-scan", label: "Parallel Attention", source: "attention",
    when: (s) => s.attention <= 0.38,
    description: "A natural multi-channel awareness that catches signals others miss when only one frame is in view.",
  },
  {
    id: "surge-output", label: "Surge Creativity", source: "energy",
    when: (s) => s.energy <= 0.42,
    description: "Wave-shaped energy that produces sudden bursts of exceptional output — the kind that defines whole projects.",
  },
  {
    id: "emotional-insight", label: "Emotional Insight", source: "emotion",
    when: (s) => s.emotion >= 0.6,
    description: "Real-time reading of emotional currents — yours and other people's — as a source of information, not noise.",
  },
  {
    id: "atmosphere-reader", label: "Atmosphere Reading", source: "sensory",
    when: (s) => s.sensory >= 0.6,
    description: "High-resolution perception that picks up tone, mood, and shifts in a room long before they become explicit.",
  },
  {
    id: "pattern-recognition", label: "Pattern Recognition", source: "learning",
    when: (s) => s.learning >= 0.55,
    description: "An instinct for the underlying structure that connects unrelated fields — the move that makes systems thinkers.",
  },
  {
    id: "systems-thinking", label: "Systems Thinking", source: "learning",
    when: (s) => s.learning >= 0.5 && s.creative >= 0.5,
    description: "An ability to see complex systems as a whole and translate them into models others can use.",
  },
  {
    id: "creative-synthesis", label: "Creative Synthesis", source: "creative",
    when: (s) => s.creative >= 0.6,
    description: "Composing original work by bringing distant ideas, fields, or disciplines into the same frame.",
  },
  {
    id: "intuitive-knowing", label: "Intuitive Knowing", source: "decision",
    when: (s) => s.decision >= 0.6,
    description: "Reliable felt-sense decisions that consistently outperform pure deliberation for the right kinds of problems.",
  },
  {
    id: "analytical-clarity", label: "Analytical Clarity", source: "decision",
    when: (s) => s.decision <= 0.4,
    description: "Disciplined reasoning that holds up under pressure and produces decisions you can defend and reproduce.",
  },
];

// ---------- Challenges (reframed, non-deficit) ----------

const CHALLENGE_TEMPLATES: Array<{
  id: string;
  label: string;
  source: DimensionId;
  when: (s: DimensionScores) => boolean;
  description: string;
  reframe: string;
  support: string;
}> = [
  {
    id: "context-switching", label: "Context Switching", source: "attention",
    when: (s) => s.attention >= 0.6,
    description: "Moving between unrelated tasks carries a real, measurable cost for you.",
    reframe: "This is the cost of depth, not a lack of flexibility.",
    support: "Batch similar work; protect long uninterrupted blocks; use transition rituals between modes.",
  },
  {
    id: "time-blindness", label: "Time Blindness", source: "attention",
    when: (s) => s.attention >= 0.55 && s.decision >= 0.5,
    description: "Time can disappear inside deep work; estimating how long things take is genuinely difficult.",
    reframe: "When attention is immersive, time loses its grip. This is a feature of how you focus.",
    support: "Use visible external time anchors — ambient timers, soft alarms, calendar nudges with buffers built in.",
  },
  {
    id: "overwhelm", label: "Sensory Overwhelm", source: "sensory",
    when: (s) => s.sensory >= 0.6,
    description: "Environments accumulate. Crowded inputs can shut down clear thinking.",
    reframe: "Your nervous system is doing high-resolution work. The cost of that capacity is needing the right room.",
    support: "Curate your environment as if it were equipment: lighting, sound, texture, scale.",
  },
  {
    id: "emotional-flooding", label: "Emotional Flooding", source: "emotion",
    when: (s) => s.emotion >= 0.65,
    description: "Feelings can arrive at high volume and crowd out the ability to think clearly.",
    reframe: "Speed and depth of feeling is the source of your insight. The same channel can overload.",
    support: "Name the feeling explicitly; slow the body before the mind; let the wave move through before deciding.",
  },
  {
    id: "working-memory", label: "Working Memory Load", source: "learning",
    when: (s) => s.learning >= 0.55,
    description: "Holding many independent items in active memory is harder than holding many connected ones.",
    reframe: "Your mind is built to connect, not to stack. Isolated lists fight against your architecture.",
    support: "Externalize: visible canvases, mind maps, written context — let your environment hold the load.",
  },
  {
    id: "energy-mismatch", label: "Rhythm Mismatch", source: "energy",
    when: (s) => s.energy <= 0.45,
    description: "Linear daily schedules collide with wave-shaped energy — producing on demand is genuinely costly.",
    reframe: "You don't lack discipline. You have a different rhythm than the calendar assumes.",
    support: "Plan in waves: capture peak-energy windows for creative output, protect troughs for recovery and admin.",
  },
  {
    id: "starting-friction", label: "Activation Friction", source: "decision",
    when: (s) => s.decision >= 0.55 && s.attention >= 0.55,
    description: "Crossing from contemplation into action can feel disproportionately hard.",
    reframe: "You don't start until the shape is clear — that's a quality control, not avoidance.",
    support: "Reduce the first step to something smaller than feels reasonable; let momentum do the rest.",
  },
];

// ---------- Operating manual ----------

function buildManual(s: DimensionScores): OperatingManual {
  const thrivesIn: string[] = [];
  const strugglesIn: string[] = [];
  const needsToFunction: string[] = [];
  const ifOverwhelmed: string[] = [];

  if (s.attention >= 0.55) {
    thrivesIn.push("Long, uninterrupted blocks where you can drop into one thing fully.");
    strugglesIn.push("Open-plan interruption patterns and 30-minute calendar grids.");
    needsToFunction.push("Protected deep-work windows treated as non-negotiable.");
  } else {
    thrivesIn.push("Variety — moving between threads, fields, or modes within a day.");
    strugglesIn.push("Single-track work with no permission to switch frames.");
    needsToFunction.push("Permission to follow tangents; a system to capture them, not suppress them.");
  }

  if (s.energy <= 0.45) {
    thrivesIn.push("Wave-shaped scheduling that honors peak-energy windows.");
    strugglesIn.push("Producing on demand inside flat 9-to-5 expectations.");
    needsToFunction.push("Real recovery between surges, not productivity-shaped rest.");
  } else if (s.energy >= 0.6) {
    thrivesIn.push("Steady working rhythms with predictable structure.");
    needsToFunction.push("Sustainable pace — the burnout signal arrives late for you.");
  }

  if (s.sensory >= 0.55) {
    needsToFunction.push("A curated environment: light, sound, and texture you've chosen.");
    ifOverwhelmed.push("Reduce sensory input first. Lower the lights, leave the room, let the nervous system reset.");
  }

  if (s.emotion >= 0.6) {
    ifOverwhelmed.push("Name the feeling explicitly before deciding anything. Let the wave move through.");
    needsToFunction.push("Time to process emotionally before responding strategically.");
  }

  if (s.learning >= 0.55) {
    thrivesIn.push("Visual systems, mind maps, and reference canvases.");
    strugglesIn.push("Long linear task lists with no spatial structure.");
  }

  if (s.creative >= 0.55) {
    thrivesIn.push("Cross-domain work where unrelated ideas can meet.");
  }

  ifOverwhelmed.push("Drop the list. Reduce the next step until it's small enough to feel obvious.");
  ifOverwhelmed.push("Move your body before solving the problem.");

  const decisionPattern =
    s.decision >= 0.6
      ? "Trust the felt sense first; use analysis to confirm, not to override."
      : s.decision <= 0.4
      ? "Lay the variables out explicitly; let structure do the heavy lifting."
      : "Hold intuition and analysis as two readings of the same question.";

  const workingRhythm =
    s.energy <= 0.45
      ? "Wave-shaped — protect the surge, honor the trough."
      : s.energy >= 0.6
      ? "Sustained — steady pace, predictable structure, watch for late burnout."
      : "Mixed — alternate between focused waves and steadier maintenance days.";

  return { thrivesIn, strugglesIn, needsToFunction, ifOverwhelmed, decisionPattern, workingRhythm };
}

// ---------- Public API ----------

export function translate(scores: DimensionScores): Translation {
  const readings: DimensionReading[] = DIMENSIONS.map((d) => {
    const v = scores[d.id];
    const l = lean(v);
    return { dimension: d, score: v, lean: l, meaning: MEANING[d.id][l] };
  });

  const strengths = STRENGTH_TEMPLATES.filter((t) => t.when(scores)).map(
    ({ id, label, source, description }) => ({ id, label, source, description }),
  );

  const challenges = CHALLENGE_TEMPLATES.filter((t) => t.when(scores)).map(
    ({ id, label, source, description, reframe, support }) => ({
      id, label, source, description, reframe, support,
    }),
  );

  return { readings, strengths, challenges, manual: buildManual(scores) };
}