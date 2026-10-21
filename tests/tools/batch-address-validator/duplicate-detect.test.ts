import { describe, expect, it } from "vitest";
import { classifyEntries } from "@/app/tools/batch-address-validator/lib/duplicate-detect";
import { publicKeyFromFixedSeed } from "@/tests/tools/batch-address-validator/fixtures/mixed-batch.fixture";

describe("classifyEntries", () => {
  const alpha = publicKeyFromFixedSeed(1);
  const beta = publicKeyFromFixedSeed(2);

  it("keeps the first valid address and marks later copies as duplicates", () => {
    const statuses = classifyEntries([
      { value: alpha, valid: true },
      { value: beta, valid: true },
      { value: alpha, valid: true }
    ]);

    expect(statuses).toEqual(["valid", "valid", "duplicate"]);
  });

  it("does not treat repeated invalid text as a duplicate", () => {
    const statuses = classifyEntries([
      { value: "bad", valid: false },
      { value: "bad", valid: false }
    ]);

    expect(statuses).toEqual(["invalid", "invalid"]);
  });

  it("preserves input order when valid and invalid entries are mixed", () => {
    const statuses = classifyEntries([
      { value: alpha, valid: true },
      { value: "bad", valid: false },
      { value: alpha, valid: true },
      { value: beta, valid: true }
    ]);

    expect(statuses).toEqual(["valid", "invalid", "duplicate", "valid"]);
  });
});
