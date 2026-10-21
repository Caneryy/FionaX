import { formatSignerKind } from "@/app/tools/account-signers/lib/format";
import type { SignerKind } from "@/app/tools/account-signers/types";

export function SignerTypeBadge({ kind }: { kind: SignerKind }) {
  return (
    <span className="inline-flex rounded-full bg-[#e0f6ff] px-2 py-1 text-xs font-extrabold text-[#146783]">
      {formatSignerKind(kind)}
    </span>
  );
}
