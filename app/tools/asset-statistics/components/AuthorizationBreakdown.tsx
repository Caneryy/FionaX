import { copy } from "@/app/tools/asset-statistics/copy";
import { formatCount } from "@/app/tools/asset-statistics/lib/format";
import type { AssetStatisticsResult } from "@/app/tools/asset-statistics/types";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-[#e4ebf5] py-3 last:border-b-0 sm:flex-row sm:items-baseline sm:justify-between">
      <dt className="text-sm font-semibold text-[#29364d]">{label}</dt>
      <dd className="text-lg font-black text-[#172033]">{value}</dd>
    </div>
  );
}

export function AuthorizationBreakdown({ result }: { result: AssetStatisticsResult }) {
  const { trustlines } = result;

  return (
    <section aria-labelledby="authorization-breakdown-title">
      <h2 id="authorization-breakdown-title" className="text-lg font-black text-[#172033]">
        {copy.authorizationTitle}
      </h2>
      <p className="mt-1 text-sm leading-6 text-[#5d6b82]">{copy.authorizationCaption}</p>
      <dl className="mt-2">
        <Row label={copy.authorizedLabel} value={formatCount(trustlines.authorized)} />
        <Row label={copy.liabilitiesLabel} value={formatCount(trustlines.authorizedToMaintainLiabilities)} />
        <Row label={copy.unauthorizedLabel} value={formatCount(trustlines.unauthorized)} />
        <Row label={copy.totalTrustlinesLabel} value={formatCount(trustlines.total)} />
      </dl>
    </section>
  );
}
