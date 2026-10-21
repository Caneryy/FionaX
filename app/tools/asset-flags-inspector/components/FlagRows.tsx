import { copy } from "@/app/tools/asset-flags-inspector/copy";
import { formatFlagState } from "@/app/tools/asset-flags-inspector/lib/format";
import type { FlagRowModel } from "@/app/tools/asset-flags-inspector/types";

export function FlagRows({ rows }: { rows: FlagRowModel[] }) {
  return (
    <section className="space-y-3" aria-labelledby="issuer-flag-rows">
      <h2 id="issuer-flag-rows" className="text-sm font-extrabold text-[#172033]">
        {copy.result.flagsTitle}
      </h2>
      <ul className="divide-y divide-[#d5e2ee] overflow-hidden rounded-md border border-[#d5e2ee]">
        {rows.map((row) => (
          <li key={row.key} className="flex flex-col gap-2 bg-white/70 p-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-extrabold text-[#172033]">{row.label}</p>
              <p className="mt-1 text-sm leading-6 text-[#4e5c73]">{row.detail}</p>
            </div>
            <span
              className={
                row.enabled
                  ? "inline-flex w-fit shrink-0 rounded-full bg-[#e1f8ef] px-2 py-1 text-xs font-extrabold text-[#17664b]"
                  : "inline-flex w-fit shrink-0 rounded-full bg-[#eef3f8] px-2 py-1 text-xs font-extrabold text-[#4e5c73]"
              }
            >
              {formatFlagState(row.enabled)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
