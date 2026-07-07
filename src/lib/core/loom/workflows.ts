import type { LoomModuleId, LoomRunRequest, LoomRunResponse, LoomWorkflowHandler, LoomWorkflowStep } from "./types";

const now = () => new Date().toISOString();

const asText = (value: unknown, fallback: string) => {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (Array.isArray(value) && value.length) return value.join(", ");
  return fallback;
};

const makeRun = (
  handler: Pick<LoomWorkflowHandler, "id" | "label" | "role" | "outputKeys">,
  request: LoomRunRequest,
  steps: LoomWorkflowStep[],
  nextAction: string,
  outputs: Record<string, unknown>,
): LoomRunResponse => {
  const createdAt = now();
  const seed = asText(request.inputs.field ?? request.inputs.draft ?? request.inputs.source ?? request.inputs.topic ?? request.inputs.project ?? request.inputs.log, "Untitled thread");

  return {
    runId: `loom-${handler.id}-${createdAt.replace(/[^0-9]/g, "").slice(0, 14)}`,
    moduleId: handler.id,
    label: handler.label,
    summary: `${handler.label} received the thread and returned a practical, local-first packet. ${handler.role}`,
    outputs,
    workflow: steps,
    nextAction,
    packet: {
      title: `${handler.label}: ${seed.slice(0, 72)}`,
      lines: [
        `Input thread: ${seed}`,
        `Outputs: ${handler.outputKeys.join(", ")}`,
        `Next action: ${nextAction}`,
      ],
      createdAt,
    },
    externalCalls: [],
  };
};

const baseSteps = (id: LoomModuleId, focus: string): LoomWorkflowStep[] => [
  {
    id: `${id}:receive`,
    label: "Receive the thread",
    description: "Capture the raw input without judging, scoring, or interpreting the person behind it.",
  },
  {
    id: `${id}:shape`,
    label: "Shape the working pattern",
    description: focus,
  },
  {
    id: `${id}:return`,
    label: "Return a usable packet",
    description: "Give the user structured output and one next practical move.",
  },
];

export const loomWorkflowHandlers: LoomWorkflowHandler[] = [
  {
    id: "signal-collapse",
    label: "Signal Collapse",
    role: "Compresses a scattered field into the load-bearing thread.",
    outputKeys: ["coreSignal", "supportingThreads", "nextMove"],
    run: (request) => makeRun(
      loomWorkflowHandlers[0],
      request,
      baseSteps("signal-collapse", "Separate signal from noise and name the smallest clear spine."),
      "Name the core signal in one sentence, then choose the smallest next move.",
      {
        coreSignal: asText(request.inputs.field, "A scattered field is ready to become one clear thread."),
        supportingThreads: [asText(request.inputs.constraint, "No constraint named yet")],
        nextMove: "Write the one-sentence promise of the work.",
      },
    ),
  },
  {
    id: "editorial",
    label: "Editorial Studio",
    role: "Shapes rough material into publishable form without flattening it.",
    outputKeys: ["editorialFrame", "outline", "readerPromise"],
    run: (request) => makeRun(
      loomWorkflowHandlers[1],
      request,
      baseSteps("editorial", "Find the reader promise, then arrange the draft around it."),
      "Draft the opening around the reader promise before polishing any section.",
      {
        editorialFrame: asText(request.inputs.intent, "Clarify what the reader should leave with."),
        outline: ["Opening signal", "Three load-bearing beats", "Closing invitation"],
        readerPromise: asText(request.inputs.intent, "A clearer path through the material."),
      },
    ),
  },
  {
    id: "creative-personas",
    label: "Creative Personas",
    role: "Voices the work through distinct creative perspectives to find its real one.",
    outputKeys: ["personaSet", "voiceNotes", "bestUse"],
    run: (request) => makeRun(
      loomWorkflowHandlers[2],
      request,
      baseSteps("creative-personas", "Use perspectives as drafting tools, not identity labels."),
      "Choose one persona as a temporary voice and draft a short sample through it.",
      {
        personaSet: asText(request.inputs.voices, "curator, skeptic, apprentice").split(/,\s*/),
        voiceNotes: `Topic: ${asText(request.inputs.topic, "Untitled topic")}`,
        bestUse: "Use personas to test expression, not to define the creator.",
      },
    ),
  },
  {
    id: "launch-packets",
    label: "Launch Packets",
    role: "Assembles the small artifacts a release actually needs.",
    outputKeys: ["checklist", "channels", "missingPiece"],
    run: (request) => makeRun(
      loomWorkflowHandlers[3],
      request,
      baseSteps("launch-packets", "Turn launch anxiety into a compact checklist and readiness state."),
      "Fill the missing piece before adding another channel.",
      {
        checklist: ["final title", "short description", "asset", "channel copy", "publish note"],
        channels: asText(request.inputs.channels, "No channels named yet"),
        missingPiece: "Name the single item blocking release readiness.",
      },
    ),
  },
  {
    id: "platform-adapter",
    label: "Platform Adapter",
    role: "Reshapes one piece for a specific platform without losing its spine.",
    outputKeys: ["platformFrame", "adaptedAngle", "constraint"],
    run: (request) => makeRun(
      loomWorkflowHandlers[4],
      request,
      baseSteps("platform-adapter", "Preserve the core idea while adapting format, length, and audience fit."),
      "Rewrite the first paragraph for the target platform while keeping the same promise.",
      {
        platformFrame: asText(request.inputs.platform, "platform not selected"),
        adaptedAngle: asText(request.inputs.source, "Source piece ready for adaptation"),
        constraint: asText(request.inputs.constraint, "No constraint named yet"),
      },
    ),
  },
  {
    id: "serendipity-lab",
    label: "Serendipity Lab",
    role: "Cross-pollinates the current field with adjacent domains to find non-obvious moves.",
    outputKeys: ["combinations", "experiment", "filter"],
    run: (request) => makeRun(
      loomWorkflowHandlers[5],
      request,
      baseSteps("serendipity-lab", "Combine unlikely fragments, then keep only the useful surprise."),
      "Pick one combination and test it as a tiny creative experiment.",
      {
        combinations: [
          `${asText(request.inputs.field, "current field")} x ${asText(request.inputs.adjacencies, "adjacent domain")}`,
        ],
        experiment: "Make a small artifact from the strongest unexpected pairing.",
        filter: "Keep it only if it lowers friction or opens a real path.",
      },
    ),
  },
  {
    id: "creative-operator",
    label: "Creative Operator",
    role: "Turns a scattered creative week into the next three concrete moves.",
    outputKeys: ["operatorState", "threeMoves", "energyFit"],
    run: (request) => makeRun(
      loomWorkflowHandlers[6],
      request,
      baseSteps("creative-operator", "Match the work to energy, horizon, and the smallest useful sequence."),
      "Do the first move only; do not open a new planning loop yet.",
      {
        operatorState: asText(request.inputs.energy, "steady"),
        threeMoves: ["choose the lane", "make the smallest artifact", "save the signal"],
        energyFit: asText(request.inputs.horizon, "this week"),
      },
    ),
  },
];

export const normalizeLoomModuleId = (id: string): LoomModuleId | undefined => {
  if (id === "personas") return "creative-personas";
  return loomWorkflowHandlers.some((handler) => handler.id === id) ? (id as LoomModuleId) : undefined;
};

export const getLoomWorkflowHandler = (id: string) => {
  const normalized = normalizeLoomModuleId(id);
  return normalized ? loomWorkflowHandlers.find((handler) => handler.id === normalized) : undefined;
};
