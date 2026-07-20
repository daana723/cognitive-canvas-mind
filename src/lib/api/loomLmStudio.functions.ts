import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const cognitiveModeSchema = z.enum([
  "scattered",
  "overloaded",
  "low-energy",
  "focused",
  "avoiding",
  "hyperfocused",
  "recovering",
  "emotionally-tangled",
]);

const supportNeedSchema = z.enum([
  "micro-steps",
  "structure",
  "encouragement",
  "decision-help",
  "decompression",
]);

const cognitiveStateSchema = z.object({
  mode: cognitiveModeSchema,
  energy: z.number(),
  focus: z.number(),
  overwhelm: z.number(),
  supportNeed: supportNeedSchema,
  note: z.string().optional(),
  updatedAt: z.string(),
});

const patternSchema = z.object({
  id: z.string(),
  source: z.enum(["manual", "loom-run", "companion"]),
  observation: z.string(),
  mode: cognitiveModeSchema.optional(),
  moduleId: z.string().optional(),
  createdAt: z.string(),
});

const cognitiveContextSchema = z.object({
  state: cognitiveStateSchema,
  patterns: z.array(patternSchema),
});

const runSchema = z.object({
  moduleId: z.string().min(1),
  inputs: z.record(z.unknown()),
  cognitiveContext: cognitiveContextSchema.optional(),
});

const companionSchema = z.object({
  question: z.string().min(1),
  cognitiveContext: cognitiveContextSchema.optional(),
});

export const runLoomModuleWithLocalModel = createServerFn({ method: "POST" })
  .validator(runSchema)
  .handler(async ({ data }) => {
    const { runLoomModuleWithLmStudio } = await import("@/lib/loom/lmStudio.server");
    return runLoomModuleWithLmStudio(data);
  });

export const askCompanionWithLocalModel = createServerFn({ method: "POST" })
  .validator(companionSchema)
  .handler(async ({ data }) => {
    const { askCompanionWithLmStudio } = await import("@/lib/loom/lmStudio.server");
    return askCompanionWithLmStudio(data);
  });
