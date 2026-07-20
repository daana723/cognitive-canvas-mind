import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  moduleId: z.string().min(1),
  inputs: z.record(z.unknown()),
});

export const runLoomModuleWithLocalModel = createServerFn({ method: "POST" })
  .validator(schema)
  .handler(async ({ data }) => {
    const { runLoomModuleWithLmStudio } = await import("@/lib/loom/lmStudio.server");
    return runLoomModuleWithLmStudio(data);
  });
