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

export type {
  LoomExecutionMetadata,
  LoomModule,
  LoomModuleId,
  LoomModuleInput,
  LoomModuleRunRecord,
  LoomProvider,
  LoomProviderId,
  LoomRunOptions,
  LoomRunPacket,
  LoomRunRequest,
  LoomRunResponse,
  LoomRunStatus,
  LoomStructuredError,
  LoomWeaveRecord,
  LoomWorkflowHandler,
  LoomWorkflowStep,
  WeaveIntentionRequest,
  WeavePlan,
  WeaveStep,
  WorkflowTemplateSummary,
} from "@/lib/loom/types";

export type Result<T> =
  { ok: true; data: T } | { ok: false; reason: "unavailable"; message: string };

export const unavailable = (message: string): Result<never> => ({
  ok: false,
  reason: "unavailable",
  message,
});

export const ok = <T>(data: T): Result<T> => ({ ok: true, data });
