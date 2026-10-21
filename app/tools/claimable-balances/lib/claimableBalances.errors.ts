import type { ClaimableBalancesError, ClaimableBalancesErrorCode } from "../types";

export class ToolFailure extends Error {
  constructor(public readonly code: ClaimableBalancesErrorCode) { super(code); }
}

export function toToolError(error: unknown): ClaimableBalancesError {
  return error instanceof ToolFailure ? { code: error.code } : { code: "request_failed" };
}
