import {
  ok,
  unavailable,
  type CurrentsReading,
  type LoomModule,
  type MirrorResult,
  type ModeId,
  type ModuleRunOutput,
  type Result,
  type SparkSketch,
  type WeavePlan,
} from "@/lib/data/types";
import type { WorkflowTemplate } from "@/lib/modes/workflows";
import { runModule } from "@/lib/loom/execute";
import { getLoomModule, LOOM_MODULES } from "@/lib/loom/modules";
import { weave as localWeave, type WeaveRequest } from "@/lib/loom/orchestrator";

/**
 * Thin client for the future Loom backend. The app talks only to this boundary;
 * today's implementation is deterministic, local-first, and network-free.
 *
 * Endpoints (contract):
 *   GET  /api/loom/modules
 *   GET  /api/loom/workflows
 *   POST /api/loom/run
 *   POST /api/spark/reflect
 *   POST /api/spark/currents
 *   POST /api/spark/mirror
 */

const AWAITING = "Awaiting Loom engine - will run when connected.";

/** Flip to true once Codex wires a real backend. */
const USE_REMOTE_LOOM = false;
const USE_LM_STUDIO = import.meta.env.VITE_LOOM_USE_LM_STUDIO === "true";

type ErrorReason = Exclude<Result<never>, { ok: true }>["reason"];

const errorResult = <T>(
  reason: ErrorReason,
  message: string,
  details?: Record<string, unknown>,
): Result<T> => ({ ok: false, reason, message, details });

const isFilled = (value: unknown) =>
  Array.isArray(value)
    ? value.some((item) => String(item).trim().length > 0)
    : String(value ?? "").trim().length > 0;

export interface LoomRunRequest {
  moduleId: string;
  inputs: Record<string, unknown>;
  mode?: ModeId;
}

export interface LoomRunPacket {
  moduleId: string;
  output: ModuleRunOutput;
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
    if (USE_REMOTE_LOOM) return unavailable(AWAITING);
    return ok(LOOM_MODULES);
  },
  async listWorkflows(): Promise<Result<WorkflowTemplate[]>> {
    return unavailable(AWAITING);
  },
  async run(req: LoomRunRequest): Promise<Result<LoomRunPacket>> {
    if (USE_REMOTE_LOOM) return unavailable(AWAITING);

    const mod = getLoomModule(req.moduleId);
    if (!mod) {
      return errorResult("not_found", `No Loom module is registered for "${req.moduleId}".`, {
        moduleId: req.moduleId,
      });
    }

    const invalidSelect = mod.inputs.find(
      (input) =>
        input.kind === "select" &&
        isFilled(req.inputs[input.id]) &&
        !input.options?.includes(String(req.inputs[input.id])),
    );

    if (invalidSelect) {
      return errorResult(
        "validation_error",
        `"${invalidSelect.label}" needs one of the supported options.`,
        { field: invalidSelect.id, options: invalidSelect.options ?? [] },
      );
    }

    if (USE_LM_STUDIO) {
      try {
        const { runLoomModuleWithLocalModel } = await import("@/lib/api/loomLmStudio.functions");
        const output = await runLoomModuleWithLocalModel({
          data: { moduleId: req.moduleId, inputs: req.inputs },
        });
        return ok({ moduleId: req.moduleId, output, ranAt: new Date().toISOString() });
      } catch (cause) {
        console.warn("LM Studio Loom run failed; falling back to deterministic runner.", cause);
      }
    }

    try {
      const output = runModule(req.moduleId, req.inputs);
      return ok({ moduleId: req.moduleId, output, ranAt: new Date().toISOString() });
    } catch (cause) {
      return errorResult("execution_error", "The Loom could not complete this local module run.", {
        moduleId: req.moduleId,
        cause: cause instanceof Error ? cause.message : String(cause),
      });
    }
  },
  async weave(req: WeaveRequest): Promise<Result<WeavePlan>> {
    if (USE_REMOTE_LOOM) return unavailable(AWAITING);
    if (!req.body.trim()) {
      return errorResult("validation_error", "Give the Loom at least one thread to hold.", {
        field: "body",
      });
    }
    return ok(localWeave(req));
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
