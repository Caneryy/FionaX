import type { ImpliedReservePrice } from "../types";

const STROOPS_PER_UNIT = 10_000_000n;

function groupDigits(whole: string): string {
  return whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/** Formats a Stellar amount string for display without Number conversion. */
export function formatExactAmount(value: string): string {
  const trimmed = value.trim();
  const match = /^(\d+)(?:\.(\d{1,7}))?$/.exec(trimmed);
  if (!match) return trimmed;
  const whole = groupDigits(match[1].replace(/^0+(?=\d)/, "") || "0");
  const fraction = (match[2] ?? "").padEnd(7, "0");
  return `${whole}.${fraction}`;
}

export function formatAsset(asset: string): string {
  if (asset === "native") return "XLM";
  const sep = asset.indexOf(":");
  if (sep === -1) return asset;
  return `${asset.slice(0, sep)} · ${asset.slice(sep + 1)}`;
}

export function formatFeeBp(feeBp: number): string {
  return `${feeBp} bp`;
}

export function formatPoolId(poolId: string): string {
  if (poolId.length <= 16) return poolId;
  return `${poolId.slice(0, 8)}…${poolId.slice(-8)}`;
}

/**
 * Renders an implied price as an exact reduced fraction plus a decimal expansion
 * computed with BigInt division (never floating point).
 */
export function formatImpliedPrice(price: ImpliedReservePrice, decimalPlaces = 7): string {
  if (price.denominator === 0n) return "—";
  const whole = price.numerator / price.denominator;
  let rem = price.numerator % price.denominator;
  let digits = "";
  for (let i = 0; i < decimalPlaces; i++) {
    rem *= 10n;
    digits += (rem / price.denominator).toString();
    rem %= price.denominator;
  }
  const decimal = `${whole.toString()}.${digits}`;
  const ratio =
    price.numerator === price.denominator
      ? "1"
      : `${price.numerator.toString()} / ${price.denominator.toString()}`;
  return `${formatExactAmount(padAmount(decimal))} (${ratio} stroops)`;
}

function padAmount(value: string): string {
  const [whole, fraction = ""] = value.split(".");
  return `${whole}.${fraction.padEnd(7, "0").slice(0, 7)}`;
}

export function formatShares(totalShares: string): string {
  return formatExactAmount(totalShares);
}

export { STROOPS_PER_UNIT };
