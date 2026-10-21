import type { ErrorCode } from "@/app/tools/reserve-calculator/types";

export const copy = {
  title: "Account Reserve Calculator",
  idle: "Enter an account to see its minimum XLM reserve and what's available above it.",
  loading: "Reading the account…",
  empty: "Reads the account and the latest ledger's base reserve — nothing is signed or submitted.",
  placeholder: "G… account ID",
  submit: "Calculate reserve",
  resultTitle: "Reserve breakdown",
  subentriesTitle: "Subentries",
  trustlinesLabel: "Trustlines",
  offersLabel: "Offers",
  dataEntriesLabel: "Data entries",
  extraSignersLabel: "Extra signers",
  sponsorshipTitle: "Sponsorship adjustment",
  numSponsoringLabel: "Entries this account sponsors for others",
  numSponsoredLabel: "Entries sponsored for this account",
  minBalanceLabel: "Minimum balance",
  balanceLabel: "Current balance",
  availableLabel: "Available balance",
  sellingLiabilitiesLabel: "Selling liabilities",
  spendableLabel: "Spendable balance",
  errors: {
    invalid_account: "Enter a valid G… account ID. Secret seeds are rejected before any request.",
    account_not_found: "No account exists for that ID on the selected network.",
    rate_limited: "Horizon is throttling requests. Wait a moment and try again.",
    request_failed: "The account lookup did not complete. Check the selected network and try again."
  } satisfies Record<ErrorCode, string>
};
