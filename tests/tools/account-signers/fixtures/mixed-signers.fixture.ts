export const fixtureAccountId = "GDVEU3DD4KOFECV66VIHWEZOYX4ZKR3WV27L464SIIPOU2IUI3JCZA57";
export const otherSigner = "GAJZR5RMNUNEK7CRXJVEWXZ5XUXWT7FJGILCDDOITF7EC26RPWJ4UVOE";
export const hashSigner = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
export const preauthSigner = "preauth-tx-hash-not-an-address";

export const mixedSignersAccount = {
  account_id: fixtureAccountId,
  thresholds: { low_threshold: 1, med_threshold: 2, high_threshold: 3 },
  signers: [
    { key: fixtureAccountId, weight: 1, type: "ed25519_public_key" },
    { key: hashSigner, weight: 2, type: "sha256_hash" },
    { key: preauthSigner, weight: 1, type: "preauth_tx" }
  ]
};
