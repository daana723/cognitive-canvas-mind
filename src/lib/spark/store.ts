import type { Responses } from "./resonance";
import type { CurrentResponses } from "./currentPrompts";

/**
 * Local-first storage for in-progress SPARK reflections. Saved sketches
 * go through dataAdapter.saveSparkSketch; these keys hold the raw
 * resonance values so a reflection can be resumed across sessions.
 */

const RESP_KEY = "creative-studio:spark-responses:v1";
const CURR_KEY = "creative-studio:spark-current-responses:v1";

const isBrowser = () => typeof window !== "undefined" && typeof localStorage !== "undefined";

function read<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
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

export const sparkResponsesStore = {
  load(): Responses {
    return read<Responses>(RESP_KEY, {});
  },
  save(r: Responses) {
    write(RESP_KEY, r);
  },
  clear() {
    if (isBrowser()) localStorage.removeItem(RESP_KEY);
  },
};

export const currentResponsesStore = {
  load(): CurrentResponses {
    return read<CurrentResponses>(CURR_KEY, {});
  },
  save(r: CurrentResponses) {
    write(CURR_KEY, r);
  },
  clear() {
    if (isBrowser()) localStorage.removeItem(CURR_KEY);
  },
};
