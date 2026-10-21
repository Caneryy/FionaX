# Account Data Entries Viewer

List one account's manage-data entries and decode each value from the base64 Horizon returns.

## Behavior

The page asks for a public account id. On submit it calls Horizon:

`GET /accounts/{account_id}`

The selected network chooses the Horizon host. Each key in `data` is one entry. The page shows the name, its UTF-8 byte length, the raw base64 string, and a decoded view.

A value that is printable UTF-8 is shown as text. A value that is not valid UTF-8, or that contains a null or other non-printable byte, is marked binary. The binary case shows hex next to the raw base64. It is not an error.

Names of 56 bytes or more, up to the 64-byte protocol limit, are flagged. The flag is a warning on a successful result.

## Empty account versus missing account

A Horizon `200` with `"data": {}` is success. The page says the account has no data entries.

A Horizon `404` is `account_not_found`. Those two outcomes use different copy.

## Validation

Checks run locally, before `fetch`:

- Empty input is `invalid_account`.
- A secret seed is `invalid_account`. The error text does not contain the seed. The request is not sent.
- Anything that is not a valid Ed25519 public key is `invalid_account`.

## Errors

- `malformed_data_entry`: a data value is not valid base64, or is not a string.
- `rate_limited`: Horizon returned 429.
- `request_failed`: the request failed, the body is not JSON, or the account payload is missing `data`.

## Boundaries

This tool only reads. It does not submit manage-data operations and it does not edit values. Amounts are not shown. Secret seeds are never stored or sent.
