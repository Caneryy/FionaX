# Transaction Memo Inspector

Decode and explain a transaction's memo by its Horizon-declared type.

## Behavior

The page asks for a 64-character hex transaction hash and calls `GET /transactions/{hash}`.

Memo handling by type:

- `none` — explicit empty memo state (not an error)
- `text` — show decoded UTF-8 text; non-printable / invalid UTF-8 is flagged as binary with a hex dump
- `id` — show the unsigned integer as a decimal string (`BigInt`-safe)
- `hash` / `return` — same 32-byte shape; show both hex and base64, labeled explicitly so they are never confused

## Errors

- `invalid_hash`: empty or not 64 hex characters
- `transaction_not_found`: Horizon 404
- `malformed_memo`: missing type, wrong shape, or undecodable payload
- `rate_limited`: Horizon 429
- `request_failed`: transport or unexpected payload failure

## Boundaries

Read-only. Does not build, sign, or submit transactions. Does not look up anchor memo requirements. Secret keys are never accepted or sent.
