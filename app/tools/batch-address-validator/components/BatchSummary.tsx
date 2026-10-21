import { copy } from "@/app/tools/batch-address-validator/copy";
import { formatCount, formatSummaryLine } from "@/app/tools/batch-address-validator/lib/format";
import type { BatchAddressSummary } from "@/app/tools/batch-address-validator/types";

export function BatchSummary({ summary }: { summary: BatchAddressSummary }) {
  const items = [
    formatCount(summary.total, "total"),
    formatCount(summary.valid, "valid"),
    formatCount(summary.invalid, "invalid"),
    formatCount(summary.duplicate, "duplicate")
  ];

  return (
    <section aria-label={copy.summaryTitle} className="space-y-3">
      <h2 className="text-sm font-extrabold text-[#172033]">{copy.summaryTitle}</h2>
      <p className="text-sm text-[#4e5c73]">{formatSummaryLine(summary)}</p>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-md border border-[#cfe0ea] bg-white/80 px-3 py-3 text-sm font-extrabold text-[#172033]"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
