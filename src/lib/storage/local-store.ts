import type { Responses } from "../spark/scoring";

/**
 * Local-first storage layer.
 * Cloud-ready: the StorageAdapter interface can be backed by Lovable Cloud later
 * without changing call sites.
 */

export interface StoredProfile {
  responses: Responses;
  completedAt?: string;
  updatedAt: string;
  version: 1;
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
    responses,
    updatedAt: new Date().toISOString(),
    completedAt: opts?.complete ? new Date().toISOString() : existing?.completedAt,
    version: 1,
  };
  localStore.saveProfile(next);
  return next;
}