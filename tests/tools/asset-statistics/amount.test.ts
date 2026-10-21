import { describe, expect, it } from "vitest";
import { amountToStroops, normalizeAmount, stroopsToAmount, sumAmounts } from "@/app/tools/asset-statistics/lib/amount";

describe("amount arithmetic", () => {
  it("converts one stroop and one whole unit", () => {
    expect(amountToStroops("0.0000001")).toBe(1n);
    expect(amountToStroops("1")).toBe(10_000_000n);
    expect(stroopsToAmount(1n)).toBe("0.0000001");
    expect(normalizeAmount("1.5")).toBe("1.5000000");
  });

  it("adds values that float64 rounds the other way", () => {
    const total = sumAmounts(["900719925.4740993", "0.0000001", "0.0000001", "0.0000001", "0.0000001", "0.0000000"]);
    expect(total).toBe("900719925.4740997");
    expect(Number(total).toFixed(7)).not.toBe(total);
  });

  it("rejects scientific notation, signs, and extra precision", () => {
    expect(amountToStroops("1e-7")).toBeNull();
    expect(amountToStroops("-1.0000000")).toBeNull();
    expect(amountToStroops("1.00000001")).toBeNull();
    expect(amountToStroops("")).toBeNull();
  });
});
