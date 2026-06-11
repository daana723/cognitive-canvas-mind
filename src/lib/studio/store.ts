import type { ModeId } from "../modes/modes";
import type { PhaseId } from "../modes/phases";

export interface Snapshot {
  id: string;
  mode: ModeId;
  phase?: PhaseId;
  note: string;
  createdAt: string;
}

export interface Reflection { id: string; body: string; createdAt: string; }
export interface NarrativeNode { id: string; text: string; createdAt: string; }

export interface StudioState {
  currentMode?: ModeId;
  currentPhase?: PhaseId;
  snapshots: Snapshot[];
  reflections: Reflection[];
  narrative: NarrativeNode[];
  narrativeContext: string;
  updatedAt: string;
  version: 1;
}

const KEY = "creative-studio:v1";

const empty: StudioState = {
  snapshots: [],
  reflections: [],
  narrative: [],
  narrativeContext: "",
  updatedAt: new Date(0).toISOString(),
  version: 1,
};

const isBrowser = () => typeof window !== "undefined" && typeof localStorage !== "undefined";

export const studioStore = {
  load(): StudioState {
    if (!isBrowser()) return empty;
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return empty;
      const parsed = JSON.parse(raw) as StudioState;
      return { ...empty, ...parsed };
    } catch { return empty; }
  },
  save(state: StudioState) {
    if (!isBrowser()) return;
    const next = { ...state, updatedAt: new Date().toISOString() };
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  },
  update(mutator: (s: StudioState) => StudioState) {
    const next = mutator(this.load());
    this.save(next);
    return next;
  },
  clear() { if (isBrowser()) localStorage.removeItem(KEY); },
};

export const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id-${Math.random().toString(36).slice(2)}-${Date.now()}`;
