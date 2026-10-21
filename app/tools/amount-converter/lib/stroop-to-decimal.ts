import { exceedsStroopRange, STROOP_SCALE } from "@/app/tools/amount-converter/lib/amount-bounds";
import type { AmountConverterErrorCode } from "@/app/tools/amount-converter/types";

export type StroopParse = { ok: true; stroops: bigint } | { ok: false; code: AmountConverterErrorCode };

export function parseStroops(raw: string): StroopParse {
  const value = raw.trim();

  if (!value) return { ok: false, code: "empty_amount" };
  if (value.startsWith("-")) return { ok: false, code: "negative_amount" };
  if (!/^\d+$/.test(value)) return { ok: false, code: "invalid_amount" };

  const stroops = BigInt(value);

  if (exceedsStroopRange(stroops)) return { ok: false, code: "out_of_range" };

  return { ok: true, stroops };
}

/** Convert stroops to a decimal string. Trailing fraction zeros are removed. */
export function stroopsToDecimal(stroops: bigint): string {
  const whole = stroops / STROOP_SCALE;
  const fraction = (stroops % STROOP_SCALE).toString().padStart(7, "0").replace(/0+$/, "");
  return fraction.length > 0 ? `${whole.toString()}.${fraction}` : whole.toString();
}
