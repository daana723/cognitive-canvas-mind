export type LoomModuleId =
  | "signal-collapse"
  | "editorial"
  | "creative-personas"
  | "launch-packets"
  | "platform-adapter"
  | "serendipity-lab"
  | "creative-operator";

export interface LoomRunRequest {
  moduleId: string;
  inputs: Record<string, unknown>;
  context?: Record<string, unknown>;
}

export interface LoomWorkflowStep {
  id: string;
  label: string;
  description: string;
}

export interface LoomWorkflowHandler {
  id: LoomModuleId;
  label: string;
  role: string;
  outputKeys: string[];
  run: (request: LoomRunRequest) => LoomRunResponse;
}

export interface LoomRunResponse {
  runId: string;
  moduleId: LoomModuleId;
  label: string;
  summary: string;
  outputs: Record<string, unknown>;
  workflow: LoomWorkflowStep[];
  nextAction: string;
  packet: {
    title: string;
    lines: string[];
    createdAt: string;
  };
  externalCalls: [];
}
