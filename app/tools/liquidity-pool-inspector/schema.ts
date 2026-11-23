import type { StellarNetwork } from "@/lib/stellar/horizon";
import type { LiquidityPoolInspectorError, LiquidityPoolInspectorInput } from "./types";

/** Liquidity pool IDs are 64-character lowercase hex digests. */
const POOL_ID = /^[0-9a-f]{64}$/;

export function validateLiquidityPoolInspectorInput(
  rawPoolId: string,
  network: StellarNetwork = "testnet"
): { ok: true; input: LiquidityPoolInspectorInput } | { ok: false; error: LiquidityPoolInspectorError } {
  const poolId = rawPoolId.trim().toLowerCase();
  if (!POOL_ID.test(poolId)) {
    return { ok: false, error: { code: "invalid_pool_id" } };
  }
  return { ok: true, input: { poolId, network } };
}
