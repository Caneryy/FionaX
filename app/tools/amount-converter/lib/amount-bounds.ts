import { MAX_FRACTION_DIGITS, MAX_STROOPS, STROOP_SCALE } from "@/app/tools/amount-converter/types";

export function fractionDigitCount(raw: string): number | null {
  const fraction = raw.trim().split(".")[1];
  return fraction === undefined ? 0 : fraction.length;
}

export function exceedsFractionDigits(raw: string): boolean {
  const count = fractionDigitCount(raw);
  return count !== null && count > MAX_FRACTION_DIGITS;
}

export function exceedsStroopRange(stroops: bigint): boolean {
  return stroops < 0n || stroops > MAX_STROOPS;
}

export { MAX_STROOPS, STROOP_SCALE };
