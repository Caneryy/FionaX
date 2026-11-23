import { copy } from "@/app/tools/memo-inspector/copy";

export function NoMemoState() {
  return (
    <div className="space-y-2 rounded-md border border-dashed border-[#c7d6e8] bg-white/50 p-4">
      <p className="text-sm font-extrabold text-[#172033]">{copy.none.title}</p>
      <p className="text-sm leading-6 text-[#68758a]">{copy.none.body}</p>
    </div>
  );
}
