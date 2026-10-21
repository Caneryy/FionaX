import type { StellarNetwork } from "@/lib/stellar/horizon";
import type { AssetMetadataErrorCode, CurrencyFieldKey } from "@/app/tools/asset-metadata/types";

export const copy = {
  title: "Asset stellar.toml Metadata Viewer",
  eyebrow: "Metadata clerk",
  intro:
    "Reads the CURRENCIES entry an issuer published for one asset code. The file is self-published and is not independently verified.",
  idle: "Paste a public issuer account ID and an asset code. The clerk checks Horizon for home_domain, then reads stellar.toml.",
  loading: "Fetching the issuer account and stellar.toml.",
  empty: "Nothing has been looked up yet. Add the issuer account ID and asset code, then read the published entry.",
  emptyBoundary:
    "An account with no home_domain is reported on its own. A home_domain whose stellar.toml cannot be reached is a different result.",
  issuerLabel: "Issuer account ID",
  issuerHint: "Public account ID starting with G. Secret seeds are rejected and are never repeated in an error.",
  issuerPlaceholder: "G...",
  assetCodeLabel: "Asset code",
  assetCodeHint: "1 to 12 letters or digits. Matching is exact, including case.",
  assetCodePlaceholder: "USDC",
  networkHint: (networkLabel: string) => `Horizon network for this lookup: ${networkLabel}.`,
  submit: "Read metadata",
  submitting: "Reading...",
  errorTitle: "Metadata was not loaded",
  unverifiedBadge: "Self-published",
  unverifiedDetail:
    "Every field below was published by the issuer in stellar.toml. It is not independently verified, and it is not an on-chain attestation.",
  resultIntro:
    "Matched CURRENCIES entry from the issuer's stellar.toml. Absent fields stay visible so a missing value is not mistaken for a field the file never had.",
  resultHomeDomain: "Home domain",
  resultTomlUrl: "stellar.toml URL",
  resultNetwork: "Network",
  fieldsHeading: "Currency fields",
  imageAlt: "Image published by the issuer, not independently verified",
  booleanYes: "Yes",
  booleanNo: "No",
  redactedSecret: "A secret seed was hidden and is not shown.",
  missingField: (label: string) => `${label} is not published in this CURRENCIES entry.`,
  tomlUnreachableTitle: "stellar.toml could not be reached",
  tomlMalformedTitle: "stellar.toml could not be parsed",
  networkLabels: {
    testnet: "Testnet",
    mainnet: "Mainnet"
  } satisfies Record<StellarNetwork, string>,
  fieldLabels: {
    code: "Asset code",
    code_template: "Code template",
    issuer: "Issuer",
    name: "Name",
    desc: "Description",
    conditions: "Conditions",
    image: "Image",
    status: "Status",
    display_decimals: "Display decimals",
    fixed_number: "Fixed number",
    max_number: "Max number",
    is_unlimited: "Unlimited supply",
    is_asset_anchored: "Asset anchored",
    anchor_asset_type: "Anchor asset type",
    anchor_asset: "Anchor asset",
    attestation_of_reserve: "Attestation of reserve",
    redemption_instructions: "Redemption instructions",
    collateral_addresses: "Collateral addresses",
    collateral_address_signatures: "Collateral address signatures",
    approval_server: "Approval server",
    approval_criteria: "Approval criteria",
    regulated: "Regulated"
  } satisfies Record<CurrencyFieldKey, string>,
  errors: {
    invalid_account:
      "Enter the issuer's public account ID. It starts with G and is 56 characters. Secret seeds are rejected and are not shown.",
    invalid_asset_code:
      "Enter an asset code of 1 to 12 letters or digits, such as USDC. The code is matched exactly, including capitalization.",
    account_not_found:
      "Horizon has no account for that issuer ID on the selected network. Check the account ID and switch testnet or mainnet if needed.",
    missing_home_domain:
      "This issuer account exists, but Horizon does not report a home_domain. There is no stellar.toml URL to open. This is separate from a domain whose file cannot be downloaded.",
    toml_unreachable:
      "The issuer published a home_domain, but stellar.toml could not be downloaded. The host may be offline, refusing the connection, or not a usable hostname.",
    currency_not_found:
      "The stellar.toml file has no CURRENCIES entry for this asset code and issuer. Check the code, including capitalization, and confirm the issuer published it.",
    malformed_toml:
      "A stellar.toml response was downloaded, but it is not valid TOML, so the CURRENCIES list could not be read.",
    request_failed: "Horizon did not return the issuer account. Wait a moment and try the lookup again."
  } satisfies Record<AssetMetadataErrorCode, string>
};
