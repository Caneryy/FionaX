export const zeroTrustlineIssuer = "GD6ROJBYLKQMOW3E7N4M2YBPUHMZD7PL65VRHRMO24BOVSBV5H3BQRSL";

/**
 * The asset exists on Horizon, but every trustline counter is zero.
 * One claimable balance remains so the empty state can still show that count.
 */
export const zeroTrustlineAssetRecord = {
  asset_type: "credit_alphanum12",
  asset_code: "ZEROCLAIMABL",
  asset_issuer: zeroTrustlineIssuer,
  paging_token: "ZEROCLAIMABL_empty",
  accounts: {
    authorized: 0,
    authorized_to_maintain_liabilities: 0,
    unauthorized: 0
  },
  balances: {
    authorized: "0.0000000",
    authorized_to_maintain_liabilities: "0.0000000",
    unauthorized: "0.0000000"
  },
  num_claimable_balances: 1,
  num_liquidity_pools: 0,
  num_contracts: 0,
  claimable_balances_amount: "15.0000000",
  liquidity_pools_amount: "0.0000000",
  contracts_amount: "0.0000000",
  flags: {
    auth_required: false,
    auth_revocable: false,
    auth_immutable: false,
    auth_clawback_enabled: false
  }
} as const;

export const zeroTrustlineCirculatingAmount = "15.0000000";
