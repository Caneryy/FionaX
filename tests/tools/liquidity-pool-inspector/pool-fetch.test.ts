import { describe, expect, it } from "vitest";
import { fetchPoolById } from "@/app/tools/liquidity-pool-inspector/lib/pool-fetch";
import { ToolFailure } from "@/app/tools/liquidity-pool-inspector/lib/liquidityPoolInspector.errors";
import type { PoolFetchClient } from "@/app/tools/liquidity-pool-inspector/types";
import { BALANCED_POOL_ID, balancedPoolResponse } from "./fixtures/balanced-pool.fixture";
import {
  MISSING_POOL_ID,
  missingPoolResponse,
  rateLimitedPoolResponse,
  serverErrorPoolResponse
} from "./fixtures/missing-pool.fixture";
import { SKEWED_POOL_ID, skewedPoolResponse } from "./fixtures/skewed-pool.fixture";

function clientFor(response: Response): PoolFetchClient {
  return { fetchPool: async () => response };
}

describe("fetchPoolById", () => {
  it("returns normalized fields for a balanced pool", async () => {
    const fields = await fetchPoolById(BALANCED_POOL_ID, "testnet", clientFor(balancedPoolResponse()));
    expect(fields.id).toBe(BALANCED_POOL_ID);
    expect(fields.feeBp).toBe(30);
    expect(fields.reserves[0].asset).toBe("native");
  });

  it("returns normalized fields for a skewed pool", async () => {
    const fields = await fetchPoolById(SKEWED_POOL_ID, "mainnet", clientFor(skewedPoolResponse()));
    expect(fields.feeBp).toBe(10);
    expect(fields.totalShares).toBe("250.5000000");
  });

  it("maps 404 to pool_not_found", async () => {
    await expect(fetchPoolById(MISSING_POOL_ID, "testnet", clientFor(missingPoolResponse()))).rejects.toMatchObject({
      code: "pool_not_found"
    });
  });

  it("maps 429 to rate_limited", async () => {
    await expect(fetchPoolById(BALANCED_POOL_ID, "testnet", clientFor(rateLimitedPoolResponse()))).rejects.toMatchObject({
      code: "rate_limited"
    });
  });

  it("maps other HTTP failures to request_failed", async () => {
    await expect(fetchPoolById(BALANCED_POOL_ID, "testnet", clientFor(serverErrorPoolResponse()))).rejects.toBeInstanceOf(
      ToolFailure
    );
    await expect(fetchPoolById(BALANCED_POOL_ID, "testnet", clientFor(serverErrorPoolResponse()))).rejects.toMatchObject({
      code: "request_failed"
    });
  });
});
