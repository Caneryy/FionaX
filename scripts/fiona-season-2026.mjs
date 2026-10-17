/**
 * Drips 2026 season: twenty independent, unimplemented RevyHubX tools.
 *
 * Each entry adds three domain modules, four domain views and three fixtures
 * on top of the standard tool scaffold (see docs/TOOL_CONTRACT.md). Every
 * tool lives entirely inside app/tools/<slug>/ and tests/tools/<slug>/, so no
 * two season issues can ever touch the same file.
 */
export const fionaSeason2026 = [
  {
    slug: "account-data-entries",
    title: "Account Data Entries Viewer",
    category: "accounts",
    summary: "List an account's manage-data entries and decode each value from base64, showing both the raw and decoded text so a developer can inspect on-chain data entries without guessing encoding.",
    source: "Horizon GET /accounts/{account_id}.",
    criteria: [
      "Validate the account ID and reject secret seeds before fetching.",
      "Decode every data entry's base64 value and show it alongside the raw base64 string.",
      "Flag values that are not valid UTF-8 text as binary instead of showing corrupted text.",
      "Show the entry name byte length and flag names near the 64-byte protocol limit.",
      "Handle an account with zero data entries as an explicit empty state, distinct from an account-not-found error."
    ],
    codes: ["invalid_account", "account_not_found", "malformed_data_entry", "rate_limited", "request_failed"],
    notes: "A data entry's value is raw bytes, not guaranteed text; never assume UTF-8 without checking, and never treat invalid UTF-8 as an error state.",
    outOfScope: ["No manage-data operation creation or submission.", "No data entry value editing."],
    reference: "app/tools/balance-viewer",
    modules: [
      ["lib/data-entries.ts", "Fetch the account and extract its data entries."],
      ["lib/base64-decode.ts", "Safely decode base64 values with a UTF-8 validity check."],
      ["lib/entry-limits.ts", "Flag entry names approaching the byte-length limit."]
    ],
    views: [
      ["components/DataEntryRows.tsx", "Show each decoded data entry."],
      ["components/BinaryValueNotice.tsx", "Flag non-UTF-8 values as binary."],
      ["components/EmptyEntriesState.tsx", "Show the zero-entries empty state."],
      ["components/EntryLimitWarning.tsx", "Warn about near-limit entry names."]
    ],
    fixtures: ["fixtures/text-entries.fixture.ts", "fixtures/binary-entry.fixture.ts", "fixtures/empty-entries.fixture.ts"]
  },
  {
    slug: "account-merge-preflight",
    title: "Account Merge Preflight Check",
    category: "accounts",
    summary: "Check whether a source account looks eligible for an account_merge into a destination account before a user builds that transaction, surfacing blockers like existing trustlines, offers, data entries, signers, or sponsorships.",
    source: "Horizon GET /accounts/{account_id} and GET /accounts/{account_id}/offers for the source account.",
    criteria: [
      "Validate both source and destination account IDs and reject secret seeds.",
      "Report every known blocker type separately: open trustlines, active offers, data entries, non-master signers, and any sponsoring relationship.",
      "Treat a destination account that does not yet exist as a separate blocker from a validation error.",
      "Show the source account's native balance that would transfer if the merge succeeded.",
      "Explain that this is a preflight check, not a guarantee, since account state can change before submission."
    ],
    codes: ["invalid_account", "source_not_found", "destination_not_found", "same_account", "rate_limited", "request_failed"],
    notes: "account_merge fails if the source has any trustline, offer, data entry, or non-master signer; check every blocker type rather than stopping at the first one found.",
    outOfScope: ["No account_merge operation creation or submission.", "No destination account creation."],
    reference: "app/tools/trustline-checker",
    modules: [
      ["lib/merge-blockers.ts", "Collect every known account_merge blocker."],
      ["lib/source-snapshot.ts", "Fetch the source account and its offers."],
      ["lib/destination-check.ts", "Validate the destination account separately."]
    ],
    views: [
      ["components/BlockerRows.tsx", "List each blocker found."],
      ["components/MergeableSummary.tsx", "Show the transferable native balance."],
      ["components/DestinationNotice.tsx", "Explain a missing destination account."],
      ["components/PreflightDisclaimer.tsx", "Explain the preflight-only scope."]
    ],
    fixtures: ["fixtures/blocked-source.fixture.ts", "fixtures/eligible-source.fixture.ts", "fixtures/missing-destination.fixture.ts"]
  },
  {
    slug: "account-signers",
    title: "Account Signers & Thresholds",
    category: "accounts",
    summary: "Show an account's current signers, their weights, and the account's low/medium/high thresholds together, so a developer can see at a glance what combination of signatures satisfies each threshold.",
    source: "Horizon GET /accounts/{account_id}.",
    criteria: [
      "Validate the account ID and reject secret seeds before fetching.",
      "List every signer (including the master key) with its type, key and weight.",
      "Show low, medium and high thresholds alongside the signer list.",
      "Flag a master key weight of zero as a distinct configuration state, not an error.",
      "Handle sha256 hash and pre-authorized transaction signer types without treating them as invalid addresses."
    ],
    codes: ["invalid_account", "account_not_found", "malformed_signer", "rate_limited", "request_failed"],
    notes: "Signers can be ed25519 public keys, sha256 hashes, or pre-authorized transaction hashes; render each type distinctly instead of forcing every signer through address validation.",
    outOfScope: ["No signer addition, removal or weight change submission.", "No multisig transaction building."],
    reference: "app/tools/balance-viewer",
    modules: [
      ["lib/signer-list.ts", "Fetch and normalize the account's signers."],
      ["lib/threshold-fields.ts", "Extract low, medium and high thresholds."],
      ["lib/signer-type.ts", "Classify each signer's key type."]
    ],
    views: [
      ["components/SignerRows.tsx", "Show each signer and its weight."],
      ["components/ThresholdSummary.tsx", "Show the three threshold levels."],
      ["components/MasterKeyNotice.tsx", "Flag a zero-weight master key."],
      ["components/SignerTypeBadge.tsx", "Label each signer's key type."]
    ],
    fixtures: ["fixtures/mixed-signers.fixture.ts", "fixtures/zero-weight-master.fixture.ts", "fixtures/single-signer.fixture.ts"]
  },
  {
    slug: "amount-converter",
    title: "Stroop & Decimal Amount Converter",
    category: "developer",
    summary: "Convert a Stellar amount between its human-readable decimal form and raw stroop integer form in both directions, using exact integer arithmetic so no value is ever rounded.",
    source: "Local arithmetic only; fully offline.",
    offline: true,
    criteria: [
      "Accept a decimal amount up to 7 fraction digits and convert it to an exact stroop integer.",
      "Accept a stroop integer and convert it to an exact decimal amount.",
      "Reject amounts with more than 7 fraction digits or outside the protocol's representable range.",
      "Reject non-numeric, empty, and negative inputs with specific messages.",
      "Keep both conversion directions in sync so editing either field updates the other without drift."
    ],
    codes: ["empty_amount", "invalid_amount", "too_many_decimals", "out_of_range", "negative_amount"],
    notes: "Stellar amounts have exactly 7 fraction digits of precision; use BigInt for the stroop form and string-based decimal arithmetic, never a JavaScript float.",
    outOfScope: ["No currency or fiat conversion.", "No transaction building or submission."],
    reference: "app/tools/address-validator",
    modules: [
      ["lib/decimal-to-stroop.ts", "Convert a decimal amount to an exact stroop BigInt."],
      ["lib/stroop-to-decimal.ts", "Convert a stroop BigInt to a decimal string."],
      ["lib/amount-bounds.ts", "Validate precision and representable range."]
    ],
    views: [
      ["components/DecimalInput.tsx", "Accept a decimal amount."],
      ["components/StroopInput.tsx", "Accept a stroop integer."],
      ["components/ConversionNotice.tsx", "Explain the active conversion direction."],
      ["components/RangeWarning.tsx", "Warn about out-of-range input."]
    ],
    fixtures: ["fixtures/valid-amounts.fixture.ts", "fixtures/boundary-amounts.fixture.ts", "fixtures/invalid-amounts.fixture.ts"]
  },
  {
    slug: "asset-flags-inspector",
    title: "Asset Issuer Flags Inspector",
    category: "assets",
    summary: "Look up an asset issuer's account and show the authorization and clawback flags that govern how that issuer's assets behave, in plain language.",
    source: "Horizon GET /accounts/{issuer_account_id}.",
    criteria: [
      "Validate the issuer account ID and reject secret seeds before fetching.",
      "Show auth_required, auth_revocable, auth_immutable and auth_clawback_enabled as individual, explained flags.",
      "Explain what each flag combination means for a holder of that issuer's assets in plain language.",
      "Distinguish an issuer account that does not exist from one with every flag unset.",
      "Show the raw flag bitmask alongside the decoded flags for developers who want to verify it."
    ],
    codes: ["invalid_account", "account_not_found", "rate_limited", "request_failed"],
    notes: "auth_immutable means the other flags can never change again; call that out distinctly from the other three, which remain adjustable.",
    outOfScope: ["No set_options operation creation or submission.", "No trustline authorization status for a specific holder."],
    reference: "app/tools/trustline-checker",
    modules: [
      ["lib/issuer-flags.ts", "Fetch the issuer account and extract its flags."],
      ["lib/flag-explanations.ts", "Map flag combinations to plain-language copy."],
      ["lib/flag-bitmask.ts", "Compute the raw flag bitmask."]
    ],
    views: [
      ["components/FlagRows.tsx", "Show each flag and its state."],
      ["components/FlagExplanation.tsx", "Explain the flag combination."],
      ["components/ImmutableNotice.tsx", "Call out an immutable issuer."],
      ["components/RawBitmask.tsx", "Show the raw bitmask value."]
    ],
    fixtures: ["fixtures/all-flags-set.fixture.ts", "fixtures/no-flags-set.fixture.ts", "fixtures/immutable-issuer.fixture.ts"]
  },
  {
    slug: "asset-metadata",
    title: "Asset stellar.toml Metadata Viewer",
    category: "assets",
    summary: "Fetch an issuer's stellar.toml file and show the CURRENCIES entry matching one asset code, including its name, description, image and conditions fields, without treating unsigned metadata as verified.",
    source: "GET https://{home_domain}/.well-known/stellar.toml for the issuer's home_domain reported by Horizon GET /accounts/{issuer_account_id}.",
    criteria: [
      "Validate the issuer account ID and asset code before fetching the account.",
      "Fetch the issuer's home_domain and parse its stellar.toml for the matching CURRENCIES entry.",
      "Show every present metadata field and explicitly mark fields that are absent rather than omitting them silently.",
      "Handle an issuer with no home_domain as a distinct outcome from a home_domain whose stellar.toml is unreachable.",
      "Label all displayed metadata as self-published by the issuer and not independently verified."
    ],
    codes: ["invalid_account", "account_not_found", "missing_home_domain", "toml_unreachable", "currency_not_found", "malformed_toml"],
    notes: "stellar.toml is published by the issuer with no on-chain verification; never present its contents as attested fact.",
    outOfScope: ["No TOML signature or domain ownership verification.", "No SEP-1 field beyond the matching CURRENCIES entry."],
    reference: "app/tools/trustline-checker",
    modules: [
      ["lib/home-domain.ts", "Resolve the issuer's home_domain."],
      ["lib/toml-fetch.ts", "Fetch and parse stellar.toml."],
      ["lib/currency-match.ts", "Match the requested asset code to a CURRENCIES entry."]
    ],
    views: [
      ["components/MetadataFields.tsx", "Show the matched currency's fields."],
      ["components/MissingFieldNotice.tsx", "Mark absent fields explicitly."],
      ["components/UnverifiedBadge.tsx", "Label metadata as self-published."],
      ["components/TomlErrorState.tsx", "Show an unreachable or malformed toml."]
    ],
    fixtures: ["fixtures/full-currency.fixture.ts", "fixtures/partial-currency.fixture.ts", "fixtures/missing-domain.fixture.ts"]
  },
  {
    slug: "asset-statistics",
    title: "Asset Supply & Trustline Statistics",
    category: "assets",
    summary: "Show an asset's circulating supply, number of trustlines and authorization breakdown for one issued asset using Horizon's assets endpoint.",
    source: "Horizon GET /assets?asset_code={code}&asset_issuer={issuer}.",
    criteria: [
      "Validate the asset code and issuer account ID before fetching.",
      "Show the number of accounts and the number of claimable balances holding the asset separately.",
      "Show authorized, authorized-to-maintain-liabilities and unauthorized trustline counts individually.",
      "Show the exact circulating amount without floating-point arithmetic.",
      "Handle an asset with zero trustlines as an explicit empty state, distinct from an invalid issuer."
    ],
    codes: ["invalid_asset_code", "invalid_issuer", "asset_not_found", "rate_limited", "request_failed"],
    notes: "Horizon's assets endpoint aggregates ledger state at response time; label the numbers as a snapshot, not a live feed.",
    outOfScope: ["No historical supply chart.", "No per-holder balance breakdown."],
    reference: "app/tools/balance-viewer",
    modules: [
      ["lib/asset-lookup.ts", "Fetch the asset's aggregate record."],
      ["lib/trustline-breakdown.ts", "Split trustline counts by authorization state."],
      ["lib/supply-snapshot.ts", "Extract the exact circulating amount."]
    ],
    views: [
      ["components/SupplySummary.tsx", "Show circulating supply and holder counts."],
      ["components/AuthorizationBreakdown.tsx", "Show trustline authorization counts."],
      ["components/EmptyAssetState.tsx", "Show the zero-trustline empty state."],
      ["components/SnapshotNotice.tsx", "Label the data as a point-in-time snapshot."]
    ],
    fixtures: ["fixtures/active-asset.fixture.ts", "fixtures/zero-trustline-asset.fixture.ts", "fixtures/mixed-authorization.fixture.ts"]
  },
  {
    slug: "batch-address-validator",
    title: "Batch Address Validator",
    category: "developer",
    summary: "Validate a pasted list of Stellar public addresses at once and report which entries are valid, invalid, or duplicated, without ever accepting a secret seed.",
    source: "Local validation only using Stellar SDK StrKey checks; fully offline.",
    offline: true,
    criteria: [
      "Parse a newline or comma-separated list and validate each entry independently.",
      "Reject any entry that looks like a secret seed outright, even inside a larger batch.",
      "Report duplicate valid addresses as a separate category from invalid ones.",
      "Preserve input order in the results so a user can map a result back to its original line.",
      "Handle an empty or whitespace-only batch as a distinct empty state."
    ],
    codes: ["empty_batch", "too_many_entries", "contains_secret_seed", "invalid_address", "duplicate_address"],
    notes: "Never log, store, or echo back anything that matches a secret seed shape beyond a generic rejection message.",
    outOfScope: ["No network lookup of whether an address exists on-chain.", "No CSV file upload."],
    reference: "app/tools/address-validator",
    modules: [
      ["lib/batch-parse.ts", "Split and normalize the pasted batch."],
      ["lib/duplicate-detect.ts", "Flag duplicate valid addresses."],
      ["lib/secret-seed-guard.ts", "Reject entries shaped like a secret seed."]
    ],
    views: [
      ["components/ResultRows.tsx", "Show the per-entry validation result."],
      ["components/DuplicateNotice.tsx", "Flag duplicate addresses."],
      ["components/SecretSeedWarning.tsx", "Warn about rejected secret seeds."],
      ["components/BatchSummary.tsx", "Summarize valid, invalid and duplicate counts."]
    ],
    fixtures: ["fixtures/mixed-batch.fixture.ts", "fixtures/duplicate-batch.fixture.ts", "fixtures/secret-seed-batch.fixture.ts"]
  },
  {
    slug: "claimable-balances",
    title: "Claimable Balances Viewer",
    category: "assets",
    summary: "List the claimable balances currently available to one claimant address, showing the asset, amount and claim predicate for each.",
    source: "Horizon GET /claimable_balances?claimant={account_id}.",
    criteria: [
      "Validate the claimant account ID and reject secret seeds before fetching.",
      "Show asset, exact amount and sponsor for every fetched claimable balance.",
      "Render the claim predicate structure (unconditional, time-based, and/or/not) in readable form.",
      "Show the number of pages fetched and label the result as a bounded sample.",
      "Handle a claimant with zero claimable balances as an explicit empty state."
    ],
    codes: ["invalid_claimant", "invalid_cursor", "malformed_predicate", "rate_limited", "request_failed"],
    notes: "A predicate tree can nest several conditions; render the full tree rather than collapsing it to a single guess.",
    outOfScope: ["No claim operation creation or submission.", "No claimable balance creation."],
    reference: "app/tools/balance-viewer",
    modules: [
      ["lib/claimant-fetch.ts", "Fetch bounded claimable-balance pages for one claimant."],
      ["lib/predicate-render.ts", "Render a predicate tree in readable form."],
      ["lib/balance-pages.ts", "Merge bounded pages by paging token."]
    ],
    views: [
      ["components/BalanceRows.tsx", "Show each claimable balance."],
      ["components/PredicateTree.tsx", "Render the nested predicate structure."],
      ["components/EmptyClaimantState.tsx", "Show the zero-balance empty state."],
      ["components/PageCoverageNotice.tsx", "Show the bounded-sample coverage note."]
    ],
    fixtures: ["fixtures/unconditional-balance.fixture.ts", "fixtures/time-predicate.fixture.ts", "fixtures/nested-predicate.fixture.ts"]
  },
  {
    slug: "effects-timeline",
    title: "Account Effects Timeline",
    category: "accounts",
    summary: "Show a chronological feed of one account's recent ledger effects with a human-readable description for each effect type.",
    source: "Horizon GET /accounts/{account_id}/effects.",
    criteria: [
      "Validate the account ID and reject secret seeds before fetching.",
      "Render a specific, human-readable description for each known effect type rather than a raw type string.",
      "Show unsupported or unrecognized effect types with their raw type name instead of hiding them.",
      "Provide next-page loading with duplicate paging tokens removed.",
      "Handle an account with no effects as an explicit empty state, distinct from a missing account."
    ],
    codes: ["invalid_account", "account_not_found", "invalid_cursor", "malformed_effect", "rate_limited", "request_failed"],
    notes: "Horizon adds new effect types over time; an unrecognized type must degrade to a raw label, never crash the feed.",
    outOfScope: ["No background indexer or streaming.", "No filtering by date range."],
    reference: "app/tools/transaction-lookup",
    modules: [
      ["lib/effect-pages.ts", "Merge bounded effect pages by paging token."],
      ["lib/effect-descriptions.ts", "Describe every known effect type."],
      ["lib/unknown-effect.ts", "Degrade unrecognized effect types gracefully."]
    ],
    views: [
      ["components/EffectRows.tsx", "Show each effect with its description."],
      ["components/UnknownEffectBadge.tsx", "Label unrecognized effect types."],
      ["components/LoadMoreButton.tsx", "Load the next page of effects."],
      ["components/EmptyEffectsState.tsx", "Show the zero-effects empty state."]
    ],
    fixtures: ["fixtures/known-effects.fixture.ts", "fixtures/unknown-effect.fixture.ts", "fixtures/paginated-effects.fixture.ts"]
  },
  {
    slug: "fee-stats",
    title: "Network Fee Stats",
    category: "network",
    summary: "Show the network's current recommended fee percentiles from Horizon's fee stats endpoint so a developer can pick a reasonable max fee.",
    source: "Horizon GET /fee_stats.",
    criteria: [
      "Fetch and show the last ledger's base fee alongside the fee charged percentiles (p10 through p99).",
      "Show the ledger capacity usage percentage for the last closed ledger.",
      "Clearly label every value as a historical observation, not a guaranteed future fee.",
      "Refresh on demand with a visible last-updated timestamp.",
      "Handle a malformed or incomplete fee_stats response as an explicit incomplete-data state."
    ],
    codes: ["history_unavailable", "malformed_response", "rate_limited", "request_failed"],
    notes: "Fee stats describe the last closed ledger only; never present a percentile as a live guarantee for the next submitted transaction.",
    outOfScope: ["No fee bidding automation.", "No transaction submission."],
    reference: "app/tools/transaction-lookup",
    modules: [
      ["lib/fee-stats-fetch.ts", "Fetch the current fee_stats response."],
      ["lib/percentile-rows.ts", "Normalize the charged-fee percentiles."],
      ["lib/capacity-usage.ts", "Compute the ledger capacity usage percentage."]
    ],
    views: [
      ["components/PercentileTable.tsx", "Show the fee percentile table."],
      ["components/CapacityGauge.tsx", "Show ledger capacity usage."],
      ["components/LastUpdatedBadge.tsx", "Show the last-refreshed timestamp."],
      ["components/IncompleteDataNotice.tsx", "Flag an incomplete fee_stats response."]
    ],
    fixtures: ["fixtures/full-fee-stats.fixture.ts", "fixtures/high-capacity.fixture.ts", "fixtures/incomplete-response.fixture.ts"]
  },
  {
    slug: "liquidity-pool-inspector",
    title: "Liquidity Pool Inspector",
    category: "assets",
    summary: "Look up a liquidity pool by ID and show its reserves, total shares and trading fee, so a developer can inspect pool state without building a swap.",
    source: "Horizon GET /liquidity_pools/{pool_id}.",
    criteria: [
      "Validate the pool ID before fetching.",
      "Show both reserve assets with their exact pooled amounts.",
      "Show total shares outstanding and the pool's trading fee in basis points.",
      "Compute and show the implied price of each reserve asset in terms of the other using exact rational arithmetic.",
      "Handle a pool ID that does not exist as a specific not-found outcome."
    ],
    codes: ["invalid_pool_id", "pool_not_found", "rate_limited", "request_failed"],
    notes: "Pool reserves are a point-in-time snapshot; label the implied price as derived from that snapshot, not a live quote.",
    outOfScope: ["No deposit, withdrawal or swap submission.", "No pool share ownership lookup for a specific account."],
    reference: "app/tools/balance-viewer",
    modules: [
      ["lib/pool-fetch.ts", "Fetch the pool record by ID."],
      ["lib/reserve-pricing.ts", "Compute the implied reserve price."],
      ["lib/pool-fields.ts", "Normalize reserve, share and fee fields."]
    ],
    views: [
      ["components/ReserveRows.tsx", "Show each reserve asset and amount."],
      ["components/ImpliedPrice.tsx", "Show the computed implied price."],
      ["components/PoolFeeNotice.tsx", "Show the pool's trading fee."],
      ["components/PoolNotFoundState.tsx", "Show the pool-not-found outcome."]
    ],
    fixtures: ["fixtures/balanced-pool.fixture.ts", "fixtures/skewed-pool.fixture.ts", "fixtures/missing-pool.fixture.ts"]
  },
  {
    slug: "memo-inspector",
    title: "Transaction Memo Inspector",
    category: "transactions",
    summary: "Decode and explain a transaction's memo by type (text, id, hash or return), showing the raw and decoded form and flagging ambiguous binary content.",
    source: "Horizon GET /transactions/{hash}.",
    criteria: [
      "Validate the transaction hash before fetching.",
      "Decode each memo type (none, text, id, hash, return) with type-specific rendering rules.",
      "Show hash and return memos in both hex and base64, since many anchors expect one or the other.",
      "Flag text memos that are not valid UTF-8 as binary content instead of showing corrupted text.",
      "Handle a transaction with no memo as an explicit none state, not an error."
    ],
    codes: ["invalid_hash", "transaction_not_found", "malformed_memo", "rate_limited", "request_failed"],
    notes: "A hash memo and a return memo share the same on-chain shape; only the transaction's own context tells them apart, so label both explicitly rather than guessing.",
    outOfScope: ["No transaction creation or submission.", "No memo requirement lookup for a destination anchor."],
    reference: "app/tools/transaction-lookup",
    modules: [
      ["lib/memo-decode.ts", "Decode the memo by its declared type."],
      ["lib/memo-type-rules.ts", "Apply type-specific rendering rules."],
      ["lib/binary-detect.ts", "Flag non-UTF-8 text memos as binary."]
    ],
    views: [
      ["components/MemoSummary.tsx", "Show the decoded memo."],
      ["components/HexBase64Rows.tsx", "Show hash/return memos in both encodings."],
      ["components/BinaryMemoNotice.tsx", "Flag binary memo content."],
      ["components/NoMemoState.tsx", "Show the no-memo state."]
    ],
    fixtures: ["fixtures/text-memo.fixture.ts", "fixtures/hash-memo.fixture.ts", "fixtures/binary-text-memo.fixture.ts"]
  },
  {
    slug: "operation-browser",
    title: "Account Operation Browser",
    category: "accounts",
    summary: "Browse one account's recent operations across every operation type, with a plain-language summary for each and a link out to the owning transaction.",
    source: "Horizon GET /accounts/{account_id}/operations.",
    criteria: [
      "Validate the account ID and reject secret seeds before fetching.",
      "Render a specific, human-readable summary for each known operation type.",
      "Show unsupported operation types with their raw type name instead of hiding them.",
      "Provide next-page loading with duplicate paging tokens removed.",
      "Handle an account with no operations as an explicit empty state."
    ],
    codes: ["invalid_account", "account_not_found", "invalid_cursor", "malformed_operation", "rate_limited", "request_failed"],
    notes: "Horizon's operation list spans every operation type in the protocol; keep the summary table data-driven so a new type degrades gracefully instead of breaking the page.",
    outOfScope: ["No background indexer or streaming.", "No operation creation or submission."],
    reference: "app/tools/transaction-lookup",
    modules: [
      ["lib/operation-pages.ts", "Merge bounded operation pages by paging token."],
      ["lib/operation-summaries.ts", "Summarize every known operation type."],
      ["lib/unknown-operation.ts", "Degrade unsupported operation types gracefully."]
    ],
    views: [
      ["components/OperationRows.tsx", "Show each operation with its summary."],
      ["components/UnknownOperationBadge.tsx", "Label unsupported operation types."],
      ["components/LoadMoreButton.tsx", "Load the next page of operations."],
      ["components/EmptyOperationsState.tsx", "Show the zero-operations empty state."]
    ],
    fixtures: ["fixtures/known-operations.fixture.ts", "fixtures/unknown-operation.fixture.ts", "fixtures/paginated-operations.fixture.ts"]
  },
  {
    slug: "preconditions-explainer",
    title: "Transaction Preconditions Explainer",
    category: "transactions",
    summary: "Decode a pasted transaction envelope's preconditions (time bounds, ledger bounds, minimum sequence number and age, and extra signers) and explain in plain language when the transaction is eligible to be submitted.",
    source: "Pasted transaction envelope XDR decoded locally with the Stellar SDK; fully offline.",
    offline: true,
    criteria: [
      "Decode time bounds, ledger bounds, min sequence number, min sequence age and min sequence ledger gap when present.",
      "Decode extra signers required by the preconditions, if any.",
      "Explain each precondition's effect in plain language rather than only showing raw values.",
      "Flag an envelope with no preconditions as explicitly unrestricted.",
      "Reject malformed or oversized XDR input before rendering any values."
    ],
    codes: ["empty_xdr", "invalid_xdr", "unsupported_envelope", "too_large"],
    notes: "Preconditions were extended by CAP-21; an older envelope may only carry classic time bounds, which is a valid and common case, not an error.",
    outOfScope: ["No transaction signing or submission.", "No live sequence number lookup against an account."],
    reference: "app/tools/transaction-lookup",
    modules: [
      ["lib/precondition-decode.ts", "Decode every supported precondition field."],
      ["lib/precondition-explain.ts", "Translate each precondition into plain language."],
      ["lib/extra-signers.ts", "Decode required extra signers."]
    ],
    views: [
      ["components/TimeBoundsRow.tsx", "Show time and ledger bounds."],
      ["components/SequenceConditions.tsx", "Show sequence-number preconditions."],
      ["components/ExtraSignerRows.tsx", "Show required extra signers."],
      ["components/UnrestrictedNotice.tsx", "Flag an envelope with no preconditions."]
    ],
    fixtures: ["fixtures/time-bounds.fixture.ts", "fixtures/sequence-conditions.fixture.ts", "fixtures/no-preconditions.fixture.ts"]
  },
  {
    slug: "reserve-calculator",
    title: "Account Reserve Calculator",
    category: "accounts",
    summary: "Calculate an account's minimum XLM base reserve from its current subentry count and flags, and show how much is available above that reserve.",
    source: "Horizon GET /accounts/{account_id}.",
    criteria: [
      "Validate the account ID and reject secret seeds before fetching.",
      "Count trustlines, offers, data entries and signers as subentries using the protocol's base reserve formula.",
      "Add sponsorship-adjusted reserve requirements when the account sponsors or is sponsored for reserves.",
      "Show exact minimum balance and available balance using integer stroop arithmetic.",
      "Handle an account with selling liabilities by showing spendable balance separately from available balance."
    ],
    codes: ["invalid_account", "account_not_found", "rate_limited", "request_failed"],
    notes: "The base reserve amount is a network-wide ledger parameter, not a fixed constant; read it from the same account response context rather than hardcoding it.",
    outOfScope: ["No payment or operation submission.", "No reserve forecast for a hypothetical future subentry count."],
    reference: "app/tools/balance-viewer",
    modules: [
      ["lib/subentry-count.ts", "Count every subentry type on the account."],
      ["lib/reserve-formula.ts", "Apply the base reserve formula."],
      ["lib/spendable-balance.ts", "Subtract liabilities from available balance."]
    ],
    views: [
      ["components/ReserveBreakdown.tsx", "Show the minimum reserve breakdown."],
      ["components/SubentryRows.tsx", "Show each subentry type and count."],
      ["components/SpendableBalance.tsx", "Show spendable balance after liabilities."],
      ["components/SponsorshipAdjustment.tsx", "Show sponsorship-adjusted reserve relief."]
    ],
    fixtures: ["fixtures/simple-account.fixture.ts", "fixtures/sponsored-account.fixture.ts", "fixtures/liabilities-account.fixture.ts"]
  },
  {
    slug: "result-code-explainer",
    title: "Result Code Explainer",
    category: "developer",
    summary: "Look up a Horizon or protocol result code (transaction or operation level) and explain what it means and the most common causes, without claiming to diagnose a specific failed transaction.",
    source: "Local lookup table of documented Stellar result codes; fully offline.",
    offline: true,
    criteria: [
      "Accept a transaction-level or operation-level result code and show which category it belongs to.",
      "Show a plain-language explanation and common causes for every supported code.",
      "Distinguish an unrecognized code from a recognized one instead of guessing an explanation.",
      "Support looking up an operation result code alongside the operation type it applies to, since some codes are reused across types.",
      "Keep the lookup table data-driven so adding a new code does not require UI changes."
    ],
    codes: ["empty_code", "unknown_code", "ambiguous_operation_type"],
    notes: "Several operation result codes share the same enum name across different operation types with different meanings; require the operation type to disambiguate rather than showing every possible meaning at once.",
    outOfScope: ["No live transaction submission or simulation.", "No automatic parsing of a full transaction result XDR."],
    reference: "app/tools/address-validator",
    modules: [
      ["lib/result-code-table.ts", "The data-driven table of known result codes."],
      ["lib/code-lookup.ts", "Look up a code's category and explanation."],
      ["lib/operation-disambiguation.ts", "Disambiguate shared codes by operation type."]
    ],
    views: [
      ["components/CodeExplanation.tsx", "Show the code's explanation."],
      ["components/CommonCauses.tsx", "Show common causes for the code."],
      ["components/UnknownCodeNotice.tsx", "Flag an unrecognized code."],
      ["components/OperationTypePicker.tsx", "Pick the operation type for disambiguation."]
    ],
    fixtures: ["fixtures/transaction-codes.fixture.ts", "fixtures/operation-codes.fixture.ts", "fixtures/ambiguous-codes.fixture.ts"]
  },
  {
    slug: "sequence-inspector",
    title: "Account Sequence Number Inspector",
    category: "accounts",
    summary: "Show an account's current sequence number and explain the next valid sequence number for a new transaction, including what happens if a prior transaction is still pending.",
    source: "Horizon GET /accounts/{account_id}.",
    criteria: [
      "Validate the account ID and reject secret seeds before fetching.",
      "Show the account's current sequence number as returned by Horizon.",
      "Compute and show the next valid sequence number for a new transaction.",
      "Explain that a value already reserved by an unconfirmed transaction can cause a submitted transaction to be rejected.",
      "Use exact integer arithmetic for the sequence number, since it exceeds JavaScript's safe integer range."
    ],
    codes: ["invalid_account", "account_not_found", "rate_limited", "request_failed"],
    notes: "Sequence numbers are 64-bit; parse and display them with BigInt, never a JavaScript number, to avoid silent precision loss.",
    outOfScope: ["No transaction building or submission.", "No bump_sequence operation creation."],
    reference: "app/tools/balance-viewer",
    modules: [
      ["lib/sequence-fetch.ts", "Fetch the account's current sequence number."],
      ["lib/next-sequence.ts", "Compute the next valid sequence number."],
      ["lib/bigint-format.ts", "Format 64-bit sequence numbers without precision loss."]
    ],
    views: [
      ["components/SequenceSummary.tsx", "Show the current sequence number."],
      ["components/NextSequenceNotice.tsx", "Show the computed next sequence number."],
      ["components/PendingTransactionWarning.tsx", "Explain the pending-transaction risk."],
      ["components/RawSequenceValue.tsx", "Show the raw sequence value."]
    ],
    fixtures: ["fixtures/account-sequence.fixture.ts", "fixtures/high-sequence.fixture.ts", "fixtures/missing-account.fixture.ts"]
  },
  {
    slug: "sponsored-reserves",
    title: "Sponsored Reserves Viewer",
    category: "accounts",
    summary: "Show which of an account's subentries are currently sponsored, by whom, and how much reserve relief that provides, distinguishing sponsor and sponsoree roles.",
    source: "Horizon GET /accounts/{account_id}.",
    criteria: [
      "Validate the account ID and reject secret seeds before fetching.",
      "Separate entries the account sponsors for others from entries sponsored for the account by someone else.",
      "Show the sponsor address for every sponsored entry the account owns.",
      "Compute the reserve relief in exact XLM terms from the sponsored subentry count.",
      "Handle an account with no sponsorship relationships as an explicit empty state."
    ],
    codes: ["invalid_account", "account_not_found", "rate_limited", "request_failed"],
    notes: "An account can simultaneously sponsor other accounts' entries and have its own entries sponsored; keep the two directions in separate, clearly labeled groups.",
    outOfScope: ["No begin_sponsoring_future_reserves or end_sponsoring_future_reserves submission.", "No sponsorship chain across more than one hop."],
    reference: "app/tools/balance-viewer",
    modules: [
      ["lib/sponsorship-fields.ts", "Extract sponsorship fields from the account."],
      ["lib/sponsor-direction.ts", "Split sponsor and sponsoree relationships."],
      ["lib/relief-calculation.ts", "Compute exact reserve relief from sponsorship."]
    ],
    views: [
      ["components/SponsoredByMe.tsx", "Show entries this account sponsors."],
      ["components/SponsoredForMe.tsx", "Show entries sponsored for this account."],
      ["components/ReliefSummary.tsx", "Show the computed reserve relief."],
      ["components/NoSponsorshipState.tsx", "Show the no-sponsorship empty state."]
    ],
    fixtures: ["fixtures/sponsor-role.fixture.ts", "fixtures/sponsoree-role.fixture.ts", "fixtures/no-sponsorship.fixture.ts"]
  },
  {
    slug: "xdr-inspector",
    title: "XDR Inspector",
    category: "developer",
    summary: "Decode a pasted base64 XDR blob (transaction envelope, transaction result, or ledger entry) and show its structure as readable, nested JSON without submitting anything.",
    source: "Pasted XDR decoded locally with the Stellar SDK; fully offline.",
    offline: true,
    criteria: [
      "Auto-detect which of the supported XDR types the pasted blob decodes as, trying each in a fixed order.",
      "Show the fully decoded structure as readable, nested JSON with BigInt fields rendered as strings.",
      "Reject empty, malformed or oversized input before attempting to decode.",
      "Show which XDR type was detected, or an explicit could-not-decode outcome if none matched.",
      "Keep all pasted content in memory only, never persisted or sent over the network."
    ],
    codes: ["empty_xdr", "invalid_xdr", "too_large", "undetected_type"],
    notes: "Three different XDR types can share similar byte shapes for short inputs; only report a detected type when the decode actually succeeds and fully consumes the input.",
    outOfScope: ["No transaction signing or submission.", "No Soroban contract spec or ScVal-specific decoding."],
    reference: "app/tools/transaction-lookup",
    modules: [
      ["lib/xdr-detect.ts", "Try each supported XDR type in order."],
      ["lib/xdr-decode.ts", "Decode the detected XDR type fully."],
      ["lib/bigint-json.ts", "Render BigInt fields as JSON-safe strings."]
    ],
    views: [
      ["components/DecodedTree.tsx", "Show the decoded structure as nested JSON."],
      ["components/DetectedTypeBadge.tsx", "Show the detected XDR type."],
      ["components/UndetectedNotice.tsx", "Show the could-not-decode outcome."],
      ["components/InputSizeWarning.tsx", "Warn about oversized input."]
    ],
    fixtures: ["fixtures/envelope-xdr.fixture.ts", "fixtures/result-xdr.fixture.ts", "fixtures/invalid-xdr.fixture.ts"]
  }
];
