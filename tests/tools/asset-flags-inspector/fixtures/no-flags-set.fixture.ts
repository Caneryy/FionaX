import type { IssuerFlags } from "@/app/tools/asset-flags-inspector/types";

export const fixtureAccountId = "GA2LU5P6H37RS7XAVWT4SP3OJ2RBQWQZZZPLXOO3O3THVV36FF4B47NB";

export const noFlagsSetSequence = "17200000000000000002";

export const noFlagsSetFlags: IssuerFlags = {
  auth_required: false,
  auth_revocable: false,
  auth_immutable: false,
  auth_clawback_enabled: false
};

/** Existing account. Every authorization flag is unset. This is not a 404. */
export const noFlagsSetHorizonAccount = {
  id: fixtureAccountId,
  account_id: fixtureAccountId,
  sequence: noFlagsSetSequence,
  subentry_count: 0,
  last_modified_ledger: 43,
  flags: noFlagsSetFlags,
  thresholds: {
    low_threshold: 0,
    med_threshold: 0,
    high_threshold: 0
  },
  balances: [
    {
      balance: "1.0000000",
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
