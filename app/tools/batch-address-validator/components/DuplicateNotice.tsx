import { copy } from "@/app/tools/batch-address-validator/copy";
import { formatRowLocation } from "@/app/tools/batch-address-validator/lib/format";
import type { BatchAddressRow } from "@/app/tools/batch-address-validator/types";

export function DuplicateNotice({ rows }: { rows: BatchAddressRow[] }) {
  const duplicates = rows.filter((row) => row.status === "duplicate");
  if (duplicates.length === 0) return null;

  return (
    <section className="rounded-lg border border-[#ffc3a8]/80 bg-[#fff2e9] p-4 text-[#9a513f]">
      <h2 className="text-sm font-extrabold">{copy.duplicateNoticeTitle}</h2>
      <p className="mt-2 text-sm leading-6 text-[#4e5c73]">{copy.errors.duplicate_address}</p>
      <ul className="mt-3 space-y-2">
        {duplicates.map((row) => (
          <li key={row.index} className="break-all text-sm font-semibold">
            {formatRowLocation(row)}
          </li>
        ))}
      </ul>
    </section>
  );
}
