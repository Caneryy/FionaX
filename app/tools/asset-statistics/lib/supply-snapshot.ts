import { normalizeAmount, sumAmounts } from "@/app/tools/asset-statistics/lib/amount";
import type { HorizonAssetAggregate, SupplySnapshot } from "@/app/tools/asset-statistics/types";

/**
 * Circulating supply is every outstanding bucket Horizon reports:
 * authorized, authorized-to-maintain-liabilities, unauthorized, claimable balances,
 * liquidity pools, and contracts. Each term is an exact decimal string.
 */
export function buildSupplySnapshot(
  aggregate: Pick<
    HorizonAssetAggregate,
    "balances" | "claimableBalancesAmount" | "liquidityPoolsAmount" | "contractsAmount"
  >
): SupplySnapshot | null {
  const authorized = normalizeAmount(aggregate.balances.authorized);
  const authorizedToMaintainLiabilities = normalizeAmount(aggregate.balances.authorizedToMaintainLiabilities);
  const unauthorized = normalizeAmount(aggregate.balances.unauthorized);
  const claimableBalances = normalizeAmount(aggregate.claimableBalancesAmount);
  const liquidityPools = normalizeAmount(aggregate.liquidityPoolsAmount);
  const contracts = normalizeAmount(aggregate.contractsAmount);

  if (
    !authorized ||
    !authorizedToMaintainLiabilities ||
    !unauthorized ||
    !claimableBalances ||
    !liquidityPools ||
    !contracts
  ) {
    return null;
  }

  const circulating = sumAmounts([
    authorized,
    authorizedToMaintainLiabilities,
    unauthorized,
    claimableBalances,
    liquidityPools,
    contracts
  ]);
  if (!circulating) return null;

  return {
    authorized,
    authorizedToMaintainLiabilities,
    unauthorized,
    claimableBalances,
    liquidityPools,
    contracts,
    circulating
  };
}
