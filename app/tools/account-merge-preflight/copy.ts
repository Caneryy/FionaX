import type { AccountMergePreflightErrorCode, BlockerCode, InvalidAccountReason } from "@/app/tools/account-merge-preflight/types";

export const copy = {
  title: "Account Merge Preflight Check",
  eyebrow: "Merge clerk",
  idle: "Paste the source and destination public account ids. The clerk lists every merge blocker it can see.",
  loadingTitle: "Checking the merge",
  loading: "Reading the source account, its offers, and the destination. Nothing is submitted.",
  emptyTitle: "Before the first check",
  empty:
    "Use two public account ids that start with G. Secret seeds are rejected and are never sent to Horizon. A missing destination is a blocker, not a bad account id. This check is not a guarantee.",
  submit: "Check merge",
  submitting: "Reading Horizon...",
  form: {
    sourceLabel: "Source account id",
    destinationLabel: "Destination account id",
    hint: "Public accounts only. The source is the account that would be merged away.",
    placeholder: "G..."
  },
  result: {
    title: "Preflight result",
    sourceLabel: "Source",
    destinationLabel: "Destination",
    networkLabel: "Network",
    balanceLabel: "Native balance that would transfer",
    mergeable: "No known blocker",
    blocked: "Merge is blocked"
  },
  networkNames: {
    testnet: "Testnet",
    mainnet: "Mainnet"
  },
  disclaimer: {
    title: "This is only a preflight check",
    body: "Account state can change before a transaction is submitted. This page does not build or send an account_merge."
  },
  destination: {
    title: "Destination account does not exist yet",
    body: "Horizon has no account for that destination. That is a blocker, and it is separate from an invalid account id."
  },
  blockers: {
    trustlines: {
      title: "Open trustlines",
      detail: "The source still holds a non-native balance. account_merge refuses an account with trustlines."
    },
    offers: {
      title: "Active offers",
      detail: "The source has at least one offer. Those must be gone before a merge."
    },
    data_entries: {
      title: "Data entries",
      detail: "The source still has manage-data entries. account_merge refuses those."
    },
    extra_signers: {
      title: "Non-master signers",
      detail: "The source has a signer other than its master key. account_merge refuses that."
    },
    sponsorship: {
      title: "Sponsorship",
      detail: "The source sponsors entries, is sponsored, or has a sponsor. That relationship blocks a merge."
    },
    destination_missing: {
      title: "Destination is missing",
      detail: "The destination account was not found. Creating it is outside this check."
    }
  } satisfies Record<BlockerCode, { title: string; detail: string }>,
  errors: {
    invalid_account: {
      empty: "Enter both public account ids. Each one starts with G and is safe to share.",
      secret: "A secret seed was entered, so nothing was looked up. Paste public account ids that start with G.",
      malformed: "One of those account ids is not a valid Stellar public key. Check the G prefix and the checksum."
    },
    source_not_found: "No source account exists for that id on the selected network. Confirm the public key and the network.",
    destination_not_found: "No destination account exists for that id on the selected network. That blocks a merge until the account exists.",
    same_account: "The source and destination are the same account. A merge needs two different public ids.",
    rate_limited: "Horizon is rate limiting account lookups. Wait a moment and try again. Nothing was merged.",
    request_failed: "The accounts could not be read from Horizon. Check the connection and try again."
  },
  errorTitles: {
    invalid_account: "Account ids need a fix",
    source_not_found: "Source account was not found",
    destination_not_found: "Destination account was not found",
    same_account: "Source and destination match",
    rate_limited: "Horizon rate limit",
    request_failed: "Horizon lookup failed"
  } satisfies Record<AccountMergePreflightErrorCode, string>
};

export function invalidAccountMessage(reason: InvalidAccountReason): string {
  return copy.errors.invalid_account[reason];
}
