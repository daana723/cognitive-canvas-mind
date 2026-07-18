import { z } from "zod";

export const loomModuleIdSchema = z.enum([
  "signal-collapse",
  "editorial",
  "creative-personas",
  "launch-packets",
  "platform-adapter",
  "serendipity-lab",
  "creative-operator",
]);

export const loomProviderIdSchema = z.enum([
  "local-deterministic",
  "gemini-flash",
  "deepseek-venice",
  "lm-studio",
]);

export const loomRunOptionsSchema = z
  .object({
    idempotencyKey: z.string().min(1).optional(),
    maxRetries: z.number().int().min(0).max(3).optional(),
    timeoutMs: z.number().int().min(50).max(30000).optional(),
    providerId: loomProviderIdSchema.optional(),
  })
  .optional();

export const loomRunRequestSchema = z.object({
  moduleId: z.string().min(1),
  inputs: z.record(z.string(), z.unknown()),
  context: z.record(z.string(), z.unknown()).optional(),
  options: loomRunOptionsSchema,
});

export const weaveIntentionRequestSchema = z.object({
  body: z.string().max(12000).default(""),
  tags: z.array(z.string().min(1).max(64)).max(12).optional(),
  options: loomRunOptionsSchema,
});

export const normalizeTags = (tags: string[] | undefined) =>
  Array.from(
    new Set(
      (tags ?? [])
        .map((tag) =>
          tag
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, " ")
            .trim(),
        )
        .filter(Boolean),
    ),
  );
