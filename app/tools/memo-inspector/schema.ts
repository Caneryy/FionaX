import { invalidHashMessage } from "@/app/tools/memo-inspector/copy";
import type { MemoInspectorError, MemoInspectorInput } from "@/app/tools/memo-inspector/types";

export type ValidatedMemoInput = { ok: true; input: MemoInspectorInput } | { ok: false; error: MemoInspectorError };

const HASH_PATTERN = /^[a-fA-F0-9]{64}$/;

export function isValidTransactionHash(value: string): boolean {
  return HASH_PATTERN.test(value);
}

export function validateMemoInspectorInput(raw: string): ValidatedMemoInput {
  const hash = raw.trim();

  if (!hash) {
    return { ok: false, error: { code: "invalid_hash", message: invalidHashMessage("empty") } };
  }

  if (!isValidTransactionHash(hash)) {
    return { ok: false, error: { code: "invalid_hash", message: invalidHashMessage("malformed") } };
  }

  return { ok: true, input: { hash: hash.toLowerCase() } };
}
