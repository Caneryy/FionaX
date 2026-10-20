import type { StellarNetwork } from "@/lib/stellar/horizon";

export interface SponsoredReservesInput {
  accountId: string;
  network: StellarNetwork;
}

export type SponsoredReservesErrorCode = "invalid_account" | "account_not_found" | "rate_limited" | "request_failed";
export interface SponsoredReservesError { code: SponsoredReservesErrorCode }
export type ToolOutcome = { ok: true; result: SponsoredReservesResult } | { ok: false; error: SponsoredReservesError };

export interface SponsoredEntry {
  kind: "account" | "trustline" | "signer";
  label: string;
  sponsor: string;
  reserveUnits: bigint;
}

export interface SponsoredReservesResult {
  accountId: string;
  network: StellarNetwork;
  sponsoredByMeCount: bigint;
  sponsoredForMeCount: bigint;
  sponsoredForMe: SponsoredEntry[];
  unlistedReserveCount: bigint;
  reliefStroops: bigint;
}

export type SponsoredReservesState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; result: SponsoredReservesResult }
  | { status: "error"; error: SponsoredReservesError };
