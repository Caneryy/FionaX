import { StrKey } from "@stellar/stellar-sdk";
import { invalidAccountMessage } from "@/app/tools/asset-flags-inspector/copy";
import type { AssetFlagsInspectorError, AssetFlagsInspectorInput } from "@/app/tools/asset-flags-inspector/types";

export type ValidatedIssuerInput = { ok: true; input: AssetFlagsInspectorInput } | { ok: false; error: AssetFlagsInspectorError };

/**
 * Secret seeds are rejected here, before any Horizon request is built.
 * The returned message never includes the raw value.
 */
export function isRejectedSecret(value: string): boolean {
  if (StrKey.isValidEd25519SecretSeed(value)) {
    return true;
  }

  if (!value.startsWith("S")) {
    return false;
  }

  // A 56-character S-key is a seed attempt even when the checksum is wrong.
  if (/^S[A-Z0-9]{55}$/.test(value)) {
    return true;
  }

  return value.length >= 56;
}

export function validateAssetFlagsInspectorInput(raw: string): ValidatedIssuerInput {
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
