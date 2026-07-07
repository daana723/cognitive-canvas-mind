import flux from "@/assets/archetypes/cartographer.jpg";
import depth from "@/assets/archetypes/deepwell.jpg";
import signal from "@/assets/archetypes/tuner.jpg";
import myth from "@/assets/archetypes/weaver.jpg";
import pulse from "@/assets/archetypes/ember.jpg";

/**
 * Creative Modes are symbolic currents the user *chooses manually*.
 * They are not traits, scores, or assessments. The system never infers
 * a mode — it only stores the one the user selects.
 */

export type ModeId = "flux" | "depth" | "signal" | "myth" | "pulse";

export interface CreativeMode {
  id: ModeId;
  label: string;
  tagline: string;
  essence: string;
  invitation: string;
  image: string;
  accent: string;
  prompts: string[];
}

export const MODES: CreativeMode[] = [
  {
    id: "flux",
    label: "Flux Mode",
    tagline: "Branching ideas, rapid exploration.",
    essence: "A wide, fast aperture. Everything is a possible direction; nothing is committed yet.",
    invitation: "Open many doors at once. Let the ideas multiply before you ask any of them to behave.",
    image: flux,
    accent: "oklch(0.82 0.16 215)",
    prompts: [
      "What are five wildly different directions this could go?",
      "If you had no obligation to finish anything, what would you start?",
      "Sketch the map before you walk it.",
    ],
  },
  {
    id: "depth",
    label: "Depth Mode",
    tagline: "Introspection, pattern-weaving.",
    essence: "Slower current. You are not looking at the work — you are looking into it.",
    invitation: "Sit with one thread. Notice what it touches. Let connections surface without forcing them.",
    image: depth,
    accent: "oklch(0.68 0.18 290)",
    prompts: [
      "What is underneath the obvious version of this?",
      "Which pattern keeps appearing across unrelated pieces?",
      "What's the question this work is really asking?",
    ],
  },
  {
    id: "signal",
    label: "Signal Mode",
    tagline: "Clarity, structure, systems.",
    essence: "The current narrows. You are sorting, sequencing, naming, and finishing.",
    invitation: "Pick the load-bearing thread. Build the scaffold around it. Cut what doesn't carry weight.",
    image: signal,
    accent: "oklch(0.86 0.14 195)",
    prompts: [
      "What is the smallest version of this that still works?",
      "What's the first step, the second step, the last step?",
      "Which three things, if removed, would not be missed?",
    ],
  },
  {
    id: "myth",
    label: "Myth Mode",
    tagline: "Symbolism, narrative, archetypes.",
    essence: "Working in metaphor and image. The literal version isn't ready yet — the story is.",
    invitation: "Tell it as a fable, a map, a creature, a season. Use the symbolic surface to find the real one.",
    image: myth,
    accent: "oklch(0.74 0.22 325)",
    prompts: [
      "What is the shape of this thing if you draw it as a figure?",
      "If this project were a myth, where in the story are you?",
      "What name would the symbol of this work answer to?",
    ],
  },
  {
    id: "pulse",
    label: "Pulse Mode",
    tagline: "Momentum, execution, iteration.",
    essence: "Short cycles. Shipping rough things on purpose to learn what the next rough thing should be.",
    invitation: "Set a small loop. Make. Show. Adjust. Repeat the loop before you redesign it.",
    image: pulse,
    accent: "oklch(0.78 0.16 40)",
    prompts: [
      "What can you put into the world in the next 25 minutes?",
      "What's the next rough version, not the next perfect one?",
      "What did the last loop teach? What does this one test?",
    ],
  },
];

export const getMode = (id: ModeId) => MODES.find((m) => m.id === id)!;
