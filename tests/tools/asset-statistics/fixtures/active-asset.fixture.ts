export const activeAssetIssuer = "GDVEU3DD4KOFECV66VIHWEZOYX4ZKR3WV27L464SIIPOU2IUI3JCZA57";

/** Horizon `/assets` record for an issued asset with holders in every balance bucket. */
export const activeAssetRecord = {
  asset_type: "credit_alphanum4",
  asset_code: "USDC",
  asset_issuer: activeAssetIssuer,
  paging_token: "USDC_active",
  accounts: {
    authorized: 120,
    authorized_to_maintain_liabilities: 4,
    unauthorized: 2
  },
  balances: {
    authorized: "1000000.5000000",
    authorized_to_maintain_liabilities: "25.0000001",
    unauthorized: "3.2500000"
  },
  num_claimable_balances: 6,
  num_liquidity_pools: 1,
  num_contracts: 1,
  claimable_balances_amount: "10.0000000",
  liquidity_pools_amount: "2.0000000",
  contracts_amount: "0.5000000",
  flags: {
    auth_required: true,
    auth_revocable: false,
    auth_immutable: false,
    auth_clawback_enabled: false
  }
} as const;

export const activeCirculatingAmount = "1000041.2500001";
