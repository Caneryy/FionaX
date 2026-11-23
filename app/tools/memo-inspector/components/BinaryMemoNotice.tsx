import { copy } from "@/app/tools/memo-inspector/copy";
import { formatHex } from "@/app/tools/memo-inspector/lib/format";

export function BinaryMemoNotice({ hex }: { hex: string }) {
  return (
    <div className="space-y-3 rounded-md border border-[#ffc3a8]/80 bg-[#fff2e9] p-4">
      <div className="space-y-2">
        <p className="text-sm font-extrabold text-[#9a513f]">{copy.binary.title}</p>
        <p className="text-sm leading-6 text-[#4e5c73]">{copy.binary.body}</p>
      </div>
      <div className="min-w-0">
        <p className="text-xs font-extrabold uppercase tracking-wide text-[#9a6754]">{copy.result.hexLabel}</p>
        <p className="mt-1 break-all font-mono text-sm text-[#172033]">{formatHex(hex)}</p>
      </div>
    </div>
  );
}
