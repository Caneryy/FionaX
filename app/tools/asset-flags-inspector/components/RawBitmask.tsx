import { copy } from "@/app/tools/asset-flags-inspector/copy";
import { formatBitmaskLabel } from "@/app/tools/asset-flags-inspector/lib/format";

export function RawBitmask({ bitmask }: { bitmask: bigint }) {
  return (
    <section className="space-y-1" aria-labelledby="issuer-raw-bitmask">
      <h2 id="issuer-raw-bitmask" className="text-sm font-extrabold text-[#172033]">
        {copy.bitmask.title}
      </h2>
      <p className="break-all font-mono text-sm text-[#172033]">{formatBitmaskLabel(bitmask)}</p>
      <p className="text-xs leading-5 text-[#68758a]">{copy.bitmask.hint}</p>
    </section>
  );
}
