import { describe, expect, it } from "vitest";
import { collectMergeBlockers } from "@/app/tools/account-merge-preflight/lib/merge-blockers";
import type { SourceSnapshot } from "@/app/tools/account-merge-preflight/types";

const clearSnapshot: SourceSnapshot = {
  accountId: "G",
  nativeBalance: "1.0000000",
  nativeStroops: 10000000n,
  trustlineCount: 0,
  offerCount: 0,
  dataEntryCount: 0,
  extraSignerCount: 0,
  sponsoring: false
};

describe("collectMergeBlockers", () => {
  it("returns no blockers for a clear source and an existing destination", () => {
    expect(collectMergeBlockers(clearSnapshot, true)).toEqual([]);
  });

  it("reports every blocker type instead of stopping at the first", () => {
    const codes = collectMergeBlockers(
      { ...clearSnapshot, trustlineCount: 1, offerCount: 2, dataEntryCount: 1, extraSignerCount: 1, sponsoring: true },
      false
    ).map((blocker) => blocker.code);

    expect(codes).toEqual(["trustlines", "offers", "data_entries", "extra_signers", "sponsorship", "destination_missing"]);
  });
});
