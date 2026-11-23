import type { StellarNetwork } from "@/lib/stellar/horizon";

export type FeeStatsErrorCode =
  | "invalid_network"
  | "history_unavailable"
  | "malformed_response"
  | "rate_limited"
  | "request_failed";

export interface FeeStatsError {
  code: FeeStatsErrorCode;
}

export interface FeeStatsInput {
  network: StellarNetwork;
}

/** One charged-fee percentile row (p10–p99). Fees stay decimal strings — never Number. */
export interface PercentileRow {
  key: string;
  label: string;
  feeStroops: string;
}

export interface FeeStatsResult {
  lastLedger: string;
  lastLedgerBaseFee: string;
  /** Horizon's raw capacity ratio string (0–1). */
  capacityUsageRatio: string;
  /** Display percentage derived from capacityUsageRatio (e.g. "5.00"). */
  capacityUsagePercent: string;
  percentiles: PercentileRow[];
  /** True when required fields are present but some percentile values are missing. */
  incomplete: boolean;
  fetchedAt: string;
  network: StellarNetwork;
}

export type FeeStatsState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; result: FeeStatsResult }
  | { status: "error"; error: FeeStatsError };

export type ToolOutcome =
  | { ok: true; result: FeeStatsResult }
  | { ok: false; error: FeeStatsError };

/** Raw Horizon GET /fee_stats body after a successful transport read. */
export interface RawFeeStatsResponse {
  last_ledger: string;
  last_ledger_base_fee: string;
  ledger_capacity_usage: string;
  fee_charged: Record<string, string>;
}
