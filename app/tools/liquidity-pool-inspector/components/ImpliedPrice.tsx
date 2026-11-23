import type { ImpliedReservePrice } from "../types";
import { copy } from "../copy";
import { formatAsset, formatImpliedPrice } from "../lib/format";

export function ImpliedPrice({ prices }: { prices: readonly [ImpliedReservePrice, ImpliedReservePrice] }) {
  return (
    <section className="space-y-3" aria-label={copy.pricesTitle}>
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-[#172033]">{copy.pricesTitle}</h3>
        <p className="text-xs text-[#68758a]">{copy.pricesHint}</p>
      </div>
      <ul className="space-y-3">
        {prices.map((price) => (
          <li key={`${price.baseAsset}->${price.quoteAsset}`} className="rounded-lg border border-[#cfe0ea] bg-white/80 p-4">
            <p className="text-xs uppercase tracking-wide text-[#68758a]">{copy.snapshotLabel}</p>
            <p className="mt-1 text-sm text-[#29364d]">
              {copy.priceOf(formatAsset(price.baseAsset), formatAsset(price.quoteAsset))}{" "}
              <span className="font-mono tabular-nums text-[#172033]">{formatImpliedPrice(price)}</span>{" "}
              {copy.priceIn(formatAsset(price.quoteAsset))}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
