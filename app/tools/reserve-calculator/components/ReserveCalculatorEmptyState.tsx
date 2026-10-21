import { copy } from "@/app/tools/reserve-calculator/copy";

export function ReserveCalculatorEmptyState() {
  return <p className="text-sm text-[#68758a]">{copy.empty}</p>;
}
