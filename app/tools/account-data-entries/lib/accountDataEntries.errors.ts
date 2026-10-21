import { copy } from "@/app/tools/account-data-entries/copy";
import { DataEntriesFailure, SecretSeedRejectedError } from "@/app/tools/account-data-entries/lib/data-entries";
import type { AccountDataEntriesError, AccountDataEntriesErrorCode } from "@/app/tools/account-data-entries/types";

function messageForCode(code: AccountDataEntriesErrorCode): string {
  if (code === "invalid_account") {
    return copy.errors.invalid_account.secret;
  }

  return copy.errors[code];
}

/** Map transport and decode failures onto this tool's codes. The raw body is dropped. */
export function toToolError(error: unknown): AccountDataEntriesError {
  if (error instanceof SecretSeedRejectedError) {
    return { code: "invalid_account", message: copy.errors.invalid_account.secret };
  }

  if (error instanceof DataEntriesFailure) {
    return { code: error.code, message: messageForCode(error.code) };
  }

  return { code: "request_failed", message: copy.errors.request_failed };
}
