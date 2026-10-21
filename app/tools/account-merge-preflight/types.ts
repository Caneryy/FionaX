import type { StellarNetwork } from "@/lib/stellar/horizon";

export interface AccountMergePreflightInput {
  sourceId: string;
  destinationId: string;
}

export type AccountMergePreflightErrorCode =
  | "invalid_account"
  | "source_not_found"
  | "destination_not_found"
  | "same_account"
  | "rate_limited"
  | "request_failed";

export type InvalidAccountReason = "empty" | "secret" | "malformed";

export interface AccountMergePreflightError {
  code: AccountMergePreflightErrorCode;
  message: string;
}

export type BlockerCode = "trustlines" | "offers" | "data_entries" | "extra_signers" | "sponsorship" | "destination_missing";

export interface MergeBlocker {
  code: BlockerCode;
  title: string;
  detail: string;
}

export interface AccountMergePreflightResult {
  sourceId: string;
  destinationId: string;
  network: StellarNetwork;
  /** Horizon native balance string, kept exact. */
  nativeBalance: string;
  /** Same balance in stroops. */
  nativeStroops: bigint;
  destinationExists: boolean;
  mergeable: boolean;
  blockers: MergeBlocker[];
}

export type AccountMergePreflightOutcome =
  | { ok: true; result: AccountMergePreflightResult }
  | { ok: false; error: AccountMergePreflightError };

export type AccountMergePreflightState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; result: AccountMergePreflightResult }
  | { status: "error"; error: AccountMergePreflightError };

export interface SourceSnapshot {
  accountId: string;
  nativeBalance: string;
  nativeStroops: bigint;
  trustlineCount: number;
  offerCount: number;
  dataEntryCount: number;
  extraSignerCount: number;
  sponsoring: boolean;
}
