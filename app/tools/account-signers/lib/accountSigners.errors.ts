import { copy } from "@/app/tools/account-signers/copy";
import { SecretSeedRejectedError, SignersFailure } from "@/app/tools/account-signers/lib/signer-list";
import type { AccountSignersError, AccountSignersErrorCode } from "@/app/tools/account-signers/types";

function messageForCode(code: AccountSignersErrorCode): string {
  if (code === "invalid_account") return copy.errors.invalid_account.secret;
  return copy.errors[code];
}

export function toToolError(error: unknown): AccountSignersError {
  if (error instanceof SecretSeedRejectedError) {
    return { code: "invalid_account", message: copy.errors.invalid_account.secret };
  }

  if (error instanceof SignersFailure) {
    return { code: error.code, message: messageForCode(error.code) };
  }

  return { code: "request_failed", message: copy.errors.request_failed };
}
