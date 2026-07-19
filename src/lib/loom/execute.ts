import { getLoomModule } from "@/lib/loom/modules";
import type { ModuleRunOutput } from "@/lib/data/types";

/**
 * Deterministic local execution for each module. Codex replaces the body
 * of this file to plug in a real backend — the return shape is the contract.
 */

const s = (v: unknown): string =>
  typeof v === "string" ? v.trim() : Array.isArray(v) ? v.join(", ") : "";

const list = (v: unknown): string[] => {
  if (Array.isArray(v)) return v.map(String).map((x) => x.trim()).filter(Boolean);
  if (typeof v === "string")
    return v
      .split(/[,\n]/)
      .map((x) => x.trim())
      .filter(Boolean);
  return [];
};

const trimLines = (v: unknown, max = 6): string[] =>
  s(v)
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, max);

type Inputs = Record<string, unknown>;

function runSignalCollapse(i: Inputs): ModuleRunOutput {
  const lines = trimLines(i.field);
  const constraint = s(i.constraint) || "no explicit constraint";
  return {
    summary: `Compressing ${lines.length || "the"} scattered signal${lines.length === 1 ? "" : "s"} against: ${constraint}.`,
    sections: [
      {
        heading: "Load-bearing thread",
        bullets: lines.slice(0, 3).length
          ? lines.slice(0, 3).map((l) => `Keep: ${l}`)
          : ["Name the one thread the rest hangs on."],
      },
      {
        heading: "Set down (for now)",
        bullets: lines.slice(3, 6).length
          ? lines.slice(3, 6).map((l) => `Park: ${l}`)
          : ["List the strands you're not carrying this cycle."],
      },
    ],
    nextMoves: [
      "Write the load-bearing thread in one sentence.",
      `Test it against the constraint: ${constraint}.`,
      "If it survives, commit for one cycle.",
    ],
  };
}

function runEditorial(i: Inputs): ModuleRunOutput {
  const draft = s(i.draft);
  const intent = s(i.intent) || "leave the reader with a clear inner shift";
  const lines = trimLines(draft, 8);
  return {
    summary: `Editorial pass toward: ${intent}.`,
    sections: [
      {
        heading: "Spine",
        bullets: lines.slice(0, 3).length
          ? lines.slice(0, 3).map((l) => `→ ${l}`)
          : ["Draft the load-bearing sentence."],
      },
      { heading: "What to cut", bullets: ["Anything that only proves you thought about it.", "Anything that repeats the spine.", "Anything the reader will not use."] },
      { heading: "What to strengthen", bullets: ["The opening (earn the read).", "The turn (where the reader shifts).", "The last sentence (what they leave with)."] },
    ],
    nextMoves: ["Rewrite opening.", "Sharpen the turn.", "Rewrite the closing to land the intent."],
  };
}

function runPersonas(i: Inputs): ModuleRunOutput {
  const topic = s(i.topic) || "the topic";
  const voices = list(i.voices);
  const cast = voices.length ? voices : ["curator", "skeptic", "apprentice"];
  return {
    summary: `Voicing "${topic}" through ${cast.length} personas to find the real one.`,
    sections: cast.map((v) => ({
      heading: `Through the ${v}`,
      bullets: [
        `What the ${v} refuses to skip about ${topic}.`,
        `What the ${v} cares about that others miss.`,
        `The one sentence the ${v} would open with.`,
      ],
    })),
    nextMoves: [
      "Pick the voice with the most tension against your default.",
      "Draft the opening in that voice.",
      "Keep only the phrases that survive translation back to yours.",
    ],
  };
}

function runLaunchPackets(i: Inputs): ModuleRunOutput {
  const project = s(i.project) || "the release";
  const channels = list(i.channels).length ? list(i.channels) : ["site", "newsletter", "social"];
  return {
    summary: `Packet for "${project}" across ${channels.join(", ")}.`,
    sections: [
      { heading: "Core artifacts", bullets: ["One-line pitch.", "One paragraph.", "One-page overview.", "Cover image / motif."] },
      { heading: "Per-channel adaptations", bullets: channels.map((c) => `${c}: shortest version that still carries the spine.`) },
      { heading: "Proof", bullets: ["One quote or moment that shows it works.", "One screenshot or artifact.", "One next step for the reader."] },
    ],
    nextMoves: ["Write the one-liner first.", "Expand only when it's honest.", "Ship the smallest complete packet."],
  };
}

function runPlatformAdapter(i: Inputs): ModuleRunOutput {
  const source = s(i.source);
  const platform = s(i.platform) || "the target platform";
  const constraint = s(i.constraint) || "keep the spine";
  const seed = trimLines(source, 4);
  return {
    summary: `Reshaping the source for ${platform}. Constraint: ${constraint}.`,
    sections: [
      { heading: "Spine to preserve", bullets: seed.length ? seed : ["Extract the load-bearing sentence before reshaping."] },
      {
        heading: `${platform} adaptation`,
        bullets: [
          "Native opening line (matches the platform's grammar).",
          "One tension the reader recognizes in the first scroll.",
          "The turn — where the piece earns its ending.",
          "A closing that invites a small action.",
        ],
      },
    ],
    nextMoves: [`Draft the ${platform} version.`, "Read it aloud against the spine.", "Cut anything that only makes sense elsewhere."],
  };
}

function runSerendipity(i: Inputs): ModuleRunOutput {
  const field = s(i.field) || "the current field";
  const adjacencies = list(i.adjacencies);
  const cast = adjacencies.length ? adjacencies : ["cartography", "jazz", "mycology"];
  return {
    summary: `Cross-pollinating "${field}" with ${cast.join(", ")}.`,
    sections: cast.map((a) => ({
      heading: `From ${a}`,
      bullets: [
        `What ${a} treats as obvious that your field ignores.`,
        `A move from ${a} you could steal.`,
        `A metaphor from ${a} that would reframe your work.`,
      ],
    })),
    nextMoves: [
      "Pick the most alien adjacency.",
      "Steal one move and try it this cycle.",
      "Note what changed in your work.",
    ],
  };
}

function runCreativeOperator(i: Inputs): ModuleRunOutput {
  const log = s(i.log);
  const horizon = s(i.horizon) || "this week";
  const energy = s(i.energy) || "steady";
  const lines = trimLines(log, 6);
  return {
    summary: `Reading the log for ${horizon} at ${energy} energy.`,
    sections: [
      { heading: "Threads active", bullets: lines.length ? lines : ["Name what's still moving.", "Name what's stalled.", "Name what's finished."] },
      { heading: "Match to energy", bullets: energy === "low"
        ? ["Small, closing work. Nothing new opened."]
        : energy === "high"
          ? ["Open the one thing that scares you.", "Close one thing that's overdue.", "Rest before you spend it all."]
          : ["One opening, one closing, one refinement."],
      },
    ],
    nextMoves: [
      "The next concrete move (today).",
      "The next visible artifact (this cycle).",
      "The thing to protect from noise.",
    ],
  };
}

const RUNNERS: Record<string, (i: Inputs) => ModuleRunOutput> = {
  "signal-collapse": runSignalCollapse,
  "editorial": runEditorial,
  "personas": runPersonas,
  "launch-packets": runLaunchPackets,
  "platform-adapter": runPlatformAdapter,
  "serendipity-lab": runSerendipity,
  "creative-operator": runCreativeOperator,
};

export function runModule(moduleId: string, inputs: Inputs): ModuleRunOutput {
  const mod = getLoomModule(moduleId);
  const runner = RUNNERS[moduleId];
  if (!mod || !runner) {
    return {
      summary: `No local runner for "${moduleId}" yet.`,
      sections: [],
      nextMoves: [],
    };
  }
  return runner(inputs);
}