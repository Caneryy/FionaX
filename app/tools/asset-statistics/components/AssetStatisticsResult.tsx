import { copy } from "@/app/tools/asset-statistics/copy";
import { AuthorizationBreakdown } from "@/app/tools/asset-statistics/components/AuthorizationBreakdown";
import { SnapshotNotice } from "@/app/tools/asset-statistics/components/SnapshotNotice";
import { SupplySummary } from "@/app/tools/asset-statistics/components/SupplySummary";
import type { AssetStatisticsResult as Result } from "@/app/tools/asset-statistics/types";

export function AssetStatisticsResult({ result }: { result: Result }) {
  return (
    <div className="space-y-6">
      <div className="min-w-0">
        <h2 className="text-lg font-black text-[#172033]">{copy.resultTitle}</h2>
        <p className="mt-1 break-all text-sm leading-6 text-[#5d6b82]">
          <span className="font-extrabold text-[#172033]">{result.assetCode}</span>
          <span> · {result.assetType}</span>
        </p>
        <p className="mt-1 break-all text-sm leading-6 text-[#5d6b82]">
          {copy.issuerValueLabel}: {result.assetIssuer}
        </p>
      </div>
      <SnapshotNotice capturedAt={result.capturedAt} />
      <SupplySummary result={result} />
      <AuthorizationBreakdown result={result} />
    </div>
  );
}
