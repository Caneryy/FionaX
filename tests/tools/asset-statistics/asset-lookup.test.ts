import { describe, expect, it, vi } from "vitest";
import { copy } from "@/app/tools/asset-statistics/copy";
import { lookupAsset, parseAssetAggregate } from "@/app/tools/asset-statistics/lib/asset-lookup";
import type { AssetLookupClient } from "@/app/tools/asset-statistics/types";
import { activeAssetIssuer, activeAssetRecord } from "@/tests/tools/asset-statistics/fixtures/active-asset.fixture";
import { zeroTrustlineAssetRecord } from "@/tests/tools/asset-statistics/fixtures/zero-trustline-asset.fixture";

function clientReturning(value: Awaited<ReturnType<AssetLookupClient["fetchAsset"]>>): AssetLookupClient {
  return {
    fetchAsset: vi.fn(async () => value)
  };
}

describe("parseAssetAggregate", () => {
  it("reads holder counts and canonical amounts from the active fixture", () => {
    const aggregate = parseAssetAggregate(activeAssetRecord);
    expect(aggregate).toMatchObject({
      assetCode: "USDC",
      assetIssuer: activeAssetIssuer,
      assetType: "credit_alphanum4",
      accounts: { authorized: 120, authorizedToMaintainLiabilities: 4, unauthorized: 2 },
      numClaimableBalances: 6,
      balances: { authorized: "1000000.5000000" }
    });
  });

  it("reads a 12-character zero-trustline asset", () => {
    const aggregate = parseAssetAggregate(zeroTrustlineAssetRecord);
    expect(aggregate?.assetType).toBe("credit_alphanum12");
    expect(aggregate?.accounts.authorized).toBe(0);
    expect(aggregate?.numClaimableBalances).toBe(1);
  });

  it("rejects a record whose asset type does not match the code length", () => {
    expect(parseAssetAggregate({ ...activeAssetRecord, asset_type: "credit_alphanum12" })).toBeNull();
  });

  it("rejects a truncated balance payload", () => {
    const partial = { ...activeAssetRecord, contracts_amount: undefined };
    expect(parseAssetAggregate(partial)).toBeNull();
  });
});

describe("lookupAsset", () => {
  const input = { assetCode: "USDC", assetIssuer: activeAssetIssuer };

  it("returns the aggregate when the client finds the same asset", async () => {
    const aggregate = parseAssetAggregate(activeAssetRecord);
    const result = await lookupAsset(clientReturning(aggregate), input);
    expect(result.ok).toBe(true);
  });

  it("maps an empty client result to asset_not_found", async () => {
    const result = await lookupAsset(clientReturning(null), input);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toEqual({ code: "asset_not_found", message: copy.errors.asset_not_found });
    }
  });

  it("maps a mismatched record to asset_not_found", async () => {
    const aggregate = parseAssetAggregate(activeAssetRecord);
    const result = await lookupAsset(clientReturning(aggregate), { ...input, assetCode: "EURC" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("asset_not_found");
  });

  it("maps a 429 thrown by the client to rate_limited", async () => {
    const client: AssetLookupClient = {
      fetchAsset: async () => {
        throw { response: { status: 429 } };
      }
    };
    const result = await lookupAsset(client, input);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("rate_limited");
  });

  it("maps a transport error to request_failed", async () => {
    const client: AssetLookupClient = {
      fetchAsset: async () => {
        throw new Error("socket hang up");
      }
    };
    const result = await lookupAsset(client, input);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("request_failed");
      expect(result.error.message).toBe(copy.errors.request_failed);
    }
  });
});
