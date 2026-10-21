import { copy } from "@/app/tools/batch-address-validator/copy";
import { parseBatch } from "@/app/tools/batch-address-validator/lib/batch-parse";
import { MAX_BATCH_ENTRIES } from "@/app/tools/batch-address-validator/lib/limits";
import { batchContainsSecretSeed } from "@/app/tools/batch-address-validator/lib/secret-seed-guard";
import type {
  BatchAddressValidatorError,
  BatchAddressValidatorInput
} from "@/app/tools/batch-address-validator/types";

export type ValidatedBatch =
  | { ok: true; input: BatchAddressValidatorInput }
  | { ok: false; error: BatchAddressValidatorError };

function failure(code: "empty_batch" | "too_many_entries" | "contains_secret_seed"): ValidatedBatch {
  return { ok: false, error: { code, message: copy.errors[code] } };
}

/**
 * Validate a raw paste without making a network request.
 * A secret seed fails the whole batch before any entry is returned.
 */
export function validateBatchAddressValidatorInput(raw: string): ValidatedBatch {
  const entries = parseBatch(raw);

  if (entries.length === 0) return failure("empty_batch");
  if (batchContainsSecretSeed(entries)) return failure("contains_secret_seed");
  if (entries.length > MAX_BATCH_ENTRIES) return failure("too_many_entries");

  return { ok: true, input: { entries } };
}
