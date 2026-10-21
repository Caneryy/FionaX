import type { IssuerFlags } from "@/app/tools/asset-flags-inspector/types";

/** Deterministic public key. No secret is stored in this fixture. */
export const fixtureAccountId = "GA2LU5P6H37RS7XAVWT4SP3OJ2RBQWQZZZPLXOO3O3THVV36FF4B47NB";

export const allFlagsSetSequence = "17200000000000000001";

export const allFlagsSetFlags: IssuerFlags = {
  auth_required: true,
  auth_revocable: true,
  auth_immutable: true,
  auth_clawback_enabled: true
};

export const allFlagsSetHorizonAccount = {
  id: fixtureAccountId,
  account_id: fixtureAccountId,
  sequence: allFlagsSetSequence,
  subentry_count: 0,
  last_modified_ledger: 42,
  flags: allFlagsSetFlags,
  thresholds: {
    low_threshold: 0,
    med_threshold: 0,
    high_threshold: 0
  },
  balances: [
    {
      balance: "10000.0000000",
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
