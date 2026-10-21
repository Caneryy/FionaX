# Account Merge Preflight Check

Check whether a source account looks eligible for `account_merge` into a destination, before anyone builds that transaction.

## Behavior

The page asks for two public account ids. On submit it calls Horizon:

- `GET /accounts/{source}`
- `GET /accounts/{source}/offers`
- `GET /accounts/{destination}`

Every known blocker is collected. The check does not stop at the first one:

- a non-native balance (an open trustline or pool shares)
- at least one offer
- any manage-data entry
- a signer whose key is not the source account id
- `num_sponsoring`, `num_sponsored`, or a `sponsor` field

The source native balance is shown as the Horizon decimal string and as stroops. Stroops are a `bigint` parsed from the decimal string, not from a JavaScript float.

## Missing destination

A destination Horizon `404` is a blocker on a successful preflight. The source balance is still shown. That is different from an invalid account id, which is rejected before any request.

`destination_not_found` remains an error code for the destination lookup itself. The page turns that code into the missing-destination blocker so the rest of the check stays visible.

## Disclaimer

The result always says this is a preflight check. Account state can change before submission. This tool does not create or submit `account_merge`, and it does not create the destination account.

## Errors

- `invalid_account`: empty, secret seed, or a bad public key. Seeds are not echoed and are not sent.
- `same_account`: source and destination are the same id.
- `source_not_found`: the source account or its offers return 404.
- `rate_limited`: Horizon returns 429.
- `request_failed`: the request or the payload cannot be read.
