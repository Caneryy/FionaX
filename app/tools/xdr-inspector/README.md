# XDR Inspector

Paste a base64 Stellar transaction envelope, transaction result, or ledger entry to see its complete XDR structure as indented JSON. The tool tries those types in that order and reports a type only when the SDK consumes the entire blob. A valid base64 blob that fits none gets a specific unsupported-type outcome.

Validation rejects empty input, malformed or noncanonical base64, incomplete XDR word lengths, and blobs over 256 KiB before calling the SDK. Whitespace around or within base64 is accepted for pasted line-wrapped data. Integers wider than JavaScript's safe range become decimal strings; raw byte fields become hexadecimal strings. Union switches and active arms remain visible.

The entire flow runs in browser memory. The slice does not call Horizon, RPC, storage, signing, or submission APIs. Pasted content and decoded JSON live only in React state and disappear on reload. No secret key field is provided; do not paste secret keys into this tool.
