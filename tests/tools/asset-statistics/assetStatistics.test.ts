import { describe, expect, it, vi } from "vitest";
import { Keypair } from "@stellar/stellar-sdk";
import { copy } from "@/app/tools/asset-statistics/copy";
import { parseAssetAggregate } from "@/app/tools/asset-statistics/lib/asset-lookup";
import { runAssetStatistics } from "@/app/tools/asset-statistics/lib/assetStatistics";
import { toViewState } from "@/app/tools/asset-statistics/lib/asset-statistics-state";
import type { AssetLookupClient, HorizonAssetAggregate } from "@/app/tools/asset-statistics/types";
import {
  activeAssetIssuer,
  activeAssetRecord,
  activeCirculatingAmount
} from "@/tests/tools/asset-statistics/fixtures/active-asset.fixture";
import {
  mixedAuthorizationIssuer,
  mixedAuthorizationRecord,
  mixedCirculatingAmount
} from "@/tests/tools/asset-statistics/fixtures/mixed-authorization.fixture";
import {
  zeroTrustlineAssetRecord,
  zeroTrustlineCirculatingAmount,
  zeroTrustlineIssuer
} from "@/tests/tools/asset-statistics/fixtures/zero-trustline-asset.fixture";

const now = () => new Date("2026-03-01T15:04:00.000Z");

function fixtureClient(record: unknown): AssetLookupClient & { fetchAsset: ReturnType<typeof vi.fn> } {
  const aggregate = parseAssetAggregate(record) as HorizonAssetAggregate;
  return {
    fetchAsset: vi.fn(async () => aggregate)
  };
}

describe("runAssetStatistics", () => {
  it("returns separate account and claimable counts plus the exact active supply", async () => {
    const client = fixtureClient(activeAssetRecord);
    const outcome = await runAssetStatistics(
      { assetCode: " USDC ", assetIssuer: activeAssetIssuer },
      client,
      { now }
    );

    expect(client.fetchAsset).toHaveBeenCalledOnce();
    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;

    expect(outcome.result.accountsHolding).toBe(126);
    expect(outcome.result.claimableBalancesHolding).toBe(6);
    expect(outcome.result.trustlines).toEqual({
      authorized: 120,
      authorizedToMaintainLiabilities: 4,
      unauthorized: 2,
      total: 126
    });
    expect(outcome.result.supply.circulating).toBe(activeCirculatingAmount);
    expect(outcome.result.capturedAt).toBe("2026-03-01T15:04:00.000Z");
    expect(toViewState(outcome).status).toBe("success");
  });

  it("keeps mixed authorization counts distinct and the circulating digit exact", async () => {
    const outcome = await runAssetStatistics(
      { assetCode: "MIX", assetIssuer: mixedAuthorizationIssuer },
      fixtureClient(mixedAuthorizationRecord),
      { now }
    );

    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;
    expect(outcome.result.trustlines.authorized).toBe(1);
    expect(outcome.result.trustlines.authorizedToMaintainLiabilities).toBe(2);
    expect(outcome.result.trustlines.unauthorized).toBe(3);
    expect(outcome.result.claimableBalancesHolding).toBe(4);
    expect(outcome.result.supply.circulating).toBe(mixedCirculatingAmount);
  });

  it("returns a zero-trustline result that the view treats as empty, not as asset_not_found", async () => {
    const outcome = await runAssetStatistics(
      { assetCode: "ZEROCLAIMABL", assetIssuer: zeroTrustlineIssuer },
      fixtureClient(zeroTrustlineAssetRecord),
      { now }
    );

    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;
    expect(outcome.result.trustlines.total).toBe(0);
    expect(outcome.result.accountsHolding).toBe(0);
    expect(outcome.result.claimableBalancesHolding).toBe(1);
    expect(outcome.result.supply.circulating).toBe(zeroTrustlineCirculatingAmount);
    expect(toViewState(outcome).status).toBe("empty");
  });

  it("does not fetch when the asset code is invalid", async () => {
    const client = fixtureClient(activeAssetRecord);
    const outcome = await runAssetStatistics({ assetCode: "US DC", assetIssuer: activeAssetIssuer }, client);
    expect(client.fetchAsset).not.toHaveBeenCalled();
    expect(outcome).toEqual({
      ok: false,
      error: { code: "invalid_asset_code", message: copy.errors.invalid_asset_code }
    });
  });

  it("does not fetch when the issuer is invalid", async () => {
    const client = fixtureClient(activeAssetRecord);
    const outcome = await runAssetStatistics(
      { assetCode: "USDC", assetIssuer: "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" },
      client
    );
    expect(client.fetchAsset).not.toHaveBeenCalled();
    expect(outcome.ok).toBe(false);
    if (!outcome.ok) expect(outcome.error.code).toBe("invalid_issuer");
  });

  it("does not fetch or echo a secret seed", async () => {
    const secret = Keypair.random().secret();
    const client = fixtureClient(activeAssetRecord);
    const outcome = await runAssetStatistics({ assetCode: "USDC", assetIssuer: secret }, client);

    expect(client.fetchAsset).not.toHaveBeenCalled();
    expect(outcome.ok).toBe(false);
    if (!outcome.ok) {
      expect(outcome.error.code).toBe("invalid_issuer");
      expect(JSON.stringify(outcome).includes(secret)).toBe(false);
    }
  });

  it("maps a missing asset to asset_not_found", async () => {
    const client: AssetLookupClient = { fetchAsset: async () => null };
    const outcome = await runAssetStatistics({ assetCode: "USDC", assetIssuer: activeAssetIssuer }, client);
    expect(outcome).toEqual({
      ok: false,
      error: { code: "asset_not_found", message: copy.errors.asset_not_found }
    });
  });

  it("maps rate limiting from the client", async () => {
    const client: AssetLookupClient = {
      fetchAsset: async () => {
        throw { response: { status: 429 } };
      }
    };
    const outcome = await runAssetStatistics({ assetCode: "USDC", assetIssuer: activeAssetIssuer }, client);
    expect(outcome.ok).toBe(false);
    if (!outcome.ok) {
      expect(outcome.error).toEqual({ code: "rate_limited", message: copy.errors.rate_limited });
    }
  });

  it("maps a failed request", async () => {
    const client: AssetLookupClient = {
      fetchAsset: async () => {
        throw new Error("network down");
      }
    };
    const outcome = await runAssetStatistics({ assetCode: "USDC", assetIssuer: activeAssetIssuer }, client);
    expect(outcome.ok).toBe(false);
    if (!outcome.ok) {
      expect(outcome.error).toEqual({ code: "request_failed", message: copy.errors.request_failed });
    }
  });
});
