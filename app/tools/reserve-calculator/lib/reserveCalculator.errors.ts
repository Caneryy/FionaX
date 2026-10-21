import { getResponseStatus } from "@/lib/stellar/account";
import type { ReserveCalculatorError } from "@/app/tools/reserve-calculator/types";

export function toToolError(error: unknown): ReserveCalculatorError {
  const status = getResponseStatus(error);
  if (status === 404) {
    return { code: "account_not_found", message: "No account exists for that ID on the selected network." };
  }
  if (status === 429) {
    return { code: "rate_limited", message: "Horizon is throttling requests. Wait a moment and try again." };
  }
  return { code: "request_failed", message: "The account lookup did not complete. Check the selected network and try again." };
}
