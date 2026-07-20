/**
 * Stable data contracts shared with Codex (backend).
 * Pure types only - no runtime, no imports from React/DOM/fetch.
 */

export type ModeId = "flux" | "depth" | "signal" | "myth" | "pulse";
export type PhaseId = "spark" | "shape" | "surface" | "ship" | "sit";
export type CurrentId = "flux" | "depth" | "signal" | "myth" | "pulse";

export interface SparkSketch {
  /** Symbolic motifs recognized in the user's reflection (never assigned). */
  motifs: string[];
  /** 0..1 affinity per mode. Recognition, not measurement. */
  modeAffinities: Partial<Record<ModeId, number>>;
  /** Optional heat map of currents at the time of the sketch. */
  currentHeat?: Partial<Record<CurrentId, number>>;
  takenAt: string;
  version: 1;
}

export interface CurrentsReading {
  values: Partial<Record<CurrentId, number>>;
  takenAt: string;
}

export interface MirrorResult {
  motifs: string[];
  suggestedModes: ModeId[];
  note?: string;
}

export interface LoomModuleInput {
  id: string;
  label: string;
  kind: "text" | "longtext" | "select" | "tags";
  placeholder?: string;
  options?: string[];
}

export interface LoomModule {
  id: string;
  label: string;
  blurb: string;
  status: "ready";
  access: "free" | "plus" | "studio";
  inputs: LoomModuleInput[];
}

export type AgentId =
  "loom" | "research" | "content" | "product" | "marketing" | "avatar" | "operations";

export interface WeaveStep {
  agentId: AgentId;
  moduleId: string;
  why: string;
}

export interface WeavePlan {
  intention: string;
  tags: string[];
  agents: AgentId[];
  steps: WeaveStep[];
  artifacts: string[];
  wovenAt: string;
}

export interface WeaveEntry {
  id: string;
  plan: WeavePlan;
}

export interface ModuleRunEntry {
  id: string;
  moduleId: string;
  inputs: Record<string, unknown>;
  output: ModuleRunOutput;
  ranAt: string;
}

export interface ModuleRunSection {
  heading: string;
  bullets: string[];
}

export interface ModuleRunOutput {
  summary: string;
  sections: ModuleRunSection[];
  nextMoves: string[];
}

export type Result<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      reason: "unavailable" | "validation_error" | "not_found" | "execution_error";
      message: string;
      details?: Record<string, unknown>;
    };

export const unavailable = (message: string): Result<never> => ({
  ok: false,
  reason: "unavailable",
  message,
});

export const ok = <T>(data: T): Result<T> => ({ ok: true, data });
