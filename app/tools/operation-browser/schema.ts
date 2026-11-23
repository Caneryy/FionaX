import { StrKey } from "@stellar/stellar-sdk";
import type { StellarNetwork } from "@/lib/stellar/horizon";
import type { OperationBrowserInput, OperationBrowserError } from "./types";

export function validateOperationBrowserInput(
  rawAccount: string,
  network: StellarNetwork,
  rawCursor?: string
): { ok: true; input: OperationBrowserInput } | { ok: false; error: OperationBrowserError } {
  const accountId = rawAccount.trim();
  // Only classic public account IDs belong on Horizon's /accounts endpoint.
  // This explicitly rejects secret seeds before any network request.
  if (!StrKey.isValidEd25519PublicKey(accountId)) {
    return { ok: false, error: { code: "invalid_account" } };
  }
  // Horizon operation paging tokens are numeric operation IDs.
  if (rawCursor !== undefined && !/^[0-9]{1,40}$/.test(rawCursor)) {
    return { ok: false, error: { code: "invalid_cursor" } };
  }
  return { ok: true, input: { accountId, network, cursor: rawCursor } };
}
