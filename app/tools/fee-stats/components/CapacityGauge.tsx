import { copy } from "../copy";
import { formatCapacityPercent } from "../lib/format";

export function CapacityGauge({ percent }: { percent: string }) {
  const display = formatCapacityPercent(percent);
  const numeric = Number(display);
  const clamped = Number.isFinite(numeric) ? Math.min(100, Math.max(0, numeric)) : 0;

  return (
    <div className="space-y-2" aria-label={copy.capacityLabel}>
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold text-[#172033]">{copy.capacityLabel}</h3>
        <p className="font-mono text-sm text-[#172033]">
          {display}
          {copy.percentSuffix}
        </p>
      </div>
      <p className="text-xs text-[#68758a]">{copy.capacityHelp}</p>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-[#e8f0f5]"
        role="meter"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clamped}
        aria-valuetext={`${display}${copy.percentSuffix}`}
      >
        <div className="h-full rounded-full bg-[#6fd4ff]" style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}
