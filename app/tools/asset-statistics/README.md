# Asset Supply & Trustline Statistics

Looks up one issued Stellar asset and shows the circulating amount, how many accounts hold it, how many claimable balances hold it, and the trustline counts for each authorization state.

## Behavior

The form asks for an asset code and an issuer account ID. Both are checked locally before any request:

- The code must be 1–12 letters or digits. Length 1–4 is `credit_alphanum4`; length 5–12 is `credit_alphanum12`. Casing is preserved because Horizon matches the code exactly.
- The issuer must be a valid `G` account ID (`StrKey.isValidEd25519PublicKey`). Values that start with `S` are rejected as secret seeds, including seeds with a bad checksum, so a seed is never sent to Horizon. Error text is static and does not echo the input.

A valid pair is loaded from Horizon `GET /assets?asset_code={code}&asset_issuer={issuer}` on the network chosen in the header. The page injects that client. Tests pass fixture records through the same function and do not open a socket.

The screen has five states:

- **Idle** — guidance before the first submit.
- **Loading** — the request is in flight.
- **Success** — the asset exists and at least one trustline is present.
- **Empty** — Horizon returned the asset and every trustline counter is zero. This is separate from an invalid issuer and from `asset_not_found`.
- **Error** — validation, a missing asset, HTTP 429, or any other transport or decode failure.

## What the numbers mean

Horizon's asset resource is an aggregate, not a holder list.

- **Accounts holding the asset** is the sum of `accounts.authorized`, `accounts.authorized_to_maintain_liabilities`, and `accounts.unauthorized`.
- **Claimable balances holding the asset** is `num_claimable_balances`. It is shown on its own row.
- **Authorization breakdown** prints those three trustline counters individually, then the total.
- **Circulating amount** is the exact sum of `balances.authorized`, `balances.authorized_to_maintain_liabilities`, `balances.unauthorized`, `claimable_balances_amount`, `liquidity_pools_amount`, and `contracts_amount`.

Amounts stay as decimal strings. Each value is split into a whole part and up to seven decimal digits, converted to integer stroops with `BigInt`, added, and formatted from that integer. `Number` and floating-point multiplication are not used on the amount path.

The banner calls the figures a point-in-time snapshot. Horizon builds them when it answers; the page does not stream updates.

## Data boundaries

- Reads one asset aggregate. It does not list holders or their balances.
- Does not chart supply over time.
- Does not accept, display, store, or transmit secret keys.
- Does not edit shared registries. Homepage listing comes from `manifest.ts` via the generated tool index.

## Design decisions

- Domain functions return `{ ok, result | error }` so validation and Horizon failures share one path.
- The Horizon adapter is behind `AssetLookupClient`. `createHorizonAssetLookup` is the production adapter; tests build a client from fixture JSON.
- A decoded record whose code or issuer does not match the request is `asset_not_found`, not a success for a different asset.
- A record that exists with zero trustlines stays a success outcome internally and becomes the empty view, so the claimable-balance count is still visible.
- User-facing sentences live in `copy.ts`. Components only read that module.
