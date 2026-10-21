import { StrKey } from "@stellar/stellar-sdk";
import { invalidAccountMessage, copy } from "@/app/tools/account-merge-preflight/copy";
import type { AccountMergePreflightError, AccountMergePreflightInput } from "@/app/tools/account-merge-preflight/types";

export type ValidatedMergeInput =
  | { ok: true; input: AccountMergePreflightInput }
  | { ok: false; error: AccountMergePreflightError };

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

function validateOne(raw: string): { ok: true; accountId: string } | { ok: false; error: AccountMergePreflightError } {
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

  return { ok: true, accountId };
}

export function validateAccountMergePreflightInput(sourceRaw: string, destinationRaw: string): ValidatedMergeInput {
  const source = validateOne(sourceRaw);

  if (!source.ok) {
    return source;
  }

  const destination = validateOne(destinationRaw);

  if (!destination.ok) {
    return destination;
  }

  if (source.accountId === destination.accountId) {
    return { ok: false, error: { code: "same_account", message: copy.errors.same_account } };
  }

  return {
    ok: true,
    input: { sourceId: source.accountId, destinationId: destination.accountId }
  };
}
