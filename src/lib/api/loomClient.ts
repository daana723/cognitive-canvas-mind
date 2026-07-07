import {
  ok,
  type CurrentsReading,
  type LoomModule,
  type LoomRunRequest,
  type LoomRunResponse,
  type MirrorResult,
  type ModeId,
  type Result,
  type SparkSketch,
  type WorkflowTemplateSummary,
} from "@/lib/data/types";
import { listLoomModules, listLoomWorkflows, runLoom } from "@/lib/core/loom";

/**
 * Local-first Loom client. The same contract can later be backed by HTTP,
 * but today it calls the framework-agnostic local Loom engine directly.
 */

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

const modeOrder: ModeId[] = ["flux", "depth", "signal", "myth", "pulse"];

const topModes = (affinities: Partial<Record<ModeId, number>>) =>
  [...modeOrder]
    .sort((left, right) => (affinities[right] ?? 0) - (affinities[left] ?? 0))
    .slice(0, 2);

const motifFromText = (text: string) => {
  const lowered = text.toLowerCase();
  if (lowered.includes("launch") || lowered.includes("ship")) return "launch readiness";
  if (lowered.includes("voice") || lowered.includes("persona")) return "voice testing";
  if (lowered.includes("many") || lowered.includes("ideas")) return "branching field";
  if (lowered.includes("structure") || lowered.includes("clear")) return "load-bearing signal";
  return "working thread";
};

export const loomClient = {
  async listModules(): Promise<Result<LoomModule[]>> {
    return ok(listLoomModules());
  },
  async listWorkflows(): Promise<Result<WorkflowTemplateSummary[]>> {
    return ok(listLoomWorkflows());
  },
  async run(req: LoomRunRequest): Promise<Result<LoomRunResponse>> {
    return ok(runLoom(req));
  },
  async reflect(req: SparkReflectRequest): Promise<Result<SparkSketch>> {
    const combined = `${req.prompt} ${req.body}`.trim();
    const motif = motifFromText(combined);
    return ok({
      motifs: [motif],
      modeAffinities: {
        flux: combined.length > 180 ? 0.72 : 0.42,
        depth: combined.includes("why") || combined.includes("pattern") ? 0.74 : 0.5,
        signal: combined.includes("clear") || combined.includes("structure") ? 0.78 : 0.48,
        myth: combined.includes("image") || combined.includes("story") ? 0.7 : 0.38,
        pulse: combined.includes("ship") || combined.includes("next") ? 0.76 : 0.44,
      },
      takenAt: new Date().toISOString(),
      version: 1,
    });
  },
  async currents(req: SparkCurrentsRequest): Promise<Result<CurrentsReading>> {
    return ok({
      values: req.values,
      takenAt: new Date().toISOString(),
    });
  },
  async mirror(req: SparkMirrorRequest): Promise<Result<MirrorResult>> {
    const suggestedModes = topModes(req.sketch.modeAffinities);
    return ok({
      motifs: req.sketch.motifs,
      suggestedModes,
      note: "This is a mirror, not a measurement. Suggested modes are invitations the user can accept, ignore, or revise.",
    });
  },
};

export default loomClient;
