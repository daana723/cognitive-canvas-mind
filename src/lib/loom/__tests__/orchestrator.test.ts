import { describe, expect, it } from "vitest";
import { LOOM_AGENTS } from "@/lib/loom/agents";
import { LOOM_MODULES } from "@/lib/loom/modules";
import { weave } from "@/lib/loom/orchestrator";

describe("Loom orchestrator", () => {
  it("defines the Indigo seven-agent constellation", () => {
    expect(LOOM_AGENTS.map((agent) => agent.id)).toEqual([
      "loom",
      "research",
      "content",
      "product",
      "marketing",
      "avatar",
      "operations",
    ]);
  });

  it("routes an intention deterministically to matching agents", () => {
    const plan = weave({
      intention: "Shape a product launch with content and a faceless avatar voice.",
    });

    expect(plan.steps.map((step) => step.agentId)).toEqual(["avatar", "content", "product"]);
    expect(plan.summary).toContain("The Loom holds the thread");
  });

  it("keeps a free entry point while marking creator studio modules as paid later", () => {
    expect(LOOM_MODULES.find((module) => module.id === "weave-intention")?.access).toBe("free");
    expect(LOOM_MODULES.find((module) => module.id === "content-draft")?.access).toBe("studio");
    expect(LOOM_MODULES.find((module) => module.id === "avatar-voice")?.access).toBe("plus");
  });
});
