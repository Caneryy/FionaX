import { copy } from "@/app/tools/preconditions-explainer/copy";
import type { ExtraSignerInfo } from "@/app/tools/preconditions-explainer/types";

export function ExtraSignerRows({ extraSigners }: { extraSigners: ExtraSignerInfo[] }) {
  if (extraSigners.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-bold text-[#4e5c73]">{copy.extraSignersTitle}</h3>
      <ul className="space-y-1 text-sm text-[#172033]">
        {extraSigners.map((signer, index) => (
          <li key={index} className="font-mono text-xs">
            [{signer.kind}] {signer.display}
          </li>
        ))}
      </ul>
    </div>
  );
}
