import { studioStore, type StudioState } from "@/lib/studio/store";
import {
  ok,
  unavailable,
  type CurrentsReading,
  type Result,
  type SparkSketch,
  type WeaveEntry,
  type WeavePlan,
  type ModuleRunEntry,
} from "@/lib/data/types";

/**
 * DataAdapter is the persistence boundary. UI code depends on this
 * interface, not on localStorage or a remote client directly.
 */
export interface DataAdapter {
  getSparkSketch(): Promise<Result<SparkSketch | null>>;
  saveSparkSketch(sketch: SparkSketch): Promise<Result<SparkSketch>>;
  getCurrents(): Promise<Result<CurrentsReading | null>>;
  saveCurrents(reading: CurrentsReading): Promise<Result<CurrentsReading>>;
  getLoomState(): Promise<Result<StudioState>>;
  saveLoomState(state: StudioState): Promise<Result<StudioState>>;
  listWeaves(): Promise<Result<WeaveEntry[]>>;
  saveWeave(plan: WeavePlan): Promise<Result<WeaveEntry>>;
  listModuleRuns(moduleId?: string): Promise<Result<ModuleRunEntry[]>>;
  saveModuleRun(run: Omit<ModuleRunEntry, "id">): Promise<Result<ModuleRunEntry>>;
}

const SPARK_KEY = "creative-studio:spark-sketch:v1";
const CURRENTS_KEY = "creative-studio:currents:v1";
const WEAVES_KEY = "nls:weaves:v1";
const RUNS_KEY = "nls:module-runs:v1";

const uid = () =>
  (globalThis.crypto?.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);

const isBrowser = () =>
  typeof window !== "undefined" && typeof localStorage !== "undefined";

function readJson<T>(key: string): T | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson<T>(key: string, value: T) {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota / private mode errors
  }
}

export const localAdapter: DataAdapter = {
  async getSparkSketch() {
    return ok(readJson<SparkSketch>(SPARK_KEY));
  },
  async saveSparkSketch(sketch) {
    writeJson(SPARK_KEY, sketch);
    return ok(sketch);
  },
  async getCurrents() {
    return ok(readJson<CurrentsReading>(CURRENTS_KEY));
  },
  async saveCurrents(reading) {
    writeJson(CURRENTS_KEY, reading);
    return ok(reading);
  },
  async getLoomState() {
    return ok(studioStore.load());
  },
  async saveLoomState(state) {
    studioStore.save(state);
    return ok(state);
  },
  async listWeaves() {
    return ok(readJson<WeaveEntry[]>(WEAVES_KEY) ?? []);
  },
  async saveWeave(plan) {
    const entries = readJson<WeaveEntry[]>(WEAVES_KEY) ?? [];
    const entry: WeaveEntry = { id: uid(), plan };
    const next = [entry, ...entries].slice(0, 50);
    writeJson(WEAVES_KEY, next);
    return ok(entry);
  },
  async listModuleRuns(moduleId) {
    const all = readJson<ModuleRunEntry[]>(RUNS_KEY) ?? [];
    return ok(moduleId ? all.filter((r) => r.moduleId === moduleId) : all);
  },
  async saveModuleRun(run) {
    const all = readJson<ModuleRunEntry[]>(RUNS_KEY) ?? [];
    const entry: ModuleRunEntry = { id: uid(), ...run };
    const next = [entry, ...all].slice(0, 100);
    writeJson(RUNS_KEY, next);
    return ok(entry);
  },
};

const remoteUnavailable = () =>
  unavailable("Backend not connected — using local state.");

export const remoteAdapter: DataAdapter = {
  async getSparkSketch() { return remoteUnavailable(); },
  async saveSparkSketch() { return remoteUnavailable(); },
  async getCurrents() { return remoteUnavailable(); },
  async saveCurrents() { return remoteUnavailable(); },
  async getLoomState() { return remoteUnavailable(); },
  async saveLoomState() { return remoteUnavailable(); },
  async listWeaves() { return remoteUnavailable(); },
  async saveWeave() { return remoteUnavailable(); },
  async listModuleRuns() { return remoteUnavailable(); },
  async saveModuleRun() { return remoteUnavailable(); },
};

export const dataAdapter: DataAdapter = localAdapter;
export default dataAdapter;