import { describe, expect, it } from "vitest";
import { exceedsFractionDigits, exceedsStroopRange, MAX_STROOPS } from "@/app/tools/amount-converter/lib/amount-bounds";
import { justOverStroops, maxStroops } from "./fixtures/boundary-amounts.fixture";

describe("amount bounds", () => {
  it("allows 7 fraction digits and rejects 8", () => {
    expect(exceedsFractionDigits("1.1234567")).toBe(false);
    expect(exceedsFractionDigits("1.12345678")).toBe(true);
  });

  it("accepts the int64 maximum and rejects one stroop past it", () => {
    expect(exceedsStroopRange(MAX_STROOPS)).toBe(false);
    expect(exceedsStroopRange(BigInt(maxStroops))).toBe(false);
    expect(exceedsStroopRange(BigInt(justOverStroops))).toBe(true);
  });
});
