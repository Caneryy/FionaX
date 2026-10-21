import { decodeExtraSigners } from "@/app/tools/preconditions-explainer/lib/extra-signers";
import { decodeEnvelopeOperations, decodePreconditions } from "@/app/tools/preconditions-explainer/lib/precondition-decode";
import type {
  PreconditionsExplainerError,
  PreconditionsExplainerInput,
  PreconditionsExplainerResult
} from "@/app/tools/preconditions-explainer/types";

/** Core tool logic. Decoding is synchronous and entirely local. */
export function runPreconditionsExplainer(
  input: PreconditionsExplainerInput
): { ok: true; result: PreconditionsExplainerResult } | { ok: false; error: PreconditionsExplainerError } {
  const decoded = decodeEnvelopeOperations(input.envelope);
  if (!decoded.ok) {
    return { ok: false, error: { code: decoded.code, message: errorMessage(decoded.code) } };
  }

  const preconditions = decodePreconditions(decoded.cond);

  return {
    ok: true,
    result: {
      unrestricted: preconditions.unrestricted,
      timeBounds: preconditions.timeBounds,
      ledgerBounds: preconditions.ledgerBounds,
      minSequenceNumber: preconditions.minSeqNum,
      minSequenceAge: preconditions.minSeqAge,
      minSequenceLedgerGap: preconditions.minSeqLedgerGap,
      extraSigners: decodeExtraSigners(preconditions.extraSigners)
    }
  };
}

function errorMessage(code: "empty_xdr" | "invalid_xdr" | "unsupported_envelope" | "too_large"): string {
  switch (code) {
    case "empty_xdr":
      return "Enter a transaction envelope first.";
    case "invalid_xdr":
      return "That is not valid base64 XDR for a transaction envelope.";
    case "unsupported_envelope":
      return "This envelope shape is not supported — only a plain transaction, or a fee-bump wrapping one, can be inspected.";
    case "too_large":
      return "That envelope is larger than this tool accepts.";
  }
}
