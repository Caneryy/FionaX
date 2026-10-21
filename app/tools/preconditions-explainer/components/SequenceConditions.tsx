import {
  explainMinSequenceAge,
  explainMinSequenceLedgerGap,
  explainMinSequenceNumber
} from "@/app/tools/preconditions-explainer/lib/precondition-explain";
import { copy } from "@/app/tools/preconditions-explainer/copy";
import type { PreconditionsExplainerResult } from "@/app/tools/preconditions-explainer/types";

export function SequenceConditions({ result }: { result: PreconditionsExplainerResult }) {
  if (!result.minSequenceNumber && !result.minSequenceAge && result.minSequenceLedgerGap === null) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-bold text-[#4e5c73]">{copy.sequenceTitle}</h3>
      <ul className="list-disc space-y-1 pl-5 text-sm text-[#172033]">
        {result.minSequenceNumber ? <li>{explainMinSequenceNumber(result.minSequenceNumber)}</li> : null}
        {result.minSequenceAge ? <li>{explainMinSequenceAge(result.minSequenceAge)}</li> : null}
        {result.minSequenceLedgerGap !== null ? <li>{explainMinSequenceLedgerGap(result.minSequenceLedgerGap)}</li> : null}
      </ul>
    </div>
  );
}
