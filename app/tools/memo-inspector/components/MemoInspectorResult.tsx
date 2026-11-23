import { MemoSummary } from "@/app/tools/memo-inspector/components/MemoSummary";
import { copy } from "@/app/tools/memo-inspector/copy";
import { formatCreatedAt, formatNetworkName, formatTransactionStatus } from "@/app/tools/memo-inspector/lib/format";
import type { MemoInspectorResult as Result } from "@/app/tools/memo-inspector/types";

export function MemoInspectorResult({ result }: { result: Result }) {
  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <h2 className="text-sm font-extrabold text-[#17664b]">{copy.result.title}</h2>
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="min-w-0 sm:col-span-2">
            <dt className="text-xs font-extrabold uppercase tracking-wide text-[#9a6754]">{copy.result.hashLabel}</dt>
            <dd className="mt-1 break-all font-mono text-sm text-[#172033]">{result.hash}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-xs font-extrabold uppercase tracking-wide text-[#9a6754]">{copy.result.networkLabel}</dt>
            <dd className="mt-1 text-sm text-[#172033]">{formatNetworkName(result.network)}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-xs font-extrabold uppercase tracking-wide text-[#9a6754]">{copy.result.statusLabel}</dt>
            <dd className="mt-1 text-sm text-[#172033]">{formatTransactionStatus(result.successful)}</dd>
          </div>
          <div className="min-w-0 sm:col-span-2">
            <dt className="text-xs font-extrabold uppercase tracking-wide text-[#9a6754]">{copy.result.sourceLabel}</dt>
            <dd className="mt-1 break-all font-mono text-sm text-[#172033]">{result.sourceAccount}</dd>
          </div>
          <div className="min-w-0 sm:col-span-2">
            <dt className="text-xs font-extrabold uppercase tracking-wide text-[#9a6754]">{copy.result.createdLabel}</dt>
            <dd className="mt-1 text-sm text-[#172033]">{formatCreatedAt(result.createdAt)}</dd>
          </div>
        </dl>
      </div>
      <MemoSummary memo={result.memo} />
    </div>
  );
}
