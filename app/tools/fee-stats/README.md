# Network Fee Stats

Refresh Horizon `GET /fee_stats` for the app's selected testnet or mainnet network. The tool shows the last closed ledger sequence, that ledger's base fee (stroops), charged-fee percentiles (p10–p99), and ledger capacity usage as a percentage. Every figure is labeled a historical observation from recent ledgers — never a live quote or a guaranteed fee for the next submitted transaction.

No account input is required. The form is a refresh control with a visible last-updated timestamp after a successful load. Amounts stay decimal strings; capacity conversion uses scaled integer math. Incomplete percentile payloads surface an explicit incomplete-data notice while still showing whatever valid fields arrived. Unusable payloads, missing history, rate limits and transport failures map to actionable error copy.

The slice imports shared Horizon URLs and UI primitives only. It does not submit transactions, bid fees, or touch secret keys. Tests inject `fetch` with deterministic fixtures under `tests/tools/fee-stats/fixtures/`.
