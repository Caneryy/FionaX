import type { AssetStatisticsErrorCode } from "@/app/tools/asset-statistics/types";

export const copy = {
  title: "Asset Supply & Trustline Statistics",
  eyebrow: "Supply clerk",
  character:
    "The supply clerk reads one Horizon asset record and counts trustlines, claimable balances, and the circulating amount.",
  idleTitle: "No asset loaded yet",
  idleBody:
    "Enter an asset code and the issuer public account ID. The clerk will read Horizon's asset aggregate for that pair on the network selected in the header.",
  submit: "Load statistics",
  loadingButton: "Reading Horizon...",
  loadingTitle: "Reading the asset aggregate",
  loadingBody: "Asking Horizon for accounts, claimable balances, authorization counts, and balances.",
  errorTitle: "Statistics could not be loaded",
  supplyTitle: "Circulating supply",
  supplyCaption:
    "Sum of account balances in every authorization state, plus amounts held by claimable balances, liquidity pools, and contracts.",
  accountsHoldingLabel: "Accounts holding the asset",
  claimableBalancesHoldingLabel: "Claimable balances holding the asset",
  authorizedBalanceLabel: "Authorized balance",
  liabilitiesBalanceLabel: "Authorized to maintain liabilities balance",
  unauthorizedBalanceLabel: "Unauthorized balance",
  claimableAmountLabel: "Claimable balance amount",
  liquidityPoolsAmountLabel: "Liquidity pool amount",
  contractsAmountLabel: "Contract amount",
  authorizationTitle: "Trustline authorization",
  authorizationCaption: "Each count is a separate authorization state. They are not combined into one trustline total until the last row.",
  authorizedLabel: "Authorized",
  liabilitiesLabel: "Authorized to maintain liabilities",
  unauthorizedLabel: "Unauthorized",
  totalTrustlinesLabel: "All trustlines",
  assetCodeLabel: "Asset code",
  assetCodeHint: "1 to 12 letters or digits. A 1–4 character code is alphanum4; 5–12 characters is alphanum12. Casing is kept as entered.",
  assetCodePlaceholder: "USDC",
  issuerLabel: "Issuer account ID",
  issuerHint: "Public account ID starting with G. Secret seeds are rejected and are never sent to Horizon.",
  issuerPlaceholder: "G...",
  snapshotNotice:
    "Point-in-time snapshot. These numbers are Horizon's aggregate at the moment it answered, not a live feed.",
  snapshotCapturedLabel: "Captured",
  zeroTrustlinesTitle: "This asset has zero trustlines",
  zeroTrustlinesBody:
    "Horizon returned this asset, and no account is authorized, authorized to maintain liabilities, or unauthorized. That is an empty trustline book, not an invalid issuer and not a missing asset.",
  resultTitle: "Asset snapshot",
  issuerValueLabel: "Issuer",
  errors: {
    invalid_asset_code:
      "Enter an asset code made of 1 to 12 letters or digits, with no spaces or punctuation. Use the code's ledger casing, such as USDC.",
    invalid_issuer:
      "Enter the issuer's public account ID. It must start with G and pass the Stellar checksum. Secret seeds are rejected and are not stored or sent.",
    asset_not_found:
      "Horizon has no asset for that exact code and issuer on this network. Check the casing, the issuer, and whether you are on testnet or mainnet.",
    rate_limited: "Horizon is rate limiting this lookup. Wait a moment, then load the asset statistics again.",
    request_failed:
      "The asset statistics request did not complete. Check the connection and try the same code and issuer again."
  } satisfies Record<AssetStatisticsErrorCode, string>,
  errorTitles: {
    invalid_asset_code: "Check the asset code",
    invalid_issuer: "Check the issuer account ID",
    asset_not_found: "No matching asset on this network",
    rate_limited: "Horizon is rate limiting requests",
    request_failed: "The lookup did not finish"
  } satisfies Record<AssetStatisticsErrorCode, string>
} as const;
