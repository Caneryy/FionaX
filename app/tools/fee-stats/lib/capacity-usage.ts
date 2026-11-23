/**
 * Convert Horizon `ledger_capacity_usage` (0–1 decimal string) into a percent string.
 * Uses integer math on scaled units so float rounding never invents a third digit.
 */
export function capacityUsagePercent(ratio: string): string {
  const trimmed = ratio.trim();
  if (!/^(0|1)(\.[0-9]+)?$/.test(trimmed)) {
    throw new RangeError("Capacity usage must be a 0–1 decimal string");
  }

  const [wholePart, fractionPart = ""] = trimmed.split(".");
  const whole = BigInt(wholePart);
  if (whole === BigInt(1) && /[1-9]/.test(fractionPart)) {
    throw new RangeError("Capacity usage exceeds 1.0");
  }

  // Scale ratio to 1e4 units (percent with two fractional digits = ratio * 10000).
  const frac = fractionPart.padEnd(4, "0").slice(0, 4);
  const scaled = whole * BigInt(10000) + BigInt(frac || "0");
  if (scaled > BigInt(10000)) {
    throw new RangeError("Capacity usage exceeds 1.0");
  }

  const integer = scaled / BigInt(100);
  const fraction = (scaled % BigInt(100)).toString().padStart(2, "0");
  return `${integer.toString()}.${fraction}`;
}
