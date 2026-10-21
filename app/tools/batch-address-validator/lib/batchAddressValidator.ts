import { StrKey } from "@stellar/stellar-sdk";
import { classifyEntries } from "@/app/tools/batch-address-validator/lib/duplicate-detect";
import { BatchAddressValidatorFailure } from "@/app/tools/batch-address-validator/lib/batchAddressValidator.errors";
import { batchContainsSecretSeed } from "@/app/tools/batch-address-validator/lib/secret-seed-guard";
import type {
  BatchAddressRow,
  BatchAddressValidatorInput,
  BatchAddressValidatorResult,
  RowIssueCode
} from "@/app/tools/batch-address-validator/types";

function issueCode(status: BatchAddressRow["status"]): RowIssueCode | null {
  if (status === "invalid") return "invalid_address";
  if (status === "duplicate") return "duplicate_address";
  return null;
}

/**
 * Validate each entry with StrKey and keep the original order.
 * This function does not contact the network.
 */
export function runBatchAddressValidator(input: BatchAddressValidatorInput): BatchAddressValidatorResult {
  if (batchContainsSecretSeed(input.entries)) {
    throw new BatchAddressValidatorFailure("contains_secret_seed");
  }

  const checked = input.entries.map((entry) => ({
    ...entry,
    valid: StrKey.isValidEd25519PublicKey(entry.value)
  }));
  const statuses = classifyEntries(checked);

  const rows: BatchAddressRow[] = checked.map((entry, position) => {
    const status = statuses[position];
    return {
      value: entry.value,
      line: entry.line,
      index: entry.index,
      status,
      code: issueCode(status)
    };
  });

  return {
    rows,
    summary: {
      total: rows.length,
      valid: rows.filter((row) => row.status === "valid").length,
      invalid: rows.filter((row) => row.status === "invalid").length,
      duplicate: rows.filter((row) => row.status === "duplicate").length
    }
  };
}
