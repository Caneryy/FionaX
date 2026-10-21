# Result Code Explainer

Looks up a Horizon or protocol result code — transaction-level or
operation-level — and explains what it means and its most common causes,
without claiming to diagnose a specific failed transaction. Fully offline:
the lookup table is local and local only.

## How it works

**Data source:** a local lookup table of documented Stellar result codes
(`lib/result-code-table.ts`); fully offline.

1. `lib/code-lookup.ts` finds every table row matching a code,
   case-insensitively.
2. `lib/operation-disambiguation.ts` resolves which row applies: if the code
   is unique, it's used directly; if several operation types share the same
   code with different meanings, the caller's declared operation type picks
   the right one, or the tool reports exactly which operation types the code
   could mean rather than guessing.
3. The table stays data-driven on purpose — adding a new code is a new row
   in `lib/result-code-table.ts`, never a UI change.

## Non-obvious decisions

- **An unrecognized code is distinguished from a recognized one.** This
  tool never invents a plausible-sounding explanation for a code it does
  not have a row for — it says plainly that the code is not in its table.
- **The table is not exhaustive.** It covers every transaction-level result
  code and the shared operation-level envelope codes, plus the
  operation-specific codes for `payment`, `create_account`, `change_trust`
  and `manage_sell_offer` — enough operation types to genuinely demonstrate
  the disambiguation this tool exists for (`malformed`, `underfunded`,
  `low_reserve`, `no_issuer` and `line_full` each mean something different
  depending on the operation type). Extending it to every operation type is
  a future, additive change — the architecture already supports it.

## Safety

This tool never accepts, displays, stores or transmits a secret key, and
never makes a network request — it only looks a code up in a local table.
