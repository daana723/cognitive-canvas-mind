import { studioStore, type StudioState } from "@/lib/studio/store";
import {
  ok,
  unavailable,
  type CurrentsReading,
  type Result,
  type SparkSketch,
} from "@/lib/data/types";
import type { WeavePlan } from "@/lib/loom/orchestrator";

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
  getWeaves(): Promise<Result<WeavePlan[]>>;
  saveWeave(plan: WeavePlan): Promise<Result<WeavePlan>>;
}

const SPARK_KEY = "creative-studio:spark-sketch:v1";
const CURRENTS_KEY = "creative-studio:currents:v1";
const WEAVES_KEY = "creative-studio:loom-weaves:v1";

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
  async getWeaves() {
    return ok(readJson<WeavePlan[]>(WEAVES_KEY) ?? []);
  },
  async saveWeave(plan) {
    const current = readJson<WeavePlan[]>(WEAVES_KEY) ?? [];
    writeJson(WEAVES_KEY, [plan, ...current].slice(0, 20));
    return ok(plan);
  },
};

const remoteUnavailable = () => unavailable("Backend not connected — using local state.");

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
  async getWeaves() {
    return remoteUnavailable();
  },
  async saveWeave() {
    return remoteUnavailable();
  },
};

export const dataAdapter: DataAdapter = localAdapter;
export default dataAdapter;
