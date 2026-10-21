import { copy } from "@/app/tools/account-data-entries/copy";

export function EntryLimitWarning() {
  return (
    <div className="space-y-2 rounded-md border border-[#ffc3a8]/80 bg-[#fff2e9] p-4">
      <p className="text-sm font-extrabold text-[#9a513f]">{copy.nearLimit.title}</p>
      <p className="text-sm leading-6 text-[#4e5c73]">{copy.nearLimit.body}</p>
    </div>
  );
}
