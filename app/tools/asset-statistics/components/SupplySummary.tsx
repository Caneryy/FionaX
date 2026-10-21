import { copy } from "@/app/tools/asset-statistics/copy";
import { formatCount, formatExactAmount } from "@/app/tools/asset-statistics/lib/format";
import type { AssetStatisticsResult } from "@/app/tools/asset-statistics/types";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-lg border border-[#d7e3f2] bg-white/70 p-3">
      <dt className="text-xs font-extrabold uppercase tracking-wide text-[#9a6754]">{label}</dt>
      <dd className="mt-1 break-all text-lg font-black text-[#172033]">{value}</dd>
    </div>
  );
}

export function SupplySummary({ result }: { result: AssetStatisticsResult }) {
  const { supply } = result;

  return (
    <section aria-labelledby="supply-summary-title" className="space-y-4">
      <div>
        <h2 id="supply-summary-title" className="text-lg font-black text-[#172033]">
          {copy.supplyTitle}
        </h2>
        <p className="mt-1 text-sm leading-6 text-[#5d6b82]">{copy.supplyCaption}</p>
      </div>
      <p className="break-all text-2xl font-black tracking-tight text-[#172033] sm:text-3xl">
        {formatExactAmount(supply.circulating)}{" "}
        <span className="text-base font-extrabold text-[#5d6b82]">{result.assetCode}</span>
      </p>
      <dl className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2">
        <Stat label={copy.accountsHoldingLabel} value={formatCount(result.accountsHolding)} />
        <Stat label={copy.claimableBalancesHoldingLabel} value={formatCount(result.claimableBalancesHolding)} />
        <Stat label={copy.authorizedBalanceLabel} value={formatExactAmount(supply.authorized)} />
        <Stat label={copy.liabilitiesBalanceLabel} value={formatExactAmount(supply.authorizedToMaintainLiabilities)} />
        <Stat label={copy.unauthorizedBalanceLabel} value={formatExactAmount(supply.unauthorized)} />
        <Stat label={copy.claimableAmountLabel} value={formatExactAmount(supply.claimableBalances)} />
        <Stat label={copy.liquidityPoolsAmountLabel} value={formatExactAmount(supply.liquidityPools)} />
        <Stat label={copy.contractsAmountLabel} value={formatExactAmount(supply.contracts)} />
      </dl>
    </section>
  );
}
