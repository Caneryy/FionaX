import { describe, expect, it } from "vitest";
import {
  formatCapacityPercent,
  formatFeeStroops,
  formatFetchedAt,
  formatLedgerSequence
} from "@/app/tools/fee-stats/lib/format";

describe("formatFeeStroops", () => {
  it("returns exact integer fee strings", () => {
    expect(formatFeeStroops("100")).toBe("100");
    expect(formatFeeStroops("5500")).toBe("5500");
    expect(formatFeeStroops(" 0 ")).toBe("0");
  });

  it("rejects non-integer fee strings", () => {
    expect(() => formatFeeStroops("1.5")).toThrow(RangeError);
    expect(() => formatFeeStroops("-1")).toThrow(RangeError);
    expect(() => formatFeeStroops("01")).toThrow(RangeError);
  });
});

describe("formatCapacityPercent", () => {
  it("normalizes to two fractional digits", () => {
    expect(formatCapacityPercent("5")).toBe("5.00");
    expect(formatCapacityPercent("5.5")).toBe("5.50");
    expect(formatCapacityPercent("97.00")).toBe("97.00");
  });

  it("rejects out-of-range values", () => {
    expect(() => formatCapacityPercent("1000")).toThrow(RangeError);
    expect(() => formatCapacityPercent("-1")).toThrow(RangeError);
  });
});

describe("formatFetchedAt", () => {
  it("renders a compact UTC label", () => {
    expect(formatFetchedAt("2026-03-20T12:34:56.000Z")).toBe("2026-03-20T12:34:56 UTC");
  });

  it("rejects invalid timestamps", () => {
    expect(() => formatFetchedAt("not-a-date")).toThrow(RangeError);
  });
});

describe("formatLedgerSequence", () => {
  it("keeps positive ledger sequences", () => {
    expect(formatLedgerSequence("28444678")).toBe("28444678");
  });

  it("rejects zero and non-integer sequences", () => {
    expect(() => formatLedgerSequence("0")).toThrow(RangeError);
    expect(() => formatLedgerSequence("12.3")).toThrow(RangeError);
  });
});
