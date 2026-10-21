import { lookupCode } from "@/app/tools/result-code-explainer/lib/code-lookup";
import { disambiguateByOperationType } from "@/app/tools/result-code-explainer/lib/operation-disambiguation";
import type { ResultCodeExplainerError, ResultCodeExplainerInput, ResultCodeExplainerResult } from "@/app/tools/result-code-explainer/types";

/** Core tool logic. Lookup is synchronous and entirely local. */
export function runResultCodeExplainer(
  input: ResultCodeExplainerInput
): { ok: true; result: ResultCodeExplainerResult } | { ok: false; error: ResultCodeExplainerError } {
  const matches = lookupCode(input.code);
  const outcome = disambiguateByOperationType(matches, input.operationType);

  if (outcome.kind === "not_found") {
    return { ok: false, error: { code: "unknown_code", message: "That code is not in this tool's table — it may be unrecognized, not an invalid lookup." } };
  }

  if (outcome.kind === "ambiguous") {
    return {
      ok: false,
      error: {
        code: "ambiguous_operation_type",
        message: `This code means something different per operation type. Pick one of: ${outcome.operationTypes.join(", ")}.`
      }
    };
  }

  const { entry } = outcome;
  return {
    ok: true,
    result: {
      code: entry.code,
      category: entry.category,
      operationType: entry.operationType,
      label: entry.label,
      explanation: entry.explanation,
      commonCauses: entry.commonCauses
    }
  };
}
