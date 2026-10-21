import { describe, expect, it } from "vitest";
import { availableBalance, spendableBalance } from "@/app/tools/reserve-calculator/lib/spendable-balance";

describe("availableBalance", () => {
  it("subtracts the minimum balance from the current balance", () => {
    expect(availableBalance(BigInt(100), BigInt(30))).toBe(BigInt(70));
  });

  it("floors at zero rather than going negative", () => {
    expect(availableBalance(BigInt(10), BigInt(30))).toBe(BigInt(0));
  });
});

describe("spendableBalance", () => {
  it("subtracts selling liabilities from available balance", () => {
    expect(spendableBalance(BigInt(70), BigInt(20))).toBe(BigInt(50));
  });

  it("floors at zero when liabilities exceed available balance", () => {
    expect(spendableBalance(BigInt(10), BigInt(20))).toBe(BigInt(0));
  });
});
