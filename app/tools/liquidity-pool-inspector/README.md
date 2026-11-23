# Liquidity Pool Inspector

Look up a Stellar liquidity pool by ID and show its reserves, total shares outstanding, trading fee, and implied reserve prices.

## Behavior

1. Validate the pool ID client-side (`64` hex characters) before any network call.
2. `GET {horizon}/liquidity_pools/{pool_id}` on the selected network.
3. Normalize reserve assets/amounts, total shares, and `fee_bp`.
4. Compute both implied prices with exact BigInt rationals (reduced by GCD). Prices are labeled as snapshot-derived, not live quotes.

## Data boundaries

- Reads Horizon only. Never submits deposits, withdrawals, or swaps.
- Amounts stay as strings / `BigInt` stroops — never `Number`.
- Secret seeds are rejected at the form and schema layers.
- `404` → `pool_not_found`, `429` → `rate_limited`, other transport/decode failures → `request_failed`.

## Design decisions

- Slice is self-contained under `app/tools/liquidity-pool-inspector/` and `tests/tools/liquidity-pool-inspector/`.
- Horizon access is injected via `PoolFetchClient` so unit tests stay offline with fixtures.
- Implied prices use stroop integers so reserve ratios remain exact after reduction.
