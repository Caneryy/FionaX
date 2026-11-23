import { describe, expect, it } from "vitest";
import { runLiquidityPoolInspector } from "@/app/tools/liquidity-pool-inspector/lib/liquidityPoolInspector";
import { copy } from "@/app/tools/liquidity-pool-inspector/copy";
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

describe("runLiquidityPoolInspector", () => {
  it("returns reserves, shares, fee, and 1:1 prices for a balanced pool", async () => {
    const outcome = await runLiquidityPoolInspector(
      { poolId: BALANCED_POOL_ID, network: "testnet" },
      clientFor(balancedPoolResponse())
    );
    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;
    expect(outcome.result.feeBp).toBe(30);
    expect(outcome.result.totalShares).toBe("1000.0000000");
    expect(outcome.result.reserves[0].amount).toBe("500.0000000");
    expect(outcome.result.reserves[1].amount).toBe("500.0000000");
    expect(outcome.result.prices[0].numerator).toBe(1n);
    expect(outcome.result.prices[0].denominator).toBe(1n);
    expect(outcome.result.prices[1].numerator).toBe(1n);
    expect(outcome.result.prices[1].denominator).toBe(1n);
  });

  it("computes skewed implied prices with exact rationals", async () => {
    const outcome = await runLiquidityPoolInspector(
      { poolId: SKEWED_POOL_ID, network: "mainnet" },
      clientFor(skewedPoolResponse())
    );
    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;
    expect(outcome.result.feeBp).toBe(10);
    // native→EUR = 250/100 = 5/2
    expect(outcome.result.prices[0]).toMatchObject({ numerator: 5n, denominator: 2n });
    // EUR→native = 100/250 = 2/5
    expect(outcome.result.prices[1]).toMatchObject({ numerator: 2n, denominator: 5n });
  });

  it("returns invalid_pool_id without calling the client", async () => {
    let called = false;
    const client: PoolFetchClient = {
      fetchPool: async () => {
        called = true;
        return balancedPoolResponse();
      }
    };
    const outcome = await runLiquidityPoolInspector({ poolId: "not-a-pool", network: "testnet" }, client);
    expect(called).toBe(false);
    expect(outcome.ok).toBe(false);
    if (!outcome.ok) {
      expect(outcome.error.code).toBe("invalid_pool_id");
      expect(copy.errors.invalid_pool_id.length).toBeGreaterThan(10);
    }
  });

  it("maps missing pool to pool_not_found with actionable copy", async () => {
    const outcome = await runLiquidityPoolInspector(
      { poolId: MISSING_POOL_ID, network: "testnet" },
      clientFor(missingPoolResponse())
    );
    expect(outcome.ok).toBe(false);
    if (!outcome.ok) {
      expect(outcome.error.code).toBe("pool_not_found");
      expect(copy.errors.pool_not_found).toMatch(/network/i);
    }
  });

  it("maps rate limiting", async () => {
    const outcome = await runLiquidityPoolInspector(
      { poolId: BALANCED_POOL_ID, network: "testnet" },
      clientFor(rateLimitedPoolResponse())
    );
    expect(outcome.ok).toBe(false);
    if (!outcome.ok) {
      expect(outcome.error.code).toBe("rate_limited");
      expect(copy.errors.rate_limited.length).toBeGreaterThan(10);
    }
  });

  it("maps transport failures", async () => {
    const outcome = await runLiquidityPoolInspector(
      { poolId: BALANCED_POOL_ID, network: "testnet" },
      clientFor(serverErrorPoolResponse())
    );
    expect(outcome.ok).toBe(false);
    if (!outcome.ok) {
      expect(outcome.error.code).toBe("request_failed");
      expect(copy.errors.request_failed.length).toBeGreaterThan(10);
    }
  });

  it("maps thrown network errors to request_failed", async () => {
    const client: PoolFetchClient = {
      fetchPool: async () => {
        throw new Error("offline");
      }
    };
    const outcome = await runLiquidityPoolInspector({ poolId: BALANCED_POOL_ID, network: "testnet" }, client);
    expect(outcome.ok).toBe(false);
    if (!outcome.ok) expect(outcome.error.code).toBe("request_failed");
  });
});
