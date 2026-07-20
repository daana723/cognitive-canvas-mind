import type { CognitiveMode, PatternMemoryEntry } from "@/lib/cognition/types";

export const PATTERN_MEMORY_KEY = "nls:pattern-memory:v1";

const isBrowser = () => typeof window !== "undefined" && typeof localStorage !== "undefined";

const uid = () =>
  globalThis.crypto?.randomUUID?.() ??
  `memory-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const normalizeEntry = (entry: unknown): PatternMemoryEntry | null => {
  if (!entry || typeof entry !== "object") return null;
  const record = entry as Partial<PatternMemoryEntry>;
  if (typeof record.observation !== "string" || !record.observation.trim()) return null;
  return {
    id: typeof record.id === "string" ? record.id : uid(),
    source:
      record.source === "loom-run" || record.source === "companion" ? record.source : "manual",
    observation: record.observation.slice(0, 500),
    mode: record.mode as CognitiveMode | undefined,
    moduleId: typeof record.moduleId === "string" ? record.moduleId : undefined,
    createdAt: typeof record.createdAt === "string" ? record.createdAt : new Date().toISOString(),
  };
};

const read = (): PatternMemoryEntry[] => {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(PATTERN_MEMORY_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.map(normalizeEntry).filter((entry): entry is PatternMemoryEntry => Boolean(entry))
      : [];
  } catch {
    return [];
  }
};

const write = (entries: PatternMemoryEntry[]) => {
  if (isBrowser()) localStorage.setItem(PATTERN_MEMORY_KEY, JSON.stringify(entries.slice(0, 80)));
};

export const patternMemoryStore = {
  list(limit = 8): PatternMemoryEntry[] {
    return read().slice(0, limit);
  },
  add(input: {
    observation: string;
    source: PatternMemoryEntry["source"];
    mode?: CognitiveMode;
    moduleId?: string;
  }): PatternMemoryEntry | null {
    const observation = input.observation.trim();
    if (!observation) return null;
    const entry: PatternMemoryEntry = {
      id: uid(),
      observation: observation.slice(0, 500),
      source: input.source,
      mode: input.mode,
      moduleId: input.moduleId,
      createdAt: new Date().toISOString(),
    };
    write([entry, ...read()]);
    return entry;
  },
};
