import type { LoomProvider } from "@/lib/loom/types";

const unavailable = async (label: string) => {
  throw new Error(`${label} provider is not configured. No external call was made.`);
};

export const localDeterministicProvider: LoomProvider = {
  id: "local-deterministic",
  label: "Local deterministic Loom",
  mode: "local",
  isConfigured: () => true,
  async generate(request) {
    return {
      providerId: "local-deterministic",
      content: request.payload,
      externalCalls: [],
    };
  },
};

export const geminiFlashProvider: LoomProvider = {
  id: "gemini-flash",
  label: "Gemini Flash",
  mode: "remote",
  isConfigured: () => false,
  generate: () => unavailable("Gemini Flash"),
};

export const deepSeekVeniceProvider: LoomProvider = {
  id: "deepseek-venice",
  label: "DeepSeek/Venice",
  mode: "remote",
  isConfigured: () => false,
  generate: () => unavailable("DeepSeek/Venice"),
};

export const lmStudioProvider: LoomProvider = {
  id: "lm-studio",
  label: "Local LM Studio",
  mode: "local",
  isConfigured: () => false,
  generate: () => unavailable("Local LM Studio"),
};

export const LOOM_PROVIDERS = [
  localDeterministicProvider,
  geminiFlashProvider,
  deepSeekVeniceProvider,
  lmStudioProvider,
] satisfies LoomProvider[];

export const getLoomProvider = (id: string) =>
  LOOM_PROVIDERS.find((provider) => provider.id === id);
