import { copy } from "@/app/tools/preconditions-explainer/copy";

export function PreconditionsExplainerEmptyState() {
  return <p className="text-sm text-[#68758a]">{copy.empty}</p>;
}
