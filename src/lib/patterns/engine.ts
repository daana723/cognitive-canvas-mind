import type { DimensionScores } from "../spark/scoring";
import type { IntensityScores } from "../intensities/scoring";
import type { Translation } from "../spark/translation";
import type { IntensityTranslation } from "../intensities/translation";
import type { TwoEReading } from "../twoe/analysis";

/**
 * Pattern Engine
 *
 * Cross-references SPARK + Intensities + 2E into recurring *motifs* —
 * short narratives where two or more readings meet. This is the connective
 * tissue between assessment layers: not new data, but the conversation
 * between layers made visible.
 */

export interface Motif {
  id: string;
  title: string;
  reading: string;
  sources: string[]; // human-readable trace ("Attention × Drive")
  weight: number;    // 0..1
}

export interface PatternMap {
  motifs: Motif[];
  throughline: string;        // the single sentence that ties them
  growthEdge: string;         // where the system is asking to expand
  guardEdge: string;          // where the system asks for protection
}

interface Ctx {
  spark: DimensionScores;
  intensities: IntensityScores | null;
  translation: Translation;
  intensityTranslation: IntensityTranslation | null;
  twoE: TwoEReading;
}

type Rule = (c: Ctx) => Motif | null;

const RULES: Rule[] = [
  // Attention × Drive — kinetic deep work
  ({ spark, intensities }) => {
    if (!intensities) return null;
    if (spark.attention >= 0.55 && intensities.drive >= 0.55) {
      return {
        id: "kinetic-depth",
        title: "Kinetic depth",
        sources: ["Attention (immersive)", "Drive"],
        reading:
          "Your focus goes deep, and your body needs to move while it does. Stillness-only environments fight both of you at once. The fix isn't more discipline — it's a workspace that lets motion stay in the room while attention goes down.",
        weight: (spark.attention + intensities.drive) / 2,
      };
    }
    return null;
  },

  // Sensory × Sense — atmosphere as equipment
  ({ spark, intensities }) => {
    if (!intensities) return null;
    if (spark.sensory >= 0.55 && intensities.sense >= 0.55) {
      return {
        id: "atmosphere-as-equipment",
        title: "Atmosphere is equipment",
        sources: ["Sensory", "Sense"],
        reading:
          "Two channels are saying the same thing: the room shapes the mind. Light, sound, texture, and scale aren't preference — they're working conditions. Curate the environment with the seriousness most people reserve for tools.",
        weight: (spark.sensory + intensities.sense) / 2,
      };
    }
    return null;
  },

  // Emotion × Heart — feeling as bandwidth
  ({ spark, intensities }) => {
    if (!intensities) return null;
    if (spark.emotion >= 0.55 && intensities.heart >= 0.55) {
      return {
        id: "feeling-as-bandwidth",
        title: "Feeling is your bandwidth",
        sources: ["Emotional Processing", "Heart"],
        reading:
          "Emotion arrives fast and loud across both readings. That's the channel you actually think with — and the one that floods first. Building a deliberate pause between feeling and deciding isn't suppression; it's giving the channel room to do its real work.",
        weight: (spark.emotion + intensities.heart) / 2,
      };
    }
    return null;
  },

  // Learning × Vision — symbolic synthesis
  ({ spark, intensities }) => {
    if (!intensities) return null;
    if (spark.learning >= 0.55 && intensities.vision >= 0.55) {
      return {
        id: "symbolic-synthesis",
        title: "Symbolic synthesis",
        sources: ["Learning (associative)", "Vision"],
        reading:
          "You learn by linking, and your inner world generates images and metaphors at high rate. Together this means you understand new domains by *re-shaping* them, not by memorizing them. Use that — diagram, sketch, metaphor — instead of fighting it with lists.",
        weight: (spark.learning + intensities.vision) / 2,
      };
    }
    return null;
  },

  // Creative × Mind — restless making
  ({ spark, intensities }) => {
    if (!intensities) return null;
    if (spark.creative >= 0.55 && intensities.mind >= 0.55) {
      return {
        id: "restless-making",
        title: "Restless making",
        sources: ["Creative (synthesizing)", "Mind"],
        reading:
          "Cross-domain creativity meets a mind that won't stop questioning. You'll keep generating new frames after the work is 'done.' Build deliberate finishing rituals — otherwise the next idea will eat the last one.",
        weight: (spark.creative + intensities.mind) / 2,
      };
    }
    return null;
  },

  // Energy (pulsed) × Heart/Mind — surge made of feeling/thought
  ({ spark, intensities }) => {
    if (!intensities) return null;
    const pulsed = (1 - spark.energy);
    if (pulsed >= 0.55 && (intensities.heart >= 0.55 || intensities.mind >= 0.55)) {
      return {
        id: "meaning-driven-waves",
        title: "Meaning-driven waves",
        sources: ["Energy (pulsed)", intensities.heart >= intensities.mind ? "Heart" : "Mind"],
        reading:
          "Your energy isn't random — it's wave-shaped because it follows meaning. When something matters, the surge appears. The rhythm is calling for projects with real resonance, not more uniform output.",
        weight: (pulsed + Math.max(intensities.heart, intensities.mind)) / 2,
      };
    }
    return null;
  },

  // 2E asynchrony × any high capacity
  ({ twoE }) => {
    if (twoE.asynchrony >= 0.18 && twoE.capacityScore >= 0.55) {
      return {
        id: "asynchronous-shape",
        title: "Asynchronous shape",
        sources: ["SPARK spread", "2E asynchrony"],
        reading:
          "Your dimensions aren't evenly tuned — some run much higher than others. This is the asynchronous shape often described in twice-exceptional profiles. Strengths and friction live next to each other in the same person; designing for the average will under-serve both.",
        weight: Math.min(1, twoE.asynchrony + twoE.capacityScore - 0.4),
      };
    }
    return null;
  },
];

function buildThroughline(c: Ctx, motifs: Motif[]): string {
  if (motifs.length === 0)
    return "Your readings are running near baseline — no single motif dominates. The throughline forms as the system is used.";

  const top = motifs[0];
  if (c.twoE.present)
    return `Across every layer, the same shape: ${top.title.toLowerCase()}, expressed through a twice-exceptional pattern. Capacity and load are reading the same nervous system.`;

  return `The connective tissue across your layers is ${top.title.toLowerCase()} — the place where multiple readings agree on what your system actually wants.`;
}

function buildGrowthEdge(c: Ctx): string {
  if (c.intensityTranslation?.movement.id === "vertical-climb")
    return "Heart, Mind, and Vision are all live. Direct that triangle toward a single project that matters — values are trying to crystallize.";
  if (c.spark.creative >= 0.6 && c.spark.learning >= 0.55)
    return "Your synthesis engine is the growth surface. Make space for cross-domain projects that nobody is asking you to do — that's where your edge is forming.";
  if (c.twoE.capacityScore >= 0.6)
    return "Capacity is asking for a bigger room. Find one assignment, project, or community where the full bandwidth is welcome, not throttled.";
  return "Run the toolkit reflections regularly. The growth edge will surface once the pattern engine has more readings to cross-reference.";
}

function buildGuardEdge(c: Ctx): string {
  if (c.spark.sensory >= 0.6 || (c.intensities && c.intensities.sense >= 0.6))
    return "Environment first. Most cognitive failures in your profile begin as sensory ones — guard the room before you guard the calendar.";
  if (c.spark.emotion >= 0.6 || (c.intensities && c.intensities.heart >= 0.6))
    return "Build the pause between feeling and deciding. The channel that gives you bandwidth also floods first.";
  if (c.intensities && c.intensities.mind >= 0.65)
    return "The Mind intensity doesn't shut off on its own. Build deliberate off-switches — physical, sensory, or social — or it will colonize sleep.";
  return "Notice the cost of context-switching. Your system pays more for it than the calendar suggests.";
}

export function buildPatternMap(ctx: Ctx): PatternMap {
  const motifs = RULES
    .map((r) => r(ctx))
    .filter((m): m is Motif => m !== null)
    .sort((a, b) => b.weight - a.weight);

  return {
    motifs,
    throughline: buildThroughline(ctx, motifs),
    growthEdge: buildGrowthEdge(ctx),
    guardEdge: buildGuardEdge(ctx),
  };
}