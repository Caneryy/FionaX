import type { XdrInspectorError } from "../types";

// SDK errors are deliberately not shown: they can contain input fragments and
// differ across SDK releases. This tool never makes a transport request.
export function toToolError(_cause: unknown): XdrInspectorError {
  void _cause;
  return { code: "invalid_xdr" };
}
