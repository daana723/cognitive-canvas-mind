import type { ModuleRunOutput } from "@/lib/data/types";
import { getLoomModule } from "@/lib/loom/modules";

interface LmStudioRunRequest {
  moduleId: string;
  inputs: Record<string, unknown>;
}

interface ChatCompletionResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

const DEFAULT_BASE_URL = "http://127.0.0.1:1234/v1";
const DEFAULT_MODEL = "google/gemma-4-26b-a4b";

const stringifyInput = (value: unknown): string => {
  if (Array.isArray(value)) return value.map(String).join(", ");
  if (value == null) return "";
  return String(value);
};

const extractJson = (content: string) => {
  const trimmed = content.trim();
  if (trimmed.startsWith("{")) return trimmed;

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) return fenced[1].trim();

  const first = trimmed.indexOf("{");
  const last = trimmed.lastIndexOf("}");
  if (first >= 0 && last > first) return trimmed.slice(first, last + 1);

  return trimmed;
};

const normalizeOutput = (value: unknown): ModuleRunOutput => {
  const fallback: ModuleRunOutput = {
    summary: "The local model returned a response, but not in the expected Loom shape.",
    sections: [],
    nextMoves: [],
  };

  if (!value || typeof value !== "object") return fallback;

  const record = value as Record<string, unknown>;
  const sections = Array.isArray(record.sections)
    ? record.sections
        .map((section) => {
          if (!section || typeof section !== "object") return null;
          const sectionRecord = section as Record<string, unknown>;
          return {
            heading: stringifyInput(sectionRecord.heading) || "Thread",
            bullets: Array.isArray(sectionRecord.bullets)
              ? sectionRecord.bullets.map(String).filter(Boolean)
              : [],
          };
        })
        .filter((section): section is ModuleRunOutput["sections"][number] => Boolean(section))
    : [];

  return {
    summary: stringifyInput(record.summary) || fallback.summary,
    sections,
    nextMoves: Array.isArray(record.nextMoves) ? record.nextMoves.map(String).filter(Boolean) : [],
  };
};

const buildPrompt = ({ moduleId, inputs }: LmStudioRunRequest) => {
  const module = getLoomModule(moduleId);
  if (!module) throw new Error(`Unknown Loom module: ${moduleId}`);

  const inputLines = module.inputs
    .map((input) => `- ${input.label}: ${stringifyInput(inputs[input.id]) || "(empty)"}`)
    .join("\n");

  return `You are the Loom, a calm cognitive layer for nonlinear creative thinkers.
The Loom holds the thread. Use a neurodivergent-friendly tone: concrete, spacious, vivid, and non-flattening.

Run this Loom module:
Name: ${module.label}
Purpose: ${module.blurb}

Inputs:
${inputLines}

Return useful work, not meta commentary. For Platform Adapter, actually rewrite/adapt the source for the chosen platform. For Editorial Studio, shape the draft. For Signal Collapse, clarify the core signal. For Creative Personas, generate distinct voice directions.

Return ONLY valid JSON with this exact shape:
{
  "summary": "one useful plain-language summary",
  "sections": [
    { "heading": "section name", "bullets": ["specific output", "specific output"] }
  ],
  "nextMoves": ["concrete next move", "concrete next move"]
}`;
};

export async function runLoomModuleWithLmStudio(
  request: LmStudioRunRequest,
): Promise<ModuleRunOutput> {
  const baseUrl = process.env.LM_STUDIO_BASE_URL ?? DEFAULT_BASE_URL;
  const model = process.env.LM_STUDIO_MODEL ?? DEFAULT_MODEL;
  const url = `${baseUrl.replace(/\/$/, "")}/chat/completions`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      max_tokens: 1400,
      messages: [
        {
          role: "system",
          content: "You are a precise local creative workflow agent. Return only valid JSON.",
        },
        { role: "user", content: buildPrompt(request) },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`LM Studio request failed: ${response.status} ${body}`.trim());
  }

  const payload = (await response.json()) as ChatCompletionResponse;
  const content = payload.choices?.[0]?.message?.content;
  if (!content) throw new Error("LM Studio returned no message content.");

  return normalizeOutput(JSON.parse(extractJson(content)));
}
