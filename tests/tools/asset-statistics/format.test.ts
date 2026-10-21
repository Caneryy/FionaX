import { describe, expect, it } from "vitest";
import { formatCount, formatExactAmount, formatSnapshotTime } from "@/app/tools/asset-statistics/lib/format";
import { mixedCirculatingAmount } from "@/tests/tools/asset-statistics/fixtures/mixed-authorization.fixture";

describe("formatExactAmount", () => {
  it("groups the whole part and keeps all seven decimals from the exact string", () => {
    expect(formatExactAmount(mixedCirculatingAmount)).toBe("900,719,925.4740997");
    expect(formatExactAmount("1000041.2500001")).toBe("1,000,041.2500001");
    expect(formatExactAmount("0.0000000")).toBe("0.0000000");
  });

  it("does not follow float rounding when the exact string and Number disagree", () => {
    const display = formatExactAmount(mixedCirculatingAmount);
    expect(display).not.toBe(Number(mixedCirculatingAmount).toLocaleString("en-US", { minimumFractionDigits: 7, maximumFractionDigits: 7 }));
  });

  it("formats counts with separators", () => {
    expect(formatCount(126)).toBe("126");
    expect(formatCount(12000)).toBe("12,000");
  });

  it("formats the snapshot clock in UTC", () => {
    expect(formatSnapshotTime("2026-03-01T15:04:00.000Z")).toContain("UTC");
    expect(formatSnapshotTime("not-a-date")).toBe("not-a-date");
  });
});
