import type { FeeStatsError, FeeStatsErrorCode } from "../types";

export class ToolFailure extends Error {
  constructor(public readonly code: FeeStatsErrorCode) {
    super(code);
    this.name = "ToolFailure";
  }
}

export function toToolError(error: unknown): FeeStatsError {
  return error instanceof ToolFailure ? { code: error.code } : { code: "request_failed" };
}
