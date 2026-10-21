import { copy } from "@/app/tools/reserve-calculator/copy";
import type { SubentryBreakdown } from "@/app/tools/reserve-calculator/types";

export function SubentryRows({ subentries }: { subentries: SubentryBreakdown }) {
  const rows: Array<[string, number]> = [
    [copy.trustlinesLabel, subentries.trustlines],
    [copy.offersLabel, subentries.offers],
    [copy.dataEntriesLabel, subentries.dataEntries],
    [copy.extraSignersLabel, subentries.extraSigners]
  ];

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-bold text-[#4e5c73]">{copy.subentriesTitle}</h3>
      <ul className="space-y-1 text-sm text-[#172033]">
        {rows.map(([label, count]) => (
          <li key={label} className="flex justify-between">
            <span>{label}</span>
            <span className="font-mono">{count}</span>
          </li>
        ))}
        <li className="flex justify-between font-extrabold">
          <span>Total</span>
          <span className="font-mono">{subentries.total}</span>
        </li>
      </ul>
    </div>
  );
}
