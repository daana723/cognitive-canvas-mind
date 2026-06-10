import type { DimensionScores } from "../spark/scoring";
import type { IntensityScores } from "../intensities/scoring";

/**
 * Twice-Exceptional (2E) Pattern Reading
 *
 * A 2E signature is the co-occurrence of high cognitive capacity and
 * disproportionate cognitive load. We don't diagnose — we describe the
 * *pattern* when both readings are loud in the same profile.
 *
 * Capacity signal:   high learning + creative + (mind || vision)
 * Load signal:       high sensory || high emotion || low energy || high heart
 * Asynchrony signal: large spread between dimensions (the textbook 2E shape)
 */

export interface TwoEReading {
  present: boolean;
  strength: number;       // 0..1
  capacityScore: number;  // 0..1
  loadScore: number;      // 0..1
  asynchrony: number;     // 0..1 (variance proxy)
  headline: string;
  description: string;
  contradictions: string[];
  recognitions: string[]; // "what tends to be true for this pattern"
}

function variance(values: number[]): number {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const sq = values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;
  return Math.sqrt(sq); // standard deviation
}

export function analyzeTwoE(
  spark: DimensionScores,
  intensities: IntensityScores | undefined,
): TwoEReading {
  const i = intensities ?? {
    drive: 0.5, sense: 0.5, mind: 0.5, vision: 0.5, heart: 0.5,
  };

  const capacity =
    (spark.learning * 0.35) +
    (spark.creative * 0.25) +
    (Math.max(i.mind, i.vision) * 0.25) +
    (spark.attention * 0.15);

  const load =
    (spark.sensory * 0.25) +
    (spark.emotion * 0.20) +
    ((1 - spark.energy) * 0.20) +
    (i.heart * 0.20) +
    (i.drive * 0.15);

  const sparkValues = Object.values(spark);
  const asynchrony = Math.min(1, variance(sparkValues) * 2.4); // normalize

  const strength = Math.min(
    1,
    (capacity * 0.45) + (load * 0.4) + (asynchrony * 0.15),
  );

  // Pattern present when both capacity AND load are above a meaningful line
  const present = capacity >= 0.58 && load >= 0.5;

  const contradictions: string[] = [];
  if (capacity >= 0.6 && load >= 0.55) {
    contradictions.push(
      "Capable of disproportionate output, yet undone by inputs others barely notice.",
    );
  }
  if (spark.learning >= 0.6 && spark.attention >= 0.6 && (1 - spark.energy) >= 0.55) {
    contradictions.push(
      "Deep focus when the wave is up; bewildering inertia when it isn't.",
    );
  }
  if (i.mind >= 0.6 && i.heart >= 0.6) {
    contradictions.push(
      "Sharper thinking than your peers, paired with feeling at a volume they don't share.",
    );
  }
  if (spark.creative >= 0.6 && spark.sensory >= 0.6) {
    contradictions.push(
      "Visible cross-domain creativity, gated by an environment that has to be exactly right.",
    );
  }

  const recognitions: string[] = [];
  if (present) {
    recognitions.push("People often see only one half of you at a time — the capacity or the load, rarely both.");
    recognitions.push("Linear systems usually fail you not because of effort, but because they were built for a narrower distribution.");
    recognitions.push("The cost of the capacity is real. It is not laziness, anxiety, or attitude — it's bandwidth.");
  }

  const headline = present
    ? "Twice-exceptional pattern present."
    : capacity >= 0.6
    ? "High-capacity pattern, low load. The signature is visible without the friction."
    : load >= 0.55
    ? "Load-heavy pattern. Capacity may not yet have a clear surface to land on."
    : "Balanced reading — no strong 2E signal in this snapshot.";

  const description = present
    ? "Your profile reads as twice-exceptional: high cognitive capacity arriving alongside disproportionate cognitive load. These are not separate stories — they're two readings of the same nervous system."
    : capacity >= 0.6
    ? "You carry the capacity half of a 2E pattern without the load half. Capacity can be expressed more directly; the work is finding rooms big enough for it."
    : load >= 0.55
    ? "You carry the load half of a 2E pattern more clearly than the capacity half. That doesn't mean the capacity isn't there — only that conditions haven't surfaced it yet."
    : "Neither capacity nor load is strongly elevated in your current reading. That's also data — the system is running closer to baseline.";

  return {
    present,
    strength,
    capacityScore: capacity,
    loadScore: load,
    asynchrony,
    headline,
    description,
    contradictions,
    recognitions,
  };
}