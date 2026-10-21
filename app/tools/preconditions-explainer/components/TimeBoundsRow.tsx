import { explainLedgerBounds, explainTimeBounds } from "@/app/tools/preconditions-explainer/lib/precondition-explain";
import { copy } from "@/app/tools/preconditions-explainer/copy";
import type { LedgerBoundsInfo, TimeBoundsInfo } from "@/app/tools/preconditions-explainer/types";

export function TimeBoundsRow({ timeBounds, ledgerBounds }: { timeBounds: TimeBoundsInfo | null; ledgerBounds: LedgerBoundsInfo | null }) {
  if (!timeBounds && !ledgerBounds) return null;

  return (
    <div className="space-y-2">
      {timeBounds ? (
        <div>
          <h3 className="text-sm font-bold text-[#4e5c73]">{copy.timeBoundsTitle}</h3>
          <p className="text-sm text-[#172033]">{explainTimeBounds(timeBounds)}</p>
        </div>
      ) : null}
      {ledgerBounds ? (
        <div>
          <h3 className="text-sm font-bold text-[#4e5c73]">{copy.ledgerBoundsTitle}</h3>
          <p className="text-sm text-[#172033]">{explainLedgerBounds(ledgerBounds)}</p>
        </div>
      ) : null}
    </div>
  );
}
