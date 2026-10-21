import { fixtureAccountId } from "./mixed-signers.fixture";

export const singleSignerAccount = {
  account_id: fixtureAccountId,
  thresholds: { low_threshold: 0, med_threshold: 0, high_threshold: 0 },
  signers: [{ key: fixtureAccountId, weight: 1, type: "ed25519_public_key" }]
};
