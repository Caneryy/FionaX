import { RESULT_CODE_TABLE } from "@/app/tools/result-code-explainer/lib/result-code-table";
import type { CodeEntry } from "@/app/tools/result-code-explainer/types";

/** Looks up every table row matching a code, case-insensitively. */
export function lookupCode(code: string): CodeEntry[] {
  const normalized = code.trim().toLowerCase();
  return RESULT_CODE_TABLE.filter((entry) => entry.code === normalized);
}
