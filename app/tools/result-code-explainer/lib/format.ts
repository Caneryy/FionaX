import type { CodeCategory } from "@/app/tools/result-code-explainer/types";

/** Presentation-only helpers. Keep formatting out of components and logic. */
export function formatCategory(category: CodeCategory): string {
  return category === "transaction" ? "Transaction-level" : "Operation-level";
}
