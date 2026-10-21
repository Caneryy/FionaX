import type { ResultCodeExplainerError } from "@/app/tools/result-code-explainer/types";

/** This slice makes no request — the lookup is synchronous and local. */
export function toToolError(error: unknown): ResultCodeExplainerError {
  void error;
  return { code: "unknown_code", message: "That code is not in this tool's table." };
}
