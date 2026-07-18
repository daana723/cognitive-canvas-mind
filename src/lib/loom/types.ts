import type { WEAVING_PHASES } from "@/lib/loom/phases";

export type LoomModuleId =
  | "signal-collapse"
  | "editorial"
  | "creative-personas"
  | "launch-packets"
  | "platform-adapter"
  | "serendipity-lab"
  | "creative-operator";

export type LoomRunStatus = "queued" | "running" | "succeeded" | "failed" | "timed_out" | "retried";

export type LoomErrorCode =
  "VALIDATION_ERROR" | "MODULE_NOT_FOUND" | "WORKFLOW_FAILED" | "TIMEOUT" | "PROVIDER_UNAVAILABLE";

export type LoomProviderId =
  "local-deterministic" | "gemini-flash" | "deepseek-venice" | "lm-studio";

export interface LoomStructuredError {
  code: LoomErrorCode;
  message: string;
  recoverable: boolean;
  details?: Record<string, unknown>;
}

export interface LoomExecutionMetadata {
  idempotencyKey: string;
  providerId: LoomProviderId;
  status: LoomRunStatus;
  attempts: number;
  maxRetries: number;
  timeoutMs: number;
  queuedAt: string;
  startedAt: string;
  completedAt: string;
  durationMs: number;
  externalCalls: [];
}

export interface LoomRunOptions {
  idempotencyKey?: string;
  maxRetries?: number;
  timeoutMs?: number;
  providerId?: LoomProviderId;
}

export interface LoomModuleInput {
  id: string;
  label: string;
  kind: "text" | "longtext" | "select" | "tags";
  placeholder?: string;
  options?: string[];
}

export interface LoomModule {
  id: LoomModuleId;
  label: string;
  blurb: string;
  status: "stub" | "ready";
  inputs: LoomModuleInput[];
}

export interface LoomRunRequest {
  moduleId: string;
  inputs: Record<string, unknown>;
  context?: Record<string, unknown>;
  options?: LoomRunOptions;
}

export interface LoomWorkflowStep {
  id: string;
  label: string;
  description: string;
}

export interface LoomRunPacket {
  title: string;
  lines: string[];
  createdAt: string;
}

export interface LoomRunResponse {
  runId: string;
  moduleId: LoomModuleId;
  label: string;
  summary: string;
  outputs: Record<string, unknown>;
  workflow: LoomWorkflowStep[];
  nextAction: string;
  packet?: LoomRunPacket;
  status: LoomRunStatus;
  error?: LoomStructuredError;
  metadata: LoomExecutionMetadata;
  externalCalls: [];
}

export interface LoomWorkflowHandler {
  id: LoomModuleId;
  label: string;
  role: string;
  outputKeys: string[];
  run: (
    request: LoomRunRequest,
  ) => Omit<LoomRunResponse, "status" | "metadata" | "externalCalls"> & { externalCalls?: [] };
}

export interface WeaveIntentionRequest {
  body: string;
  tags?: string[];
  options?: LoomRunOptions;
}

export interface WeaveStep {
  id: string;
  agentId: string;
  agentLabel: string;
  moduleId: LoomModuleId;
  moduleLabel: string;
  why: string;
}

export interface WeavePlan {
  weaveId: string;
  intention: string;
  tags: string[];
  agents: string[];
  steps: WeaveStep[];
  artifacts: string[];
  phases: typeof WEAVING_PHASES;
  summary: string;
  nextAction: string;
  createdAt: string;
  metadata: LoomExecutionMetadata;
  externalCalls: [];
}

export interface LoomWeaveRecord {
  id: string;
  createdAt: string;
  intention: string;
  tags: string[];
  plan: unknown;
}

export interface LoomModuleRunRecord {
  id: string;
  createdAt: string;
  moduleId: string;
  inputs: Record<string, unknown>;
  response: LoomRunResponse;
}
export interface WorkflowTemplateSummary {
  id: string;
  label: string;
  moduleId?: LoomModuleId;
  modeId?: string;
  steps: Array<{
    id: string;
    label: string;
    description?: string;
  }>;
}

export interface LoomProviderRequest {
  operation: "weave" | "run";
  payload: Record<string, unknown>;
  metadata: LoomExecutionMetadata;
}

export interface LoomProviderResult {
  providerId: LoomProviderId;
  content: Record<string, unknown>;
  externalCalls: [];
}

export interface LoomProvider {
  id: LoomProviderId;
  label: string;
  mode: "local" | "remote";
  isConfigured: () => boolean;
  generate: (request: LoomProviderRequest) => Promise<LoomProviderResult>;
}
