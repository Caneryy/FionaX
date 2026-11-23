import { describe, expect, it } from "vitest";
import { capacityUsagePercent } from "@/app/tools/fee-stats/lib/capacity-usage";

describe("capacityUsagePercent", () => {
  it("converts common Horizon ratios without float noise", () => {
    expect(capacityUsagePercent("0")).toBe("0.00");
    expect(capacityUsagePercent("0.05")).toBe("5.00");
    expect(capacityUsagePercent("0.2")).toBe("20.00");
    expect(capacityUsagePercent("0.97")).toBe("97.00");
    expect(capacityUsagePercent("1")).toBe("100.00");
    expect(capacityUsagePercent("1.0")).toBe("100.00");
  });

  it("rejects ratios above 1.0 and malformed strings", () => {
    expect(() => capacityUsagePercent("1.01")).toThrow(RangeError);
    expect(() => capacityUsagePercent("2")).toThrow(RangeError);
    expect(() => capacityUsagePercent("-0.1")).toThrow(RangeError);
    expect(() => capacityUsagePercent("full")).toThrow(RangeError);
  });
});
