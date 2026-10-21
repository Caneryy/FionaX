import type { PreconditionsExplainerError } from "@/app/tools/preconditions-explainer/types";

/** This slice makes no request — decoding is synchronous and local. */
export function toToolError(error: unknown): PreconditionsExplainerError {
  void error;
  return { code: "invalid_xdr", message: "That is not valid base64 XDR for a transaction envelope." };
}
