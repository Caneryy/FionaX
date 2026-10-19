import { StrKey } from "@stellar/stellar-sdk";
import type { StellarNetwork } from "@/lib/stellar/horizon";
import type { ClaimableBalancesError, ClaimableBalancesInput } from "./types";

export function validateClaimableBalancesInput(
  rawClaimant: string,
  rawCursor = "",
  network: StellarNetwork = "testnet"
): { ok: true; input: ClaimableBalancesInput } | { ok: false; error: ClaimableBalancesError } {
  const claimant = rawClaimant.trim();
  if (!StrKey.isValidEd25519PublicKey(claimant)) return { ok: false, error: { code: "invalid_claimant" } };
  const cursor = rawCursor.trim();
  if (cursor && !(/^[0-9]{1,40}$/.test(cursor) || /^[0-9a-fA-F]{72}$/.test(cursor))) return { ok: false, error: { code: "invalid_cursor" } };
  return { ok: true, input: { claimant, ...(cursor ? { cursor } : {}), network } };
}
