import { copy } from "@/app/tools/asset-flags-inspector/copy";
import { FlagExplanation } from "@/app/tools/asset-flags-inspector/components/FlagExplanation";
import { FlagRows } from "@/app/tools/asset-flags-inspector/components/FlagRows";
import { ImmutableNotice } from "@/app/tools/asset-flags-inspector/components/ImmutableNotice";
import { RawBitmask } from "@/app/tools/asset-flags-inspector/components/RawBitmask";
import { formatNetworkName, formatSequence } from "@/app/tools/asset-flags-inspector/lib/format";
import type { AssetFlagsInspectorResult as Result } from "@/app/tools/asset-flags-inspector/types";

export function AssetFlagsInspectorResult({ result }: { result: Result }) {
  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <h2 className="text-sm font-extrabold text-[#17664b]">{copy.result.foundTitle}</h2>
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="min-w-0 sm:col-span-2">
            <dt className="text-xs font-extrabold uppercase tracking-wide text-[#9a6754]">{copy.result.accountLabel}</dt>
            <dd className="mt-1 break-all font-mono text-sm text-[#172033]">{result.accountId}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-xs font-extrabold uppercase tracking-wide text-[#9a6754]">{copy.result.networkLabel}</dt>
            <dd className="mt-1 text-sm text-[#172033]">{formatNetworkName(result.network)}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-xs font-extrabold uppercase tracking-wide text-[#9a6754]">{copy.result.sequenceLabel}</dt>
            <dd className="mt-1 break-all font-mono text-sm text-[#172033]">{formatSequence(result.sequence)}</dd>
          </div>
        </dl>
      </div>
      <FlagRows rows={result.explanation.rows} />
      <FlagExplanation combination={result.explanation.combination} allUnset={result.explanation.allUnset} />
      <ImmutableNotice immutableNotice={result.explanation.immutableNotice} adjustableNotice={result.explanation.adjustableNotice} />
      <RawBitmask bitmask={result.bitmask} />
    </div>
  );
}
