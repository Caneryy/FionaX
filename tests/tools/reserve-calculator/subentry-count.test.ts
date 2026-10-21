import { describe, expect, it } from "vitest";
import { countSubentries } from "@/app/tools/reserve-calculator/lib/subentry-count";

describe("countSubentries", () => {
  it("counts a plain account with nothing but the master key", () => {
    const result = countSubentries({ accountId: "G", subentryCount: 0, balanceCount: 0, dataEntryCount: 0, signerCount: 1 });
    expect(result).toEqual({ trustlines: 0, offers: 0, dataEntries: 0, extraSigners: 0, total: 0 });
  });

  it("counts trustlines, data entries and extra signers directly, and derives offers as the remainder", () => {
    // 2 trustlines + 1 data entry + 1 extra signer + 3 offers = 7 total subentries.
    const result = countSubentries({ accountId: "G", subentryCount: 7, balanceCount: 2, dataEntryCount: 1, signerCount: 2 });
    expect(result).toEqual({ trustlines: 2, offers: 3, dataEntries: 1, extraSigners: 1, total: 7 });
  });

  it("never reports a negative offer count even if the inputs are inconsistent", () => {
    const result = countSubentries({ accountId: "G", subentryCount: 1, balanceCount: 5, dataEntryCount: 0, signerCount: 1 });
    expect(result.offers).toBe(0);
  });

  it("does not count the master key itself as an extra signer", () => {
    const result = countSubentries({ accountId: "G", subentryCount: 0, balanceCount: 0, dataEntryCount: 0, signerCount: 1 });
    expect(result.extraSigners).toBe(0);
  });
});
