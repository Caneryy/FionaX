import { BinaryValueNotice } from "@/app/tools/account-data-entries/components/BinaryValueNotice";
import { DataEntryRows } from "@/app/tools/account-data-entries/components/DataEntryRows";
import { EmptyEntriesState } from "@/app/tools/account-data-entries/components/EmptyEntriesState";
import { EntryLimitWarning } from "@/app/tools/account-data-entries/components/EntryLimitWarning";
import { copy } from "@/app/tools/account-data-entries/copy";
import { formatEntryCount, formatNetworkName } from "@/app/tools/account-data-entries/lib/format";
import type { AccountDataEntriesResult as Result } from "@/app/tools/account-data-entries/types";

export function AccountDataEntriesResult({ result }: { result: Result }) {
  const hasBinary = result.entries.some((entry) => entry.encoding === "binary");
  const nearLimit = result.entries.some((entry) => entry.nearLimit);

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
            <dt className="text-xs font-extrabold uppercase tracking-wide text-[#9a6754]">{copy.result.countLabel}</dt>
            <dd className="mt-1 text-sm text-[#172033]">{formatEntryCount(result.entries.length)}</dd>
          </div>
        </dl>
      </div>
      {result.entries.length === 0 ? <EmptyEntriesState /> : <DataEntryRows entries={result.entries} />}
      {hasBinary ? <BinaryValueNotice /> : null}
      {nearLimit ? <EntryLimitWarning /> : null}
    </div>
  );
}
