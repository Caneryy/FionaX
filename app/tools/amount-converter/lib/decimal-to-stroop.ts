import { exceedsFractionDigits, exceedsStroopRange, STROOP_SCALE } from "@/app/tools/amount-converter/lib/amount-bounds";
import type { AmountConverterErrorCode } from "@/app/tools/amount-converter/types";

export type DecimalParse = { ok: true; stroops: bigint } | { ok: false; code: AmountConverterErrorCode };

/** Convert a decimal amount to stroops with integer arithmetic. Never uses a float. */
export function decimalToStroops(raw: string): DecimalParse {
  const value = raw.trim();

  if (!value) return { ok: false, code: "empty_amount" };
  if (value.startsWith("-")) return { ok: false, code: "negative_amount" };
  if (!/^\d+(\.\d+)?$/.test(value)) return { ok: false, code: "invalid_amount" };
  if (exceedsFractionDigits(value)) return { ok: false, code: "too_many_decimals" };

  const [whole, fraction = ""] = value.split(".");
  const padded = `${fraction}0000000`.slice(0, 7);
  const stroops = BigInt(whole) * STROOP_SCALE + BigInt(padded);

  if (exceedsStroopRange(stroops)) return { ok: false, code: "out_of_range" };

  return { ok: true, stroops };
}
