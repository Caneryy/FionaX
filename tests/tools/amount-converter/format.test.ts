import { describe, expect, it } from "vitest";
import { copy } from "@/app/tools/amount-converter/copy";
import { formatDecimalAmount, formatDirection, formatStroopAmount } from "@/app/tools/amount-converter/lib/format";

describe("amount formatting", () => {
  it("formats the two fields without rounding", () => {
    expect(formatDecimalAmount("1.5")).toBe("1.5");
    expect(formatStroopAmount("15000000")).toBe("15000000 stroops");
  });

  it("uses the direction copy", () => {
    expect(formatDirection("decimal")).toBe(copy.notice.fromDecimal);
    expect(formatDirection("stroop")).toBe(copy.notice.fromStroop);
  });
});
