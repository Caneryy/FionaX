import { SignerTypeBadge } from "@/app/tools/account-signers/components/SignerTypeBadge";
import { copy } from "@/app/tools/account-signers/copy";
import { formatWeight } from "@/app/tools/account-signers/lib/format";
import type { SignerView } from "@/app/tools/account-signers/types";

export function SignerRows({ signers }: { signers: SignerView[] }) {
  return (
    <ul className="space-y-3">
      {signers.map((signer) => (
        <li key={`${signer.kind}:${signer.key}`} className="min-w-0 space-y-2 rounded-md border border-[#c7d6e8] bg-white/70 p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <SignerTypeBadge kind={signer.kind} />
            {signer.master ? <span className="text-xs font-extrabold uppercase tracking-wide text-[#9a6754]">{copy.result.masterLabel}</span> : null}
          </div>
          <p className="break-all font-mono text-sm text-[#172033]">{signer.key}</p>
          <p className="text-sm text-[#4e5c73]">
            {copy.result.weightLabel}: {formatWeight(signer.weight)}
          </p>
        </li>
      ))}
    </ul>
  );
}
