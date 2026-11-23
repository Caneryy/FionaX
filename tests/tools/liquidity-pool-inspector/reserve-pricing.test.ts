import { describe, expect, it } from "vitest";
import { amountToStroops } from "@/app/tools/liquidity-pool-inspector/lib/pool-fields";
import { impliedPrice, impliedPrices } from "@/app/tools/liquidity-pool-inspector/lib/reserve-pricing";
import { ToolFailure } from "@/app/tools/liquidity-pool-inspector/lib/liquidityPoolInspector.errors";
import type { PoolReserve } from "@/app/tools/liquidity-pool-inspector/types";

function reserve(asset: string, amount: string): PoolReserve {
  return { asset, amount, amountStroops: amountToStroops(amount) };
}

describe("impliedPrice", () => {
  it("reduces equal reserves to 1/1", () => {
    const price = impliedPrice(reserve("native", "500.0000000"), reserve("USD:G", "500.0000000"));
    expect(price.numerator).toBe(1n);
    expect(price.denominator).toBe(1n);
  });

  it("reduces skewed reserves exactly", () => {
    // 250 / 100 = 5 / 2 in stroops after canceling 10^7
    const price = impliedPrice(reserve("native", "100.0000000"), reserve("EUR:G", "250.0000000"));
    expect(price.numerator).toBe(5n);
    expect(price.denominator).toBe(2n);
    expect(price.baseAsset).toBe("native");
    expect(price.quoteAsset).toBe("EUR:G");
  });

  it("rejects zero reserves", () => {
    expect(() => impliedPrice(reserve("native", "0"), reserve("USD:G", "1"))).toThrow(ToolFailure);
  });
});

describe("impliedPrices", () => {
  it("returns both directions", () => {
    const [aInB, bInA] = impliedPrices([
      reserve("native", "100.0000000"),
      reserve("EUR:G", "250.0000000")
    ]);
    expect(aInB.numerator).toBe(5n);
    expect(aInB.denominator).toBe(2n);
    expect(bInA.numerator).toBe(2n);
    expect(bInA.denominator).toBe(5n);
  });
});
