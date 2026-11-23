import type { OperationBrowserError } from "../types";

export class MalformedOperationError extends Error {}

export function toToolError(error: unknown): OperationBrowserError {
  if (error instanceof MalformedOperationError) return { code: "malformed_operation" };
  if (typeof error === "object" && error !== null && "response" in error) {
    const status = (error as { response?: { status?: number } }).response?.status;
    if (status === 404) return { code: "account_not_found" };
    if (status === 400) return { code: "invalid_cursor" };
    if (status === 429) return { code: "rate_limited" };
  }
  return { code: "request_failed" };
}

export function errorFromStatus(status: number): OperationBrowserError {
  return toToolError({ response: { status } });
}
