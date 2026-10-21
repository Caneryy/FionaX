import { describe, expect, it, vi } from "vitest";
import { AssetDecodeError, createAssetLookupClient, createHorizonAssetLookup } from "@/app/tools/asset-statistics/lib/horizon-asset-client";
import { activeAssetIssuer, activeAssetRecord } from "@/tests/tools/asset-statistics/fixtures/active-asset.fixture";
import { mixedAuthorizationRecord } from "@/tests/tools/asset-statistics/fixtures/mixed-authorization.fixture";

const input = { assetCode: "USDC", assetIssuer: activeAssetIssuer };

describe("createAssetLookupClient", () => {
  it("returns the matching fixture record and ignores a different asset on the page", async () => {
    const load = vi.fn(async () => ({ records: [mixedAuthorizationRecord, activeAssetRecord] }));
    const client = createAssetLookupClient({ load });
    const aggregate = await client.fetchAsset(input);

    expect(load).toHaveBeenCalledWith(input);
    expect(aggregate?.assetCode).toBe("USDC");
    expect(aggregate?.numClaimableBalances).toBe(6);
  });

  it("returns null when the page has no matching record", async () => {
    const client = createAssetLookupClient({
      load: async () => ({ records: [] })
    });
    expect(await client.fetchAsset(input)).toBeNull();
  });

  it("throws a decode error when the matching record is malformed", async () => {
    const client = createAssetLookupClient({
      load: async () => ({ records: [{ asset_code: "USDC", asset_issuer: activeAssetIssuer, accounts: {} }] })
    });
    await expect(client.fetchAsset(input)).rejects.toBeInstanceOf(AssetDecodeError);
  });
});

describe("createHorizonAssetLookup", () => {
  it("builds a client for the selected network without calling Horizon", () => {
    const client = createHorizonAssetLookup("testnet");
    expect(typeof client.fetchAsset).toBe("function");
  });
});
