import type { ResultCodeExplainerError, ResultCodeExplainerInput } from "@/app/tools/result-code-explainer/types";

export function validateResultCodeExplainerInput(
  raw: string,
  operationType = ""
): { ok: true; input: ResultCodeExplainerInput } | { ok: false; error: ResultCodeExplainerError } {
  const code = raw.trim();

  if (!code) {
    return { ok: false, error: { code: "empty_code", message: "Enter a result code first." } };
  }

  return { ok: true, input: { code, operationType: operationType.trim() } };
}
