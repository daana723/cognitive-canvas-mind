import { patternMemoryStore } from "@/lib/cognition/memory";
import { cognitiveStateStore } from "@/lib/cognition/state";
import type { CognitiveContext } from "@/lib/cognition/types";

export function getLocalCognitiveContext(): CognitiveContext {
  return {
    state: cognitiveStateStore.load(),
    patterns: patternMemoryStore.list(8),
  };
}
