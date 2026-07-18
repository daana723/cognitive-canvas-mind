import { getLoomModule, LOOM_MODULES } from "@/lib/loom/modules";
import { loomRunRequestSchema } from "@/lib/loom/schemas";
import type {
  LoomExecutionMetadata,
  LoomModuleId,
  LoomRunOptions,
  LoomRunRequest,
  LoomRunResponse,
  LoomStructuredError,
  WorkflowTemplateSummary,
} from "@/lib/loom/types";
import {
  getLoomWorkflowHandler,
  loomWorkflowHandlers,
  normalizeLoomModuleId,
} from "@/lib/loom/workflows";

const DEFAULT_TIMEOUT_MS = 2000;
const DEFAULT_MAX_RETRIES = 0;

const now = () => new Date().toISOString();

const hash = (value: string) => {
  let h = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    h ^= value.charCodeAt(index);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36);
};

export const createIdempotencyKey = (prefix: string, payload: unknown) =>
  `${prefix}-${hash(JSON.stringify(payload))}`;

const metadata = (
  options: LoomRunOptions | undefined,
  status: LoomExecutionMetadata["status"],
  attempts: number,
  queuedAt: string,
  startedAt: string,
  completedAt: string,
  payload: unknown,
): LoomExecutionMetadata => ({
  idempotencyKey: options?.idempotencyKey ?? createIdempotencyKey("loom", payload),
  providerId: options?.providerId ?? "local-deterministic",
  status,
  attempts,
  maxRetries: options?.maxRetries ?? DEFAULT_MAX_RETRIES,
  timeoutMs: options?.timeoutMs ?? DEFAULT_TIMEOUT_MS,
  queuedAt,
  startedAt,
  completedAt,
  durationMs: Math.max(0, Date.parse(completedAt) - Date.parse(startedAt)),
  externalCalls: [],
});

const structuredError = (error: LoomStructuredError) => error;

const failedRun = (
  request: LoomRunRequest,
  error: LoomStructuredError,
  options?: LoomRunOptions,
  attempts = 1,
): LoomRunResponse => {
  const queuedAt = now();
  const startedAt = queuedAt;
  const completedAt = now();
  const normalized = normalizeLoomModuleId(request.moduleId) ?? "signal-collapse";
  const module = getLoomModule(normalized);
  return {
    runId: `loom-failed-${metadata(options, "failed", attempts, queuedAt, startedAt, completedAt, request).idempotencyKey}`,
    moduleId: normalized,
    label: module?.label ?? "Loom module",
    summary: error.message,
    outputs: {
      errorCode: error.code,
      receivedModuleId: request.moduleId,
      receivedInputs: request.inputs,
    },
    workflow: [
      {
        id: "loom:failure",
        label: "Hold safely",
        description: "The Loom stopped before execution and returned an audit-safe error.",
      },
    ],
    nextAction: error.recoverable
      ? "Adjust the input and run the module again."
      : "Choose a supported Loom module.",
    packet: {
      title: "Loom execution stopped",
      lines: [error.message],
      createdAt: completedAt,
    },
    status: "failed",
    error,
    metadata: metadata(options, "failed", attempts, queuedAt, startedAt, completedAt, request),
    externalCalls: [],
  };
};

const validateModuleInputs = (
  moduleId: LoomModuleId,
  inputs: Record<string, unknown>,
): LoomStructuredError | null => {
  const module = getLoomModule(moduleId);
  if (!module) {
    return structuredError({
      code: "MODULE_NOT_FOUND",
      message: `No Loom module is registered for ${moduleId}.`,
      recoverable: false,
    });
  }

  const missing = module.inputs
    .filter((input) => inputs[input.id] === undefined)
    .map((input) => input.id);
  if (missing.length > 0) {
    return structuredError({
      code: "VALIDATION_ERROR",
      message: `Missing required Loom input${missing.length === 1 ? "" : "s"}: ${missing.join(", ")}.`,
      recoverable: true,
      details: { missing },
    });
  }

  const invalidSelect = module.inputs.find(
    (input) =>
      input.kind === "select" &&
      input.options &&
      !input.options.includes(String(inputs[input.id] ?? "")),
  );
  if (invalidSelect) {
    return structuredError({
      code: "VALIDATION_ERROR",
      message: `${invalidSelect.label} must be one of: ${invalidSelect.options?.join(", ")}.`,
      recoverable: true,
      details: { inputId: invalidSelect.id, allowed: invalidSelect.options },
    });
  }

  return null;
};

export const listLoomModules = () => LOOM_MODULES;

export const listLoomWorkflows = (): WorkflowTemplateSummary[] =>
  loomWorkflowHandlers.map((handler) => ({
    id: `${handler.id}:default`,
    label: handler.label,
    moduleId: handler.id,
    steps: handler.outputKeys.map((key, index) => ({
      id: `${handler.id}:output-${index + 1}`,
      label: key,
      description: `Structured ${key} output from ${handler.label}.`,
    })),
  }));

export const runModule = (request: LoomRunRequest): LoomRunResponse => {
  const parsed = loomRunRequestSchema.safeParse(request);
  const options = request.options;
  if (!parsed.success) {
    return failedRun(
      request,
      structuredError({
        code: "VALIDATION_ERROR",
        message: "The Loom run request did not match the expected shape.",
        recoverable: true,
        details: { issues: parsed.error.issues },
      }),
      options,
    );
  }

  const normalized = normalizeLoomModuleId(parsed.data.moduleId);
  if (!normalized) {
    return failedRun(
      request,
      structuredError({
        code: "MODULE_NOT_FOUND",
        message: `No Loom module is registered for ${parsed.data.moduleId}.`,
        recoverable: false,
      }),
      options,
    );
  }

  const inputError = validateModuleInputs(normalized, parsed.data.inputs);
  if (inputError) return failedRun({ ...request, moduleId: normalized }, inputError, options);

  const handler = getLoomWorkflowHandler(normalized);
  if (!handler) {
    return failedRun(
      { ...request, moduleId: normalized },
      structuredError({
        code: "MODULE_NOT_FOUND",
        message: `No Loom workflow handler is registered for ${normalized}.`,
        recoverable: false,
      }),
      options,
    );
  }

  const maxRetries = options?.maxRetries ?? DEFAULT_MAX_RETRIES;
  let attempt = 0;
  let lastError: unknown;
  while (attempt <= maxRetries) {
    attempt += 1;
    const queuedAt = now();
    const startedAt = queuedAt;
    try {
      const response = handler.run({ ...parsed.data, moduleId: normalized });
      const completedAt = now();
      const meta = metadata(
        options,
        "succeeded",
        attempt,
        queuedAt,
        startedAt,
        completedAt,
        parsed.data,
      );
      return {
        ...response,
        runId: response.runId.replace(/$/, `-${meta.idempotencyKey}`),
        moduleId: normalized,
        summary: `${response.summary} The Loom holds the thread locally; no external calls were made.`,
        status: "succeeded",
        metadata: meta,
        externalCalls: [],
      };
    } catch (error) {
      lastError = error;
    }
  }

  return failedRun(
    { ...request, moduleId: normalized },
    structuredError({
      code: "WORKFLOW_FAILED",
      message:
        lastError instanceof Error
          ? lastError.message
          : "The Loom workflow failed before returning a packet.",
      recoverable: true,
    }),
    options,
    attempt,
  );
};

export const runLoom = runModule;
