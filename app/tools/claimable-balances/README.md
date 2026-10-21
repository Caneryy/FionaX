# Claimable Balances Viewer

Enter a public Stellar G address, optionally with a Horizon paging token (72 hex characters or decimal digits), and select the app's testnet or mainnet network. The viewer requests Horizon `/claimable_balances?claimant=…` with 20 records per page and stops after three pages. It labels every result a bounded sample, reports pages fetched, and exposes the next token when a full final page suggests more results. An empty response has its own state.

Horizon records are decoded before display. The matching claimant's full predicate tree is shown, including unconditional, absolute and relative time bounds, AND, OR, and NOT. Asset, exact decimal amount and sponsor (or an explicit missing sponsor label) are shown for each balance. Amounts stay strings; validation uses BigInt stroops. The viewer creates or submits no claim transactions. It neither requests nor persists secret seeds; only valid public addresses reach Horizon.

The slice uses the shared network endpoints and does not cache results. The sample may change as ledgers close. Horizon failures and malformed response data become actionable error states. Tests supply deterministic Horizon response fixtures.
