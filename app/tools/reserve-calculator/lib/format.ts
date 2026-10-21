const SCALE = BigInt(10_000_000);
const ZERO = BigInt(0);

/** Presentation-only helpers. Keep formatting out of components and logic. */
export function formatXlm(stroops: string): string {
  const value = BigInt(stroops);
  const negative = value < ZERO;
  const abs = negative ? -value : value;
  const whole = abs / SCALE;
  const fraction = (abs % SCALE).toString().padStart(7, "0").replace(/0+$/, "");
  const formatted = fraction ? `${whole}.${fraction}` : `${whole}`;
  return negative ? `-${formatted} XLM` : `${formatted} XLM`;
}
