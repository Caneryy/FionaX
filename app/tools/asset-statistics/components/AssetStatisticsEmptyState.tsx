import { copy } from "@/app/tools/asset-statistics/copy";

export function AssetStatisticsEmptyState() {
  return (
    <div className="space-y-2 rounded-lg border border-dashed border-[#c7d6e8] bg-white/50 p-4">
      <h2 className="text-base font-black text-[#172033]">{copy.idleTitle}</h2>
      <p className="text-sm leading-6 text-[#5d6b82]">{copy.idleBody}</p>
    </div>
  );
}
