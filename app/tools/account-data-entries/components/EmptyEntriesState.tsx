import { copy } from "@/app/tools/account-data-entries/copy";

export function EmptyEntriesState() {
  return (
    <div className="space-y-2 rounded-md border border-[#70c7a7]/70 bg-[#e1f8ef] p-4">
      <p className="text-sm font-extrabold text-[#17664b]">{copy.zeroEntries.title}</p>
      <p className="text-sm leading-6 text-[#4e5c73]">{copy.zeroEntries.body}</p>
    </div>
  );
}
