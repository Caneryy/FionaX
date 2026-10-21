import { StrKey } from "@stellar/stellar-sdk";
import type { StellarNetwork } from "@/lib/stellar/horizon";
import type { EffectsTimelineInput, EffectsTimelineError } from "./types";

export function validateEffectsTimelineInput(
  rawAccount: string,
  network: StellarNetwork,
  rawCursor?: string
): { ok: true; input: EffectsTimelineInput } | { ok: false; error: EffectsTimelineError } {
  const accountId = rawAccount.trim();
  // Only classic public account IDs belong on Horizon's /accounts endpoint.
  // This explicitly rejects secret seeds before any network request.
  if (!StrKey.isValidEd25519PublicKey(accountId)) {
    return { ok: false, error: { code: "invalid_account" } };
  }
  // Horizon effect tokens contain an operation ID and effect index.
  if (rawCursor !== undefined && !/^[0-9]{1,40}-[0-9]{1,10}$/.test(rawCursor)) {
    return { ok: false, error: { code: "invalid_cursor" } };
  }
  return { ok: true, input: { accountId, network, cursor: rawCursor } };
}
