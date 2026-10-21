const AMOUNT = /^(\d+)(?:\.(\d{1,7}))?$/;
const STROOPS_PER_UNIT = 10_000_000n;

/**
 * Converts a non-negative Stellar amount string into integer stroops.
 * The fractional part is padded in a string, so values past the float mantissa stay exact.
 */
export function amountToStroops(value: string): bigint | null {
  const match = AMOUNT.exec(value.trim());
  if (!match) return null;

  const whole = BigInt(match[1]);
  const fraction = BigInt((match[2] ?? "").padEnd(7, "0"));
  return whole * STROOPS_PER_UNIT + fraction;
}

export function stroopsToAmount(stroops: bigint): string {
  const whole = stroops / STROOPS_PER_UNIT;
  const fraction = (stroops % STROOPS_PER_UNIT).toString().padStart(7, "0");
  return `${whole.toString()}.${fraction}`;
}

export function normalizeAmount(value: string): string | null {
  const stroops = amountToStroops(value);
  if (stroops === null) return null;
  return stroopsToAmount(stroops);
}

export function sumAmounts(values: readonly string[]): string | null {
  let total = 0n;
  for (const value of values) {
    const stroops = amountToStroops(value);
    if (stroops === null) return null;
    total += stroops;
  }
  return stroopsToAmount(total);
}
