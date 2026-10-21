import { copy } from "@/app/tools/account-merge-preflight/copy";

export function DestinationNotice({ missing }: { missing: boolean }) {
  if (!missing) {
    return null;
  }

  return (
    <div className="space-y-2 rounded-md border border-[#ffc3a8]/80 bg-[#fff2e9] p-4">
      <p className="text-sm font-extrabold text-[#9a513f]">{copy.destination.title}</p>
      <p className="text-sm leading-6 text-[#4e5c73]">{copy.destination.body}</p>
    </div>
  );
}
