import { viewedAccount } from "./sponsor-role.fixture";

export const noSponsorshipAccount = {
  account_id: viewedAccount,
  num_sponsoring: 0,
  num_sponsored: 0,
  balances: [{ asset_type: "native", balance: "4.0000000" }],
  signers: [{ key: viewedAccount, weight: 1 }],
  data: {}
};
