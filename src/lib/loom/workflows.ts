import type {
  LoomModuleId,
  LoomRunRequest,
  LoomRunResponse,
  LoomWorkflowHandler,
  LoomWorkflowStep,
} from "@/lib/loom/types";

const now = () => new Date().toISOString();

const asText = (value: unknown, fallback: string) => {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (Array.isArray(value) && value.length) return value.join(", ");
  return fallback;
};

const splitSignals = (text: string) =>
  text
    .split(/[\n.;!?]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 5);

const firstWords = (text: string, count = 10) =>
  text.split(/\s+/).filter(Boolean).slice(0, count).join(" ");

const titleCase = (text: string) =>
  text
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const poeticHandle = (seed: string) => {
  const lowered = seed.toLowerCase();
  if (lowered.includes("burnout") || lowered.includes("overwhelm"))
    return "the quiet revolt against urgency";
  if (lowered.includes("ai") || lowered.includes("automation"))
    return "human signal in the machine weather";
  if (lowered.includes("launch") || lowered.includes("offer"))
    return "the threshold before the work becomes visible";
  if (lowered.includes("identity") || lowered.includes("voice"))
    return "the voice behind the visible work";
  return `${firstWords(seed, 5) || "the unnamed thread"} as a working signal`;
};

const contentAngles = (seed: string) => [
  `A reflective post about ${poeticHandle(seed)}.`,
  `A practical checklist that turns "${firstWords(seed, 7)}" into one next move.`,
  "A behind-the-scenes note on what this thread is really asking for.",
];

const makeRun = (
  handler: Pick<LoomWorkflowHandler, "id" | "label" | "role" | "outputKeys">,
  request: LoomRunRequest,
  steps: LoomWorkflowStep[],
  nextAction: string,
  outputs: Record<string, unknown>,
): ReturnType<LoomWorkflowHandler["run"]> => {
  const createdAt = now();
  const seed = asText(
    request.inputs.field ??
      request.inputs.draft ??
      request.inputs.source ??
      request.inputs.topic ??
      request.inputs.project ??
      request.inputs.log,
    "Untitled thread",
  );

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
    description:
      "Capture the raw input without judging, scoring, or interpreting the person behind it.",
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

const signalCollapseHandler: LoomWorkflowHandler = {
  id: "signal-collapse",
  label: "Signal Collapse",
  role: "Compresses a scattered field into visible signal, hidden tension, and a next creative artifact.",
  outputKeys: [
    "visibleSignal",
    "hiddenTension",
    "audienceResonance",
    "creativeOpportunity",
    "poeticHandle",
    "contentAngles",
    "unexpectedBridge",
    "nextArtifact",
  ],
  run: (request) => {
    const field = asText(
      request.inputs.field,
      "A scattered field is ready to become one clear thread.",
    );
    const fragments = splitSignals(field);

    return makeRun(
      signalCollapseHandler,
      request,
      [
        ...baseSteps(
          "signal-collapse",
          "Separate signal from noise, then name the emotional and practical spine.",
        ),
        {
          id: "signal-collapse:angles",
          label: "Open usable angles",
          description:
            "Return creative handles, content angles, and a next artifact rather than only a summary.",
        },
      ],
      "Choose one content angle and make the smallest artifact that proves the signal is alive.",
      {
        visibleSignal: firstWords(field, 24),
        hiddenTension:
          "The work wants clarity, but too much certainty too early would flatten the living signal.",
        audienceResonance:
          "This may speak to people holding too much input who need one humane thread to follow.",
        creativeOpportunity:
          "Turn the pressure into a translation tool: show the shift from noise to usable pattern.",
        poeticHandle: poeticHandle(field),
        signalFragments: fragments,
        contentAngles: contentAngles(field),
        unexpectedBridge:
          "Treat the messy note like a weather map: not a problem to solve, but a pressure system to read.",
        nextArtifact: {
          type: "post",
          prompt: "Write a short note beginning with: 'The signal underneath this is...'",
        },
      },
    );
  },
};

const editorialHandler: LoomWorkflowHandler = {
  id: "editorial",
  label: "Editorial Studio",
  role: "Shapes rough material into publishable form without flattening its texture.",
  outputKeys: ["editorialFrame", "headlineSet", "outline", "readerPromise", "texturePass"],
  run: (request) => {
    const draft = asText(request.inputs.draft, "the material");
    const intent = asText(request.inputs.intent, "A clearer path through the material.");

    return makeRun(
      editorialHandler,
      request,
      baseSteps("editorial", "Find the reader promise, then arrange the draft around it."),
      "Draft the opening around the strongest headline before polishing any section.",
      {
        editorialFrame: intent,
        headlineSet: [
          titleCase(firstWords(intent, 6)),
          `What ${firstWords(draft, 5)} is really asking`,
          `A calmer way through ${firstWords(draft, 4)}`,
        ],
        outline: [
          "Opening signal",
          "Hidden tension",
          "Three load-bearing beats",
          "Useful turn",
          "Closing invitation",
        ],
        readerPromise: intent,
        texturePass:
          "Keep one vivid sentence, one practical sentence, and one sentence that names the emotional stakes.",
      },
    );
  },
};

const creativePersonasHandler: LoomWorkflowHandler = {
  id: "creative-personas",
  label: "Creative Personas",
  role: "Tests the work through temporary creative voices without turning them into identity labels.",
  outputKeys: ["personaSet", "voiceNotes", "sampleLines", "bestUse"],
  run: (request) =>
    makeRun(
      creativePersonasHandler,
      request,
      baseSteps("creative-personas", "Use perspectives as drafting tools, not identity labels."),
      "Choose one persona as a temporary voice and draft a short sample through it.",
      {
        personaSet: asText(request.inputs.voices, "curator, field guide, maker, skeptic").split(
          /,\s*/,
        ),
        voiceNotes: `Topic: ${asText(request.inputs.topic, "Untitled topic")}`,
        sampleLines: [
          "Curator: Here is the thread worth preserving.",
          "Field guide: Start here, then notice what changes.",
          "Maker: Build the smallest version and let it answer back.",
        ],
        bestUse: "Use personas to test expression, not to define the creator.",
      },
    ),
};

const launchPacketsHandler: LoomWorkflowHandler = {
  id: "launch-packets",
  label: "Launch Packets",
  role: "Assembles the artifacts a release needs and names the missing piece without creating launch panic.",
  outputKeys: ["readinessState", "checklist", "channels", "launchCopy", "missingPiece"],
  run: (request) => {
    const project = asText(request.inputs.project, "This project");

    return makeRun(
      launchPacketsHandler,
      request,
      baseSteps(
        "launch-packets",
        "Turn launch anxiety into a compact checklist and readiness state.",
      ),
      "Fill the missing piece before adding another channel.",
      {
        readinessState: "nearly-ready",
        checklist: ["final title", "short description", "asset", "channel copy", "publish note"],
        channels: asText(request.inputs.channels, "No channels named yet"),
        launchCopy: {
          short: `${project} is ready to meet its first audience.`,
          note: "Keep the launch note concrete: what it is, who it helps, and what to do next.",
        },
        missingPiece: "Name the single item blocking release readiness.",
      },
    );
  },
};

const platformAdapterHandler: LoomWorkflowHandler = {
  id: "platform-adapter",
  label: "Platform Adapter",
  role: "Reshapes one piece for a specific platform without losing its spine.",
  outputKeys: ["platformFrame", "adaptedAngle", "captionSeed", "formatNotes", "constraint"],
  run: (request) => {
    const source = asText(request.inputs.source, "Source piece ready for adaptation");

    return makeRun(
      platformAdapterHandler,
      request,
      baseSteps(
        "platform-adapter",
        "Preserve the core idea while adapting format, length, and audience fit.",
      ),
      "Rewrite the first paragraph for the target platform while keeping the same promise.",
      {
        platformFrame: asText(request.inputs.platform, "platform not selected"),
        adaptedAngle: source,
        captionSeed: `Start with the tension: ${firstWords(source, 14)}...`,
        formatNotes:
          "Preserve the promise, change the shape: shorter hook, clearer turn, one action.",
        constraint: asText(request.inputs.constraint, "No constraint named yet"),
      },
    );
  },
};

const serendipityLabHandler: LoomWorkflowHandler = {
  id: "serendipity-lab",
  label: "Serendipity Lab",
  role: "Cross-pollinates the current field with adjacent domains to find non-obvious moves.",
  outputKeys: ["combinations", "strangeConnection", "experiment", "filter"],
  run: (request) =>
    makeRun(
      serendipityLabHandler,
      request,
      baseSteps(
        "serendipity-lab",
        "Combine unlikely fragments, then keep only the useful surprise.",
      ),
      "Pick one combination and test it as a tiny creative experiment.",
      {
        combinations: [
          `${asText(request.inputs.field, "current field")} x ${asText(request.inputs.adjacencies, "adjacent domain")}`,
        ],
        strangeConnection:
          "Borrow structure from the adjacent world, not decoration. Ask what its rhythm teaches the work.",
        experiment: "Make a small artifact from the strongest unexpected pairing.",
        filter: "Keep it only if it lowers friction or opens a real path.",
      },
    ),
};

const creativeOperatorHandler: LoomWorkflowHandler = {
  id: "creative-operator",
  label: "Creative Operator",
  role: "Turns a scattered creative week into the next three concrete moves.",
  outputKeys: ["operatorState", "lane", "threeMoves", "energyFit", "stopRule"],
  run: (request) =>
    makeRun(
      creativeOperatorHandler,
      request,
      baseSteps(
        "creative-operator",
        "Match the work to energy, horizon, and the smallest useful sequence.",
      ),
      "Do the first move only; do not open a new planning loop yet.",
      {
        operatorState: asText(request.inputs.energy, "steady"),
        lane: "one visible artifact before another planning pass",
        threeMoves: ["choose the lane", "make the smallest artifact", "save the signal"],
        energyFit: asText(request.inputs.horizon, "this week"),
        stopRule:
          "Stop after the first artifact is saved; momentum counts only if it leaves a trace.",
      },
    ),
};

export const loomWorkflowHandlers: LoomWorkflowHandler[] = [
  signalCollapseHandler,
  editorialHandler,
  creativePersonasHandler,
  launchPacketsHandler,
  platformAdapterHandler,
  serendipityLabHandler,
  creativeOperatorHandler,
];

export const normalizeLoomModuleId = (id: string): LoomModuleId | undefined => {
  if (id === "personas") return "creative-personas";
  return loomWorkflowHandlers.some((handler) => handler.id === id)
    ? (id as LoomModuleId)
    : undefined;
};

export const getLoomWorkflowHandler = (id: string) => {
  const normalized = normalizeLoomModuleId(id);
  return normalized ? loomWorkflowHandlers.find((handler) => handler.id === normalized) : undefined;
};
