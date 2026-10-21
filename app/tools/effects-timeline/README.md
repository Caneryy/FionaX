# Account Effects Timeline

Enter a public classic Stellar G-address and select the app's testnet or mainnet network. The tool validates the address locally, then requests `GET /accounts/{account_id}/effects?order=desc&limit=20` from that network's configured Horizon server. It sends no request for an invalid address or secret seed. It never asks for, stores, or displays secret keys.

The feed shows newest effects first. Each known classic Horizon effect type has a specific plain-language description; unknown future types remain visible under their raw type name. Only the fields needed for a description are rendered. Amounts remain decimal strings without floating-point conversion. Times are shown in UTC. Missing timestamps show an explicit fallback.

Each request fetches at most 20 records. Load more uses the last paging token (including Horizon's hyphenated effect index) and merges records by token, preserving order and limiting the in-memory feed to 200 unique effects. A successful empty response is a zero-effects state; a 404 is a missing-account error. A failed next page leaves already loaded effects visible and offers a retry.

Horizon can return new effects while a user pages through older results, so paging is a snapshot-like view rather than a permanent historical record. No streaming, background indexing, or date-range filter is used. Tests mock the network and use deterministic fixtures in this slice.

Effect names follow the [Stellar Horizon effect type reference](https://developers.stellar.org/docs/data/apis/horizon/api-reference/resources/effects/types).
