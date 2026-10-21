import { describe, expect, it } from "vitest";
import { copy } from "@/app/tools/amount-converter/copy";
import { validateAmountConverterInput } from "@/app/tools/amount-converter/schema";
import { eightDigits, justOverStroops, maxDecimal } from "./fixtures/boundary-amounts.fixture";
import { emptySample, invalidSamples, negativeSample } from "./fixtures/invalid-amounts.fixture";

describe("validateAmountConverterInput", () => {
  it("rejects empty, invalid, negative, extra decimals, and range", () => {
    expect(validateAmountConverterInput({ raw: emptySample, direction: "decimal" }).ok).toBe(false);
    const empty = validateAmountConverterInput({ raw: emptySample, direction: "stroop" });
    if (!empty.ok) expect(empty.error.message).toBe(copy.errors.empty_amount);

    for (const sample of invalidSamples) {
      const result = validateAmountConverterInput({ raw: sample, direction: "decimal" });
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error.code).toBe("invalid_amount");
    }

    const negative = validateAmountConverterInput({ raw: negativeSample, direction: "stroop" });
    if (!negative.ok) expect(negative.error.message).toBe(copy.errors.negative_amount);

    const decimals = validateAmountConverterInput({ raw: eightDigits, direction: "decimal" });
    if (!decimals.ok) expect(decimals.error.message).toBe(copy.errors.too_many_decimals);

    const range = validateAmountConverterInput({ raw: justOverStroops, direction: "stroop" });
    if (!range.ok) expect(range.error.message).toBe(copy.errors.out_of_range);
  });

  it("accepts the maximum decimal amount", () => {
    const result = validateAmountConverterInput({ raw: maxDecimal, direction: "decimal" });
    expect(result.ok).toBe(true);
  });
});
