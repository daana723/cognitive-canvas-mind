import type { CognitiveContext } from "@/lib/cognition/types";
import type { ModuleRunOutput } from "@/lib/data/types";
import { getLoomModule } from "@/lib/loom/modules";

interface LmStudioRunRequest {
  moduleId: string;
  inputs: Record<string, unknown>;
  cognitiveContext?: CognitiveContext;
}

interface CompanionRequest {
  question: string;
  cognitiveContext?: CognitiveContext;
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

const renderCognitiveContext = (context?: CognitiveContext) => {
  if (!context) return "No cognitive context provided.";
  const state = context.state;
  const patterns = context.patterns.length
    ? context.patterns.map((entry) => `- ${entry.observation}`).join("\n")
    : "- No learned pattern memories yet.";

  return `Current cognitive state:
- Mode: ${state.mode}
- Energy: ${state.energy}/5
- Focus: ${state.focus}/5
- Overwhelm: ${state.overwhelm}/5
- Support need: ${state.supportNeed}
- User note: ${state.note || "(none)"}

Recent pattern memories:
${patterns}`;
};

const outputContract = `Return ONLY valid JSON with this exact shape:
{
  "summary": "one useful plain-language summary",
  "sections": [
    { "heading": "section name", "bullets": ["specific output", "specific output"] }
  ],
  "nextMoves": ["concrete next move", "concrete next move"]
}`;

const buildModulePrompt = ({ moduleId, inputs, cognitiveContext }: LmStudioRunRequest) => {
  const module = getLoomModule(moduleId);
  if (!module) throw new Error(`Unknown Loom module: ${moduleId}`);

  const inputLines = module.inputs
    .map((input) => `- ${input.label}: ${stringifyInput(inputs[input.id]) || "(empty)"}`)
    .join("\n");

  return `You are the Loom, a calm cognitive layer for nonlinear creative thinkers.
The Loom holds the thread. You adapt to the user's current cognitive state without diagnosing them.
Use a neurodivergent-friendly tone: concrete, spacious, vivid, non-shaming, and non-flattening.

${renderCognitiveContext(cognitiveContext)}

Run this Loom module:
Name: ${module.label}
Purpose: ${module.blurb}

Inputs:
${inputLines}

Rules:
- Return useful work, not meta commentary.
- If overwhelm is high, reduce choices and give smaller steps.
- If energy is low, prefer micro-actions and gentle closure.
- If focus is high, allow deeper structure.
- If mode is avoiding, make the first next move very easy to start.
- For Platform Adapter, actually rewrite/adapt the source for the chosen platform.
- For Editorial Studio, shape the draft.
- For Signal Collapse, clarify the core signal.
- For Creative Personas, generate distinct voice directions.

${outputContract}`;
};

const buildCompanionPrompt = ({
  question,
  cognitiveContext,
}: CompanionRequest) => `You are the Nonlinear Companion, a local-first ND-aware creative guide.
You help the user understand their current state, choose the next humane action, and work with their brain instead of against it.
You are not a therapist and you do not diagnose. You are practical, warm, pattern-aware, and concise.

${renderCognitiveContext(cognitiveContext)}

User asks:
${question}

Rules:
- Start with what seems true in the current state.
- Offer guidance that fits energy, focus, overwhelm, and support need.
- Prefer one next action over a big plan when the user is overloaded or avoiding.
- Include one reflection that helps the system learn the user's pattern.
- Avoid generic productivity advice.

${outputContract}`;

async function completeJson(prompt: string): Promise<ModuleRunOutput> {
  const baseUrl = process.env.LM_STUDIO_BASE_URL ?? DEFAULT_BASE_URL;
  const model = process.env.LM_STUDIO_MODEL ?? DEFAULT_MODEL;
  const url = `${baseUrl.replace(/\/$/, "")}/chat/completions`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      max_tokens: 3200,
      messages: [
        {
          role: "system",
          content:
            "You are a precise local ND-aware creative workflow agent. Return only valid JSON.",
        },
        { role: "user", content: prompt },
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

export async function runLoomModuleWithLmStudio(
  request: LmStudioRunRequest,
): Promise<ModuleRunOutput> {
  return completeJson(buildModulePrompt(request));
}

export async function askCompanionWithLmStudio(
  request: CompanionRequest,
): Promise<ModuleRunOutput> {
  return completeJson(buildCompanionPrompt(request));
}
