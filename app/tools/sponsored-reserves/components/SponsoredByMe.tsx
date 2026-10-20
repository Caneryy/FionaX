import { copy } from "../copy";
import { formatReserveCount } from "../lib/format";

export function SponsoredByMe({ count }: { count: bigint }) {
  return (
    <section aria-labelledby="sponsored-by-me" className="rounded-lg border border-[#cfe0ea] p-4">
      <h3 id="sponsored-by-me" className="font-bold">{copy.byMe}</h3>
      <p className="mt-2 text-sm">{copy.byMeCount}: <strong>{formatReserveCount(count)}</strong></p>
      {count > BigInt("0") ? <p className="mt-2 text-sm text-[#68758a]">{copy.byMeLimit}</p> : null}
    </section>
  );
}
