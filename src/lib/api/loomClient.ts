import {
  ok,
  type CurrentsReading,
  type LoomModule,
  type MirrorResult,
  type ModeId,
  type Result,
  type SparkSketch,
} from "@/lib/data/types";
import { getLoomModule, LOOM_MODULES } from "@/lib/loom/modules";
import { weave, type WeaveInput, type WeavePlan } from "@/lib/loom/orchestrator";
import { WORKFLOWS, type WorkflowTemplate } from "@/lib/loom/workflows";

export interface LoomRunRequest {
  moduleId: string;
  inputs: Record<string, unknown>;
  mode?: ModeId;
}

export interface LoomRunPacket {
  moduleId: string;
  moduleLabel: string;
  output: {
    title: string;
    summary: string;
    artifacts: string[];
    nextSteps: string[];
    weave?: WeavePlan;
  };
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
    return ok(LOOM_MODULES);
  },
  async listWorkflows(): Promise<Result<WorkflowTemplate[]>> {
    return ok(WORKFLOWS);
  },
  async weave(req: WeaveInput): Promise<Result<WeavePlan>> {
    return ok(weave(req));
  },
  async run(req: LoomRunRequest): Promise<Result<LoomRunPacket>> {
    const module = getLoomModule(req.moduleId);
    if (!module) {
      return {
        ok: false,
        reason: "unavailable",
        message: "That Loom module is not registered yet.",
      };
    }

    const inputText = Object.values(req.inputs)
      .flatMap((value) => (Array.isArray(value) ? value : [value]))
      .filter(Boolean)
      .join(" ");
    const plan = weave({
      intention: inputText || module.blurb,
      tags: [module.label, module.agentId ?? "loom", req.mode ?? ""].filter(Boolean),
    });

    return ok({
      moduleId: module.id,
      moduleLabel: module.label,
      output: {
        title: `${module.label} return`,
        summary:
          "The Loom holds the thread. This local placeholder returns structure, not external AI output.",
        artifacts: plan.steps.flatMap((step) => step.expectedArtifacts),
        nextSteps: [
          "Name the clearest signal.",
          "Choose one small vessel for it.",
          "Leave the rest in the field for later.",
        ],
        weave: plan,
      },
      ranAt: new Date().toISOString(),
    });
  },
  async reflect(_req: SparkReflectRequest): Promise<Result<SparkSketch>> {
    return {
      ok: false,
      reason: "unavailable",
      message: "SPARK reflection still runs locally in the UI.",
    };
  },
  async currents(_req: SparkCurrentsRequest): Promise<Result<CurrentsReading>> {
    return {
      ok: false,
      reason: "unavailable",
      message: "SPARK currents still run locally in the UI.",
    };
  },
  async mirror(_req: SparkMirrorRequest): Promise<Result<MirrorResult>> {
    return {
      ok: false,
      reason: "unavailable",
      message: "SPARK mirror still runs locally in the UI.",
    };
  },
};

export default loomClient;
