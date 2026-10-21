# Account Signers & Thresholds

Show one account's signers beside its low, medium, and high thresholds.

## Behavior

The page asks for a public account id and calls `GET /accounts/{account_id}`.

Each signer is listed with its key, weight, and type:

- `ed25519_public_key`
- `sha256_hash`
- `preauth_tx`

Hash and pre-authorized signers are not passed through public-key validation. A key that is not a `G...` address is still a valid signer of those types.

The signer whose key equals the account id is the master key. A master weight of zero is called out on the result. It is not an error.

Thresholds come from `thresholds.low_threshold`, `thresholds.med_threshold`, and `thresholds.high_threshold`.

## Errors

- `invalid_account`: empty, secret seed, or a bad public key. Seeds are not echoed and are not sent.
- `account_not_found`: Horizon 404.
- `malformed_signer`: a signer is missing a key, an integer weight, or a known type.
- `rate_limited`: Horizon 429.
- `request_failed`: the request or the payload cannot be read.

## Boundaries

This tool only reads. It does not add, remove, or reweight signers, and it does not build a multisig transaction.
