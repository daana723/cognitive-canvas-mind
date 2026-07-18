import type { OEResponses } from "./scoring";

const KEY = "nls.twoe.responses.v1";

export const twoeResponsesStore = {
  load(): OEResponses {
    if (typeof window === "undefined") return {};
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as OEResponses) : {};
    } catch {
      return {};
    }
  },
  save(r: OEResponses) {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(KEY, JSON.stringify(r));
    } catch {
      /* no-op */
    }
  },
  clear() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(KEY);
  },
};