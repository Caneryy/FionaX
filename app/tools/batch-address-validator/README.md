# Batch Address Validator

Validate a pasted list of Stellar account public keys in the browser. The tool reports which entries are valid, invalid, or duplicated, and it rejects the whole list when any entry is shaped like a secret seed.

## Data boundary

This tool is fully offline. It uses Stellar SDK `StrKey.isValidEd25519PublicKey` and never calls Horizon, Friendbot, or Soroban RPC. There is no on-chain existence check and no CSV upload. The only input is text pasted into the form.

`tests/tools/batch-address-validator/fixtures/offline-network.fixture.ts` records that boundary as an empty request list.

## Parsing

New lines and commas are separators. A line may mix both (`G..., G...`). Carriage returns are normalized. Blank tokens from extra commas or empty lines are dropped, and the remaining entries keep their original 1-based line number plus their order in the list.

## Secret seeds

An entry is treated as a secret seed when it starts with `S`, when it contains a 56-character secret-seed shape, or when `StrKey.isValidEd25519SecretSeed` accepts it. That check runs before the size limit, so a seed hidden in a long paste still rejects the batch.

The field is cleared, the result rows are not built, and the error copy never includes the value. Decoder exceptions are mapped without reading `Error.message`, because that message can contain the pasted text.

## Duplicates and invalid rows

A valid `G...` public key is `valid` the first time it appears and `duplicate` after that. Repeated invalid text stays `invalid`. Muxed (`M...`), contract (`C...`), and checksum-failed `G...` values are invalid public addresses. Results stay in input order so each row maps back to its line.

## Empty list and batch size

A paste that is empty or only whitespace and commas is `empty_batch`, shown as its own empty state. More than 100 entries, the `MAX_BATCH_ENTRIES` limit, is `too_many_entries`. The form tells the user to split the list.

## States

The panel starts idle, shows a short local processing message while the list is checked, then shows either the summary and rows or one of the terminal errors above.

## Error copy

| Code | When |
| --- | --- |
| `empty_batch` | No entries remain after parsing |
| `too_many_entries` | More than 100 entries, and none are secret-shaped |
| `contains_secret_seed` | Any entry is shaped like a secret seed |
| `invalid_address` | A row is not a checksum-valid `G...` public key |
| `duplicate_address` | A later row repeats a valid public key |

## Out of scope

No network lookup of whether an address exists. No CSV file upload.
