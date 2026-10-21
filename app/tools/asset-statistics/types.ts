export const ASSET_STATISTICS_ERROR_CODES = [
  "invalid_asset_code",
  "invalid_issuer",
  "asset_not_found",
  "rate_limited",
  "request_failed"
] as const;

export type AssetStatisticsErrorCode = (typeof ASSET_STATISTICS_ERROR_CODES)[number];

export type AssetTypeName = "credit_alphanum4" | "credit_alphanum12";

export interface AssetStatisticsInput {
  assetCode: string;
  assetIssuer: string;
}

export interface AssetStatisticsError {
  code: AssetStatisticsErrorCode;
  message: string;
}

export interface TrustlineCounts {
  authorized: number;
  authorizedToMaintainLiabilities: number;
  unauthorized: number;
}

export interface TrustlineBreakdown extends TrustlineCounts {
  total: number;
}

export interface SupplyParts {
  authorized: string;
  authorizedToMaintainLiabilities: string;
  unauthorized: string;
  claimableBalances: string;
  liquidityPools: string;
  contracts: string;
}

export interface SupplySnapshot extends SupplyParts {
  /** Canonical 7-decimal amount. Built with integer stroops, never a float. */
  circulating: string;
}

export interface AssetStatisticsResult {
  assetCode: string;
  assetIssuer: string;
  assetType: AssetTypeName;
  accountsHolding: number;
  claimableBalancesHolding: number;
  trustlines: TrustlineBreakdown;
  supply: SupplySnapshot;
  capturedAt: string;
}

export type AssetStatisticsOutcome =
  | { ok: true; result: AssetStatisticsResult }
  | { ok: false; error: AssetStatisticsError };

export type AssetStatisticsViewState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; result: AssetStatisticsResult }
  | { status: "empty"; result: AssetStatisticsResult }
  | { status: "error"; error: AssetStatisticsError };

/** Normalized Horizon `/assets` aggregate for one code and issuer. */
export interface HorizonAssetAggregate {
  assetCode: string;
  assetIssuer: string;
  assetType: AssetTypeName;
  accounts: TrustlineCounts;
  balances: {
    authorized: string;
    authorizedToMaintainLiabilities: string;
    unauthorized: string;
  };
  numClaimableBalances: number;
  claimableBalancesAmount: string;
  liquidityPoolsAmount: string;
  contractsAmount: string;
}

/**
 * Injected reader for the asset aggregate.
 * Production uses Horizon; tests pass fixture records and never call the network.
 */
export interface AssetLookupClient {
  fetchAsset(input: AssetStatisticsInput): Promise<HorizonAssetAggregate | null>;
}

export interface AssetStatisticsFormValues {
  assetCode: string;
  assetIssuer: string;
}
