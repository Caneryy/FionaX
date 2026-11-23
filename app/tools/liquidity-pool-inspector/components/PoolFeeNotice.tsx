import { copy } from "../copy";
import { formatFeeBp } from "../lib/format";

export function PoolFeeNotice({ feeBp }: { feeBp: number }) {
  return (
    <section className="rounded-lg border border-[#cfe0ea] bg-white/80 p-4" aria-label={copy.feeTitle}>
      <h3 className="text-sm font-semibold text-[#172033]">{copy.feeTitle}</h3>
      <p className="mt-1 text-sm text-[#29364d]">
        {copy.feeBody(feeBp)} <span className="text-[#68758a]">({formatFeeBp(feeBp)})</span>
      </p>
      <p className="mt-1 text-xs text-[#68758a]">{copy.feeHint}</p>
    </section>
  );
}
