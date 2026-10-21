import { copy } from "@/app/tools/asset-flags-inspector/copy";
import { IssuerFlagsFailure, SecretSeedRejectedError } from "@/app/tools/asset-flags-inspector/lib/issuer-flags";
import type { AssetFlagsInspectorError, AssetFlagsInspectorErrorCode } from "@/app/tools/asset-flags-inspector/types";

function messageForCode(code: AssetFlagsInspectorErrorCode): string {
  if (code === "invalid_account") {
    return copy.errors.invalid_account.secret;
  }

  return copy.errors[code];
}

/**
 * Map transport and decode failures onto this tool's codes.
 * The underlying message is dropped so a seed or a Horizon body cannot leak into the UI.
 */
export function toToolError(error: unknown): AssetFlagsInspectorError {
  if (error instanceof SecretSeedRejectedError) {
    return { code: "invalid_account", message: copy.errors.invalid_account.secret };
  }

  if (error instanceof IssuerFlagsFailure) {
    return { code: error.code, message: messageForCode(error.code) };
  }

  return { code: "request_failed", message: copy.errors.request_failed };
}
