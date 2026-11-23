import { copy } from "@/app/tools/memo-inspector/copy";

export function MemoInspectorEmptyState() {
  return (
    <div className="space-y-2 rounded-md border border-dashed border-[#c7d6e8] bg-white/50 p-4">
      <p className="text-sm font-extrabold text-[#172033]">{copy.emptyTitle}</p>
      <p className="text-sm leading-6 text-[#68758a]">{copy.empty}</p>
    </div>
  );
}
