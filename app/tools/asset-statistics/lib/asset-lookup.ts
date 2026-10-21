import { copy } from "@/app/tools/asset-statistics/copy";
import { normalizeAmount } from "@/app/tools/asset-statistics/lib/amount";
import { toToolError } from "@/app/tools/asset-statistics/lib/assetStatistics.errors";
import type {
  AssetLookupClient,
  AssetStatisticsError,
  AssetStatisticsInput,
  AssetTypeName,
  HorizonAssetAggregate,
  TrustlineCounts
} from "@/app/tools/asset-statistics/types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readCount(source: Record<string, unknown>, key: string): number | null {
  const value = source[key];
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) return null;
  return value;
}

function readAmount(source: Record<string, unknown>, key: string): string | null {
  const value = source[key];
  if (typeof value !== "string") return null;
  return normalizeAmount(value);
}

function assetTypeFor(code: string, declared: unknown): AssetTypeName | null {
  const expected: AssetTypeName = code.length <= 4 ? "credit_alphanum4" : "credit_alphanum12";
  if (declared !== expected) return null;
  return expected;
}

/** Decodes one Horizon asset record into the aggregate this tool stores. */
export function parseAssetAggregate(record: unknown): HorizonAssetAggregate | null {
  if (!isRecord(record) || !isRecord(record.accounts) || !isRecord(record.balances)) return null;
  if (typeof record.asset_code !== "string" || typeof record.asset_issuer !== "string") return null;

  const assetType = assetTypeFor(record.asset_code, record.asset_type);
  const accounts: TrustlineCounts | null = (() => {
    const authorized = readCount(record.accounts, "authorized");
    const authorizedToMaintainLiabilities = readCount(record.accounts, "authorized_to_maintain_liabilities");
    const unauthorized = readCount(record.accounts, "unauthorized");
    if (authorized === null || authorizedToMaintainLiabilities === null || unauthorized === null) return null;
    return { authorized, authorizedToMaintainLiabilities, unauthorized };
  })();

  const authorized = readAmount(record.balances, "authorized");
  const authorizedToMaintainLiabilities = readAmount(record.balances, "authorized_to_maintain_liabilities");
  const unauthorized = readAmount(record.balances, "unauthorized");
  const numClaimableBalances = readCount(record, "num_claimable_balances");
  const claimableBalancesAmount = readAmount(record, "claimable_balances_amount");
  const liquidityPoolsAmount = readAmount(record, "liquidity_pools_amount");
  const contractsAmount = readAmount(record, "contracts_amount");

  if (
    !assetType ||
    !accounts ||
    !authorized ||
    !authorizedToMaintainLiabilities ||
    !unauthorized ||
    numClaimableBalances === null ||
    !claimableBalancesAmount ||
    !liquidityPoolsAmount ||
    !contractsAmount
  ) {
    return null;
  }

  return {
    assetCode: record.asset_code,
    assetIssuer: record.asset_issuer,
    assetType,
    accounts,
    balances: { authorized, authorizedToMaintainLiabilities, unauthorized },
    numClaimableBalances,
    claimableBalancesAmount,
    liquidityPoolsAmount,
    contractsAmount
  };
}

export async function lookupAsset(
  client: AssetLookupClient,
  input: AssetStatisticsInput
): Promise<{ ok: true; aggregate: HorizonAssetAggregate } | { ok: false; error: AssetStatisticsError }> {
  try {
    const aggregate = await client.fetchAsset(input);
    if (!aggregate) {
      return { ok: false, error: { code: "asset_not_found", message: copy.errors.asset_not_found } };
    }
    if (aggregate.assetCode !== input.assetCode || aggregate.assetIssuer !== input.assetIssuer) {
      return { ok: false, error: { code: "asset_not_found", message: copy.errors.asset_not_found } };
    }
    return { ok: true, aggregate };
  } catch (error) {
    return { ok: false, error: toToolError(error) };
  }
}
