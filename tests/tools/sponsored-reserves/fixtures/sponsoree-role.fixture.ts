import { assetIssuer, otherSponsor, viewedAccount } from "./sponsor-role.fixture";

export const sponsoreeRoleAccount = {
  account_id: viewedAccount,
  sponsor: otherSponsor,
  num_sponsoring: 3,
  num_sponsored: 6,
  balances: [
    { asset_type: "native", balance: "0.0000000" },
    { asset_type: "credit_alphanum4", asset_code: "USD", asset_issuer: assetIssuer, balance: "5.0000000", sponsor: otherSponsor }
  ],
  signers: [{ key: viewedAccount, weight: 1 }, { key: assetIssuer, weight: 1, sponsor: otherSponsor }],
  data: { memo: "eA==" }
};
