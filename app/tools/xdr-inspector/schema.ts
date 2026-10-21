import type { XdrInspectorError, XdrInspectorInput } from "./types";

export const MAX_XDR_BYTES = 256 * 1024;

export function validateXdrInspectorInput(raw: string):
  | { ok: true; input: XdrInspectorInput }
  | { ok: false; error: XdrInspectorError } {
  if (!raw.trim()) return { ok: false, error: { code: "empty_xdr" } };

  // Reject huge pastes before creating a second large string or decoding anything.
  if (raw.length > Math.ceil(MAX_XDR_BYTES / 3) * 4 + 4096) {
    return { ok: false, error: { code: "too_large" } };
  }
  const base64 = raw.replace(/\s/g, "");
  if (!base64) return { ok: false, error: { code: "empty_xdr" } };
  const byteLength = base64.length / 4 * 3 - (base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0);
  if (byteLength > MAX_XDR_BYTES) return { ok: false, error: { code: "too_large" } };
  if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(base64) ||
      byteLength < 4 || byteLength % 4 !== 0) {
    return { ok: false, error: { code: "invalid_xdr" } };
  }
  // Canonical encoding also rejects non-zero unused padding bits.
  try {
    if (btoa(atob(base64)) !== base64) {
      return { ok: false, error: { code: "invalid_xdr" } };
    }
  } catch {
    return { ok: false, error: { code: "invalid_xdr" } };
  }
  return { ok: true, input: { base64, byteLength } };
}
