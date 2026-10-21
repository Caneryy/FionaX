import { copy } from "@/app/tools/asset-metadata/copy";
import type { AssetMetadataError, AssetMetadataErrorCode } from "@/app/tools/asset-metadata/types";

export function errorFor(code: AssetMetadataErrorCode): AssetMetadataError {
  return { code, message: copy.errors[code] };
}

export function isAssetMetadataError(error: unknown): error is AssetMetadataError {
  if (!error || typeof error !== "object") return false;
  const candidate = error as { code?: unknown; message?: unknown };
  return typeof candidate.code === "string" && candidate.code in copy.errors && typeof candidate.message === "string";
}

// Unexpected failures keep the fixed copy. Caller-supplied messages are dropped so a seed cannot leak through.
export function toToolError(error: unknown): AssetMetadataError {
  if (isAssetMetadataError(error)) {
    return errorFor(error.code);
  }
  return errorFor("request_failed");
}
