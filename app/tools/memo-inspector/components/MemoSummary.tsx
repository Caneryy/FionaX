import { BinaryMemoNotice } from "@/app/tools/memo-inspector/components/BinaryMemoNotice";
import { HexBase64Rows } from "@/app/tools/memo-inspector/components/HexBase64Rows";
import { NoMemoState } from "@/app/tools/memo-inspector/components/NoMemoState";
import { copy } from "@/app/tools/memo-inspector/copy";
import { formatMemoId, formatMemoKind } from "@/app/tools/memo-inspector/lib/format";
import { applyMemoTypeRules } from "@/app/tools/memo-inspector/lib/memo-type-rules";
import type { DecodedMemo } from "@/app/tools/memo-inspector/types";

export function MemoSummary({ memo }: { memo: DecodedMemo }) {
  const rules = applyMemoTypeRules(memo);

  return (
    <div className="space-y-4">
      <div className="min-w-0">
        <p className="text-xs font-extrabold uppercase tracking-wide text-[#9a6754]">{copy.result.typeLabel}</p>
        <p className="mt-1 text-sm font-extrabold text-[#172033]">{formatMemoKind(rules.typeLabelKey)}</p>
      </div>

      {rules.showNoneState ? <NoMemoState /> : null}

      {rules.showText && memo.kind === "text" && memo.text !== null ? (
        <div className="min-w-0">
          <p className="text-xs font-extrabold uppercase tracking-wide text-[#9a6754]">{copy.result.textLabel}</p>
          <p className="mt-1 break-words text-sm text-[#172033]">{memo.text}</p>
          <p className="mt-3 text-xs font-extrabold uppercase tracking-wide text-[#9a6754]">{copy.result.rawLabel}</p>
          <p className="mt-1 break-all font-mono text-sm text-[#68758a]">{memo.raw}</p>
        </div>
      ) : null}

      {rules.showBinaryNotice && memo.kind === "text" ? <BinaryMemoNotice hex={memo.hex} /> : null}

      {rules.showId && memo.kind === "id" ? (
        <div className="min-w-0">
          <p className="text-xs font-extrabold uppercase tracking-wide text-[#9a6754]">{copy.result.idLabel}</p>
          <p className="mt-1 break-all font-mono text-sm text-[#172033]">{formatMemoId(memo.id)}</p>
        </div>
      ) : null}

      {rules.showHexBase64 && (memo.kind === "hash" || memo.kind === "return") ? (
        <HexBase64Rows hex={memo.hex} base64={memo.base64} />
      ) : null}
    </div>
  );
}
