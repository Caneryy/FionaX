import type { StellarNetwork } from "@/lib/stellar/horizon";

export const MEMO_KINDS = ["none", "text", "id", "hash", "return"] as const;

export type MemoKind = (typeof MEMO_KINDS)[number];

export interface MemoInspectorInput {
  hash: string;
}

export type MemoInspectorErrorCode =
  | "invalid_hash"
  | "transaction_not_found"
  | "malformed_memo"
  | "rate_limited"
  | "request_failed";

export type InvalidHashReason = "empty" | "malformed";

export interface MemoInspectorError {
  code: MemoInspectorErrorCode;
  message: string;
}

/** Decoded memo ready for type-specific UI rules. */
export type DecodedMemo =
  | { kind: "none" }
  | { kind: "text"; raw: string; text: string | null; binary: boolean; hex: string }
  | { kind: "id"; raw: string; id: string }
  | { kind: "hash"; rawBase64: string; hex: string; base64: string }
  | { kind: "return"; rawBase64: string; hex: string; base64: string };

export interface MemoInspectorResult {
  hash: string;
  network: StellarNetwork;
  memoType: MemoKind;
  memo: DecodedMemo;
  sourceAccount: string;
  createdAt: string;
  successful: boolean;
}

export type MemoInspectorOutcome =
  | { ok: true; result: MemoInspectorResult }
  | { ok: false; error: MemoInspectorError };

export type MemoInspectorState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; result: MemoInspectorResult }
  | { status: "error"; error: MemoInspectorError };
