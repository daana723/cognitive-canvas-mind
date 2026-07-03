import {
  unavailable,
  type LoomModule,
  type MirrorResult,
  type ModeId,
  type Result,
  type SparkSketch,
  type CurrentsReading,
} from "@/lib/data/types";
import type { WorkflowTemplate } from "@/lib/modes/workflows";

/**
 * Thin client for the future Loom backend. Every method currently
 * returns `unavailable` — Codex will wire the real endpoints later.
 *
 * Endpoints (contract):
 *   GET  /api/loom/modules
 *   GET  /api/loom/workflows
 *   POST /api/loom/run
 *   POST /api/spark/reflect
 *   POST /api/spark/currents
 *   POST /api/spark/mirror
 */

const AWAITING = "Awaiting Loom engine — will run when connected.";

export interface LoomRunRequest {
  moduleId: string;
  inputs: Record<string, unknown>;
  mode?: ModeId;
}

export interface LoomRunPacket {
  moduleId: string;
  output: unknown;
  ranAt: string;
}

export interface SparkReflectRequest {
  prompt: string;
  body: string;
}

export interface SparkCurrentsRequest {
  values: CurrentsReading["values"];
}

export interface SparkMirrorRequest {
  sketch: SparkSketch;
}

export const loomClient = {
  async listModules(): Promise<Result<LoomModule[]>> {
    return unavailable(AWAITING);
  },
  async listWorkflows(): Promise<Result<WorkflowTemplate[]>> {
    return unavailable(AWAITING);
  },
  async run(_req: LoomRunRequest): Promise<Result<LoomRunPacket>> {
    return unavailable(AWAITING);
  },
  async reflect(_req: SparkReflectRequest): Promise<Result<SparkSketch>> {
    return unavailable(AWAITING);
  },
  async currents(_req: SparkCurrentsRequest): Promise<Result<CurrentsReading>> {
    return unavailable(AWAITING);
  },
  async mirror(_req: SparkMirrorRequest): Promise<Result<MirrorResult>> {
    return unavailable(AWAITING);
  },
};

export default loomClient;