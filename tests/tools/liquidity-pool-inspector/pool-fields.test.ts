import { describe, expect, it } from "vitest";
import { amountToStroops, normalizePoolFields, normalizeReserve } from "@/app/tools/liquidity-pool-inspector/lib/pool-fields";
import { ToolFailure } from "@/app/tools/liquidity-pool-inspector/lib/liquidityPoolInspector.errors";
import { BALANCED_POOL_ID, balancedPoolRecord, issuer } from "./fixtures/balanced-pool.fixture";

describe("amountToStroops", () => {
  it("converts exact amounts to stroops", () => {
    expect(amountToStroops("1.0000001")).toBe(10_000_001n);
  });

  it("rejects malformed amounts", () => {
    expect(() => amountToStroops("1.00000001")).toThrow(ToolFailure);
    expect(() => amountToStroops("-1")).toThrow(ToolFailure);
  });
});

describe("normalizeReserve", () => {
  it("accepts native and credit reserves", () => {
    expect(normalizeReserve({ asset: "native", amount: "1.0" }).asset).toBe("native");
    expect(normalizeReserve({ asset: `USD:${issuer}`, amount: "2.5" }).amountStroops).toBe(25_000_000n);
  });

  it("rejects missing fields", () => {
    expect(() => normalizeReserve({})).toThrow(ToolFailure);
  });
});

describe("normalizePoolFields", () => {
  it("normalizes a balanced pool record", () => {
    const fields = normalizePoolFields(balancedPoolRecord, BALANCED_POOL_ID);
    expect(fields.feeBp).toBe(30);
    expect(fields.totalShares).toBe("1000.0000000");
    expect(fields.reserves).toHaveLength(2);
    expect(fields.totalSharesStroops).toBe(10_000_000_000n);
  });

  it("rejects id mismatch", () => {
    expect(() => normalizePoolFields(balancedPoolRecord, "b".repeat(64))).toThrow(ToolFailure);
  });

  it("rejects wrong reserve count", () => {
    expect(() =>
      normalizePoolFields({ ...balancedPoolRecord, reserves: [balancedPoolRecord.reserves[0]] }, BALANCED_POOL_ID)
    ).toThrow(ToolFailure);
  });

  it("rejects out-of-range fee", () => {
    expect(() => normalizePoolFields({ ...balancedPoolRecord, fee_bp: 10_001 }, BALANCED_POOL_ID)).toThrow(ToolFailure);
  });
});
