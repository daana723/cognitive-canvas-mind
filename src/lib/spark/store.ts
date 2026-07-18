import type { Responses } from "./resonance";
import { CURRENT_PROMPTS, type CurrentResponses } from "./currentPrompts";
import { PROMPTS, type Resonance } from "./prompts";

/**
 * Local-first storage for in-progress SPARK reflections. Saved sketches
 * go through dataAdapter.saveSparkSketch; these keys hold the raw
 * resonance values so a reflection can be resumed across sessions.
 *
 * The response envelope is deliberately versioned. A prompt rewrite must
 * never reinterpret an old answer as an answer to a new prompt.
 */

const RESP_KEY = "creative-studio:spark-responses:v1";
const CURR_KEY = "creative-studio:spark-current-responses:v1";
export const SPARK_RESPONSE_VERSION = 2;

type StoredResponses = {
  version: number;
  responses: Record<string, unknown>;
};

const isBrowser = () => typeof window !== "undefined" && typeof localStorage !== "undefined";

function readRaw(key: string): string | null {
  if (!isBrowser()) return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write<T>(key: string, value: T) {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage writes can fail in private mode; keep Spark usable without persistence.
  }
}

function clear(key: string) {
  if (isBrowser()) {
    try {
      localStorage.removeItem(key);
    } catch {
      // Keep Spark usable when storage is unavailable.
    }
  }
}

/**
 * Decode only a current, versioned response envelope whose ids all belong to
 * the active prompt set. Legacy or mixed-version data is discarded as a
 * whole rather than partially reinterpreted.
 */
export function decodeStoredResponses(
  raw: string | null,
  promptIds: string[],
): Record<string, Resonance> {
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw) as Partial<StoredResponses>;
    if (
      parsed.version !== SPARK_RESPONSE_VERSION ||
      !parsed.responses ||
      typeof parsed.responses !== "object" ||
      Array.isArray(parsed.responses)
    ) {
      return {};
    }

    const allowed = new Set(promptIds);
    const entries = Object.entries(parsed.responses);
    if (
      entries.some(([id, value]) => !allowed.has(id) || ![1, 2, 3, 4, 5].includes(value as number))
    ) {
      return {};
    }

    return Object.fromEntries(entries) as Record<string, Resonance>;
  } catch {
    return {};
  }
}

export function encodeStoredResponses(responses: Record<string, unknown>): string {
  return JSON.stringify({ version: SPARK_RESPONSE_VERSION, responses });
}

function loadResponses<T extends Record<string, Resonance>>(key: string, promptIds: string[]): T {
  const raw = readRaw(key);
  const decoded = decodeStoredResponses(raw, promptIds) as T;

  // Remove legacy/mismatched data once it has been detected so the user is
  // not repeatedly trapped in the broken resume path on later visits.
  if (raw && Object.keys(decoded).length === 0) clear(key);
  return decoded;
}

export const sparkResponsesStore = {
  load(): Responses {
    return loadResponses<Responses>(
      RESP_KEY,
      PROMPTS.map((prompt) => prompt.id),
    );
  },
  save(r: Responses) {
    write(RESP_KEY, JSON.parse(encodeStoredResponses(r)));
  },
  clear() {
    clear(RESP_KEY);
  },
};

export const currentResponsesStore = {
  load(): CurrentResponses {
    return loadResponses<CurrentResponses>(
      CURR_KEY,
      CURRENT_PROMPTS.map((prompt) => prompt.id),
    );
  },
  save(r: CurrentResponses) {
    write(CURR_KEY, JSON.parse(encodeStoredResponses(r)));
  },
  clear() {
    clear(CURR_KEY);
  },
};
