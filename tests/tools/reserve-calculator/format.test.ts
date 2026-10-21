import { describe, expect, it } from "vitest";
import { formatXlm } from "@/app/tools/reserve-calculator/lib/format";

describe("formatXlm", () => {
  it("formats a whole-number amount", () => {
    expect(formatXlm("1000000000")).toBe("100 XLM");
  });

  it("formats a fractional amount, trimming trailing zeros", () => {
    expect(formatXlm("12345000")).toBe("1.2345 XLM");
  });

  it("formats a negative amount", () => {
    expect(formatXlm("-5000000")).toBe("-0.5 XLM");
  });

  it("formats zero", () => {
    expect(formatXlm("0")).toBe("0 XLM");
  });
});
