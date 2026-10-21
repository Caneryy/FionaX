import { StrKey } from "@stellar/stellar-sdk";
import type { StellarNetwork } from "@/lib/stellar/horizon";
import type { SponsoredReservesInput, SponsoredReservesError } from "./types";

export function validateSponsoredReservesInput(raw: string, network: StellarNetwork):
  { ok: true; input: SponsoredReservesInput } | { ok: false; error: SponsoredReservesError } {
  const accountId = raw.trim();
  if (!StrKey.isValidEd25519PublicKey(accountId)) {
    return { ok: false, error: { code: "invalid_account" } };
  }
  return { ok: true, input: { accountId, network } };
}
