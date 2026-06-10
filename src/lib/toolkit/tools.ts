import type { DimensionScores } from "../spark/scoring";
import type { Translation } from "../spark/translation";

/**
 * Adaptive Toolkit
 *
 * Each tool is a small interactive surface. Recommendations are
 * personalized: each tool reads from the Translation layer to produce
 * prompts that fit the user's specific cognitive signature.
 */

export type ToolId =
  | "emotion"
  | "sensory"
  | "focus"
  | "time"
  | "task"
  | "discovery";

export interface ToolDefinition {
  id: ToolId;
  name: string;
  essence: string;
  description: string;
  prompts: (s: DimensionScores, t: Translation) => string[];
}

export const TOOLS: ToolDefinition[] = [
  {
    id: "emotion",
    name: "Emotion Navigator",
    essence: "Find the shape of the feeling before you decide.",
    description:
      "A short guided pass to name what's actually happening underneath, so emotion becomes information instead of noise.",
    prompts: (s) => {
      const high = s.emotion >= 0.6;
      return [
        high
          ? "Where in your body is this feeling sitting right now? Be specific."
          : "Pause and check: is there a feeling underneath this that hasn't surfaced yet?",
        "If this feeling had a single word, what word would it actually be — not the polite one?",
        high
          ? "What is this feeling trying to tell you that's worth listening to?"
          : "What would change if you let this matter as much as it actually does?",
        "What's the smallest honest thing you can do for yourself in the next ten minutes?",
      ];
    },
  },
  {
    id: "sensory",
    name: "Sensory Check-In",
    essence: "Read the room before you read the work.",
    description:
      "A two-minute scan of your environment to surface what's loading your nervous system before you try to think.",
    prompts: (s) => {
      const high = s.sensory >= 0.55;
      return [
        "Light: too bright, too dim, or right? Adjust before you read the next line.",
        "Sound: what's in the background that you've been working around but not noticing?",
        high
          ? "Texture and clothing — anything pulling at your attention without permission?"
          : "Is there any sensory input you'd remove if you could?",
        "Temperature, hunger, water — which of these is silently shaping your mood right now?",
        "One change you can make in the next thirty seconds. Make it.",
      ];
    },
  },
  {
    id: "focus",
    name: "Focus Support",
    essence: "Build the runway your attention actually needs.",
    description:
      "Conditions for entering focus, tuned to whether your attention is immersive, exploratory, or both.",
    prompts: (s) => {
      if (s.attention >= 0.6)
        return [
          "Close every tab and surface that isn't the one thing.",
          "Decide on a single concrete deliverable for this session. Name it out loud.",
          "Set a soft external anchor — a timer, an ambient track — so time stays visible.",
          "Give yourself permission to go long. Calendar the recovery on the other side.",
        ];
      return [
        "Pick two related threads, not one — your attention prefers a small constellation.",
        "Set a visible canvas where you can move between them without losing context.",
        "Capture tangents as you go — don't suppress them, just park them somewhere you trust.",
        "Use a soft timer to mark the edges of the session, not to police it.",
      ];
    },
  },
  {
    id: "time",
    name: "Time Helper",
    essence: "Make time visible from outside your head.",
    description:
      "Anti-time-blindness scaffolding for the kind of attention that loses hours inside good work.",
    prompts: (s) => {
      const wave = s.energy <= 0.45;
      return [
        "Estimate how long the next task will take. Now double it. That's the working estimate.",
        wave
          ? "Is this a peak window or a trough window for you right now? Plan accordingly."
          : "Where are you in your day's rhythm — opening, peak, fade?",
        "Set a visible anchor: an ambient clock, a soft chime at 45 minutes, a calendar block with a real edge.",
        "Decide in advance what 'enough' looks like. Without that, time doesn't bind.",
      ];
    },
  },
  {
    id: "task",
    name: "Task Breaker",
    essence: "Reduce the next step until it's smaller than reasonable.",
    description:
      "When activation feels heavy, this is the move: shrink the next step to something almost-trivial.",
    prompts: (s) => {
      const associative = s.learning >= 0.55;
      return [
        "Write down the task in one sentence. If it takes more than one sentence, it's actually three tasks.",
        associative
          ? "Sketch the task as a small map, not a list. Where does it connect to things you already know?"
          : "Lay out the steps in order. The smallest one becomes the first.",
        "What's the next physical action — something your hands could do in the next 90 seconds?",
        "Start with that. Don't promise yourself anything beyond it.",
      ];
    },
  },
  {
    id: "discovery",
    name: "Discovery Journal",
    essence: "Catch the pattern while it's still half-formed.",
    description:
      "A space to notice what's emerging — for minds that learn by connection and synthesis rather than by linear capture.",
    prompts: (s) => {
      const synth = s.creative >= 0.55;
      return [
        "What's the question your attention keeps returning to, even when you don't ask it to?",
        synth
          ? "Which two ideas from different worlds have started showing up near each other in your head?"
          : "What's the one thing you keep refining — that you'd quietly like to take further?",
        "If today were a sentence, what would the sentence be?",
        "What signal is small now that you suspect will be loud later?",
      ];
    },
  },
];

export function getTool(id: ToolId) {
  return TOOLS.find((t) => t.id === id);
}