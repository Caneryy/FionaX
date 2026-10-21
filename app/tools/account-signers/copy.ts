import type { AccountSignersErrorCode, InvalidAccountReason, SignerKind } from "@/app/tools/account-signers/types";

export const copy = {
  title: "Account Signers & Thresholds",
  eyebrow: "Signer clerk",
  idle: "Paste a public account id. The clerk reads Horizon and lists every signer next to the three thresholds.",
  loadingTitle: "Reading signers",
  loading: "Asking Horizon for this account. The lookup is read-only and does not change any signer.",
  emptyTitle: "Before the first lookup",
  empty:
    "Use a public account id that starts with G. Secret seeds are rejected and are never sent. A master key with weight zero is a configuration, not an error. Hash and pre-authorized signers are shown as their own types.",
  submit: "Show signers",
  submitting: "Reading Horizon...",
  form: {
    label: "Account id",
    hint: "Public account only. It starts with G.",
    placeholder: "G..."
  },
  result: {
    title: "Signers and thresholds",
    accountLabel: "Account",
    networkLabel: "Network",
    keyLabel: "Key",
    weightLabel: "Weight",
    typeLabel: "Type",
    masterLabel: "Master key"
  },
  thresholds: {
    title: "Thresholds",
    low: "Low",
    medium: "Medium",
    high: "High"
  },
  kinds: {
    ed25519_public_key: "Ed25519 public key",
    sha256_hash: "SHA-256 hash",
    preauth_tx: "Pre-authorized transaction"
  } satisfies Record<SignerKind, string>,
  masterZero: {
    title: "Master key weight is zero",
    body: "The master key is still listed. Weight zero means it cannot sign on its own. That is a configuration, not a failed lookup."
  },
  networkNames: { testnet: "Testnet", mainnet: "Mainnet" },
  errors: {
    invalid_account: {
      empty: "Enter a public account id. It starts with G and is safe to share.",
      secret: "That value is a secret seed, so it was not looked up. Paste the public account id that starts with G.",
      malformed: "That account id is not a valid Stellar public key. Check that it starts with G and that the checksum is intact."
    },
    account_not_found: "No account exists for that id on the selected network. Confirm the public key and the network.",
    malformed_signer: "Horizon returned a signer this page could not read. The lookup stopped instead of guessing a key type.",
    rate_limited: "Horizon is rate limiting account lookups. Wait a moment and try again. No signer was changed.",
    request_failed: "The account could not be read from Horizon. Check the connection and try again."
  },
  errorTitles: {
    invalid_account: "Account id needs a fix",
    account_not_found: "Account was not found",
    malformed_signer: "A signer could not be read",
    rate_limited: "Horizon rate limit",
    request_failed: "Horizon lookup failed"
  } satisfies Record<AccountSignersErrorCode, string>
};

export function invalidAccountMessage(reason: InvalidAccountReason): string {
  return copy.errors.invalid_account[reason];
}
