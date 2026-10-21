import { describe, expect, it } from "vitest";
import { decimalToStroops } from "@/app/tools/amount-converter/lib/decimal-to-stroop";
import { eightDigits, sevenDigits } from "./fixtures/boundary-amounts.fixture";
import { oneAndAHalf } from "./fixtures/valid-amounts.fixture";

describe("decimalToStroops", () => {
  it("converts 1.5 to 15000000 stroops", () => {
    const parsed = decimalToStroops(oneAndAHalf.decimal);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) expect(parsed.stroops.toString()).toBe(oneAndAHalf.stroops);
  });

  it("keeps a single stroop exact", () => {
    const parsed = decimalToStroops(sevenDigits);
    expect(parsed.ok && parsed.stroops).toBe(1n);
  });

  it("rejects an eighth fraction digit", () => {
    expect(decimalToStroops(eightDigits)).toEqual({ ok: false, code: "too_many_decimals" });
  });
});
