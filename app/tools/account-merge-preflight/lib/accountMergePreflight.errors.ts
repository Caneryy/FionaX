import { copy } from "@/app/tools/account-merge-preflight/copy";
import { MergeFailure, SecretSeedRejectedError } from "@/app/tools/account-merge-preflight/lib/source-snapshot";
import type { AccountMergePreflightError, AccountMergePreflightErrorCode } from "@/app/tools/account-merge-preflight/types";

function messageForCode(code: AccountMergePreflightErrorCode): string {
  if (code === "invalid_account") {
    return copy.errors.invalid_account.secret;
  }

  return copy.errors[code];
}

export function toToolError(error: unknown): AccountMergePreflightError {
  if (error instanceof SecretSeedRejectedError) {
    return { code: "invalid_account", message: copy.errors.invalid_account.secret };
  }

  if (error instanceof MergeFailure) {
    return { code: error.code, message: messageForCode(error.code) };
  }

  return { code: "request_failed", message: copy.errors.request_failed };
}
