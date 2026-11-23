# Account Operation Browser

Enter a public classic Stellar G-address and select the app's testnet or mainnet network. The tool validates the address locally, then requests `GET /accounts/{account_id}/operations?order=desc&limit=20` from that network's configured Horizon server. It sends no request for an invalid address or secret seed. It never asks for, stores, or displays secret keys.

The feed shows newest operations first. Each known Horizon operation type has a specific plain-language summary; unknown future types remain visible under their raw type name. Only the fields needed for a summary are retained. Amounts remain decimal strings without floating-point conversion. Times are shown in UTC. Missing timestamps show an explicit fallback. Each row links out to the owning transaction on Stellar Expert for the selected network.

Each request fetches at most 20 records. Load more uses the last numeric paging token and merges records by token, preserving order and limiting the in-memory feed to 200 unique operations. A successful empty response is a zero-operations state; a 404 is a missing-account error. A failed next page leaves already loaded operations visible and offers a retry.

Horizon can return new operations while a user pages through older results, so paging is a snapshot-like view rather than a permanent historical record. No streaming, background indexing, or operation submission is used. Tests mock the network and use deterministic fixtures in this slice.

Operation names follow the [Stellar Horizon operation type reference](https://developers.stellar.org/docs/data/apis/horizon/api-reference/resources/operations/object).
