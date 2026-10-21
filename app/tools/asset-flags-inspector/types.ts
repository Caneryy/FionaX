import type { StellarNetwork } from "@/lib/stellar/horizon";

/**
 * Horizon account flags, in the order they are explained to a holder.
 * Bit positions live in flag-bitmask.ts and follow the Stellar protocol.
 */
export const ISSUER_FLAG_KEYS = [
  "auth_required",
  "auth_revocable",
  "auth_immutable",
  "auth_clawback_enabled"
] as const;

export type IssuerFlagKey = (typeof ISSUER_FLAG_KEYS)[number];

export interface IssuerFlags {
  auth_required: boolean;
  auth_revocable: boolean;
  auth_immutable: boolean;
  auth_clawback_enabled: boolean;
}

/** Raw text-field input. Network comes from the app shell, not this form. */
export interface AssetFlagsInspectorInput {
  accountId: string;
}

export type AssetFlagsInspectorErrorCode =
  | "invalid_account"
  | "account_not_found"
  | "rate_limited"
  | "request_failed";

export type InvalidAccountReason = "empty" | "secret" | "malformed";

export interface AssetFlagsInspectorError {
  code: AssetFlagsInspectorErrorCode;
  message: string;
}

export interface FlagRowModel {
  key: IssuerFlagKey;
  enabled: boolean;
  label: string;
  detail: string;
}

export interface FlagExplanationModel {
  rows: FlagRowModel[];
  combination: string;
  /** Set only when auth_immutable is on. The other three flags are locked. */
  immutableNotice: string | null;
  /** Set only when auth_immutable is off. The other three flags can still change. */
  adjustableNotice: string | null;
  allUnset: boolean;
}

export interface AssetFlagsInspectorResult {
  accountId: string;
  network: StellarNetwork;
  /** Horizon sequence as a decimal string so large values stay exact. */
  sequence: string;
  flags: IssuerFlags;
  /** AccountFlags bitmask. This is a protocol bit field, not a token amount. */
  bitmask: bigint;
  explanation: FlagExplanationModel;
}

/** Expected failures stay in this union. Callers do not need a throw for them. */
export type AssetFlagsInspectorOutcome =
  | { ok: true; result: AssetFlagsInspectorResult }
  | { ok: false; error: AssetFlagsInspectorError };

export type AssetFlagsInspectorState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; result: AssetFlagsInspectorResult }
  | { status: "error"; error: AssetFlagsInspectorError };

export interface IssuerAccountSnapshot {
  accountId: string;
  sequence: string;
  flags: IssuerFlags;
}
