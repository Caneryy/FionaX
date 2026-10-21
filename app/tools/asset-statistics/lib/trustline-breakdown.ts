import type { TrustlineBreakdown, TrustlineCounts } from "@/app/tools/asset-statistics/types";

function isAccountCount(value: number): boolean {
  return Number.isSafeInteger(value) && value >= 0;
}

/** Splits Horizon account counters by authorization state and adds them as integers. */
export function buildTrustlineBreakdown(counts: TrustlineCounts): TrustlineBreakdown | null {
  if (
    !isAccountCount(counts.authorized) ||
    !isAccountCount(counts.authorizedToMaintainLiabilities) ||
    !isAccountCount(counts.unauthorized)
  ) {
    return null;
  }

  return {
    authorized: counts.authorized,
    authorizedToMaintainLiabilities: counts.authorizedToMaintainLiabilities,
    unauthorized: counts.unauthorized,
    total: counts.authorized + counts.authorizedToMaintainLiabilities + counts.unauthorized
  };
}
