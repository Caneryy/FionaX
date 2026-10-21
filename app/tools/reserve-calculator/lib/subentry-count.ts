import type { SubentryBreakdown } from "@/app/tools/reserve-calculator/types";

interface SubentryCountInput {
  accountId: string;
  subentryCount: number;
  balanceCount: number;
  dataEntryCount: number;
  signerCount: number;
}

/**
 * Breaks Horizon's single `subentry_count` total down by type: trustlines,
 * offers, data entries and extra signers. Horizon does not report offers on
 * the account resource itself, and a second, potentially-paginated
 * `/accounts/{id}/offers` call could be incomplete for a very active
 * account — so the offer count is derived as the remainder after the other
 * three types are counted directly, which is both exact and a single
 * request. See the README.
 */
export function countSubentries(input: SubentryCountInput): SubentryBreakdown {
  const trustlines = input.balanceCount;
  const dataEntries = input.dataEntryCount;
  // Every signer entry other than the account's own master-key entry counts
  // as a subentry; the master key itself is implicit and never counted.
  const extraSigners = Math.max(input.signerCount - 1, 0);
  const offers = Math.max(input.subentryCount - trustlines - dataEntries - extraSigners, 0);

  return { trustlines, offers, dataEntries, extraSigners, total: input.subentryCount };
}
