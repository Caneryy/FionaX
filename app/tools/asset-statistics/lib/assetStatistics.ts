import { copy } from "@/app/tools/asset-statistics/copy";
import { lookupAsset } from "@/app/tools/asset-statistics/lib/asset-lookup";
import { buildSupplySnapshot } from "@/app/tools/asset-statistics/lib/supply-snapshot";
import { buildTrustlineBreakdown } from "@/app/tools/asset-statistics/lib/trustline-breakdown";
import { validateAssetStatisticsInput } from "@/app/tools/asset-statistics/schema";
import type {
  AssetLookupClient,
  AssetStatisticsFormValues,
  AssetStatisticsOutcome
} from "@/app/tools/asset-statistics/types";

export interface RunAssetStatisticsOptions {
  now?: () => Date;
}

/**
 * Validates input, reads one aggregate through the injected client, and returns a result.
 * Expected failures stay in the result; the function does not throw them.
 */
export async function runAssetStatistics(
  raw: AssetStatisticsFormValues,
  client: AssetLookupClient,
  options: RunAssetStatisticsOptions = {}
): Promise<AssetStatisticsOutcome> {
  const parsed = validateAssetStatisticsInput(raw);
  if (!parsed.ok) return parsed;

  const lookedUp = await lookupAsset(client, parsed.input);
  if (!lookedUp.ok) return lookedUp;

  const trustlines = buildTrustlineBreakdown(lookedUp.aggregate.accounts);
  const supply = buildSupplySnapshot(lookedUp.aggregate);
  const claimableBalancesHolding = lookedUp.aggregate.numClaimableBalances;
  if (!trustlines || !supply || !Number.isSafeInteger(claimableBalancesHolding)) {
    return { ok: false, error: { code: "request_failed", message: copy.errors.request_failed } };
  }

  const capturedAt = (options.now ?? (() => new Date()))().toISOString();

  return {
    ok: true,
    result: {
      assetCode: lookedUp.aggregate.assetCode,
      assetIssuer: lookedUp.aggregate.assetIssuer,
      assetType: lookedUp.aggregate.assetType,
      accountsHolding: trustlines.total,
      claimableBalancesHolding,
      trustlines,
      supply,
      capturedAt
    }
  };
}
