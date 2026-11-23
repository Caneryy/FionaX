import type { LiquidityPoolInspectorError, LiquidityPoolInspectorErrorCode } from "../types";

export class ToolFailure extends Error {
  constructor(public readonly code: LiquidityPoolInspectorErrorCode) {
    super(code);
    this.name = "ToolFailure";
  }
}

export function toToolError(error: unknown): LiquidityPoolInspectorError {
  if (error instanceof ToolFailure) return { code: error.code };
  return { code: "request_failed" };
}

export function statusToToolError(status: number): LiquidityPoolInspectorError {
  if (status === 404) return { code: "pool_not_found" };
  if (status === 429) return { code: "rate_limited" };
  return { code: "request_failed" };
}
