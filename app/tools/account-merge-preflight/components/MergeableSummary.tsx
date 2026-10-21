import { copy } from "@/app/tools/account-merge-preflight/copy";
import { formatNativeBalance, formatStroops } from "@/app/tools/account-merge-preflight/lib/format";

export function MergeableSummary({ balance, stroops }: { balance: string; stroops: bigint }) {
  return (
    <div className="min-w-0 rounded-md border border-[#c7d6e8] bg-white/70 p-4">
      <p className="text-xs font-extrabold uppercase tracking-wide text-[#9a6754]">{copy.result.balanceLabel}</p>
      <p className="mt-1 break-all font-mono text-sm text-[#172033]">{formatNativeBalance(balance)}</p>
      <p className="mt-1 break-all font-mono text-sm text-[#4e5c73]">{formatStroops(stroops)}</p>
    </div>
  );
}
