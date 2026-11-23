import type { InvalidHashReason, MemoInspectorErrorCode, MemoKind } from "@/app/tools/memo-inspector/types";

export const copy = {
  title: "Transaction Memo Inspector",
  eyebrow: "Memo clerk",
  idle: "Paste a transaction hash. The clerk reads Horizon and decodes the memo by its declared type.",
  loadingTitle: "Reading memo",
  loading: "Asking Horizon for this transaction. The lookup is read-only and does not change anything on-chain.",
  emptyTitle: "Before the first lookup",
  empty:
    "Use a 64-character hex transaction hash. Text, id, hash, and return memos each get their own rendering. A missing memo is shown as none, not as an error. Hash and return share the same byte shape — only the type label tells them apart.",
  submit: "Inspect memo",
  submitting: "Reading Horizon...",
  form: {
    label: "Transaction hash",
    hint: "64 hexadecimal characters. No secret keys are accepted or sent.",
    placeholder: "a1b2c3..."
  },
  result: {
    title: "Decoded memo",
    hashLabel: "Transaction",
    networkLabel: "Network",
    typeLabel: "Memo type",
    sourceLabel: "Source account",
    createdLabel: "Created at",
    statusLabel: "Status",
    rawLabel: "Raw value",
    textLabel: "Decoded text",
    idLabel: "Memo id",
    hexLabel: "Hex",
    base64Label: "Base64"
  },
  kinds: {
    none: "None",
    text: "Text",
    id: "Id",
    hash: "Hash",
    return: "Return"
  } satisfies Record<MemoKind, string>,
  status: {
    successful: "Successful",
    failed: "Failed"
  },
  none: {
    title: "No memo on this transaction",
    body: "Horizon reported memo type none. That is an explicit empty memo, not a lookup failure."
  },
  binary: {
    title: "Binary text memo",
    body: "The text memo bytes are not valid printable UTF-8, so the page shows a hex dump instead of corrupted characters."
  },
  encodings: {
    title: "Encodings",
    hint: "Hash and return memos are 32 bytes. Anchors may expect either hex or base64 — both are shown."
  },
  networkNames: { testnet: "Testnet", mainnet: "Mainnet" },
  errors: {
    invalid_hash: {
      empty: "Enter a transaction hash. It is 64 hexadecimal characters.",
      malformed: "That value is not a valid transaction hash. Use 64 hexadecimal characters with no spaces."
    },
    transaction_not_found: "No transaction exists for that hash on the selected network. Confirm the hash and the network.",
    malformed_memo: "Horizon returned a memo this page could not decode. The lookup stopped instead of guessing the type.",
    rate_limited: "Horizon is rate limiting transaction lookups. Wait a moment and try again. Nothing was changed on-chain.",
    request_failed: "The transaction could not be read from Horizon. Check the connection and try again."
  },
  errorTitles: {
    invalid_hash: "Transaction hash needs a fix",
    transaction_not_found: "Transaction was not found",
    malformed_memo: "A memo could not be decoded",
    rate_limited: "Horizon rate limit",
    request_failed: "Horizon lookup failed"
  } satisfies Record<MemoInspectorErrorCode, string>
};

export function invalidHashMessage(reason: InvalidHashReason): string {
  return copy.errors.invalid_hash[reason];
}
