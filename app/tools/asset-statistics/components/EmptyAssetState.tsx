import { copy } from "@/app/tools/asset-statistics/copy";
import { formatCount } from "@/app/tools/asset-statistics/lib/format";
import type { AssetStatisticsResult } from "@/app/tools/asset-statistics/types";

export function EmptyAssetState({ result }: { result: AssetStatisticsResult }) {
  return (
    <div role="status" className="space-y-3 rounded-lg border border-[#ffc3a8]/80 bg-[#fff7f1] p-4">
      <h2 className="text-base font-black text-[#172033]">{copy.zeroTrustlinesTitle}</h2>
      <p className="text-sm leading-6 text-[#4e5c73]">{copy.zeroTrustlinesBody}</p>
      <dl className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2">
        <div className="min-w-0">
          <dt className="text-xs font-extrabold uppercase tracking-wide text-[#9a6754]">{copy.accountsHoldingLabel}</dt>
          <dd className="mt-1 text-lg font-black text-[#172033]">{formatCount(result.accountsHolding)}</dd>
        </div>
        <div className="min-w-0">
          <dt className="text-xs font-extrabold uppercase tracking-wide text-[#9a6754]">
            {copy.claimableBalancesHoldingLabel}
          </dt>
          <dd className="mt-1 text-lg font-black text-[#172033]">{formatCount(result.claimableBalancesHolding)}</dd>
        </div>
      </dl>
    </div>
  );
}
