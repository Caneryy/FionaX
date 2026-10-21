import type { AccountDataEntriesErrorCode, InvalidAccountReason } from "@/app/tools/account-data-entries/types";

export const copy = {
  title: "Account Data Entries Viewer",
  eyebrow: "Data clerk",
  idle: "Paste a public account id. The clerk reads Horizon and decodes each manage-data value.",
  loadingTitle: "Reading data entries",
  loading: "Asking Horizon for this account. The lookup is read-only and does not write any data entry.",
  emptyTitle: "Before the first lookup",
  empty:
    "Use a public account id that starts with G. Secret seeds are rejected on this page and are never sent to Horizon. An account with zero data entries is a real result. A missing account is a different message.",
  submit: "Show data entries",
  submitting: "Reading Horizon...",
  form: {
    label: "Account id",
    hint: "Public account only. It starts with G. A secret seed is rejected before any lookup.",
    placeholder: "G..."
  },
  result: {
    foundTitle: "Data entries",
    accountLabel: "Account",
    networkLabel: "Network",
    countLabel: "Entries",
    nameLabel: "Name",
    bytesLabel: "Name length",
    rawLabel: "Raw base64",
    decodedLabel: "Decoded value"
  },
  encoding: {
    text: "UTF-8 text",
    binary: "Binary"
  },
  networkNames: {
    testnet: "Testnet",
    mainnet: "Mainnet"
  },
  zeroEntries: {
    title: "This account has no data entries",
    body: "Horizon returned the account, and its data map is empty. That is not the same as an account that does not exist."
  },
  binary: {
    title: "This value is binary",
    body: "The bytes are not printable UTF-8, so the page shows the raw base64 and a hex dump instead of broken text."
  },
  nearLimit: {
    title: "A name is near the 64-byte limit",
    body: "Stellar manage-data names can be at most 64 bytes. A name of 56 bytes or more is flagged here so it is not mistaken for a short label."
  },
  errors: {
    invalid_account: {
      empty: "Enter a public account id. It starts with G and is safe to share.",
      secret: "That value is a secret seed, so it was not looked up. Paste the public account id that starts with G.",
      malformed: "That account id is not a valid Stellar public key. Check that it starts with G and that the checksum is intact."
    },
    account_not_found:
      "No account exists for that id on the selected network. Confirm the public key, then switch testnet or mainnet if you are on the wrong one.",
    malformed_data_entry:
      "Horizon returned a data entry whose value is not valid base64. The page did not guess a decoding. Try the lookup again.",
    rate_limited: "Horizon is rate limiting account lookups. Wait a moment and try again. No data entry was changed.",
    request_failed: "The account could not be read from Horizon. Check the connection and try again."
  },
  errorTitles: {
    invalid_account: "Account id needs a fix",
    account_not_found: "Account was not found",
    malformed_data_entry: "A data entry could not be decoded",
    rate_limited: "Horizon rate limit",
    request_failed: "Horizon lookup failed"
  } satisfies Record<AccountDataEntriesErrorCode, string>
};

export function invalidAccountMessage(reason: InvalidAccountReason): string {
  return copy.errors.invalid_account[reason];
}
