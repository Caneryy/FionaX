import type { PreconditionsExplainerError, PreconditionsExplainerInput } from "@/app/tools/preconditions-explainer/types";

export const MAX_XDR_LENGTH = 65_536;
const BASE64 = /^[A-Za-z0-9+/]+={0,2}$/;

export function validatePreconditionsExplainerInput(
  raw: string
): { ok: true; input: PreconditionsExplainerInput } | { ok: false; error: PreconditionsExplainerError } {
  const envelope = raw.replace(/\s+/g, "");

  if (!envelope) {
    return { ok: false, error: { code: "empty_xdr", message: "Enter a transaction envelope first." } };
  }
  if (envelope.length > MAX_XDR_LENGTH) {
    return { ok: false, error: { code: "too_large", message: "That envelope is larger than this tool accepts." } };
  }
  if (envelope.length % 4 !== 0 || !BASE64.test(envelope)) {
    return { ok: false, error: { code: "invalid_xdr", message: "That is not valid base64 XDR." } };
  }

  return { ok: true, input: { envelope } };
}
