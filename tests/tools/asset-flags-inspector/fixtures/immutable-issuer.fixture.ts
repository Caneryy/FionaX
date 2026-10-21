import type { IssuerFlags } from "@/app/tools/asset-flags-inspector/types";

export const fixtureAccountId = "GA2LU5P6H37RS7XAVWT4SP3OJ2RBQWQZZZPLXOO3O3THVV36FF4B47NB";

export const immutableIssuerSequence = "17200000000000000003";

/** Required authorization, locked. Revocation and clawback stay off and cannot be turned on later. */
export const immutableIssuerFlags: IssuerFlags = {
  auth_required: true,
  auth_revocable: false,
  auth_immutable: true,
  auth_clawback_enabled: false
};

export const immutableIssuerHorizonAccount = {
  id: fixtureAccountId,
  account_id: fixtureAccountId,
  sequence: immutableIssuerSequence,
  subentry_count: 1,
  last_modified_ledger: 44,
  flags: immutableIssuerFlags,
  thresholds: {
    low_threshold: 1,
    med_threshold: 1,
    high_threshold: 1
  },
  balances: [
    {
      balance: "20.0000000",
      asset_type: "native"
    }
  ],
  signers: [
    {
      weight: 1,
      key: fixtureAccountId,
      type: "ed25519_public_key"
    }
  ],
  num_sponsoring: 0,
  num_sponsored: 0
};
