import { xdr } from "@stellar/stellar-sdk";
import type { XdrType } from "../types";

export const DETECTION_ORDER: readonly XdrType[] = [
  "transaction_envelope", "transaction_result", "ledger_entry"
];

export type SupportedXdr =
  | InstanceType<typeof xdr.TransactionEnvelope>
  | InstanceType<typeof xdr.TransactionResult>
  | InstanceType<typeof xdr.LedgerEntry>;

export interface DetectedXdr {
  type: XdrType;
  value: SupportedXdr;
}

export function detectXdr(base64: string): DetectedXdr | null {
  for (const type of DETECTION_ORDER) {
    try {
      // js-xdr's fromXDR calls ensureInputConsumed, so trailing bytes fail.
      const value = type === "transaction_envelope"
        ? xdr.TransactionEnvelope.fromXDR(base64, "base64")
        : type === "transaction_result"
          ? xdr.TransactionResult.fromXDR(base64, "base64")
          : xdr.LedgerEntry.fromXDR(base64, "base64");
      return { type, value };
    } catch {
      // A failed candidate may still be another supported type.
    }
  }
  return null;
}
