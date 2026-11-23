import type { BrowserOperation, OperationBrowserErrorCode } from "./types";

export const copy = {
  title: "Account Operation Browser",
  manifestDescription: "Browse an account's recent operations with plain-language summaries.",
  manifestCharacter: "An operations guide translates ledger actions into plain language.",
  eyebrow: "Operation trail",
  intro: "Read the newest operations for a public Stellar account on the selected network.",
  accountLabel: "Stellar public account ID",
  accountPlaceholder: "G...",
  submit: "Show operations",
  loading: "Loading account operations…",
  idle: "Enter a public G-address to see its recent operations.",
  resultTitle: "Recent operations",
  resultCount: (count: number) => `${count} operation${count === 1 ? "" : "s"} loaded`,
  emptyTitle: "No operations yet",
  empty: "This account exists, but Horizon returned no operations for it.",
  loadMore: "Load older operations",
  loadingMore: "Loading older operations…",
  unknown: "Unrecognized operation type",
  timeUnavailable: "Time unavailable",
  viewTransaction: "View transaction",
  errorTitle: "Could not show operations",
  pageErrorTitle: "Could not load the next page",
  errors: {
    invalid_account: "Enter a valid public Stellar G-address. Secret seeds and other keys are not accepted.",
    account_not_found: "This account does not exist on the selected network. Check the address and network; on testnet, fund a new account first.",
    invalid_cursor: "The page cursor is invalid. Start a new search to load recent operations.",
    malformed_operation: "Horizon returned an incomplete operation. Try again later or switch Horizon providers.",
    rate_limited: "Horizon is limiting requests. Wait a moment, then try again.",
    request_failed: "Could not reach Horizon. Check your connection and try again."
  } satisfies Record<OperationBrowserErrorCode, string>
};

type Description = (operation: BrowserOperation) => string;
const detail = (operation: BrowserOperation, key: string) =>
  typeof operation.details[key] === "string" ? operation.details[key] as string : undefined;
const asset = (operation: BrowserOperation) => {
  const code = detail(operation, "asset_code");
  return detail(operation, "asset_type") === "native" ? "XLM" : code ?? "an asset";
};
const amount = (operation: BrowserOperation) => detail(operation, "amount") ?? "an amount of";
const destination = (operation: BrowserOperation) => {
  const value = detail(operation, "destination") ?? detail(operation, "into") ?? detail(operation, "to");
  return value ? ` to ${value.slice(0, 4)}…${value.slice(-4)}` : "";
};

// Horizon's documented classic and Soroban operation names. Optional fields add detail when present.
export const operationSummaries: Record<string, Description> = {
  create_account: (o) =>
    `Created a new account${detail(o, "starting_balance") ? ` with ${detail(o, "starting_balance")} XLM` : ""}${destination(o)}.`,
  payment: (o) => `Sent ${amount(o)} ${asset(o)}${destination(o)}.`,
  path_payment_strict_receive: (o) =>
    `Path payment received ${amount(o)} ${asset(o)}${destination(o)}.`,
  path_payment_strict_send: (o) =>
    `Path payment sent ${detail(o, "source_amount") ?? amount(o)} ${detail(o, "source_asset_code") ?? asset(o)}${destination(o)}.`,
  manage_sell_offer: () => "Managed a sell offer on the exchange.",
  create_passive_sell_offer: () => "Created a passive sell offer on the exchange.",
  set_options: () => "Updated account options or signing settings.",
  change_trust: (o) => `Changed the trustline for ${asset(o)}${detail(o, "limit") ? ` (limit ${detail(o, "limit")})` : ""}.`,
  allow_trust: (o) => `Updated trustline authorization for ${asset(o)}.`,
  account_merge: (o) => `Merged the account${destination(o)}.`,
  inflation: () => "Ran the inflation operation.",
  manage_data: (o) =>
    `Managed account data entry${detail(o, "name") ? ` “${detail(o, "name")}”` : ""}.`,
  bump_sequence: () => "Advanced the account sequence number.",
  manage_buy_offer: () => "Managed a buy offer on the exchange.",
  create_claimable_balance: () => "Created a claimable balance.",
  claim_claimable_balance: () => "Claimed a claimable balance.",
  begin_sponsoring_future_reserves: () => "Began sponsoring future reserves for another account.",
  end_sponsoring_future_reserves: () => "Ended sponsorship of future reserves.",
  revoke_sponsorship: () => "Revoked an existing sponsorship.",
  clawback: (o) => `Clawed back ${amount(o)} ${asset(o)}.`,
  clawback_claimable_balance: () => "Clawed back a claimable balance.",
  set_trust_line_flags: (o) => `Updated trustline flags for ${asset(o)}.`,
  liquidity_pool_deposit: () => "Deposited assets into a liquidity pool.",
  liquidity_pool_withdraw: () => "Withdrew assets from a liquidity pool.",
  invoke_host_function: () => "Invoked a Soroban host function.",
  extend_footprint_ttl: () => "Extended the TTL of a Soroban footprint.",
  restore_footprint: () => "Restored a Soroban footprint."
};
