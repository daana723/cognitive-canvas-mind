import type { LoomModule } from "@/lib/loom/types";

/**
 * Static registry of Loom modules. Data only â€” no behavior.
 * Codex owns runtime orchestration; these are stubs until then.
 */
export const LOOM_MODULES: LoomModule[] = [
  {
    id: "signal-collapse",
    label: "Signal Collapse",
    blurb: "Compress a scattered field into the load-bearing thread.",
    status: "ready",
    inputs: [
      {
        id: "field",
        label: "The field",
        kind: "longtext",
        placeholder: "Everything on your mind about this project.",
      },
      {
        id: "constraint",
        label: "One constraint",
        kind: "text",
        placeholder: "Time, audience, mediumâ€¦",
      },
    ],
  },
  {
    id: "editorial",
    label: "Editorial Studio",
    blurb: "Shape rough material into publishable form without flattening it.",
    status: "ready",
    inputs: [
      { id: "draft", label: "Draft", kind: "longtext" },
      {
        id: "intent",
        label: "Intent",
        kind: "text",
        placeholder: "What should the reader leave with?",
      },
    ],
  },
  {
    id: "creative-personas",
    label: "Creative Personas",
    blurb: "Voice the work through distinct perspectives to find its real one.",
    status: "ready",
    inputs: [
      { id: "topic", label: "Topic", kind: "text" },
      {
        id: "voices",
        label: "Voices",
        kind: "tags",
        placeholder: "curator, skeptic, apprenticeâ€¦",
      },
    ],
  },
  {
    id: "launch-packets",
    label: "Launch Packets",
    blurb: "Assemble the small artifacts a release actually needs.",
    status: "ready",
    inputs: [
      { id: "project", label: "Project", kind: "text" },
      {
        id: "channels",
        label: "Channels",
        kind: "tags",
        placeholder: "site, newsletter, socialâ€¦",
      },
    ],
  },
  {
    id: "platform-adapter",
    label: "Platform Adapter",
    blurb: "Reshape one piece for a specific platform without losing its spine.",
    status: "ready",
    inputs: [
      { id: "source", label: "Source piece", kind: "longtext", placeholder: "Paste the original." },
      {
        id: "platform",
        label: "Target platform",
        kind: "select",
        options: ["newsletter", "x/thread", "linkedin", "instagram", "site", "talk"],
      },
      {
        id: "constraint",
        label: "Constraint",
        kind: "text",
        placeholder: "Length, tone, or audience note.",
      },
    ],
  },
  {
    id: "serendipity-lab",
    label: "Serendipity Lab",
    blurb: "Cross-pollinate the current field with an adjacent domain to find non-obvious moves.",
    status: "ready",
    inputs: [
      { id: "field", label: "The field", kind: "longtext", placeholder: "What you're working on." },
      {
        id: "adjacencies",
        label: "Adjacent domains",
        kind: "tags",
        placeholder: "cartography, jazz, mycologyâ€¦",
      },
    ],
  },
  {
    id: "creative-operator",
    label: "Creative Operator",
    blurb: "Turn a scattered week of creative activity into the next three concrete moves.",
    status: "ready",
    inputs: [
      {
        id: "log",
        label: "Recent log",
        kind: "longtext",
        placeholder: "Recent work, notes, half-finished threads.",
      },
      {
        id: "horizon",
        label: "Horizon",
        kind: "select",
        options: ["this week", "this month", "this quarter"],
      },
      { id: "energy", label: "Energy", kind: "select", options: ["low", "steady", "high"] },
    ],
  },
];

export const getLoomModule = (id: string): LoomModule | undefined =>
  LOOM_MODULES.find((m) => m.id === id);
