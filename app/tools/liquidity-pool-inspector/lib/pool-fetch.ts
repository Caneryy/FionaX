import { horizonUrls, type StellarNetwork } from "@/lib/stellar/horizon";
import type { PoolFetchClient } from "../types";
import { ToolFailure, statusToToolError } from "./liquidityPoolInspector.errors";
import { normalizePoolFields, type NormalizedPoolFields } from "./pool-fields";

export function createHorizonPoolFetchClient(fetchImpl: typeof fetch = fetch): PoolFetchClient {
  return {
    async fetchPool(poolId, network) {
      const url = `${horizonUrls[network]}/liquidity_pools/${poolId}`;
      try {
        return await fetchImpl(url, { cache: "no-store" });
      } catch {
        throw new ToolFailure("request_failed");
      }
    }
  };
}

/**
 * Fetch a single liquidity pool by ID and normalize its fields.
 * Maps 404 → pool_not_found and 429 → rate_limited.
 */
export async function fetchPoolById(
  poolId: string,
  network: StellarNetwork,
  client: PoolFetchClient
): Promise<NormalizedPoolFields> {
  const response = await client.fetchPool(poolId, network);
  if (!response.ok) {
    const mapped = statusToToolError(response.status);
    throw new ToolFailure(mapped.code);
  }
  let body: unknown;
  try {
    body = await response.json();
  } catch {
    throw new ToolFailure("request_failed");
  }
  return normalizePoolFields(body, poolId);
}
