import type { PreconditionsExplainerResult as Result } from "@/app/tools/preconditions-explainer/types";
import { ExtraSignerRows } from "@/app/tools/preconditions-explainer/components/ExtraSignerRows";
import { SequenceConditions } from "@/app/tools/preconditions-explainer/components/SequenceConditions";
import { TimeBoundsRow } from "@/app/tools/preconditions-explainer/components/TimeBoundsRow";
import { UnrestrictedNotice } from "@/app/tools/preconditions-explainer/components/UnrestrictedNotice";

export function PreconditionsExplainerResult({ result }: { result: Result }) {
  if (result.unrestricted) return <UnrestrictedNotice />;

  return (
    <div className="space-y-4">
      <TimeBoundsRow timeBounds={result.timeBounds} ledgerBounds={result.ledgerBounds} />
      <SequenceConditions result={result} />
      <ExtraSignerRows extraSigners={result.extraSigners} />
    </div>
  );
}
