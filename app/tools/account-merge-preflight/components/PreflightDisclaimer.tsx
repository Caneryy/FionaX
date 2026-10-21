import { copy } from "@/app/tools/account-merge-preflight/copy";

export function PreflightDisclaimer() {
  return (
    <div className="space-y-2 rounded-md border border-[#82cbe3]/70 bg-[#e0f6ff] p-4">
      <p className="text-sm font-extrabold text-[#146783]">{copy.disclaimer.title}</p>
      <p className="text-sm leading-6 text-[#4e5c73]">{copy.disclaimer.body}</p>
    </div>
  );
}
