import { describe, expect, it } from "vitest";
import { formatAmount, formatAsset, formatUtc } from "@/app/tools/claimable-balances/lib/format";
import { issuer } from "./fixtures/unconditional-balance.fixture";

describe("exact presentation", () => {
  it("keeps all amount digits and trailing zeroes", () => expect(formatAmount("123456789.0000001")).toBe("123456789.0000001"));
  it("labels native and issued assets", () => {
    expect(formatAsset("native")).toBe("XLM");
    expect(formatAsset(`USD:${issuer}`)).toBe(`USD · ${issuer}`);
  });
  it("renders UTC times", () => expect(formatUtc("2030-01-01T00:00:00Z")).toBe("2030-01-01T00:00:00 UTC"));
});
