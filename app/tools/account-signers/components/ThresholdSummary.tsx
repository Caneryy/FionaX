import { copy } from "@/app/tools/account-signers/copy";
import { formatThreshold } from "@/app/tools/account-signers/lib/format";
import type { Thresholds } from "@/app/tools/account-signers/types";

export function ThresholdSummary({ thresholds }: { thresholds: Thresholds }) {
  const levels = ["low", "medium", "high"] as const;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-extrabold text-[#172033]">{copy.thresholds.title}</h3>
      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {levels.map((level) => (
          <div key={level} className="min-w-0 rounded-md border border-[#c7d6e8] bg-white/70 p-3">
            <dt className="text-xs font-extrabold uppercase tracking-wide text-[#9a6754]">{copy.thresholds[level]}</dt>
            <dd className="mt-1 font-mono text-sm text-[#172033]">{formatThreshold(thresholds, level)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
