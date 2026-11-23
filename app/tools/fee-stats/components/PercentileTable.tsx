import { copy } from "../copy";
import { formatFeeStroops } from "../lib/format";
import type { PercentileRow } from "../types";

export function PercentileTable({ rows }: { rows: PercentileRow[] }) {
  if (rows.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-[#172033]">{copy.percentilesTitle}</h3>
      <p className="text-xs text-[#68758a]">{copy.percentilesHelp}</p>
      <table className="w-full border-collapse text-sm" aria-label={copy.percentilesTitle}>
        <thead>
          <tr className="border-b border-[#cfe0ea] text-left text-[#68758a]">
            <th scope="col" className="py-2 pr-3 font-medium">
              Percentile
            </th>
            <th scope="col" className="py-2 font-medium">
              Fee charged
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-b border-[#e8f0f5]">
              <th scope="row" className="py-2 pr-3 font-medium text-[#29364d]">
                {row.label}
              </th>
              <td className="py-2 font-mono text-[#172033]">
                {formatFeeStroops(row.feeStroops)} {copy.stroopsSuffix}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
