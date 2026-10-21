import { StrKey } from "@stellar/stellar-sdk";
import { invalidAccountMessage } from "@/app/tools/account-data-entries/copy";
import type { AccountDataEntriesError, AccountDataEntriesInput } from "@/app/tools/account-data-entries/types";

export type ValidatedAccountInput =
  | { ok: true; input: AccountDataEntriesInput }
  | { ok: false; error: AccountDataEntriesError };

/** Secret seeds are rejected here, before any Horizon request is built. */
export function isRejectedSecret(value: string): boolean {
  if (StrKey.isValidEd25519SecretSeed(value)) {
    return true;
  }

  if (!value.startsWith("S")) {
    return false;
  }

  if (/^S[A-Z0-9]{55}$/.test(value)) {
    return true;
  }

  return value.length >= 56;
}

export function validateAccountDataEntriesInput(raw: string): ValidatedAccountInput {
  const accountId = raw.trim();

  if (!accountId) {
    return { ok: false, error: { code: "invalid_account", message: invalidAccountMessage("empty") } };
  }

  if (isRejectedSecret(accountId)) {
    return { ok: false, error: { code: "invalid_account", message: invalidAccountMessage("secret") } };
  }

  if (!StrKey.isValidEd25519PublicKey(accountId)) {
    return { ok: false, error: { code: "invalid_account", message: invalidAccountMessage("malformed") } };
  }

  return { ok: true, input: { accountId } };
}
