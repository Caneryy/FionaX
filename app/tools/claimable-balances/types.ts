import type { StellarNetwork } from "@/lib/stellar/horizon";

export type ClaimableBalancesErrorCode = "invalid_claimant" | "invalid_cursor" | "malformed_predicate" | "rate_limited" | "request_failed";
export interface ClaimableBalancesError { code: ClaimableBalancesErrorCode }
export interface ClaimableBalancesInput { claimant: string; cursor?: string; network: StellarNetwork }
export type Predicate =
  | { kind: "unconditional" }
  | { kind: "abs_before" | "abs_before_epoch" | "rel_before"; value: string }
  | { kind: "and" | "or"; children: Predicate[] }
  | { kind: "not"; child: Predicate };
export interface ClaimableBalance {
  id: string;
  pagingToken: string;
  asset: string;
  amount: string;
  sponsor?: string;
  predicate: Predicate;
}
export interface ClaimableBalancesResult {
  balances: ClaimableBalance[];
  pagesFetched: number;
  pageLimit: number;
  nextCursor?: string;
  network: StellarNetwork;
}
export type ClaimableBalancesState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; result: ClaimableBalancesResult }
  | { status: "error"; error: ClaimableBalancesError };
export type ToolOutcome = { ok: true; result: ClaimableBalancesResult } | { ok: false; error: ClaimableBalancesError };
