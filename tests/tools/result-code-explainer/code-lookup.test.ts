import { describe, expect, it } from "vitest";
import { lookupCode } from "@/app/tools/result-code-explainer/lib/code-lookup";
import { knownTransactionCode, unknownTransactionLikeCode } from "@/tests/tools/result-code-explainer/fixtures/transaction-codes.fixture";
import { ambiguousCode } from "@/tests/tools/result-code-explainer/fixtures/ambiguous-codes.fixture";

describe("lookupCode", () => {
  it("finds a known transaction code", () => {
    expect(lookupCode(knownTransactionCode)).toHaveLength(1);
  });

  it("is case-insensitive", () => {
    expect(lookupCode(knownTransactionCode.toUpperCase())).toHaveLength(1);
  });

  it("returns an empty list for an unknown code", () => {
    expect(lookupCode(unknownTransactionLikeCode)).toHaveLength(0);
  });

  it("returns every row for an ambiguous code", () => {
    expect(lookupCode(ambiguousCode).length).toBeGreaterThan(1);
  });
});
