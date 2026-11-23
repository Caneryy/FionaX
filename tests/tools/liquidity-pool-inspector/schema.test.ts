import { describe, expect, it } from "vitest";
import { validateLiquidityPoolInspectorInput } from "@/app/tools/liquidity-pool-inspector/schema";
import { BALANCED_POOL_ID } from "./fixtures/balanced-pool.fixture";

describe("validateLiquidityPoolInspectorInput", () => {
  it("rejects empty input", () => {
    const result = validateLiquidityPoolInspectorInput("  ");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("invalid_pool_id");
  });

  it("rejects short hex", () => {
    const result = validateLiquidityPoolInspectorInput("abc123");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("invalid_pool_id");
  });

  it("rejects non-hex characters", () => {
    const result = validateLiquidityPoolInspectorInput("g".repeat(64));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("invalid_pool_id");
  });

  it("rejects 63 and 65 character ids", () => {
    expect(validateLiquidityPoolInspectorInput("a".repeat(63)).ok).toBe(false);
    expect(validateLiquidityPoolInspectorInput("a".repeat(65)).ok).toBe(false);
  });

  it("accepts a trimmed lowercase pool id", () => {
    const result = validateLiquidityPoolInspectorInput(`  ${BALANCED_POOL_ID}  `, "mainnet");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.input.poolId).toBe(BALANCED_POOL_ID);
      expect(result.input.network).toBe("mainnet");
    }
  });

  it("normalizes uppercase hex to lowercase", () => {
    const result = validateLiquidityPoolInspectorInput(BALANCED_POOL_ID.toUpperCase());
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.input.poolId).toBe(BALANCED_POOL_ID);
  });
});
