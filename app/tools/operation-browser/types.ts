import type { StellarNetwork } from "@/lib/stellar/horizon";

export interface OperationBrowserInput {
  accountId: string;
  network: StellarNetwork;
  cursor?: string;
}

export interface BrowserOperation {
  pagingToken: string;
  type: string;
  createdAt: string | null;
  transactionHash: string;
  details: Record<string, unknown>;
}

export interface OperationBrowserResult {
  accountId: string;
  network: StellarNetwork;
  operations: BrowserOperation[];
  nextCursor: string | null;
}

export type OperationBrowserErrorCode =
  | "invalid_account"
  | "account_not_found"
  | "invalid_cursor"
  | "malformed_operation"
  | "rate_limited"
  | "request_failed";

export interface OperationBrowserError {
  code: OperationBrowserErrorCode;
}

export type OperationBrowserOutcome =
  | { ok: true; result: OperationBrowserResult }
  | { ok: false; error: OperationBrowserError };

export type OperationBrowserState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; result: OperationBrowserResult; loadingMore: boolean; pageError: OperationBrowserError | null }
  | { status: "error"; error: OperationBrowserError };
