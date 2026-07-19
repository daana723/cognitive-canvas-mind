import type { LoomModule } from "@/lib/data/types";

export const LOOM_MODULES: LoomModule[] = [
  {
    id: "weave-intention",
    label: "Weave Intention",
    blurb: "Bring a scattered intention and let The Loom choose the first agents.",
    status: "ready",
    agentId: "loom",
    access: "free",
    inputs: [
      {
        id: "intention",
        label: "Intention",
        kind: "longtext",
        placeholder: "A spark, question, project knot, or half-formed idea.",
      },
      {
        id: "tags",
        label: "Signals",
        kind: "tags",
        placeholder: "launch, avatar, draft, product...",
      },
    ],
  },
  {
    id: "research-brief",
    label: "Research Brief",
    blurb: "Surface the pattern, context, and cleanest next questions.",
    status: "ready",
    agentId: "research",
    access: "free",
    inputs: [
      {
        id: "field",
        label: "The field",
        kind: "longtext",
        placeholder: "What are you exploring, noticing, or trying to understand?",
      },
      {
        id: "question",
        label: "Question",
        kind: "text",
        placeholder: "What would clarity make easier?",
      },
    ],
  },
  {
    id: "content-draft",
    label: "Content Draft",
    blurb: "Shape rough material into publishable form without flattening it.",
    status: "ready",
    agentId: "content",
    access: "studio",
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
    id: "product-vessel",
    label: "Product Vessel",
    blurb: "Turn an idea into a simple offer, template, or tool container.",
    status: "ready",
    agentId: "product",
    access: "studio",
    inputs: [
      { id: "idea", label: "Idea", kind: "longtext" },
      {
        id: "format",
        label: "Format",
        kind: "select",
        options: ["template", "guide", "tool", "course", "service"],
      },
    ],
  },
  {
    id: "marketing-signal",
    label: "Marketing Signal",
    blurb: "Carry the work outward gently, with a clear angle and low-pressure path.",
    status: "ready",
    agentId: "marketing",
    access: "studio",
    inputs: [
      { id: "project", label: "Project", kind: "text" },
      {
        id: "audience",
        label: "Audience",
        kind: "text",
        placeholder: "Who might this help?",
      },
      {
        id: "channels",
        label: "Channels",
        kind: "tags",
        placeholder: "site, newsletter, social...",
      },
    ],
  },
  {
    id: "avatar-voice",
    label: "Avatar Voice",
    blurb: "Hold faceless presence, voice anchors, and creative persona coherence.",
    status: "ready",
    agentId: "avatar",
    access: "plus",
    inputs: [
      {
        id: "presence",
        label: "Presence",
        kind: "longtext",
        placeholder: "What should this creative presence feel like?",
      },
      {
        id: "voices",
        label: "Voice anchors",
        kind: "tags",
        placeholder: "warm, precise, mythic, grounded...",
      },
    ],
  },
  {
    id: "ops-tending",
    label: "Operations Tending",
    blurb: "Turn creative static into the next three low-friction moves.",
    status: "ready",
    agentId: "operations",
    access: "plus",
    inputs: [
      {
        id: "log",
        label: "Recent log",
        kind: "longtext",
        placeholder: "Recent work, notes, half-finished threads.",
      },
      {
        id: "energy",
        label: "Energy",
        kind: "select",
        options: ["low", "steady", "high"],
      },
    ],
  },
  {
    id: "platform-adapter",
    label: "Platform Adapter",
    blurb: "Reshape one piece for a platform without losing its spine.",
    status: "ready",
    agentId: "marketing",
    access: "studio",
    inputs: [
      {
        id: "source",
        label: "Source piece",
        kind: "longtext",
        placeholder: "Paste the original.",
      },
      {
        id: "platform",
        label: "Target platform",
        kind: "select",
        options: ["newsletter", "linkedin", "instagram", "site", "talk"],
      },
      {
        id: "constraint",
        label: "Constraint",
        kind: "text",
        placeholder: "Length, tone, or audience note.",
      },
    ],
  },
];

export const getLoomModule = (id: string): LoomModule | undefined =>
  LOOM_MODULES.find((module) => module.id === id);
