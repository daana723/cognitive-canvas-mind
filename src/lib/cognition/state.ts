import {
  COGNITIVE_MODE_LABELS,
  DEFAULT_COGNITIVE_STATE,
  type CognitiveMode,
  type CognitiveState,
} from "@/lib/cognition/types";

export const COGNITIVE_STATE_KEY = "nls:cognitive-state:v1";

const isBrowser = () => typeof window !== "undefined" && typeof localStorage !== "undefined";

const clamp = (value: unknown, fallback: number) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(1, Math.min(5, Math.round(number)));
};

const supportNeeds: CognitiveState["supportNeed"][] = [
  "micro-steps",
  "structure",
  "encouragement",
  "decision-help",
  "decompression",
];

const isMode = (value: unknown): value is CognitiveMode =>
  typeof value === "string" && value in COGNITIVE_MODE_LABELS;

const isSupportNeed = (value: unknown): value is CognitiveState["supportNeed"] =>
  typeof value === "string" && supportNeeds.includes(value as CognitiveState["supportNeed"]);

export function currentDefaultState(): CognitiveState {
  return { ...DEFAULT_COGNITIVE_STATE, updatedAt: new Date().toISOString() };
}

export function normalizeCognitiveState(value: unknown): CognitiveState {
  if (!value || typeof value !== "object") return currentDefaultState();
  const record = value as Partial<CognitiveState>;
  return {
    mode: isMode(record.mode) ? record.mode : DEFAULT_COGNITIVE_STATE.mode,
    energy: clamp(record.energy, DEFAULT_COGNITIVE_STATE.energy),
    focus: clamp(record.focus, DEFAULT_COGNITIVE_STATE.focus),
    overwhelm: clamp(record.overwhelm, DEFAULT_COGNITIVE_STATE.overwhelm),
    supportNeed: isSupportNeed(record.supportNeed)
      ? record.supportNeed
      : DEFAULT_COGNITIVE_STATE.supportNeed,
    note: typeof record.note === "string" ? record.note.slice(0, 600) : undefined,
    updatedAt: typeof record.updatedAt === "string" ? record.updatedAt : new Date().toISOString(),
  };
}

export const cognitiveStateStore = {
  load(): CognitiveState {
    if (!isBrowser()) return currentDefaultState();
    try {
      const raw = localStorage.getItem(COGNITIVE_STATE_KEY);
      return raw ? normalizeCognitiveState(JSON.parse(raw)) : currentDefaultState();
    } catch {
      return currentDefaultState();
    }
  },
  save(state: CognitiveState): CognitiveState {
    const normalized = normalizeCognitiveState({ ...state, updatedAt: new Date().toISOString() });
    if (isBrowser()) localStorage.setItem(COGNITIVE_STATE_KEY, JSON.stringify(normalized));
    return normalized;
  },
};
