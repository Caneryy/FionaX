# Asset Issuer Flags Inspector

Look up one issuer account and explain the four authorization flags that govern how that issuer's assets behave for a holder.

## Behavior

The page asks for a public issuer account id (a `G...` address). On submit it calls Horizon:

`GET /accounts/{issuer_account_id}`

The selected network in the app shell chooses the Horizon host. The response flags are shown as four separate rows:

- `auth_required`
- `auth_revocable`
- `auth_immutable`
- `auth_clawback_enabled`

Each row says whether the flag is on or off and what that means for someone holding the issuer's asset. A second paragraph joins those sentences into one holder-facing reading.

`auth_immutable` is also called out on its own. When it is on, `auth_required`, `auth_revocable`, and `auth_clawback_enabled` can never change again. When it is off, those three flags can still be changed. That lock is not treated as just another on/off row.

The raw AccountFlags bitmask is shown next to the decoded flags. The bits are the protocol values: 1, 2, 4, and 8. The mask is computed with `bigint` and displayed as decimal plus hex, for example `15 (0xf)`.

The account sequence is kept as a decimal string. It is not passed through `Number`, so values above `Number.MAX_SAFE_INTEGER` stay exact. This tool does not display balances.

## Account missing versus flags unset

A Horizon `404` is `account_not_found`. The copy tells the reader to check the public key and the selected network.

A Horizon `200` whose four flags are all `false` is a successful result. The page says the account exists and every authorization flag is unset. Those two outcomes use different copy and different UI states.

## Validation

Checks run locally, before `fetch`:

- Empty input is `invalid_account`.
- A secret seed (`S...`, including a valid `StrKey` seed) is `invalid_account`. The error text does not contain the seed. The request is not sent. The field is cleared after that submit.
- Anything that is not a valid Ed25519 public key is `invalid_account`.

## Errors

| Code | When |
| --- | --- |
| `invalid_account` | Empty, secret, or malformed account id |
| `account_not_found` | Horizon responds `404` |
| `rate_limited` | Horizon responds `429` |
| `request_failed` | Network failure, other HTTP errors, or a body that is not a usable account |

Expected failures return `{ ok: false, error }`. They are not thrown to the page. The screen has four states: idle, loading, success, and error. User-facing strings live in `copy.ts`.

## Data boundaries

- Read-only Horizon account lookup. No `set_options` transaction is built or submitted.
- No per-holder trustline or authorization check.
- No secret keys are stored, displayed in errors, or sent.
- Tests inject `fetch` and use fixtures. They do not call Horizon.

## Design

The tool is one slice under `app/tools/asset-flags-inspector/` plus `tests/tools/asset-flags-inspector/`. Homepage listing comes from `manifest.ts` through the generated registry. Shared UI (`Card`, `Button`, `CharacterPanel`, `StatusMessage`) is imported, not edited.

The layout stacks on a 390px-wide screen: one column, full-width submit button, and a wrapping account id.
