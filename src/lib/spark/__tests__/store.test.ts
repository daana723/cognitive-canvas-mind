import { describe, expect, it } from "vitest";
import { CURRENT_PROMPTS } from "@/lib/spark/currentPrompts";
import { PROMPTS, type Resonance } from "@/lib/spark/prompts";
import {
  SPARK_RESPONSE_VERSION,
  decodeStoredResponses,
  encodeStoredResponses,
} from "@/lib/spark/store";

describe("SPARK response persistence", () => {
  it("uses the deployed 25-prompt schema", () => {
    expect(PROMPTS).toHaveLength(25);
    expect(PROMPTS.map((prompt) => prompt.id)).toContain("ci1");
    expect(PROMPTS.map((prompt) => prompt.id)).toContain("ed5");
  });

  it("round-trips the current versioned response shape", () => {
    const responses = { [PROMPTS[0].id]: 5 as Resonance };

    const decoded = decodeStoredResponses(
      encodeStoredResponses(responses),
      PROMPTS.map((p) => p.id),
    );

    expect(decoded).toEqual(responses);
  });

  it("rejects legacy unversioned responses instead of mixing prompt versions", () => {
    const legacy = JSON.stringify({ a1: 5, r1: 4, oldPrompt: 1 });

    expect(
      decodeStoredResponses(
        legacy,
        PROMPTS.map((p) => p.id),
      ),
    ).toEqual({});
  });

  it("rejects a versioned payload containing old 21-prompt ids", () => {
    const stale = JSON.stringify({
      version: SPARK_RESPONSE_VERSION,
      responses: { a1: 5, r1: 4, u3: 2 },
    });

    expect(
      decodeStoredResponses(
        stale,
        PROMPTS.map((p) => p.id),
      ),
    ).toEqual({});
  });

  it("rejects invalid resonance values", () => {
    const invalid = JSON.stringify({
      version: SPARK_RESPONSE_VERSION,
      responses: { [PROMPTS[0].id]: 0 },
    });

    expect(
      decodeStoredResponses(
        invalid,
        PROMPTS.map((p) => p.id),
      ),
    ).toEqual({});
  });

  it("keeps current-stream storage on its own validated schema", () => {
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
