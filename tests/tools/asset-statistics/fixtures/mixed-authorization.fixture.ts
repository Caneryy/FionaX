export const mixedAuthorizationIssuer = "GBTL47RTFR5EKMZSXWOQU735WBK7LRPPDIDK3JTNTCZZ7NUBBRDTVSK2";

/**
 * Authorization counters differ, and the claimable amount sits past the float64 mantissa.
 * Integer stroop addition keeps the final digit; `Number` rounds it.
 */
export const mixedAuthorizationRecord = {
  asset_type: "credit_alphanum4",
  asset_code: "MIX",
  asset_issuer: mixedAuthorizationIssuer,
  paging_token: "MIX_mixed",
  accounts: {
    authorized: 1,
    authorized_to_maintain_liabilities: 2,
    unauthorized: 3
  },
  balances: {
    authorized: "0.0000001",
    authorized_to_maintain_liabilities: "0.0000001",
    unauthorized: "0.0000001"
  },
  num_claimable_balances: 4,
  num_liquidity_pools: 1,
  num_contracts: 0,
  claimable_balances_amount: "900719925.4740993",
  liquidity_pools_amount: "0.0000001",
  contracts_amount: "0.0000000",
  flags: {
    auth_required: true,
    auth_revocable: true,
    auth_immutable: false,
    auth_clawback_enabled: true
  }
} as const;

export const mixedCirculatingAmount = "900719925.4740997";
