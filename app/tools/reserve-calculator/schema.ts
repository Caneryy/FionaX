import { StrKey } from "@stellar/stellar-sdk";
import type { ReserveCalculatorError, ReserveCalculatorInput } from "@/app/tools/reserve-calculator/types";

const SECRET_PREFIX = /^S/;

export function validateReserveCalculatorInput(
  raw: string
): { ok: true; input: ReserveCalculatorInput } | { ok: false; error: ReserveCalculatorError } {
  const accountId = raw.trim();

  if (!accountId) {
    return { ok: false, error: { code: "invalid_account", message: "Enter a Stellar account ID first." } };
  }
  if (SECRET_PREFIX.test(accountId) || !StrKey.isValidEd25519PublicKey(accountId)) {
    return { ok: false, error: { code: "invalid_account", message: "Enter a valid G… account ID. Secret seeds are rejected before any request." } };
  }

  return { ok: true, input: { accountId } };
}
