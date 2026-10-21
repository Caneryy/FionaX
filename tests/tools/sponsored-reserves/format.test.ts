import { describe, expect, it } from "vitest";
import { formatReserveCount, formatXlm } from "@/app/tools/sponsored-reserves/lib/format";

describe("exact presentation", () => {
  it.each([[BigInt("0"), "0 XLM"], [BigInt("5000000"), "0.5 XLM"], [BigInt("12345678"), "1.2345678 XLM"], [BigInt("100000000000000001"), "10000000000.0000001 XLM"]] as const)("formats stroops", (stroops, expected) => {
    expect(formatXlm(stroops)).toBe(expected);
  });
  it("formats reserve count without floating point", () => {
    expect(formatReserveCount(BigInt("1"))).toBe("1 reserve unit");
    expect(formatReserveCount(BigInt("9007199254740993"))).toBe("9007199254740993 reserve units");
  });
});
