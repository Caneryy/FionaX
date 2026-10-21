# Transaction Preconditions Explainer

Decodes a pasted transaction envelope's preconditions — time bounds, ledger
bounds, minimum sequence number and age, and required extra signers — and
explains each one in plain language, entirely in your browser.

## How it works

**Data source:** the pasted transaction envelope XDR, decoded locally with
the Stellar SDK; fully offline. No Horizon or RPC request is ever made.

1. `schema.ts` validates the pasted text is well-formed base64 before it
   reaches the decoder, and caps its length so a pasted file cannot lock
   the main thread.
2. `lib/precondition-decode.ts` decodes the envelope (classic v0 — which
   predates CAP-21 and only ever carries time bounds, or none at all — v1,
   or a fee-bump's inner v1 transaction) into its `Preconditions` union.
3. `lib/precondition-explain.ts` translates each decoded field into a
   sentence, rather than only showing the raw numbers.
4. `lib/extra-signers.ts` decodes any required extra signers (`ed25519`,
   `preAuthTx`, `hashX`, or a signed-payload signer) into their `StrKey`
   display form.

## Non-obvious decisions

- **An envelope with no preconditions at all is flagged as explicitly
  unrestricted** rather than silently rendering an empty page — a user who
  pastes a plain transaction should be told plainly that nothing blocks it,
  not left wondering if the tool found nothing to report.
- **A v0 envelope with no time bounds is also unrestricted**, not an error:
  v0 predates CAP-21's extended preconditions, and an absent time bound was
  always a valid, common case for it.
- **`minSeqAge` of `"0"` and `minSeqLedgerGap` of `0` are treated as "not
  set"**, matching the protocol's own meaning for those fields, so a v2
  envelope that only sets, say, ledger bounds doesn't spuriously report a
  zero-second minimum sequence age as a real restriction.

## Safety

This tool never accepts, displays, stores or transmits a secret key, and
never signs or submits anything — it only decodes what was pasted.
