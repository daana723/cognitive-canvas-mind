import type { LoomModule } from "@/lib/data/types";

/**
 * Static registry of Loom modules. Data only — no behavior.
 * Codex owns runtime orchestration; these are stubs until then.
 */
export const LOOM_MODULES: LoomModule[] = [
  {
    id: "signal-collapse",
    label: "Signal Collapse",
    blurb: "Compress a scattered field into the load-bearing thread.",
    status: "stub",
    inputs: [
      { id: "field", label: "The field", kind: "longtext", placeholder: "Everything on your mind about this project." },
      { id: "constraint", label: "One constraint", kind: "text", placeholder: "Time, audience, medium…" },
    ],
  },
  {
    id: "editorial",
    label: "Editorial Studio",
    blurb: "Shape rough material into publishable form without flattening it.",
    status: "stub",
    inputs: [
      { id: "draft", label: "Draft", kind: "longtext" },
      { id: "intent", label: "Intent", kind: "text", placeholder: "What should the reader leave with?" },
    ],
  },
  {
    id: "personas",
    label: "Creative Personas",
    blurb: "Voice the work through distinct perspectives to find its real one.",
    status: "stub",
    inputs: [
      { id: "topic", label: "Topic", kind: "text" },
      { id: "voices", label: "Voices", kind: "tags", placeholder: "curator, skeptic, apprentice…" },
    ],
  },
  {
    id: "launch-packets",
    label: "Launch Packets",
    blurb: "Assemble the small artifacts a release actually needs.",
    status: "stub",
    inputs: [
      { id: "project", label: "Project", kind: "text" },
      { id: "channels", label: "Channels", kind: "tags", placeholder: "site, newsletter, social…" },
    ],
  },
];

export const getLoomModule = (id: string): LoomModule | undefined =>
  LOOM_MODULES.find((m) => m.id === id);