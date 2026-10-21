import { copy } from "@/app/tools/batch-address-validator/copy";
import { formatRowIssue, formatRowLocation, formatStatusLabel } from "@/app/tools/batch-address-validator/lib/format";
import type { BatchAddressRow } from "@/app/tools/batch-address-validator/types";

const statusTone: Record<BatchAddressRow["status"], string> = {
  valid: "bg-[#e1f8ef] text-[#17664b]",
  invalid: "bg-[#fff0ee] text-[#9f342d]",
  duplicate: "bg-[#fff2e9] text-[#9a513f]"
};

export function ResultRows({ rows }: { rows: BatchAddressRow[] }) {
  return (
    <section aria-label={copy.rowsTitle} className="space-y-3">
      <h2 className="text-sm font-extrabold text-[#172033]">{copy.rowsTitle}</h2>
      <ul className="space-y-3">
        {rows.map((row) => (
          <li key={row.index} className="min-w-0 rounded-lg border border-[#cfe0ea] bg-white/80 p-3 sm:p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs font-extrabold uppercase tracking-wide text-[#9a6754]">{formatRowLocation(row)}</p>
              <p className={`w-fit rounded-full px-3 py-1 text-xs font-extrabold ${statusTone[row.status]}`}>
                {formatStatusLabel(row.status)}
              </p>
            </div>
            <p className="mt-2 break-all font-mono text-sm text-[#172033]">{row.value}</p>
            {row.code ? <p className="mt-2 text-sm leading-6 text-[#4e5c73]">{formatRowIssue(row.code)}</p> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
