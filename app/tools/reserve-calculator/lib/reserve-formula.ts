import type { SponsorshipAdjustment, SubentryBreakdown } from "@/app/tools/reserve-calculator/types";

/**
 * Applies the protocol's base reserve formula, including CAP-33 sponsorship
 * adjustment: an account's minimum balance covers its own subentries, minus
 * any that another account sponsors for it, plus any it sponsors for
 * others.
 *
 *   minBalance = (2 + subentries + numSponsoring - numSponsored) * baseReserve
 */
export function minimumBalanceStroops(
  subentries: SubentryBreakdown,
  numSponsoring: number,
  numSponsored: number,
  baseReserveStroops: bigint
): { minBalanceStroops: bigint; sponsorship: SponsorshipAdjustment } {
  const netSubentries = BigInt(2 + subentries.total + numSponsoring - numSponsored);
  const minBalanceStroops = netSubentries * baseReserveStroops;
  const netReserveStroops = BigInt(numSponsoring - numSponsored) * baseReserveStroops;

  return {
    minBalanceStroops,
    sponsorship: { numSponsoring, numSponsored, netReserveStroops: netReserveStroops.toString() }
  };
}
