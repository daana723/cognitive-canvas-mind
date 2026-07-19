export type LoomPhaseId = "intention" | "delegation" | "return" | "automation" | "flow";

export interface LoomPhase {
  id: LoomPhaseId;
  step: string;
  title: string;
  body: string;
}

export const LOOM_PHASES: LoomPhase[] = [
  {
    id: "intention",
    step: "01",
    title: "You bring an intention",
    body: "A spark, a question, a half-formed idea. The Loom listens before it moves.",
  },
  {
    id: "delegation",
    step: "02",
    title: "It delegates to the right agent",
    body: "Research, Content, Product, Marketing, Avatar, or Operations lights up when the moment calls.",
  },
  {
    id: "return",
    step: "03",
    title: "Agents return usable material",
    body: "Not finished noise. Clear drafts, questions, structures, and next steps you can shape.",
  },
  {
    id: "automation",
    step: "04",
    title: "Automation stays optional",
    body: "Future tools can carry delivery later. For now the weave remains local, deterministic, and calm.",
  },
  {
    id: "flow",
    step: "05",
    title: "You stay in creative flow",
    body: "The system holds the thread beneath the surface while you choose the next gentle move.",
  },
];
