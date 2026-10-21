import type { StellarNetwork } from "@/lib/stellar/horizon";

export const SIGNER_TYPES = ["ed25519_public_key", "sha256_hash", "preauth_tx"] as const;

export type SignerKind = (typeof SIGNER_TYPES)[number];

export interface AccountSignersInput {
  accountId: string;
}

export type AccountSignersErrorCode =
  | "invalid_account"
  | "account_not_found"
  | "malformed_signer"
  | "rate_limited"
  | "request_failed";

export type InvalidAccountReason = "empty" | "secret" | "malformed";

export interface AccountSignersError {
  code: AccountSignersErrorCode;
  message: string;
}

export interface Thresholds {
  low: number;
  medium: number;
  high: number;
}

export interface SignerView {
  key: string;
  weight: number;
  kind: SignerKind;
  master: boolean;
}

export interface AccountSignersResult {
  accountId: string;
  network: StellarNetwork;
  signers: SignerView[];
  thresholds: Thresholds;
  masterWeightZero: boolean;
}

export type AccountSignersOutcome = { ok: true; result: AccountSignersResult } | { ok: false; error: AccountSignersError };

export type AccountSignersState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; result: AccountSignersResult }
  | { status: "error"; error: AccountSignersError };
