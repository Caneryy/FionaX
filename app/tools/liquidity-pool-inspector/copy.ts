export const copy = {
  title: "Liquidity Pool Inspector",
  description: "Look up a liquidity pool by ID and inspect reserves, shares, and trading fee.",
  character: "A market scribe reads one pool's reserves without building a swap.",
  manifestCharacter: "A market scribe reveals pool reserves, shares, and fee.",
  eyebrow: "Pool state",
  intro: "Enter a 64-character liquidity pool ID to inspect reserves, total shares, and fee on the selected network.",
  poolIdLabel: "Liquidity pool ID",
  poolIdPlaceholder: "64 hex characters",
  submit: "Inspect pool",
  loading: "Loading liquidity pool…",
  errorTitle: "Could not inspect pool",
  idle: "Enter a pool ID to see its reserves, total shares, trading fee, and implied prices.",
  emptyTitle: "Waiting for a pool ID",
  empty: "Paste a Horizon liquidity pool ID. This tool only reads pool state — it never submits deposits, withdrawals, or swaps.",
  resultTitle: "Liquidity pool",
  poolId: "Pool ID",
  poolType: "Pool type",
  totalShares: "Total shares outstanding",
  totalTrustlines: "Trustlines",
  reservesTitle: "Reserves",
  reserveAsset: "Asset",
  reserveAmount: "Pooled amount",
  feeTitle: "Trading fee",
  feeBody: (bp: number) => `${bp} basis points (${formatFeePercent(bp)})`,
  feeHint: "Fee charged on trades that route through this constant-product pool.",
  pricesTitle: "Implied prices",
  pricesHint:
    "Derived from this pool's reserve snapshot only — not a live market quote. Ratios use exact integer arithmetic.",
  priceOf: (base: string, quote: string) => `1 ${base} ≈`,
  priceIn: (quote: string) => quote,
  snapshotLabel: "Snapshot-derived",
  notFoundTitle: "Pool not found",
  notFoundBody:
    "Horizon has no liquidity pool with that ID on this network. Confirm the ID and network, then try again.",
  errors: {
    invalid_pool_id:
      "Enter a valid liquidity pool ID: exactly 64 hexadecimal characters (0-9, a-f). Secret keys are never accepted.",
    pool_not_found:
      "No liquidity pool exists for that ID on the selected network. Double-check the ID and try another network if needed.",
    rate_limited: "Horizon is rate limiting requests. Wait a moment and try again.",
    request_failed: "Could not load or decode the liquidity pool from Horizon. Check the network and try again."
  }
} as const;

function formatFeePercent(bp: number): string {
  const whole = Math.floor(bp / 100);
  const frac = bp % 100;
  if (frac === 0) return `${whole}%`;
  const padded = String(frac).padStart(2, "0").replace(/0+$/, "");
  return `${whole}.${padded}%`;
}
