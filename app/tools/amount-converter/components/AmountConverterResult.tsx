import { copy } from "@/app/tools/amount-converter/copy";
import { formatDecimalAmount, formatStroopAmount } from "@/app/tools/amount-converter/lib/format";
import type { AmountConverterResult as Result } from "@/app/tools/amount-converter/types";

export function AmountConverterResult({ result }: { result: Result }) {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-extrabold text-[#17664b]">{copy.result.title}</h2>
      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="min-w-0">
          <dt className="text-xs font-extrabold uppercase tracking-wide text-[#9a6754]">{copy.result.decimalLabel}</dt>
          <dd className="mt-1 break-all font-mono text-sm text-[#172033]">{formatDecimalAmount(result.decimal)}</dd>
        </div>
        <div className="min-w-0">
          <dt className="text-xs font-extrabold uppercase tracking-wide text-[#9a6754]">{copy.result.stroopLabel}</dt>
          <dd className="mt-1 break-all font-mono text-sm text-[#172033]">{formatStroopAmount(result.stroops)}</dd>
        </div>
      </dl>
    </div>
  );
}
