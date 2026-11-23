import type { StellarNetwork } from "@/lib/stellar/horizon";

export const LIQUIDITY_POOL_INSPECTOR_ERROR_CODES = [
  "invalid_pool_id",
  "pool_not_found",
  "rate_limited",
  "request_failed"
] as const;

export type LiquidityPoolInspectorErrorCode = (typeof LIQUIDITY_POOL_INSPECTOR_ERROR_CODES)[number];

export interface LiquidityPoolInspectorError {
  code: LiquidityPoolInspectorErrorCode;
}

export interface LiquidityPoolInspectorInput {
  poolId: string;
  network: StellarNetwork;
}

export interface PoolReserve {
  /** Horizon asset string: "native" or "CODE:ISSUER". */
  asset: string;
  /** Exact pooled amount string from Horizon (never a float). */
  amount: string;
  /** Integer stroops representation of amount. */
  amountStroops: bigint;
}

/** Exact rational price of one reserve in terms of the other. */
export interface ImpliedReservePrice {
  /** Asset being priced (1 unit of this asset). */
  baseAsset: string;
  /** Quote asset (how many units of this per 1 base). */
  quoteAsset: string;
  /** Reduced numerator in stroops of quote. */
  numerator: bigint;
  /** Reduced denominator in stroops of base. */
  denominator: bigint;
}

export interface LiquidityPoolInspectorResult {
  poolId: string;
  network: StellarNetwork;
  type: string;
  feeBp: number;
  totalShares: string;
  totalSharesStroops: bigint;
  totalTrustlines: string;
  reserves: [PoolReserve, PoolReserve];
  prices: [ImpliedReservePrice, ImpliedReservePrice];
}

export type ToolOutcome =
  | { ok: true; result: LiquidityPoolInspectorResult }
  | { ok: false; error: LiquidityPoolInspectorError };

export type LiquidityPoolInspectorState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; result: LiquidityPoolInspectorResult }
  | { status: "error"; error: LiquidityPoolInspectorError };

/** Injected Horizon reader so tests stay offline. */
export interface PoolFetchClient {
  fetchPool(poolId: string, network: StellarNetwork): Promise<Response>;
}
