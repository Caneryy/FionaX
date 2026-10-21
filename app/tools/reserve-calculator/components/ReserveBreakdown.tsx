import { copy } from "@/app/tools/reserve-calculator/copy";
import { formatXlm } from "@/app/tools/reserve-calculator/lib/format";
import type { ReserveCalculatorResult } from "@/app/tools/reserve-calculator/types";

export function ReserveBreakdown({ result }: { result: ReserveCalculatorResult }) {
  return (
    <ul className="space-y-1 text-sm text-[#172033]">
      <li className="flex justify-between">
        <span>{copy.balanceLabel}</span>
        <span className="font-mono">{formatXlm(result.balanceStroops)}</span>
      </li>
      <li className="flex justify-between">
        <span>{copy.minBalanceLabel}</span>
        <span className="font-mono">{formatXlm(result.minBalanceStroops)}</span>
      </li>
      <li className="flex justify-between font-extrabold">
        <span>{copy.availableLabel}</span>
        <span className="font-mono">{formatXlm(result.availableBalanceStroops)}</span>
      </li>
    </ul>
  );
}
