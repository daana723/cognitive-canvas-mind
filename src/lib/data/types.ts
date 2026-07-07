/**
 * Stable data contracts shared with Codex (backend).
 * Pure types only - no runtime dependencies on React, routing, fetch, or DOM.
 */

export type ModeId = "flux" | "depth" | "signal" | "myth" | "pulse";
export type PhaseId = "initiation" | "expansion" | "integration" | "synthesis";
export type CurrentId = ModeId;

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
  status: "stub" | "ready";
  inputs: LoomModuleInput[];
}

export interface LoomRunRequest {
  moduleId: string;
  inputs: Record<string, unknown>;
  context?: Record<string, unknown>;
}

export interface LoomRunResponse {
  runId: string;
  moduleId: string;
  label: string;
  summary: string;
  outputs: Record<string, unknown>;
  workflow: Array<{
    id: string;
    label: string;
    description: string;
  }>;
  nextAction: string;
  packet?: unknown;
  externalCalls: [];
}

export interface WorkflowTemplateSummary {
  id: string;
  label: string;
  moduleId?: string;
  modeId?: ModeId;
  steps: Array<{
    id: string;
    label: string;
    description?: string;
  }>;
}

export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; reason: "unavailable"; message: string };

export const unavailable = (message: string): Result<never> => ({
  ok: false,
  reason: "unavailable",
  message,
});

export const ok = <T>(data: T): Result<T> => ({ ok: true, data });
