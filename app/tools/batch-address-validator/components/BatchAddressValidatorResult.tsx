import { copy } from "@/app/tools/batch-address-validator/copy";
import { BatchSummary } from "@/app/tools/batch-address-validator/components/BatchSummary";
import { DuplicateNotice } from "@/app/tools/batch-address-validator/components/DuplicateNotice";
import { ResultRows } from "@/app/tools/batch-address-validator/components/ResultRows";
import type { BatchAddressValidatorResult } from "@/app/tools/batch-address-validator/types";

export function BatchAddressValidatorResult({ result }: { result: BatchAddressValidatorResult }) {
  return (
    <div className="space-y-5">
      <h2 className="text-base font-extrabold text-[#172033]">{copy.resultTitle}</h2>
      <BatchSummary summary={result.summary} />
      <DuplicateNotice rows={result.rows} />
      <ResultRows rows={result.rows} />
    </div>
  );
}
