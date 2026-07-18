import { describe, expect, it } from "vitest";
import { CURRENT_PROMPTS } from "@/lib/spark/currentPrompts";
import { PROMPTS, type Resonance } from "@/lib/spark/prompts";
import {
  SPARK_RESPONSE_VERSION,
  decodeStoredResponses,
  encodeStoredResponses,
} from "@/lib/spark/store";

describe("SPARK response persistence", () => {
  it("round-trips the current versioned response shape", () => {
    const responses = { [PROMPTS[0].id]: 5 as Resonance };

    const decoded = decodeStoredResponses(
      encodeStoredResponses(responses),
      PROMPTS.map((p) => p.id),
    );

    expect(decoded).toEqual(responses);
  });

  it("rejects legacy unversioned responses instead of mixing prompt versions", () => {
    const legacy = JSON.stringify({ [PROMPTS[0].id]: 5, oldPrompt: 1 });

    expect(
      decodeStoredResponses(
        legacy,
        PROMPTS.map((p) => p.id),
      ),
    ).toEqual({});
  });

  it("rejects a payload containing unknown prompt ids", () => {
    const stale = JSON.stringify({
      version: SPARK_RESPONSE_VERSION,
      responses: { [PROMPTS[0].id]: 5, stalePrompt: 4 },
    });

    expect(
      decodeStoredResponses(
        stale,
        PROMPTS.map((p) => p.id),
      ),
    ).toEqual({});
  });

  it("keeps current and current-stream storage on separate validated schemas", () => {
    const responses = { [CURRENT_PROMPTS[0].id]: 4 as Resonance };
    const payload = encodeStoredResponses(responses);

    expect(
      decodeStoredResponses(
        payload,
        CURRENT_PROMPTS.map((p) => p.id),
      ),
    ).toEqual(responses);
    expect(
      decodeStoredResponses(
        payload,
        PROMPTS.map((p) => p.id),
      ),
    ).toEqual({});
  });
});
