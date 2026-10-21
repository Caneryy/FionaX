/**
 * Subtracts liabilities from available balance. `availableBalance` is what
 * remains once the minimum reserve is covered; `spendableBalance` further
 * subtracts XLM already committed to open sell offers (`selling_liabilities`),
 * since that XLM cannot be spent again without first canceling those offers.
 */
const ZERO = BigInt(0);

export function availableBalance(balanceStroops: bigint, minBalanceStroops: bigint): bigint {
  const available = balanceStroops - minBalanceStroops;
  return available > ZERO ? available : ZERO;
}

export function spendableBalance(availableBalanceStroops: bigint, sellingLiabilitiesStroops: bigint): bigint {
  const spendable = availableBalanceStroops - sellingLiabilitiesStroops;
  return spendable > ZERO ? spendable : ZERO;
}
