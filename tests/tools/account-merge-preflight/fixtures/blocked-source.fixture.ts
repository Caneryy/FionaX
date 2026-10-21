import { sourceAccountId } from "./eligible-source.fixture";

export const blockedSourceAccount = {
  account_id: sourceAccountId,
  balances: [
    { asset_type: "native", balance: "2.5000000" },
    { asset_type: "credit_alphanum4", asset_code: "USD", balance: "1.0000000" }
  ],
  signers: [
    { key: sourceAccountId, weight: 1, type: "ed25519_public_key" },
    { key: "GAJZR5RMNUNEK7CRXJVEWXZ5XUXWT7FJGILCDDOITF7EC26RPWJ4UVOE", weight: 1, type: "ed25519_public_key" }
  ],
  data: { config: "aGVsbG8=" },
  num_sponsoring: 1,
  num_sponsored: 0
};

export const blockedOffers = { _embedded: { records: [{ id: "1" }] } };
