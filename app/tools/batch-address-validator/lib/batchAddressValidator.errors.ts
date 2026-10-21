import { copy } from "@/app/tools/batch-address-validator/copy";
import type {
  BatchAddressValidatorError,
  BatchAddressValidatorErrorCode
} from "@/app/tools/batch-address-validator/types";

const ERROR_CODES: readonly BatchAddressValidatorErrorCode[] = [
  "empty_batch",
  "too_many_entries",
  "contains_secret_seed",
  "invalid_address",
  "duplicate_address"
];

export class BatchAddressValidatorFailure extends Error {
  readonly code: BatchAddressValidatorErrorCode;

  constructor(code: BatchAddressValidatorErrorCode) {
    super(code);
    this.name = "BatchAddressValidatorFailure";
    this.code = code;
  }
}

export function isToolErrorCode(value: string): value is BatchAddressValidatorErrorCode {
  return ERROR_CODES.some((code) => code === value);
}

export function toolError(code: BatchAddressValidatorErrorCode): BatchAddressValidatorError {
  return { code, message: copy.errors[code] };
}

function hasToolCode(error: unknown): error is { code: BatchAddressValidatorErrorCode } {
  if (!error || typeof error !== "object" || !("code" in error)) return false;
  const code = (error as { code: unknown }).code;
  return typeof code === "string" && isToolErrorCode(code);
}

/**
 * Map a thrown value to tool copy. Error.message is ignored because a decoder
 * can include the rejected input, and that input may be a secret seed.
 */
export function toToolError(error: unknown): BatchAddressValidatorError {
  if (error instanceof BatchAddressValidatorFailure) return toolError(error.code);
  if (hasToolCode(error)) return toolError(error.code);
  return toolError("invalid_address");
}
