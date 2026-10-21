export const sourceAccountId = "GDVEU3DD4KOFECV66VIHWEZOYX4ZKR3WV27L464SIIPOU2IUI3JCZA57";
export const destinationAccountId = "GAJZR5RMNUNEK7CRXJVEWXZ5XUXWT7FJGILCDDOITF7EC26RPWJ4UVOE";

export const eligibleBalance = "10.0000000";
export const eligibleStroops = 100000000n;

export const eligibleSourceAccount = {
  account_id: sourceAccountId,
  balances: [{ asset_type: "native", balance: eligibleBalance }],
  signers: [{ key: sourceAccountId, weight: 1, type: "ed25519_public_key" }],
  data: {},
  num_sponsoring: 0,
  num_sponsored: 0
};

export const emptyOffers = { _embedded: { records: [] } };

export const destinationAccount = { account_id: destinationAccountId };
