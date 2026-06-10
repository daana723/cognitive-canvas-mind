import type { Responses } from "../spark/scoring";
import type { IntensityResponses } from "../intensities/scoring";

/**
 * Local-first storage layer.
 * Cloud-ready: the StorageAdapter interface can be backed by Lovable Cloud later
 * without changing call sites.
 */

export interface StoredProfile {
  responses: Responses;
  intensities?: IntensityResponses;
  intensitiesCompletedAt?: string;
  completedAt?: string;
  updatedAt: string;
  version: 2;
}

export interface StorageAdapter {
  loadProfile(): StoredProfile | null;
  saveProfile(profile: StoredProfile): void;
  clearProfile(): void;
}

const KEY = "cognitive-layer:profile:v1";

const isBrowser = () => typeof window !== "undefined" && typeof localStorage !== "undefined";

export const localStore: StorageAdapter = {
  loadProfile() {
    if (!isBrowser()) return null;
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      return JSON.parse(raw) as StoredProfile;
    } catch {
      return null;
    }
  },
  saveProfile(profile) {
    if (!isBrowser()) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(profile));
    } catch { /* quota — ignore */ }
  },
  clearProfile() {
    if (!isBrowser()) return;
    localStorage.removeItem(KEY);
  },
};

export function upsertResponses(responses: Responses, opts?: { complete?: boolean }) {
  const existing = localStore.loadProfile();
  const next: StoredProfile = {
    ...(existing ?? {}),
    responses,
    updatedAt: new Date().toISOString(),
    completedAt: opts?.complete ? new Date().toISOString() : existing?.completedAt,
    version: 2,
  };
  localStore.saveProfile(next);
  return next;
}

export function upsertIntensities(
  intensities: IntensityResponses,
  opts?: { complete?: boolean },
) {
  const existing = localStore.loadProfile();
  const next: StoredProfile = {
    responses: existing?.responses ?? {},
    ...(existing ?? {}),
    intensities,
    updatedAt: new Date().toISOString(),
    intensitiesCompletedAt: opts?.complete
      ? new Date().toISOString()
      : existing?.intensitiesCompletedAt,
    version: 2,
  };
  localStore.saveProfile(next);
  return next;
}