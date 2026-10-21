import type { EffectsTimelineErrorCode, TimelineEffect } from "./types";

export const copy = {
  title: "Account Effects Timeline",
  manifestDescription: "Browse an account's recent ledger effects in order.",
  manifestCharacter: "A ledger guide translates account changes into plain language.",
  eyebrow: "Ledger trail",
  intro: "Read the newest ledger effects for a public Stellar account on the selected network.",
  accountLabel: "Stellar public account ID",
  accountPlaceholder: "G...",
  submit: "Show effects",
  loading: "Loading account effects…",
  idle: "Enter a public G-address to see its recent ledger effects.",
  resultTitle: "Recent effects",
  resultCount: (count: number) => `${count} effect${count === 1 ? "" : "s"} loaded`,
  emptyTitle: "No effects yet",
  empty: "This account exists, but Horizon returned no effects for it.",
  loadMore: "Load older effects",
  loadingMore: "Loading older effects…",
  unknown: "Unrecognized effect type",
  timeUnavailable: "Time unavailable",
  errorTitle: "Could not show effects",
  pageErrorTitle: "Could not load the next page",
  errors: {
    invalid_account: "Enter a valid public Stellar G-address. Secret seeds and other keys are not accepted.",
    account_not_found: "This account does not exist on the selected network. Check the address and network; on testnet, fund a new account first.",
    invalid_cursor: "The page cursor is invalid. Start a new search to load recent effects.",
    malformed_effect: "Horizon returned an incomplete effect. Try again later or switch Horizon providers.",
    rate_limited: "Horizon is limiting requests. Wait a moment, then try again.",
    request_failed: "Could not reach Horizon. Check your connection and try again."
  } satisfies Record<EffectsTimelineErrorCode, string>
};

type Description = (effect: TimelineEffect) => string;
const detail = (effect: TimelineEffect, key: string) =>
  typeof effect.details[key] === "string" ? effect.details[key] as string : undefined;
const asset = (effect: TimelineEffect) => {
  const code = detail(effect, "asset_code");
  return detail(effect, "asset_type") === "native" ? "XLM" : code ?? "an asset";
};
const amount = (effect: TimelineEffect) => detail(effect, "amount") ?? "an amount of";

// Horizon's documented classic effect names. Optional fields add detail when present.
export const effectDescriptions: Record<string, Description> = {
  account_created: (e) => `Account created${detail(e, "starting_balance") ? ` with ${detail(e, "starting_balance")} XLM` : ""}.`,
  account_removed: () => "Account merged and removed from the ledger.",
  account_credited: (e) => `Account received ${amount(e)} ${asset(e)}.`,
  account_debited: (e) => `Account sent ${amount(e)} ${asset(e)}.`,
  account_thresholds_updated: () => "Account signing thresholds changed.",
  account_home_domain_updated: (e) => `Account home domain changed${detail(e, "home_domain") ? ` to ${detail(e, "home_domain")}` : ""}.`,
  account_flags_updated: () => "Account authorization flags changed.",
  account_inflation_destination_updated: () => "Account inflation destination changed.",
  signer_created: () => "A signer was added to the account.",
  signer_removed: () => "A signer was removed from the account.",
  signer_updated: () => "A signer weight was updated.",
  trustline_created: (e) => `Trustline opened for ${asset(e)}.`,
  trustline_removed: (e) => `Trustline removed for ${asset(e)}.`,
  trustline_updated: (e) => `Trustline settings changed for ${asset(e)}.`,
  trustline_authorized: (e) => `Trustline authorized for ${asset(e)}.`,
  trustline_deauthorized: (e) => `Trustline authorization removed for ${asset(e)}.`,
  offer_created: () => "An exchange offer was created.",
  offer_removed: () => "An exchange offer was removed.",
  offer_updated: () => "An exchange offer was updated.",
  trade: () => "An exchange trade executed.",
  data_created: (e) => `Account data entry${detail(e, "name") ? ` “${detail(e, "name")}”` : ""} created.`,
  data_removed: (e) => `Account data entry${detail(e, "name") ? ` “${detail(e, "name")}”` : ""} removed.`,
  data_updated: (e) => `Account data entry${detail(e, "name") ? ` “${detail(e, "name")}”` : ""} updated.`,
  claimable_balance_created: () => "A claimable balance was created.",
  claimable_balance_claimant_created: () => "A claimant was added to a claimable balance.",
  claimable_balance_claimed: () => "A claimable balance was claimed.",
  account_sponsorship_created: () => "Sponsorship of an account reserve began.",
  account_sponsorship_updated: () => "Sponsorship of an account reserve changed.",
  account_sponsorship_removed: () => "Sponsorship of an account reserve ended.",
  trustline_sponsorship_created: () => "Sponsorship of a trustline reserve began.",
  trustline_sponsorship_updated: () => "Sponsorship of a trustline reserve changed.",
  trustline_sponsorship_removed: () => "Sponsorship of a trustline reserve ended.",
  account_data_sponsorship_created: () => "Sponsorship of an account data reserve began.",
  account_data_sponsorship_updated: () => "Sponsorship of an account data reserve changed.",
  account_data_sponsorship_removed: () => "Sponsorship of an account data reserve ended.",
  claimable_balance_sponsorship_created: () => "Sponsorship of a claimable balance reserve began.",
  claimable_balance_sponsorship_updated: () => "Sponsorship of a claimable balance reserve changed.",
  claimable_balance_sponsorship_removed: () => "Sponsorship of a claimable balance reserve ended.",
  account_signer_sponsorship_created: () => "Sponsorship of a signer reserve began.",
  account_signer_sponsorship_updated: () => "Sponsorship of a signer reserve changed.",
  account_signer_sponsorship_removed: () => "Sponsorship of a signer reserve ended.",
  liquidity_pool_created: () => "A liquidity pool trustline was created.",
  liquidity_pool_removed: () => "A liquidity pool trustline was removed.",
  liquidity_pool_revoked: () => "A liquidity pool trustline was revoked.",
  liquidity_pool_deposited: () => "Assets were deposited into a liquidity pool.",
  liquidity_pool_withdraw: () => "Assets were withdrawn from a liquidity pool.",
  liquidity_pool_trade: () => "A trade executed through a liquidity pool.",
  sequence_bumped: () => "Account sequence number was advanced."
};
