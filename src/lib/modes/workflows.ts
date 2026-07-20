import type { ModeId } from "./modes";

export interface WorkflowStep {
  title: string;
  body: string;
}

export type WorkflowKind =
  "unfreeze" | "choose-thread" | "shape-pattern" | "resonance-angle" | "ship-tiny";

export interface WorkflowTemplate {
  id: string;
  mode: ModeId;
  kind: WorkflowKind;
  title: string;
  intent: string;
  duration: string;
  promptLabel: string;
  promptPlaceholder: string;
  secondaryLabel?: string;
  secondaryPlaceholder?: string;
  sparkLens: string;
  steps: WorkflowStep[];
}

export const WORKFLOWS: WorkflowTemplate[] = [
  {
    id: "flux-unfreeze",
    mode: "flux",
    kind: "unfreeze",
    title: "Unfreeze a messy idea",
    intent: "Turn the too-many-tabs feeling into one thread you can actually touch.",
    duration: "5-12 min",
    promptLabel: "Messy field",
    promptPlaceholder: "Paste the brain dump, idea swarm, or 'I don't know where to start' tangle.",
    secondaryLabel: "Desired tiny output",
    secondaryPlaceholder: "Post, outline, product idea, first paragraph, sketch direction...",
    sparkLens:
      "Sensory Awareness: the noise is information. We reduce it before asking you to perform.",
    steps: [
      { title: "Pour out the field", body: "No sorting. No hierarchy. Let the mess be visible." },
      {
        title: "Find the charged thread",
        body: "The Loom names what seems most alive and usable now.",
      },
      {
        title: "Make the first move tiny",
        body: "The return ends with a start small enough for an overloaded brain.",
      },
    ],
  },
  {
    id: "signal-choose-thread",
    mode: "signal",
    kind: "choose-thread",
    title: "Choose the next thread",
    intent: "Stop comparing every possible direction and choose the next honest move.",
    duration: "8-15 min",
    promptLabel: "Current options",
    promptPlaceholder:
      "List the ideas, tasks, drafts, products, or directions competing for attention.",
    secondaryLabel: "Constraint",
    secondaryPlaceholder: "Time, energy, deadline, audience, money, emotional load...",
    sparkLens:
      "Personal Sovereignty: the app can clarify the choice, but you remain the authority.",
    steps: [
      { title: "Name the options", body: "Externalize the choice so it stops looping internally." },
      {
        title: "Apply one constraint",
        body: "Capacity matters. The best choice is the one that can move now.",
      },
      { title: "Commit for one cycle", body: "Not forever. Just long enough to get signal back." },
    ],
  },
  {
    id: "depth-shape-pattern",
    mode: "depth",
    kind: "shape-pattern",
    title: "Find the pattern under the work",
    intent: "Locate the recurring signal across scattered notes, drafts, and obsessions.",
    duration: "10-20 min",
    promptLabel: "Recent fragments",
    promptPlaceholder:
      "Paste recent notes, themes, repeated thoughts, half-drafts, or observations.",
    secondaryLabel: "What you want to understand",
    secondaryPlaceholder: "Voice, offer, project direction, audience, recurring block...",
    sparkLens:
      "Authentic Practices: the pattern should fit your actual rhythm, not an idealized one.",
    steps: [
      { title: "Collect fragments", body: "Bring enough material for echoes to appear." },
      { title: "Name the recurrence", body: "The Loom looks for what keeps returning." },
      {
        title: "Turn pattern into action",
        body: "A pattern only helps when it changes the next move.",
      },
    ],
  },
  {
    id: "myth-resonance-angle",
    mode: "myth",
    kind: "resonance-angle",
    title: "Find the resonant angle",
    intent: "Give a flat idea emotional shape without making the product spiritual-first.",
    duration: "8-15 min",
    promptLabel: "Idea or draft",
    promptPlaceholder: "Paste the idea that feels technically clear but emotionally undercharged.",
    secondaryLabel: "Voices or angles",
    secondaryPlaceholder: "mentor, maker, skeptic, future self, beginner...",
    sparkLens:
      "Resilient Boundaries: metaphor is useful when it gives shape, not when it adds fog.",
    steps: [
      {
        title: "Name the ordinary version",
        body: "Start with the plain thing, not the dramatic one.",
      },
      { title: "Try a few angles", body: "Different voices reveal different entry points." },
      { title: "Keep what clarifies", body: "The right metaphor reduces friction." },
    ],
  },
  {
    id: "pulse-ship-tiny",
    mode: "pulse",
    kind: "ship-tiny",
    title: "Ship a tiny version",
    intent:
      "Convert one piece into a small publishable artifact before perfectionism expands the scope.",
    duration: "12-25 min",
    promptLabel: "Source piece",
    promptPlaceholder:
      "Paste the rough idea, paragraph, offer, post, or concept you want to move outward.",
    secondaryLabel: "Platform or container",
    secondaryPlaceholder: "linkedin, instagram, newsletter, site, tiny offer, carousel...",
    sparkLens: "Kinetic Evolution: a tiny shipped version counts. Spirals count. Restarts count.",
    steps: [
      {
        title: "Pick the smallest container",
        body: "A tiny artifact teaches faster than a perfect plan.",
      },
      {
        title: "Adapt without losing the spine",
        body: "The Loom shapes it for the chosen platform or container.",
      },
      { title: "Close the loop", body: "Copy, save, publish, or park it with a clear next move." },
    ],
  },
];

export const workflowsFor = (mode: ModeId) => WORKFLOWS.filter((w) => w.mode === mode);
