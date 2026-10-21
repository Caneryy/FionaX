import { copy } from "@/app/tools/amount-converter/copy";
import { formatDirection } from "@/app/tools/amount-converter/lib/format";
import type { AmountDirection } from "@/app/tools/amount-converter/types";

export function ConversionNotice({ direction }: { direction: AmountDirection | null }) {
  if (!direction) return null;

  return (
    <div className="space-y-2 rounded-md border border-[#82cbe3]/70 bg-[#e0f6ff] p-4">
      <p className="text-sm font-extrabold text-[#146783]">{copy.notice.title}</p>
      <p className="text-sm leading-6 text-[#4e5c73]">{formatDirection(direction)}</p>
    </div>
  );
}
