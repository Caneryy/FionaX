# Account Reserve Calculator

Calculates an account's minimum XLM base reserve from its current subentry
count and flags, and shows how much is available above that reserve.

## How it works

**Data source:** Horizon `GET /accounts/{account_id}`, plus the latest
ledger (`GET /ledgers?order=desc&limit=1`) for the network's current base
reserve amount.

1. `schema.ts` validates the account ID, rejecting anything that looks like
   a secret key on sight, before any request.
2. `lib/subentry-count.ts` breaks Horizon's single `subentry_count` total
   down into trustlines, offers, data entries and extra signers.
3. `lib/reserve-formula.ts` applies the protocol's base reserve formula,
   including the CAP-33 sponsorship adjustment.
4. `lib/spendable-balance.ts` subtracts selling liabilities from the
   available balance to show what is actually spendable.

## Non-obvious decisions

- **The base reserve is read live from the latest ledger, not hardcoded.**
  It is a network-wide ledger parameter that can change between protocol
  versions; reading it from the same request context this tool already
  makes keeps the result correct if it ever does.
- **The offer count is derived, not fetched separately.** Horizon's account
  resource does not include offers, and a second `/accounts/{id}/offers`
  call would need pagination to be exact for a very active account. Since
  `subentry_count` is the authoritative total across all four subentry
  types, this tool counts trustlines, data entries and extra signers
  directly from the account response and derives the offer count as the
  remainder — exact, and still just one request.
- **This project has no HTTP-mocking library installed.** `lib/reserveCalculator.ts`
  takes its Horizon calls as an injectable `deps` parameter instead, so
  tests pass fixture-returning functions directly rather than mocking a
  network layer.

## Safety

This tool never accepts, displays, stores or transmits a secret key. The
account ID field rejects any value starting with `S` on sight, before any
request is built.
