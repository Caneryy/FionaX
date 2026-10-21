import { describe, expect, it } from "vitest";
import { decodeEnvelopeOperations, decodePreconditions } from "@/app/tools/preconditions-explainer/lib/precondition-decode";
import { decodeExtraSigners } from "@/app/tools/preconditions-explainer/lib/extra-signers";
import { envelopeWithTimeBounds, maxTime, minTime } from "@/tests/tools/preconditions-explainer/fixtures/time-bounds.fixture";
import {
  envelopeWithSequenceConditions,
  extraSignerAddress,
  minSeqAge,
  minSeqLedgerGap,
  minSeqNum
} from "@/tests/tools/preconditions-explainer/fixtures/sequence-conditions.fixture";
import { envelopeWithNoPreconditions, malformedEnvelope } from "@/tests/tools/preconditions-explainer/fixtures/no-preconditions.fixture";

describe("decodeEnvelopeOperations + decodePreconditions", () => {
  it("decodes time bounds", () => {
    const decoded = decodeEnvelopeOperations(envelopeWithTimeBounds);
    expect(decoded.ok).toBe(true);
    if (!decoded.ok) return;
    const result = decodePreconditions(decoded.cond);
    expect(result.unrestricted).toBe(false);
    expect(result.timeBounds).toEqual({ minTime: String(minTime), maxTime: String(maxTime) });
  });

  it("decodes sequence-number preconditions and extra signers", () => {
    const decoded = decodeEnvelopeOperations(envelopeWithSequenceConditions);
    expect(decoded.ok).toBe(true);
    if (!decoded.ok) return;
    const result = decodePreconditions(decoded.cond);
    expect(result.unrestricted).toBe(false);
    expect(result.minSeqNum).toBe(minSeqNum);
    expect(result.minSeqAge).toBe(String(minSeqAge));
    expect(result.minSeqLedgerGap).toBe(minSeqLedgerGap);
    expect(result.extraSigners).toHaveLength(1);
    expect(decodeExtraSigners(result.extraSigners)).toEqual([{ kind: "ed25519", display: extraSignerAddress }]);
  });

  it("flags an envelope with no preconditions as unrestricted", () => {
    const decoded = decodeEnvelopeOperations(envelopeWithNoPreconditions);
    expect(decoded.ok).toBe(true);
    if (!decoded.ok) return;
    const result = decodePreconditions(decoded.cond);
    expect(result.unrestricted).toBe(true);
  });

  it("returns invalid_xdr for malformed input", () => {
    const decoded = decodeEnvelopeOperations(malformedEnvelope);
    expect(decoded.ok).toBe(false);
    expect(!decoded.ok && decoded.code).toBe("invalid_xdr");
  });
});
