/**
 * The Intensities — a translation of Dąbrowski's five overexcitabilities (OEs)
 * into Cognitive Layer's own language. Same structural model, no jargon
 * on the surface; the underlying framework is credited inside the detail.
 *
 *   Drive   ← Psychomotor OE
 *   Sense   ← Sensual OE
 *   Mind    ← Intellectual OE
 *   Vision  ← Imaginational OE
 *   Heart   ← Emotional OE
 *
 * Intensities describe *where your nervous system runs hot* — channels of
 * extra current that ND minds often carry, framed as fuel rather than excess.
 */

export type IntensityId = "drive" | "sense" | "mind" | "vision" | "heart";

export interface Intensity {
  id: IntensityId;
  label: string;
  origin: string;        // the named OE (shown only on detail surfaces)
  essence: string;       // one-line poetic summary
  description: string;   // plain-language reading
  signature: string;     // how it shows up in the body / behavior
}

export const INTENSITIES: Intensity[] = [
  {
    id: "drive",
    label: "Drive",
    origin: "Psychomotor intensity",
    essence: "Kinetic surplus — motion as a way of thinking.",
    description:
      "An extra current of physical and mental restlessness. You move while you think; stillness without purpose feels louder than work.",
    signature: "Pacing, tapping, gesturing while talking, working in bursts, exercise as regulation.",
  },
  {
    id: "sense",
    label: "Sense",
    essence: "The world arrives in high resolution.",
    origin: "Sensual intensity",
    description:
      "A wide aperture for texture, color, light, sound, taste, and atmosphere. Beauty is not decoration for you — it's a system input.",
    signature: "Strong aesthetic responses, comfort/discomfort tied to materials, deep absorption in sensory pleasure.",
  },
  {
    id: "mind",
    label: "Mind",
    origin: "Intellectual intensity",
    essence: "Thinking that won't switch off.",
    description:
      "A relentless engine of questioning, analyzing, and pattern-tracking. You're more bothered by an unfinished idea than by an unfinished task.",
    signature: "Long thought spirals, late-night research, irritation with shallow answers, hunger for first principles.",
  },
  {
    id: "vision",
    label: "Vision",
    origin: "Imaginational intensity",
    essence: "An inner world running in parallel.",
    description:
      "Vivid imagery, scenarios, metaphors, and possible futures playing alongside the present moment. The line between literal and symbolic stays porous.",
    signature: "Rich inner narration, dreams that linger, easy metaphor, escape into imagined worlds when overwhelmed.",
  },
  {
    id: "heart",
    label: "Heart",
    origin: "Emotional intensity",
    essence: "Feeling at higher amplitude and depth.",
    description:
      "Emotions arrive faster, larger, and with more nuance than most rooms expect. You feel for and with others as if the boundary were thinner.",
    signature: "Strong empathic resonance, lasting affective memory, intensity in attachment and meaning-making.",
  },
];

export const getIntensity = (id: IntensityId) =>
  INTENSITIES.find((i) => i.id === id)!;