import { copy } from "@/app/tools/account-data-entries/copy";
import { formatByteLength, formatDecodedValue, formatEncoding } from "@/app/tools/account-data-entries/lib/format";
import type { DataEntryView } from "@/app/tools/account-data-entries/types";

export function DataEntryRows({ entries }: { entries: DataEntryView[] }) {
  return (
    <ul className="space-y-3">
      {entries.map((entry) => (
        <li key={entry.name} className="min-w-0 space-y-2 rounded-md border border-[#c7d6e8] bg-white/70 p-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
            <p className="break-all font-mono text-sm font-extrabold text-[#172033]">{entry.name}</p>
            <p className="text-xs font-extrabold uppercase tracking-wide text-[#9a6754]">{formatEncoding(entry.encoding)}</p>
          </div>
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="min-w-0">
              <dt className="text-xs font-extrabold uppercase tracking-wide text-[#9a6754]">{copy.result.bytesLabel}</dt>
              <dd className="mt-1 text-sm text-[#172033]">{formatByteLength(entry.nameBytes)}</dd>
            </div>
            <div className="min-w-0">
              <dt className="text-xs font-extrabold uppercase tracking-wide text-[#9a6754]">{copy.result.rawLabel}</dt>
              <dd className="mt-1 break-all font-mono text-sm text-[#172033]">{entry.rawBase64}</dd>
            </div>
            <div className="min-w-0 sm:col-span-2">
              <dt className="text-xs font-extrabold uppercase tracking-wide text-[#9a6754]">{copy.result.decodedLabel}</dt>
              <dd className="mt-1 break-all font-mono text-sm text-[#172033]">
                {formatDecodedValue(entry.encoding, entry.text, entry.hex)}
              </dd>
            </div>
          </dl>
        </li>
      ))}
    </ul>
  );
}
