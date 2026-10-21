import { describe, expect, it } from "vitest";
import { stroopsToDecimal } from "@/app/tools/amount-converter/lib/stroop-to-decimal";
import { oneAndAHalf, oneStroop, whole } from "./fixtures/valid-amounts.fixture";

describe("stroopsToDecimal", () => {
  it("drops trailing zeros without changing the value", () => {
    expect(stroopsToDecimal(BigInt(oneAndAHalf.stroops))).toBe(oneAndAHalf.decimal);
    expect(stroopsToDecimal(BigInt(whole.stroops))).toBe(whole.decimal);
    expect(stroopsToDecimal(BigInt(oneStroop.stroops))).toBe(oneStroop.decimal);
  });

  it("renders zero as 0", () => {
    expect(stroopsToDecimal(0n)).toBe("0");
  });
});
