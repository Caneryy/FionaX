import { fixtureAccountId, otherSigner } from "./mixed-signers.fixture";

export const zeroWeightMasterAccount = {
  account_id: fixtureAccountId,
  thresholds: { low_threshold: 1, med_threshold: 1, high_threshold: 1 },
  signers: [
    { key: fixtureAccountId, weight: 0, type: "ed25519_public_key" },
    { key: otherSigner, weight: 1, type: "ed25519_public_key" }
  ]
};
