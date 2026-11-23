import { copy } from "../copy";
import { formatFeeStroops, formatLedgerSequence } from "../lib/format";
import type { FeeStatsResult as Result } from "../types";
import { CapacityGauge } from "./CapacityGauge";
import { IncompleteDataNotice } from "./IncompleteDataNotice";
import { LastUpdatedBadge } from "./LastUpdatedBadge";
import { PercentileTable } from "./PercentileTable";

export function FeeStatsResult({ result }: { result: Result }) {
  return (
    <section className="space-y-5" aria-label={copy.resultTitle}>
      <LastUpdatedBadge fetchedAt={result.fetchedAt} />
      <p className="rounded-md border border-[#cfe0ea] bg-[#f5fbff] px-3 py-2 text-sm text-[#29364d]">
        {copy.historicalNotice}
      </p>
      {result.incomplete ? <IncompleteDataNotice /> : null}
      <dl className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <dt className="text-xs font-medium uppercase tracking-wide text-[#68758a]">{copy.lastLedgerLabel}</dt>
          <dd className="font-mono text-sm text-[#172033]">{formatLedgerSequence(result.lastLedger)}</dd>
        </div>
        <div className="space-y-1">
          <dt className="text-xs font-medium uppercase tracking-wide text-[#68758a]">{copy.baseFeeLabel}</dt>
          <dd className="font-mono text-sm text-[#172033]">
            {formatFeeStroops(result.lastLedgerBaseFee)} {copy.stroopsSuffix}
          </dd>
          <dd className="text-xs text-[#68758a]">{copy.baseFeeHelp}</dd>
        </div>
      </dl>
      <CapacityGauge percent={result.capacityUsagePercent} />
      <PercentileTable rows={result.percentiles} />
    </section>
  );
}
