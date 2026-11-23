import type { ImpliedReservePrice, PoolReserve } from "../types";
import { ToolFailure } from "./liquidityPoolInspector.errors";

function gcd(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}

/**
 * Price of `base` in terms of `quote`: quoteStroops / baseStroops as a reduced rational.
 * Exact integer arithmetic only — never Number or float division.
 */
export function impliedPrice(base: PoolReserve, quote: PoolReserve): ImpliedReservePrice {
  if (base.amountStroops <= 0n || quote.amountStroops <= 0n) {
    throw new ToolFailure("request_failed");
  }
  const numerator = quote.amountStroops;
  const denominator = base.amountStroops;
  const divisor = gcd(numerator, denominator);
  return {
    baseAsset: base.asset,
    quoteAsset: quote.asset,
    numerator: numerator / divisor,
    denominator: denominator / divisor
  };
}

/** Both directions: A in B and B in A. */
export function impliedPrices(reserves: [PoolReserve, PoolReserve]): [ImpliedReservePrice, ImpliedReservePrice] {
  const [a, b] = reserves;
  return [impliedPrice(a, b), impliedPrice(b, a)];
}
