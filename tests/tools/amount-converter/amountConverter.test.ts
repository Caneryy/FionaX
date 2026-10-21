import { describe, expect, it } from "vitest";
import { copy } from "@/app/tools/amount-converter/copy";
import { runAmountConverter } from "@/app/tools/amount-converter/lib/amountConverter";
import { toToolError } from "@/app/tools/amount-converter/lib/amountConverter.errors";
import { maxDecimal, maxStroops } from "./fixtures/boundary-amounts.fixture";
import { oneAndAHalf } from "./fixtures/valid-amounts.fixture";

describe("runAmountConverter", () => {
  it("keeps both directions on the same integer", () => {
    const fromDecimal = runAmountConverter(oneAndAHalf.decimal, "decimal");
    const fromStroop = runAmountConverter(oneAndAHalf.stroops, "stroop");

    expect(fromDecimal.ok && fromStroop.ok).toBe(true);
    if (fromDecimal.ok && fromStroop.ok) {
      expect(fromDecimal.result.stroops).toBe(fromStroop.result.stroops);
      expect(fromDecimal.result.decimal).toBe(fromStroop.result.decimal);
      expect(fromDecimal.result.stroopValue).toBe(fromStroop.result.stroopValue);
    }
  });

  it("round-trips the maximum amount", () => {
    const parsed = runAmountConverter(maxDecimal, "decimal");
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.result.stroops).toBe(maxStroops);
      const back = runAmountConverter(parsed.result.stroops, "stroop");
      expect(back.ok).toBe(true);
      if (back.ok) expect(back.result.decimal).toBe(parsed.result.decimal);
    }
  });

  it("maps every error code to its copy", () => {
    expect(runAmountConverter("", "decimal")).toEqual({ ok: false, error: toToolError("empty_amount") });
    expect(runAmountConverter("nope", "stroop")).toEqual({ ok: false, error: { code: "invalid_amount", message: copy.errors.invalid_amount } });
    expect(runAmountConverter("-2", "decimal")).toEqual({ ok: false, error: { code: "negative_amount", message: copy.errors.negative_amount } });
    expect(runAmountConverter("1.12345678", "decimal")).toEqual({
      ok: false,
      error: { code: "too_many_decimals", message: copy.errors.too_many_decimals }
    });
    expect(runAmountConverter("9223372036854775808", "stroop")).toEqual({
      ok: false,
      error: { code: "out_of_range", message: copy.errors.out_of_range }
    });
  });
});
