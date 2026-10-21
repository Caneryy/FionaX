import { copy } from "@/app/tools/account-merge-preflight/copy";
import type { MergeBlocker } from "@/app/tools/account-merge-preflight/types";

export function BlockerRows({ blockers }: { blockers: MergeBlocker[] }) {
  if (blockers.length === 0) {
    return <p className="text-sm font-extrabold text-[#17664b]">{copy.result.mergeable}</p>;
  }

  return (
    <ul className="space-y-3">
      {blockers.map((blocker) => (
        <li key={blocker.code} className="min-w-0 space-y-1 rounded-md border border-[#ffc3a8]/80 bg-[#fff2e9] p-4">
          <p className="text-sm font-extrabold text-[#9a513f]">{blocker.title}</p>
          <p className="text-sm leading-6 text-[#4e5c73]">{blocker.detail}</p>
        </li>
      ))}
    </ul>
  );
}
