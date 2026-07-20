export type CognitiveMode =
  | "scattered"
  | "overloaded"
  | "low-energy"
  | "focused"
  | "avoiding"
  | "hyperfocused"
  | "recovering"
  | "emotionally-tangled";

export interface CognitiveState {
  mode: CognitiveMode;
  energy: number;
  focus: number;
  overwhelm: number;
  supportNeed: "micro-steps" | "structure" | "encouragement" | "decision-help" | "decompression";
  note?: string;
  updatedAt: string;
}

export interface PatternMemoryEntry {
  id: string;
  source: "manual" | "loom-run" | "companion";
  observation: string;
  mode?: CognitiveMode;
  moduleId?: string;
  createdAt: string;
}

export interface CognitiveContext {
  state: CognitiveState;
  patterns: PatternMemoryEntry[];
}

export const DEFAULT_COGNITIVE_STATE: CognitiveState = {
  mode: "scattered",
  energy: 3,
  focus: 3,
  overwhelm: 3,
  supportNeed: "structure",
  updatedAt: new Date(0).toISOString(),
};

export const COGNITIVE_MODE_LABELS: Record<CognitiveMode, string> = {
  scattered: "Scattered",
  overloaded: "Overloaded",
  "low-energy": "Low energy",
  focused: "Focused",
  avoiding: "Avoiding",
  hyperfocused: "Hyperfocused",
  recovering: "Recovering",
  "emotionally-tangled": "Emotionally tangled",
};

export const COGNITIVE_MODE_DESCRIPTIONS: Record<CognitiveMode, string> = {
  scattered: "Many threads are active; help me find one clear line.",
  overloaded: "Too much is pressing at once; reduce load and choices.",
  "low-energy": "Capacity is limited; make the next step tiny and kind.",
  focused: "I can go deeper; give me structure with useful depth.",
  avoiding: "Task initiation is sticky; give me a low-friction first move.",
  hyperfocused: "I have momentum; help me use it without burning out.",
  recovering: "I am returning after intensity; keep things gentle and concrete.",
  "emotionally-tangled": "Feelings and meaning are mixed; help me separate the threads.",
};
