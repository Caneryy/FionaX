import { BlockerRows } from "@/app/tools/account-merge-preflight/components/BlockerRows";
import { DestinationNotice } from "@/app/tools/account-merge-preflight/components/DestinationNotice";
import { MergeableSummary } from "@/app/tools/account-merge-preflight/components/MergeableSummary";
import { PreflightDisclaimer } from "@/app/tools/account-merge-preflight/components/PreflightDisclaimer";
import { copy } from "@/app/tools/account-merge-preflight/copy";
import { formatNetworkName } from "@/app/tools/account-merge-preflight/lib/format";
import type { AccountMergePreflightResult as Result } from "@/app/tools/account-merge-preflight/types";

export function AccountMergePreflightResult({ result }: { result: Result }) {
  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <h2 className="text-sm font-extrabold text-[#17664b]">{result.mergeable ? copy.result.mergeable : copy.result.blocked}</h2>
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="min-w-0">
            <dt className="text-xs font-extrabold uppercase tracking-wide text-[#9a6754]">{copy.result.sourceLabel}</dt>
            <dd className="mt-1 break-all font-mono text-sm text-[#172033]">{result.sourceId}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-xs font-extrabold uppercase tracking-wide text-[#9a6754]">{copy.result.destinationLabel}</dt>
            <dd className="mt-1 break-all font-mono text-sm text-[#172033]">{result.destinationId}</dd>
          </div>
          <div className="min-w-0 sm:col-span-2">
            <dt className="text-xs font-extrabold uppercase tracking-wide text-[#9a6754]">{copy.result.networkLabel}</dt>
            <dd className="mt-1 text-sm text-[#172033]">{formatNetworkName(result.network)}</dd>
          </div>
        </dl>
      </div>
      <MergeableSummary balance={result.nativeBalance} stroops={result.nativeStroops} />
      <BlockerRows blockers={result.blockers} />
      <DestinationNotice missing={!result.destinationExists} />
      <PreflightDisclaimer />
    </div>
  );
}
