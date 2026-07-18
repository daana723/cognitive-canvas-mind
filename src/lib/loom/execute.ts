import { runLoom } from "@/lib/core/loom";
import type { LoomRunRequest, LoomRunResponse } from "@/lib/data/types";

export const runModule = (request: LoomRunRequest): LoomRunResponse => {
  const response = runLoom(request);
  return {
    ...response,
    summary: `${response.summary} The Loom holds the thread locally; no external calls were made.`,
    externalCalls: [],
  };
};
