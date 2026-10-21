import { describe, expect, it } from "vitest";
import { MAX_XDR_LENGTH, validatePreconditionsExplainerInput } from "@/app/tools/preconditions-explainer/schema";
import { envelopeWithNoPreconditions, oversizedEnvelope } from "@/tests/tools/preconditions-explainer/fixtures/no-preconditions.fixture";

describe("validatePreconditionsExplainerInput", () => {
  it("rejects empty input", () => {
    const result = validatePreconditionsExplainerInput("   ");
    expect(result.ok).toBe(false);
    expect(!result.ok && result.error.code).toBe("empty_xdr");
  });

  it("accepts a valid envelope", () => {
    const result = validatePreconditionsExplainerInput(envelopeWithNoPreconditions);
    expect(result.ok).toBe(true);
  });

  it("rejects text that is not base64", () => {
    const result = validatePreconditionsExplainerInput("not base64 at all!!");
    expect(!result.ok && result.error.code).toBe("invalid_xdr");
  });

  it("rejects input over the length cap", () => {
    expect(oversizedEnvelope.length).toBeGreaterThan(MAX_XDR_LENGTH);
    const result = validatePreconditionsExplainerInput(oversizedEnvelope);
    expect(!result.ok && result.error.code).toBe("too_large");
  });

  it("strips whitespace before validating", () => {
    const spaced = envelopeWithNoPreconditions.replace(/(.{4})/g, "$1 ");
    expect(validatePreconditionsExplainerInput(spaced).ok).toBe(true);
  });
});
