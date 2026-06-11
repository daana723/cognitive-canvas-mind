import type { ModeId } from "./modes";

export interface WorkflowStep { title: string; body: string; }

export interface WorkflowTemplate {
  id: string;
  mode: ModeId;
  title: string;
  intent: string;
  duration: string;
  steps: WorkflowStep[];
}

export const WORKFLOWS: WorkflowTemplate[] = [
  {
    id: "flux-divergence",
    mode: "flux",
    title: "Open the field",
    intent: "Multiply directions before committing to any of them.",
    duration: "20–30 min",
    steps: [
      { title: "Name the seed", body: "Write the one thing pulling at you, in a single sentence." },
      { title: "Twelve directions", body: "List twelve possible directions, no filtering. Bad ones are useful." },
      { title: "Adjacent worlds", body: "For three of them, ask: what does this look like in a different medium, scale, or audience?" },
      { title: "Mark the alive ones", body: "Put a small dot beside the entries that still feel charged. Stop there." },
    ],
  },
  {
    id: "depth-weave",
    mode: "depth",
    title: "Weave the threads",
    intent: "Find what recurring patterns the work is already showing.",
    duration: "30–45 min",
    steps: [
      { title: "Collect", body: "Pull together three to five pieces of recent work or notes that feel related." },
      { title: "Read for echoes", body: "Read them slowly. Note any word, image, or move that repeats." },
      { title: "Name the pattern", body: "Give the recurrence a working name, even a clumsy one." },
      { title: "Ask the pattern", body: "Write down one question the pattern seems to be asking you." },
    ],
  },
  {
    id: "signal-spine",
    mode: "signal",
    title: "Build the spine",
    intent: "Reduce a sprawling thing to its load-bearing structure.",
    duration: "25–40 min",
    steps: [
      { title: "One-sentence promise", body: "Write what this work promises — one sentence, no qualifiers." },
      { title: "Three to seven beats", body: "List the beats that have to exist for the promise to be kept." },
      { title: "Cut the unnecessary", body: "Remove anything that doesn't directly serve a beat." },
      { title: "First step today", body: "Pick the single next action that moves the spine forward." },
    ],
  },
  {
    id: "myth-figure",
    mode: "myth",
    title: "Draw the figure",
    intent: "Find the symbolic shape of the work before its literal form.",
    duration: "20–30 min",
    steps: [
      { title: "Sketch the creature", body: "Draw the work as a figure, animal, landscape, or weather. Stick figures are fine." },
      { title: "Name it", body: "Give it a name and a role: what does it do in the story?" },
      { title: "What does it want?", body: "Write one line on what this figure wants, and one on what stands in its way." },
      { title: "Translate one move", body: "Pick one symbolic move and translate it into a literal next step in the work." },
    ],
  },
  {
    id: "pulse-loop",
    mode: "pulse",
    title: "Run a 25-minute loop",
    intent: "Make, show, adjust — once. Then stop and notice.",
    duration: "25 min",
    steps: [
      { title: "Pick a tiny target", body: "Choose one rough output you can finish in 25 minutes." },
      { title: "Make", body: "Build it. No polishing while making." },
      { title: "Show", body: "Put it somewhere a human (or your future self) can see it." },
      { title: "Note one signal", body: "Write the single most useful thing you noticed. That's the input to the next loop." },
    ],
  },
];

export const workflowsFor = (mode: ModeId) => WORKFLOWS.filter((w) => w.mode === mode);
