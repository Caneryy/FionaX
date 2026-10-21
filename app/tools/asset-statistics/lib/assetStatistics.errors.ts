import { copy } from "@/app/tools/asset-statistics/copy";
import {
  ASSET_STATISTICS_ERROR_CODES,
  type AssetStatisticsError,
  type AssetStatisticsErrorCode
} from "@/app/tools/asset-statistics/types";

function isErrorCode(value: unknown): value is AssetStatisticsErrorCode {
  return typeof value === "string" && (ASSET_STATISTICS_ERROR_CODES as readonly string[]).includes(value);
}

function readStatus(error: unknown): number | undefined {
  if (typeof error !== "object" || error === null) return undefined;

  if ("status" in error && typeof error.status === "number") {
    return error.status;
  }

  if ("response" in error && typeof error.response === "object" && error.response !== null && "status" in error.response) {
    const status = error.response.status;
    if (typeof status === "number") return status;
  }

  return undefined;
}

/** Maps transport and decode failures onto this tool's codes. Messages always come from copy.ts. */
export function toToolError(error: unknown): AssetStatisticsError {
  if (typeof error === "object" && error !== null && "code" in error && isErrorCode(error.code)) {
    return { code: error.code, message: copy.errors[error.code] };
  }

  const status = readStatus(error);
  if (status === 429) {
    return { code: "rate_limited", message: copy.errors.rate_limited };
  }
  if (status === 404) {
    return { code: "asset_not_found", message: copy.errors.asset_not_found };
  }

  return { code: "request_failed", message: copy.errors.request_failed };
}
