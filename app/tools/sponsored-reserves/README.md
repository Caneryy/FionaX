# Sponsored Reserves Viewer

Enter a public Stellar G account ID and choose the app's testnet or mainnet network. The tool validates the address locally before one read-only `GET /accounts/{account_id}` Horizon request. It rejects secret seeds and neither sends nor stores them.

Horizon provides `num_sponsoring` and `num_sponsored` as reserve-unit totals. Its account payload also exposes a sponsor for the account itself (two units), trustline balances (one unit, or two for pool share trustlines), and signers (one unit). The viewer keeps the sponsoring and sponsored totals in separate groups and lists each visible sponsored entry with its sponsor. Any gap between `num_sponsored` and the listed entries is shown as unlisted reserve units. The account endpoint does not enumerate entries sponsored for others, offers, or sponsorship metadata for account data; the viewer does not invent their identities or sponsors. A zero/zero count gives an explicit empty state.

Relief is `num_sponsored × 5,000,000` stroops, displayed exactly as XLM using `BigInt`; this assumes the current 0.5 XLM base reserve. The count may include two units for sponsored account creation, not just subentries. A future network reserve change would require a separate live base-reserve data source. Malformed responses are shown as request failures rather than incomplete financial totals.

Unit tests mock Horizon with deterministic fixtures. The tool makes no transactions or sponsorship changes.
