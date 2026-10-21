import { copy } from "@/app/tools/result-code-explainer/copy";

export function ResultCodeExplainerEmptyState() {
  return <p className="text-sm text-[#68758a]">{copy.empty}</p>;
}
