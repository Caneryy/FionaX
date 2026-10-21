import { copy } from "@/app/tools/reserve-calculator/copy";
import { formatXlm } from "@/app/tools/reserve-calculator/lib/format";
import type { ReserveCalculatorResult } from "@/app/tools/reserve-calculator/types";

export function SpendableBalance({ result }: { result: ReserveCalculatorResult }) {
  if (result.sellingLiabilitiesStroops === "0") return null;

  return (
    <ul className="space-y-1 text-sm text-[#172033]">
      <li className="flex justify-between">
        <span>{copy.sellingLiabilitiesLabel}</span>
        <span className="font-mono">{formatXlm(result.sellingLiabilitiesStroops)}</span>
      </li>
      <li className="flex justify-between font-extrabold">
        <span>{copy.spendableLabel}</span>
        <span className="font-mono">{formatXlm(result.spendableBalanceStroops)}</span>
      </li>
    </ul>
  );
}
