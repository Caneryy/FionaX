import { validateLiquidityPoolInspectorInput } from "../schema";
import type { LiquidityPoolInspectorInput, PoolFetchClient, ToolOutcome } from "../types";
import { toToolError } from "./liquidityPoolInspector.errors";
import { createHorizonPoolFetchClient, fetchPoolById } from "./pool-fetch";
import { impliedPrices } from "./reserve-pricing";

/**
 * Validate input, fetch the pool, normalize fields, and compute implied prices.
 * Expected failures stay in the result; the function does not throw them.
 */
export async function runLiquidityPoolInspector(
  input: LiquidityPoolInspectorInput,
  client: PoolFetchClient = createHorizonPoolFetchClient()
): Promise<ToolOutcome> {
  const parsed = validateLiquidityPoolInspectorInput(input.poolId, input.network);
  if (!parsed.ok) return { ok: false, error: parsed.error };

  try {
    const fields = await fetchPoolById(parsed.input.poolId, parsed.input.network, client);
    const prices = impliedPrices(fields.reserves);
    return {
      ok: true,
      result: {
        poolId: fields.id,
        network: parsed.input.network,
        type: fields.type,
        feeBp: fields.feeBp,
        totalShares: fields.totalShares,
        totalSharesStroops: fields.totalSharesStroops,
        totalTrustlines: fields.totalTrustlines,
        reserves: fields.reserves,
        prices
      }
    };
  } catch (error) {
    return { ok: false, error: toToolError(error) };
  }
}
