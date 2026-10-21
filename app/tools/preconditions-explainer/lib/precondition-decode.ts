import { xdr } from "@stellar/stellar-sdk";
import type { ErrorCode, LedgerBoundsInfo, TimeBoundsInfo } from "@/app/tools/preconditions-explainer/types";

export interface DecodedPreconditions {
  unrestricted: boolean;
  timeBounds: TimeBoundsInfo | null;
  ledgerBounds: LedgerBoundsInfo | null;
  minSeqNum: string | null;
  minSeqAge: string | null;
  minSeqLedgerGap: number | null;
  extraSigners: xdr.SignerKey[];
}

function decodeTimeBounds(bounds: xdr.TimeBounds | null): TimeBoundsInfo | null {
  if (!bounds) return null;
  return { minTime: bounds.minTime().toString(), maxTime: bounds.maxTime().toString() };
}

function decodeLedgerBounds(bounds: xdr.LedgerBounds | null): LedgerBoundsInfo | null {
  if (!bounds) return null;
  return { minLedger: bounds.minLedger(), maxLedger: bounds.maxLedger() };
}

/** Decodes every supported precondition field from a transaction's `Preconditions` union. */
export function decodePreconditions(cond: xdr.Preconditions): DecodedPreconditions {
  const empty: DecodedPreconditions = {
    unrestricted: true,
    timeBounds: null,
    ledgerBounds: null,
    minSeqNum: null,
    minSeqAge: null,
    minSeqLedgerGap: null,
    extraSigners: []
  };

  switch (cond.switch().name) {
    case "precondNone":
      return empty;
    case "precondTime": {
      const bounds = decodeTimeBounds(cond.timeBounds());
      // "0" on both sides is the SDK's own encoding for "no timeout set"
      // (e.g. TransactionBuilder.setTimeout(0)) — not a real restriction.
      const isZeroBounds = bounds?.minTime === "0" && bounds?.maxTime === "0";
      return { ...empty, unrestricted: isZeroBounds, timeBounds: isZeroBounds ? null : bounds };
    }
    case "precondV2": {
      const v2 = cond.v2();
      const minSeqNum = v2.minSeqNum();
      const minSeqAge = v2.minSeqAge().toString();
      const minSeqLedgerGap = v2.minSeqLedgerGap();
      const extraSigners = v2.extraSigners();
      const timeBounds = decodeTimeBounds(v2.timeBounds());
      const ledgerBounds = decodeLedgerBounds(v2.ledgerBounds());
      const unrestricted =
        !timeBounds && !ledgerBounds && !minSeqNum && minSeqAge === "0" && minSeqLedgerGap === 0 && extraSigners.length === 0;
      return {
        unrestricted,
        timeBounds,
        ledgerBounds,
        minSeqNum: minSeqNum ? minSeqNum.toString() : null,
        minSeqAge: minSeqAge === "0" ? null : minSeqAge,
        minSeqLedgerGap: minSeqLedgerGap === 0 ? null : minSeqLedgerGap,
        extraSigners
      };
    }
    default:
      return empty;
  }
}

export function decodeEnvelopeOperations(raw: string): { ok: true; cond: xdr.Preconditions } | { ok: false; code: ErrorCode } {
  let decoded: xdr.TransactionEnvelope;
  try {
    decoded = xdr.TransactionEnvelope.fromXDR(raw, "base64");
  } catch {
    return { ok: false, code: "invalid_xdr" };
  }

  try {
    switch (decoded.switch().name) {
      case "envelopeTypeTxV0": {
        // V0 envelopes predate CAP-21 and only ever carry classic time bounds,
        // which can themselves be absent — a valid, common, unrestricted case.
        const v0Bounds = decoded.v0().tx().timeBounds();
        return { ok: true, cond: v0Bounds ? xdr.Preconditions.precondTime(v0Bounds) : xdr.Preconditions.precondNone() };
      }
      case "envelopeTypeTx":
        return { ok: true, cond: decoded.v1().tx().cond() };
      case "envelopeTypeTxFeeBump": {
        const inner = decoded.feeBump().tx().innerTx();
        if (inner.switch().name !== "envelopeTypeTx") return { ok: false, code: "unsupported_envelope" };
        return { ok: true, cond: inner.v1().tx().cond() };
      }
      default:
        return { ok: false, code: "unsupported_envelope" };
    }
  } catch {
    return { ok: false, code: "invalid_xdr" };
  }
}
