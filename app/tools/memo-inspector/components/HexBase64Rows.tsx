import { copy } from "@/app/tools/memo-inspector/copy";
import { formatBase64, formatHex } from "@/app/tools/memo-inspector/lib/format";

export function HexBase64Rows({ hex, base64 }: { hex: string; base64: string }) {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <p className="text-sm font-extrabold text-[#17664b]">{copy.encodings.title}</p>
        <p className="text-sm leading-6 text-[#68758a]">{copy.encodings.hint}</p>
      </div>
      <dl className="grid grid-cols-1 gap-3">
        <div className="min-w-0">
          <dt className="text-xs font-extrabold uppercase tracking-wide text-[#9a6754]">{copy.result.hexLabel}</dt>
          <dd className="mt-1 break-all font-mono text-sm text-[#172033]">{formatHex(hex)}</dd>
        </div>
        <div className="min-w-0">
          <dt className="text-xs font-extrabold uppercase tracking-wide text-[#9a6754]">{copy.result.base64Label}</dt>
          <dd className="mt-1 break-all font-mono text-sm text-[#172033]">{formatBase64(base64)}</dd>
        </div>
      </dl>
    </div>
  );
}
