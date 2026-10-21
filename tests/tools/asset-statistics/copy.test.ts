import { describe, expect, it } from "vitest";
import { copy } from "@/app/tools/asset-statistics/copy";
import { ASSET_STATISTICS_ERROR_CODES } from "@/app/tools/asset-statistics/types";

describe("asset statistics copy", () => {
  it("gives every error code its own actionable message and title", () => {
    for (const code of ASSET_STATISTICS_ERROR_CODES) {
      expect(copy.errors[code].length).toBeGreaterThan(40);
      expect(copy.errorTitles[code].length).toBeGreaterThan(8);
      expect(copy.errors[code]).not.toMatch(/TODO/i);
    }
  });

  it("labels the figures as a snapshot rather than a live feed", () => {
    expect(copy.snapshotNotice.toLowerCase()).toContain("snapshot");
    expect(copy.snapshotNotice.toLowerCase()).toContain("not a live feed");
  });

  it("describes the zero-trustline state separately from a missing asset", () => {
    expect(copy.zeroTrustlinesTitle.toLowerCase()).toContain("zero trustlines");
    expect(copy.zeroTrustlinesBody.toLowerCase()).toContain("invalid issuer");
    expect(copy.errors.asset_not_found.toLowerCase()).toContain("no asset");
  });
});
