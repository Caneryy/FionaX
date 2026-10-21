import { describe, expect, it } from "vitest";
import { reserveReliefStroops } from "@/app/tools/sponsored-reserves/lib/relief-calculation";

describe("reserve relief", () => {
  it("counts the account base as two units and preserves large integers", () => {
    expect(reserveReliefStroops(BigInt("2"))).toBe(BigInt("10000000"));
    expect(reserveReliefStroops(BigInt("9007199254740993"))).toBe(BigInt("45035996273704965000000"));
  });
  it("rejects negative units", () => expect(() => reserveReliefStroops(-BigInt("1"))).toThrow(RangeError));
});
