# Asset stellar.toml Metadata Viewer

Shows the SEP-1 `CURRENCIES` entry an issuer published for one asset code. The values come from the issuer's own `stellar.toml`. They are labeled self-published and are not treated as verified facts.

## Behavior

1. The issuer account ID and asset code are checked locally. A secret seed is rejected, and the seed is never copied into an error.
2. Horizon `GET /accounts/{issuer}` is requested only after that check. The selected network (testnet or mainnet) chooses the Horizon host.
3. `home_domain` from that account becomes `https://{home_domain}/.well-known/stellar.toml`.
4. The matching `[[CURRENCIES]]` entry is the one whose `code` equals the requested asset code. When the entry includes `issuer`, it must equal the account that was looked up. An entry with no `issuer` can still match the code. An entry that names a different issuer does not match.
5. Every SEP-1 currency field is shown. A field that is missing stays on screen with an explicit notice. Extra keys on that same entry are shown as well. Other TOML tables are ignored.

An account that exists but has no `home_domain` is `missing_home_domain`. A `home_domain` whose file cannot be downloaded, or whose hostname cannot be requested, is `toml_unreachable`. A downloaded body that is not valid TOML is `malformed_toml`. Those are different outcomes.

## Data boundaries

- Account records come from Horizon. Metadata comes from the issuer's web host.
- Nothing in the file is signed or checked against a domain-ownership proof.
- Integer amounts such as `fixed_number` and `max_number` stay decimal strings and are grouped with `BigInt`. They are never stored as floating-point numbers.
- The lookup runs on the server. Issuer hosts rarely send browser CORS headers, so a page-side fetch would report a reachable file as unreachable. Tests still inject both fetches and use fixtures only.

## Error codes

| Code | When |
| --- | --- |
| `invalid_account` | The issuer ID is empty, not a public account ID, or a secret seed. |
| `invalid_asset_code` | The asset code is not 1–12 letters or digits. |
| `account_not_found` | Horizon responds 404. |
| `missing_home_domain` | The account exists and `home_domain` is absent or blank. |
| `toml_unreachable` | The domain is not a hostname, or the TOML request fails. |
| `malformed_toml` | The response body is not usable TOML. |
| `currency_not_found` | The file parsed and no entry matches the code and issuer. |
| `request_failed` | Horizon failed for a reason other than a missing account. |

## Out of scope

- TOML signatures and domain-ownership checks.
- SEP-1 tables other than the matching `CURRENCIES` entry.
