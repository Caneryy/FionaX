import type { StellarNetwork } from "@/lib/stellar/horizon";

export const NAME_BYTE_LIMIT = 64;
export const NAME_NEAR_LIMIT = 56;

export interface AccountDataEntriesInput {
  accountId: string;
}

export type AccountDataEntriesErrorCode =
  | "invalid_account"
  | "account_not_found"
  | "malformed_data_entry"
  | "rate_limited"
  | "request_failed";

export type InvalidAccountReason = "empty" | "secret" | "malformed";

export interface AccountDataEntriesError {
  code: AccountDataEntriesErrorCode;
  message: string;
}

export type DataEntryEncoding = "text" | "binary";

export interface DataEntryView {
  name: string;
  nameBytes: number;
  nearLimit: boolean;
  rawBase64: string;
  encoding: DataEntryEncoding;
  /** Present only when the bytes are printable UTF-8. Binary entries leave this null. */
  text: string | null;
  hex: string;
}

export interface AccountDataEntriesResult {
  accountId: string;
  network: StellarNetwork;
  entries: DataEntryView[];
}

export type AccountDataEntriesOutcome =
  | { ok: true; result: AccountDataEntriesResult }
  | { ok: false; error: AccountDataEntriesError };

export type AccountDataEntriesState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; result: AccountDataEntriesResult }
  | { status: "error"; error: AccountDataEntriesError };
