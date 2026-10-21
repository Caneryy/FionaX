import { MasterKeyNotice } from "@/app/tools/account-signers/components/MasterKeyNotice";
import { SignerRows } from "@/app/tools/account-signers/components/SignerRows";
import { ThresholdSummary } from "@/app/tools/account-signers/components/ThresholdSummary";
import { copy } from "@/app/tools/account-signers/copy";
import { formatNetworkName } from "@/app/tools/account-signers/lib/format";
import type { AccountSignersResult as Result } from "@/app/tools/account-signers/types";

export function AccountSignersResult({ result }: { result: Result }) {
  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <h2 className="text-sm font-extrabold text-[#17664b]">{copy.result.title}</h2>
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="min-w-0 sm:col-span-2">
            <dt className="text-xs font-extrabold uppercase tracking-wide text-[#9a6754]">{copy.result.accountLabel}</dt>
            <dd className="mt-1 break-all font-mono text-sm text-[#172033]">{result.accountId}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-xs font-extrabold uppercase tracking-wide text-[#9a6754]">{copy.result.networkLabel}</dt>
            <dd className="mt-1 text-sm text-[#172033]">{formatNetworkName(result.network)}</dd>
          </div>
        </dl>
      </div>
      <ThresholdSummary thresholds={result.thresholds} />
      <SignerRows signers={result.signers} />
      <MasterKeyNotice zero={result.masterWeightZero} />
    </div>
  );
}
