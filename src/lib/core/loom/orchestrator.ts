import { LOOM_MODULES } from "@/lib/loom/modules";
import type { LoomRunRequest, LoomRunResponse } from "./types";
import { getLoomWorkflowHandler, loomWorkflowHandlers } from "./workflows";

export const listLoomModules = () => LOOM_MODULES;

export const listLoomWorkflows = () => loomWorkflowHandlers.map((handler) => ({
  id: `${handler.id}:default`,
  label: handler.label,
  moduleId: handler.id,
  steps: handler.outputKeys.map((key, index) => ({
    id: `${handler.id}:output-${index + 1}`,
    label: key,
    description: `Structured ${key} output from ${handler.label}.`,
  })),
}));

export const runLoom = (request: LoomRunRequest): LoomRunResponse => {
  const handler = getLoomWorkflowHandler(request.moduleId);
  if (!handler) {
    return {
      runId: `loom-unknown-${Date.now()}`,
      moduleId: "signal-collapse",
      label: "Signal Collapse",
      summary: `No Loom module is registered for ${request.moduleId}. The thread was held safely without external calls.`,
      outputs: {
        missingModule: request.moduleId,
        receivedInputs: request.inputs,
      },
      workflow: [
        {
          id: "unknown:receive",
          label: "Receive safely",
          description: "The Loom received the request but did not find a matching module.",
        },
      ],
      nextAction: "Choose a supported Loom module and run the thread again.",
      packet: {
        title: "Unsupported Loom module",
        lines: [`Missing module: ${request.moduleId}`],
        createdAt: new Date().toISOString(),
      },
      externalCalls: [],
    };
  }

  return handler.run(request);
};
