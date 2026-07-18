import { describe, expect, it } from "vitest";
import { weave } from "@/lib/loom/orchestrator";
import { runModule } from "@/lib/loom/execute";
import { LOOM_PROVIDERS, getLoomProvider } from "@/lib/loom/providers";
import { listLoomModules, listLoomWorkflows } from "@/lib/loom";

describe("Loom deterministic routing", () => {
  it("lights content, product, and operations for a launch-oriented creative intention", () => {
    const plan = weave({
      body: "I need to write the voice, package the offer, launch it, and choose the next workflow for this week.",
      tags: ["content", "launch", "planning"],
      options: { idempotencyKey: "route-demo" },
    });

    expect(plan.weaveId).toBe("weave-route-demo");
    expect(plan.agents).toContain("loom");
    expect(plan.agents).toContain("content");
    expect(plan.agents).toContain("product");
    expect(plan.agents).toContain("operations");
    expect(plan.steps.map((step) => step.moduleId)).toEqual(
      expect.arrayContaining([
        "editorial",
        "creative-personas",
        "launch-packets",
        "creative-operator",
      ]),
    );
    expect(plan.externalCalls).toEqual([]);
    expect(plan.metadata.providerId).toBe("local-deterministic");
  });

  it("falls back to a clarity-first path for an unnamed intention", () => {
    const plan = weave({ body: "", options: { idempotencyKey: "empty-intention" } });

    expect(plan.intention).toBe("A quiet unnamed intention");
    expect(plan.steps.map((step) => step.moduleId)).toEqual([
      "signal-collapse",
      "serendipity-lab",
      "editorial",
      "creative-personas",
      "creative-operator",
    ]);
  });
});

describe("Loom workflow execution", () => {
  it("executes a supported module with audit metadata and no external calls", () => {
    const response = runModule({
      moduleId: "signal-collapse",
      inputs: {
        field:
          "A messy field of notes about nonlinear creators, creative momentum, and build week demos.",
        constraint: "One page demo",
      },
      options: { idempotencyKey: "signal-test", maxRetries: 1, timeoutMs: 500 },
    });

    expect(response.status).toBe("succeeded");
    expect(response.runId).toContain("signal-test");
    expect(response.outputs.visibleSignal).toBeTruthy();
    expect(response.metadata).toMatchObject({
      idempotencyKey: "signal-test",
      providerId: "local-deterministic",
      attempts: 1,
      maxRetries: 1,
      timeoutMs: 500,
      externalCalls: [],
    });
    expect(response.externalCalls).toEqual([]);
  });

  it("returns a structured failure for unknown modules", () => {
    const response = runModule({
      moduleId: "missing-module",
      inputs: {},
      options: { idempotencyKey: "missing-test" },
    });

    expect(response.status).toBe("failed");
    expect(response.error).toMatchObject({ code: "MODULE_NOT_FOUND", recoverable: false });
    expect(response.metadata.idempotencyKey).toBe("missing-test");
    expect(response.externalCalls).toEqual([]);
  });

  it("returns a recoverable validation failure for missing required inputs", () => {
    const response = runModule({
      moduleId: "platform-adapter",
      inputs: { source: "Turn this into a platform post." },
      options: { idempotencyKey: "validation-test" },
    });

    expect(response.status).toBe("failed");
    expect(response.error).toMatchObject({ code: "VALIDATION_ERROR", recoverable: true });
    expect(response.error?.details?.missing).toEqual(["platform", "constraint"]);
  });

  it("lists modules and workflows from the canonical Loom layer", () => {
    expect(listLoomModules()).toHaveLength(7);
    expect(listLoomWorkflows().map((workflow) => workflow.moduleId)).toEqual(
      expect.arrayContaining(["signal-collapse", "editorial", "creative-operator"]),
    );
  });
});

describe("Loom provider seam", () => {
  it("defines future providers without enabling fake external calls", () => {
    expect(LOOM_PROVIDERS.map((provider) => provider.id)).toEqual([
      "local-deterministic",
      "gemini-flash",
      "deepseek-venice",
      "lm-studio",
    ]);
    expect(getLoomProvider("gemini-flash")?.isConfigured()).toBe(false);
    expect(getLoomProvider("deepseek-venice")?.isConfigured()).toBe(false);
    expect(getLoomProvider("lm-studio")?.isConfigured()).toBe(false);
  });
});
