import type { EffectsTimelineError } from "../types";

export class MalformedEffectError extends Error {}

export function toToolError(error: unknown): EffectsTimelineError {
  if (error instanceof MalformedEffectError) return { code: "malformed_effect" };
  if (typeof error === "object" && error !== null && "response" in error) {
    const status = (error as { response?: { status?: number } }).response?.status;
    if (status === 404) return { code: "account_not_found" };
    if (status === 400) return { code: "invalid_cursor" };
    if (status === 429) return { code: "rate_limited" };
  }
  return { code: "request_failed" };
}

export function errorFromStatus(status: number): EffectsTimelineError {
  return toToolError({ response: { status } });
}
