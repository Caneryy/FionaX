import { describe, expect, it } from "vitest";
import {
  formatAsset,
  formatExactAmount,
  formatFeeBp,
  formatImpliedPrice,
  formatPoolId
} from "@/app/tools/liquidity-pool-inspector/lib/format";

describe("formatExactAmount", () => {
  it("pads fractional part to seven digits without Number", () => {
    expect(formatExactAmount("123456789.1")).toBe("123,456,789.1000000");
  });

  it("groups whole digits", () => {
    expect(formatExactAmount("1000.0000000")).toBe("1,000.0000000");
  });
});

describe("formatAsset", () => {
  it("maps native to XLM", () => {
    expect(formatAsset("native")).toBe("XLM");
  });

  it("formats credit assets", () => {
    expect(formatAsset("USD:GABCDEF")).toBe("USD · GABCDEF");
  });
});

describe("formatFeeBp", () => {
  it("appends bp suffix", () => {
    expect(formatFeeBp(30)).toBe("30 bp");
  });
});

describe("formatPoolId", () => {
  it("shortens long ids", () => {
    const id = "a".repeat(64);
    expect(formatPoolId(id)).toBe("aaaaaaaa…aaaaaaaa");
  });
});

describe("formatImpliedPrice", () => {
  it("renders reduced 1:1 price", () => {
    const text = formatImpliedPrice({
      baseAsset: "native",
      quoteAsset: "USD:G",
      numerator: 1n,
      denominator: 1n
    });
    expect(text).toContain("1.0000000");
    expect(text).toContain("(1 stroops)");
  });

  it("renders skewed rationals with BigInt decimal expansion", () => {
    const text = formatImpliedPrice({
      baseAsset: "native",
      quoteAsset: "EUR:G",
      numerator: 5n,
      denominator: 2n
    });
    expect(text).toContain("2.5000000");
    expect(text).toContain("5 / 2");
  });
});
