import { describe, expect, it } from "vitest";
import { parseAssetAggregate } from "@/app/tools/asset-statistics/lib/asset-lookup";
import { buildSupplySnapshot } from "@/app/tools/asset-statistics/lib/supply-snapshot";
import {
  activeAssetRecord,
  activeCirculatingAmount
} from "@/tests/tools/asset-statistics/fixtures/active-asset.fixture";
import {
  mixedAuthorizationRecord,
  mixedCirculatingAmount
} from "@/tests/tools/asset-statistics/fixtures/mixed-authorization.fixture";
import {
  zeroTrustlineAssetRecord,
  zeroTrustlineCirculatingAmount
} from "@/tests/tools/asset-statistics/fixtures/zero-trustline-asset.fixture";

describe("buildSupplySnapshot", () => {
  it("sums the active asset buckets to the exact circulating string", () => {
    const aggregate = parseAssetAggregate(activeAssetRecord);
    expect(aggregate).not.toBeNull();
    const snapshot = buildSupplySnapshot(aggregate!);
    expect(snapshot?.circulating).toBe(activeCirculatingAmount);
    expect(snapshot?.authorized).toBe("1000000.5000000");
  });

  it("keeps a zero-trustline asset at the claimable amount only", () => {
    const aggregate = parseAssetAggregate(zeroTrustlineAssetRecord);
    const snapshot = buildSupplySnapshot(aggregate!);
    expect(snapshot?.circulating).toBe(zeroTrustlineCirculatingAmount);
  });

  it("preserves the mixed fixture digit that floating point changes", () => {
    const aggregate = parseAssetAggregate(mixedAuthorizationRecord);
    const snapshot = buildSupplySnapshot(aggregate!);
    expect(snapshot?.circulating).toBe(mixedCirculatingAmount);
    expect(Number(snapshot?.circulating).toFixed(7)).not.toBe(mixedCirculatingAmount);
  });

  it("rejects a balance that is not a Stellar amount string", () => {
    const aggregate = parseAssetAggregate(activeAssetRecord);
    expect(
      buildSupplySnapshot({
        ...aggregate!,
        balances: { ...aggregate!.balances, unauthorized: "1.2.3" }
      })
    ).toBeNull();
  });
});
