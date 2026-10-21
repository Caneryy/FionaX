import type { CodeEntry } from "@/app/tools/result-code-explainer/types";

export type DisambiguationOutcome =
  | { kind: "unique"; entry: CodeEntry }
  | { kind: "ambiguous"; operationTypes: string[] }
  | { kind: "not_found" };

/**
 * Several operation result codes share the same enum name across different
 * operation types with different meanings. This picks the one matching the
 * caller's declared operation type when the code is ambiguous, rather than
 * showing every possible meaning at once.
 */
export function disambiguateByOperationType(matches: CodeEntry[], operationType: string): DisambiguationOutcome {
  if (matches.length === 0) return { kind: "not_found" };
  if (matches.length === 1) return { kind: "unique", entry: matches[0] };

  const typeSpecific = matches.filter((entry) => entry.operationType !== undefined);
  const trimmedType = operationType.trim().toLowerCase();

  if (trimmedType) {
    const match = typeSpecific.find((entry) => entry.operationType === trimmedType);
    if (match) return { kind: "unique", entry: match };
  }

  return { kind: "ambiguous", operationTypes: typeSpecific.map((entry) => entry.operationType as string) };
}
