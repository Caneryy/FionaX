import type { SponsoredReservesError } from "../types";

export function toToolError(status?: number): SponsoredReservesError {
  if (status === 404) return { code: "account_not_found" };
  if (status === 429) return { code: "rate_limited" };
  return { code: "request_failed" };
}
