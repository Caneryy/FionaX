import type { PoolReserve } from "../types";
import { copy } from "../copy";
import { formatAsset, formatExactAmount } from "../lib/format";

export function ReserveRows({ reserves }: { reserves: readonly [PoolReserve, PoolReserve] }) {
  return (
    <section className="space-y-3" aria-label={copy.reservesTitle}>
      <h3 className="text-sm font-semibold text-[#172033]">{copy.reservesTitle}</h3>
      <ul className="space-y-3">
        {reserves.map((reserve) => (
          <li key={reserve.asset} className="rounded-lg border border-[#cfe0ea] bg-white/80 p-4">
            <dl className="grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="font-semibold text-[#29364d]">{copy.reserveAsset}</dt>
                <dd className="break-all">{formatAsset(reserve.asset)}</dd>
              </div>
              <div>
                <dt className="font-semibold text-[#29364d]">{copy.reserveAmount}</dt>
                <dd className="font-mono tabular-nums">{formatExactAmount(reserve.amount)}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </section>
  );
}
