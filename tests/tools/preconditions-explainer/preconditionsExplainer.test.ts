import { describe, expect, it } from "vitest";
import { runPreconditionsExplainer } from "@/app/tools/preconditions-explainer/lib/preconditionsExplainer";
import { envelopeWithTimeBounds } from "@/tests/tools/preconditions-explainer/fixtures/time-bounds.fixture";
import { envelopeWithSequenceConditions } from "@/tests/tools/preconditions-explainer/fixtures/sequence-conditions.fixture";
import { envelopeWithNoPreconditions, malformedEnvelope } from "@/tests/tools/preconditions-explainer/fixtures/no-preconditions.fixture";

describe("runPreconditionsExplainer", () => {
  it("explains time bounds end to end", () => {
    const outcome = runPreconditionsExplainer({ envelope: envelopeWithTimeBounds });
    expect(outcome.ok).toBe(true);
    expect(outcome.ok && outcome.result.unrestricted).toBe(false);
    expect(outcome.ok && outcome.result.timeBounds).not.toBeNull();
  });

  it("explains sequence conditions and extra signers end to end", () => {
    const outcome = runPreconditionsExplainer({ envelope: envelopeWithSequenceConditions });
    expect(outcome.ok).toBe(true);
    expect(outcome.ok && outcome.result.extraSigners).toHaveLength(1);
  });

  it("flags an envelope with no preconditions as unrestricted", () => {
    const outcome = runPreconditionsExplainer({ envelope: envelopeWithNoPreconditions });
    expect(outcome.ok).toBe(true);
    expect(outcome.ok && outcome.result.unrestricted).toBe(true);
  });

  it("rejects malformed XDR with a specific error code", () => {
    const outcome = runPreconditionsExplainer({ envelope: malformedEnvelope });
    expect(outcome.ok).toBe(false);
    expect(!outcome.ok && outcome.error.code).toBe("invalid_xdr");
  });
});
