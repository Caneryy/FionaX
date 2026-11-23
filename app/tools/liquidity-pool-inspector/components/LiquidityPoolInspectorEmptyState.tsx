import { copy } from "../copy";

export function LiquidityPoolInspectorEmptyState() {
  return (
    <div className="space-y-1 text-sm text-[#68758a]">
      <p className="font-medium text-[#29364d]">{copy.emptyTitle}</p>
      <p>{copy.empty}</p>
    </div>
  );
}
