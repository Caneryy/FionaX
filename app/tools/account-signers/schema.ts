import { StrKey } from "@stellar/stellar-sdk";
import { invalidAccountMessage } from "@/app/tools/account-signers/copy";
import type { AccountSignersError, AccountSignersInput } from "@/app/tools/account-signers/types";

export type ValidatedAccountInput = { ok: true; input: AccountSignersInput } | { ok: false; error: AccountSignersError };

export function isRejectedSecret(value: string): boolean {
  if (StrKey.isValidEd25519SecretSeed(value)) return true;
  if (!value.startsWith("S")) return false;
  if (/^S[A-Z0-9]{55}$/.test(value)) return true;
  return value.length >= 56;
}

export function validateAccountSignersInput(raw: string): ValidatedAccountInput {
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
