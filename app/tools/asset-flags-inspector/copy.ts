import type { AssetFlagsInspectorErrorCode, InvalidAccountReason, IssuerFlagKey } from "@/app/tools/asset-flags-inspector/types";

export const copy = {
  title: "Asset Issuer Flags Inspector",
  eyebrow: "Issuer clerk",
  idle: "Paste a public issuer account id. The clerk reads Horizon and explains the authorization rules a holder would live with.",
  loadingTitle: "Reading the issuer account",
  loading: "Asking Horizon for this issuer. The lookup is read-only and does not change any flags.",
  emptyTitle: "Before the first lookup",
  empty: "Use the issuer's public account id, the one that starts with G. Secret seeds are rejected on this page and are never sent to Horizon. An account that exists with every flag off is a real result. A missing account is a different message.",
  submit: "Inspect flags",
  submitting: "Reading Horizon...",
  form: {
    label: "Issuer account id",
    hint: "Public account only. It starts with G. A secret seed is rejected before any lookup.",
    placeholder: "G..."
  },
  result: {
    foundTitle: "Issuer account found",
    accountLabel: "Account",
    networkLabel: "Network",
    sequenceLabel: "Sequence",
    flagsTitle: "Authorization flags"
  },
  flagState: {
    on: "On",
    off: "Off"
  },
  networkNames: {
    testnet: "Testnet",
    mainnet: "Mainnet"
  },
  flags: {
    auth_required: {
      label: "Authorization required",
      enabled: "A holder must be authorized by the issuer before they can hold this asset.",
      disabled: "A holder can hold this asset after opening a trustline, without extra approval."
    },
    auth_revocable: {
      label: "Authorization revocable",
      enabled: "The issuer can revoke authorization later and freeze a holder's balance.",
      disabled: "The issuer cannot revoke authorization to freeze a holder's balance."
    },
    auth_immutable: {
      label: "Authorization immutable",
      enabled: "auth_immutable is on, so the other authorization flags can never be changed again.",
      disabled: "auth_immutable is off, so the other three flags can still be changed by the issuer."
    },
    auth_clawback_enabled: {
      label: "Clawback enabled",
      enabled: "The issuer can claw this asset back from a holder.",
      disabled: "The issuer cannot claw this asset back from a holder."
    }
  } satisfies Record<IssuerFlagKey, { label: string; enabled: string; disabled: string }>,
  explanation: {
    title: "What this means for a holder",
    allUnset: "This issuer account exists, and every authorization flag is unset."
  },
  immutable: {
    title: "These flags can never change again",
    body: "auth_immutable is set. auth_required, auth_revocable, and auth_clawback_enabled can never change again. Those three stay adjustable only while auth_immutable is off."
  },
  adjustable: {
    title: "These flags can still change",
    body: "auth_immutable is off. The issuer can still change auth_required, auth_revocable, and auth_clawback_enabled. This page shows the current rules, not a permanent lock."
  },
  bitmask: {
    title: "Raw flag bitmask",
    hint: "Protocol bits: auth_required 1, auth_revocable 2, auth_immutable 4, auth_clawback_enabled 8."
  },
  errors: {
    invalid_account: {
      empty: "Enter the issuer's public account id. It starts with G and is safe to share.",
      secret: "That value is a secret seed, so it was not looked up. Paste the public issuer account id that starts with G.",
      malformed: "That account id is not a valid Stellar public key. Check that it starts with G and that the checksum is intact."
    },
    account_not_found: "No issuer account exists for that id on the selected network. Confirm the public key, then switch testnet or mainnet if you are on the wrong one.",
    rate_limited: "Horizon is rate limiting account lookups. Wait a moment and try again. No flags were changed.",
    request_failed: "The issuer account could not be read from Horizon. Check the connection and try again."
  },
  errorTitles: {
    invalid_account: "Issuer account id needs a fix",
    account_not_found: "Issuer account was not found",
    rate_limited: "Horizon rate limit",
    request_failed: "Horizon lookup failed"
  } satisfies Record<AssetFlagsInspectorErrorCode, string>
};

export function invalidAccountMessage(reason: InvalidAccountReason): string {
  return copy.errors.invalid_account[reason];
}
