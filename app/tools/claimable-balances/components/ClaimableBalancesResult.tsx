import type { ClaimableBalancesResult as Result } from "../types";
import { copy } from "../copy";
import { BalanceRows } from "./BalanceRows";
import { EmptyClaimantState } from "./EmptyClaimantState";
import { PageCoverageNotice } from "./PageCoverageNotice";

export function ClaimableBalancesResult({ result }: { result: Result }) {
  return <section className="space-y-4" aria-label={copy.resultTitle}>
    <PageCoverageNotice pages={result.pagesFetched} limit={result.pageLimit} nextCursor={result.nextCursor} />
    {result.balances.length === 0 ? <EmptyClaimantState /> : <BalanceRows balances={result.balances} />}
  </section>;
}
