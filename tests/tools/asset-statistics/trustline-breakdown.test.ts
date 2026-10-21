import { describe, expect, it } from "vitest";
import { buildTrustlineBreakdown } from "@/app/tools/asset-statistics/lib/trustline-breakdown";
import { mixedAuthorizationRecord } from "@/tests/tools/asset-statistics/fixtures/mixed-authorization.fixture";
import { zeroTrustlineAssetRecord } from "@/tests/tools/asset-statistics/fixtures/zero-trustline-asset.fixture";

describe("buildTrustlineBreakdown", () => {
  it("keeps each authorization state from the mixed fixture", () => {
    const breakdown = buildTrustlineBreakdown({
      authorized: mixedAuthorizationRecord.accounts.authorized,
      authorizedToMaintainLiabilities: mixedAuthorizationRecord.accounts.authorized_to_maintain_liabilities,
      unauthorized: mixedAuthorizationRecord.accounts.unauthorized
    });

    expect(breakdown).toEqual({
      authorized: 1,
      authorizedToMaintainLiabilities: 2,
      unauthorized: 3,
      total: 6
    });
  });

  it("treats an all-zero book as an empty total rather than a missing record", () => {
    const breakdown = buildTrustlineBreakdown({
      authorized: zeroTrustlineAssetRecord.accounts.authorized,
      authorizedToMaintainLiabilities: zeroTrustlineAssetRecord.accounts.authorized_to_maintain_liabilities,
      unauthorized: zeroTrustlineAssetRecord.accounts.unauthorized
    });

    expect(breakdown?.total).toBe(0);
    expect(breakdown?.authorized).toBe(0);
    expect(breakdown?.authorizedToMaintainLiabilities).toBe(0);
    expect(breakdown?.unauthorized).toBe(0);
  });

  it("rejects fractional and negative counters", () => {
    expect(
      buildTrustlineBreakdown({
        authorized: 1.5,
        authorizedToMaintainLiabilities: 0,
        unauthorized: 0
      })
    ).toBeNull();
    expect(
      buildTrustlineBreakdown({
        authorized: -1,
        authorizedToMaintainLiabilities: 0,
        unauthorized: 0
      })
    ).toBeNull();
  });
});
