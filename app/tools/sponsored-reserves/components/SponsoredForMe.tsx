import { copy } from "../copy";
import { formatReserveCount } from "../lib/format";
import type { SponsoredEntry } from "../types";

export function SponsoredForMe({ count, entries, unlisted }: { count: bigint; entries: SponsoredEntry[]; unlisted: bigint }) {
  return (
    <section aria-labelledby="sponsored-for-me" className="rounded-lg border border-[#cfe0ea] p-4">
      <h3 id="sponsored-for-me" className="font-bold">{copy.forMe}</h3>
      <p className="mt-2 text-sm">{copy.forMeCount}: <strong>{formatReserveCount(count)}</strong></p>
      {entries.length ? <ul className="mt-3 space-y-3">
        {entries.map((entry, index) => <li key={`${entry.kind}-${entry.label}-${index}`} className="rounded border border-[#e3edf2] bg-white/70 p-3 text-sm">
          <p className="font-semibold">{copy.kinds[entry.kind]}: <span className="break-all font-normal">{entry.label}</span></p>
          <p>{copy.sponsor}: <span className="break-all">{entry.sponsor}</span></p>
          <p>{formatReserveCount(entry.reserveUnits)}</p>
        </li>)}
      </ul> : <p className="mt-2 text-sm text-[#68758a]">{copy.forMeNone}</p>}
      {unlisted > BigInt("0") ? <div className="mt-3 text-sm">
        <p>{copy.unlisted}: <strong>{formatReserveCount(unlisted)}</strong></p>
        <p className="mt-1 text-[#68758a]">{copy.unlistedLimit}</p>
      </div> : null}
    </section>
  );
}
