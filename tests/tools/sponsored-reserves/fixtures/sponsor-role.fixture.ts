import { StrKey } from "@stellar/stellar-sdk";

export const address = (byte: number) => StrKey.encodeEd25519PublicKey(Buffer.alloc(32, byte));
export const viewedAccount = address(1);
export const otherSponsor = address(2);
export const assetIssuer = address(3);

export const sponsorRoleAccount = {
  account_id: viewedAccount,
  num_sponsoring: 3,
  num_sponsored: 0,
  balances: [{ asset_type: "native", balance: "12.0000000" }],
  signers: [{ key: viewedAccount, weight: 1 }],
  data: {}
};
