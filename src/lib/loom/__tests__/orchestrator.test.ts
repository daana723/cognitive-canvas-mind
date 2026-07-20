import { describe, expect, it } from "vitest";
import { loomClient } from "@/lib/api/loomClient";
import { AGENTS, agentForModule } from "@/lib/loom/agents";
import { runModule } from "@/lib/loom/execute";
import { LOOM_MODULES } from "@/lib/loom/modules";
import { weave } from "@/lib/loom/orchestrator";

describe("Loom constellation", () => {
  it("defines the seven Indigo Loom agents", () => {
    expect(AGENTS.map((agent) => agent.id)).toEqual([
      "loom",
      "research",
      "content",
      "product",
      "marketing",
      "avatar",
      "operations",
    ]);
  });

  it("gives each specialist agent at least one callable module", () => {
    const specialistAgents = AGENTS.filter((agent) => agent.id !== "loom");

    expect(specialistAgents.every((agent) => agent.moduleIds.length > 0)).toBe(true);
    expect(agentForModule("personas")?.id).toBe("avatar");
  });

  it("marks monetization as metadata only", () => {
    expect(LOOM_MODULES.find((module) => module.id === "signal-collapse")?.access).toBe("free");
    expect(LOOM_MODULES.find((module) => module.id === "personas")?.access).toBe("plus");
    expect(LOOM_MODULES.find((module) => module.id === "editorial")?.access).toBe("studio");
  });
});

describe("Loom orchestration", () => {
  it("routes an intention deterministically to matching agents", () => {
    const plan = weave({
      body: "Shape a product launch with content and a faceless avatar voice.",
      tags: ["launch"],
    });

    expect(plan.agents[0]).toBe("loom");
    expect(plan.agents).toContain("avatar");
    expect(plan.agents).toContain("product");
    expect(plan.steps.map((step) => step.moduleId)).toContain("personas");
    expect(plan.artifacts.length).toBeGreaterThan(0);
  });

  it("falls back to a clarity-first trio when no keywords match", () => {
    const plan = weave({ body: "Something unnamed is asking for shape." });

    expect(plan.agents).toEqual(["loom", "research", "content", "operations"]);
    expect(plan.steps.map((step) => step.moduleId)).toEqual([
      "signal-collapse",
      "editorial",
      "creative-operator",
    ]);
  });
});

describe("Loom local execution", () => {
  it("runs a module and returns structured output", () => {
    const output = runModule("platform-adapter", {
      source: "A long essay about nonlinear creative work.",
      platform: "linkedin",
      constraint: "warm and practical",
    });

    expect(output.summary).toContain("linkedin");
    expect(output.sections.length).toBeGreaterThan(0);
    expect(output.nextMoves.length).toBeGreaterThan(0);
  });

  it("returns a structured not_found error through the UI boundary", async () => {
    const result = await loomClient.run({ moduleId: "missing", inputs: {} });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("not_found");
  });

  it("returns a structured validation error for empty weave input", async () => {
    const result = await loomClient.weave({ body: "   " });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("validation_error");
  });

  it("validates select inputs before module execution", async () => {
    const result = await loomClient.run({
      moduleId: "creative-operator",
      inputs: { horizon: "someday", energy: "steady" },
    });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.details?.field).toBe("horizon");
  });
});
