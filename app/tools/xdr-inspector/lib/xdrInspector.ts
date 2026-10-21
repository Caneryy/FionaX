import { validateXdrInspectorInput } from "../schema";
import type { XdrInspectorOutcome } from "../types";
import { detectXdr } from "./xdr-detect";
import { decodeXdr } from "./xdr-decode";
import { toToolError } from "./xdrInspector.errors";

export function runXdrInspector(raw: string): XdrInspectorOutcome {
  const parsed = validateXdrInspectorInput(raw);
  if (!parsed.ok) return parsed;
  try {
    const detected = detectXdr(parsed.input.base64);
    if (!detected) return { ok: false, error: { code: "undetected_type" } };
    return { ok: true, result: {
      type: detected.type,
      json: decodeXdr(detected),
      byteLength: parsed.input.byteLength
    } };
  } catch (cause) {
    return { ok: false, error: toToolError(cause) };
  }
}
