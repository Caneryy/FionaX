import { getHorizonServer, type StellarNetwork } from "@/lib/stellar/horizon";
import { parseAssetAggregate } from "@/app/tools/asset-statistics/lib/asset-lookup";
import type { AssetLookupClient, AssetStatisticsInput } from "@/app/tools/asset-statistics/types";

export interface AssetPageSource {
  load(input: AssetStatisticsInput): Promise<{ records: unknown[] }>;
}

export class AssetDecodeError extends Error {
  constructor() {
    super("Horizon asset record could not be decoded.");
    this.name = "AssetDecodeError";
  }
}

/** Adapts a page of Horizon asset records into the injected lookup client. */
export function createAssetLookupClient(source: AssetPageSource): AssetLookupClient {
  return {
    async fetchAsset(input) {
      const page = await source.load(input);
      const record = page.records.find((candidate) => {
        if (typeof candidate !== "object" || candidate === null || !("asset_code" in candidate)) return false;
        const row = candidate as { asset_code?: unknown; asset_issuer?: unknown };
        return row.asset_code === input.assetCode && row.asset_issuer === input.assetIssuer;
      });
      if (!record) return null;

      const aggregate = parseAssetAggregate(record);
      if (!aggregate) throw new AssetDecodeError();
      return aggregate;
    }
  };
}

export function createHorizonAssetLookup(network: StellarNetwork): AssetLookupClient {
  return createAssetLookupClient({
    async load(input) {
      const page = await getHorizonServer(network).assets().forCode(input.assetCode).forIssuer(input.assetIssuer).call();
      return { records: page.records };
    }
  });
}
