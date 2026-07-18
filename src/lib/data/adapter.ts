import { studioStore, type StudioState } from "@/lib/studio/store";
import {
  ok,
  unavailable,
  type CurrentsReading,
  type LoomModuleRunRecord,
  type LoomWeaveRecord,
  type Result,
  type SparkSketch,
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
  saveWeave(record: LoomWeaveRecord): Promise<Result<LoomWeaveRecord>>;
  listWeaves(): Promise<Result<LoomWeaveRecord[]>>;
  saveModuleRun(record: LoomModuleRunRecord): Promise<Result<LoomModuleRunRecord>>;
  listModuleRuns(): Promise<Result<LoomModuleRunRecord[]>>;
}

const SPARK_KEY = "creative-studio:spark-sketch:v1";
const CURRENTS_KEY = "creative-studio:currents:v1";
const WEAVES_KEY = "nls:weaves:v1";
const MODULE_RUNS_KEY = "nls:module-runs:v1";

const isBrowser = () => typeof window !== "undefined" && typeof localStorage !== "undefined";

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

const listJson = <T>(key: string) => readJson<T[]>(key) ?? [];

const prependJson = <T>(key: string, value: T, limit = 20) => {
  const next = [value, ...listJson<T>(key)].slice(0, limit);
  writeJson(key, next);
  return next;
};

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
  async saveWeave(record) {
    prependJson(WEAVES_KEY, record);
    return ok(record);
  },
  async listWeaves() {
    return ok(listJson<LoomWeaveRecord>(WEAVES_KEY));
  },
  async saveModuleRun(record) {
    prependJson(MODULE_RUNS_KEY, record);
    return ok(record);
  },
  async listModuleRuns() {
    return ok(listJson<LoomModuleRunRecord>(MODULE_RUNS_KEY));
  },
};

const remoteUnavailable = () => unavailable("Backend not connected - using local state.");

export const remoteAdapter: DataAdapter = {
  async getSparkSketch() {
    return remoteUnavailable();
  },
  async saveSparkSketch() {
    return remoteUnavailable();
  },
  async getCurrents() {
    return remoteUnavailable();
  },
  async saveCurrents() {
    return remoteUnavailable();
  },
  async getLoomState() {
    return remoteUnavailable();
  },
  async saveLoomState() {
    return remoteUnavailable();
  },
  async saveWeave() {
    return remoteUnavailable();
  },
  async listWeaves() {
    return remoteUnavailable();
  },
  async saveModuleRun() {
    return remoteUnavailable();
  },
  async listModuleRuns() {
    return remoteUnavailable();
  },
};

export const dataAdapter: DataAdapter = localAdapter;
export default dataAdapter;
