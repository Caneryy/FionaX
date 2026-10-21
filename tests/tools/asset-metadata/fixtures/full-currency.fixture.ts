export const ISSUER_ACCOUNT_ID = "GC7YWFLC7GVWZQT3S5J7HBWGFDUOCQ2OJ3JZPW6CSKCCY53645GOPRMW";
export const OTHER_ISSUER_ACCOUNT_ID = "GALBEQFI5VHLRJV67KWN7ROAY2XGCG6QREHFNNDWU63TYT4BNWXJ5Q3B";
export const ASSET_CODE = "USDC";
export const HOME_DOMAIN = "assets.example.com";
export const FIXED_NUMBER = "123456789012345678901234567890";
export const MAX_NUMBER = "2500000";

export const FULL_TOML = `VERSION = "2.0.0"

# Other tables are ignored.
NETWORK_PASSPHRASE = "Test SDF Network ; September 2015"

[[PRINCIPALS]]
name = "Example Anchor"
email = "ops@example.com"

[[CURRENCIES]]
code = "OTHER"
issuer = "${OTHER_ISSUER_ACCOUNT_ID}"
name = "Other coin"
desc = "This entry must not be selected."

[[CURRENCIES]]
code = "${ASSET_CODE}"
issuer = "${ISSUER_ACCOUNT_ID}"
status = "live"
display_decimals = 2
name = "USD Coin"
desc = """
A published description
of the asset.
"""
conditions = "Redemption follows the issuer policy."
image = "https://cdn.example.com/usdc.png"
fixed_number = ${FIXED_NUMBER}
max_number = 2_500_000
is_unlimited = false
is_asset_anchored = true
anchor_asset_type = "fiat"
anchor_asset = "USD"
attestation_of_reserve = "https://example.com/attestation"
redemption_instructions = "Contact the issuer through the published domain."
collateral_addresses = ["0xabc", "0xdef"]
collateral_address_signatures = ["sig-one"]
approval_server = "https://example.com/approve"
approval_criteria = "The issuer decides who may hold the asset."
regulated = true
extra_note = "Shown because the file published it."

[DOCUMENTATION]
ORG_NAME = "Example Anchor"
ORG_URL = "https://assets.example.com"
`;

export const HORIZON_ACCOUNT = {
  id: ISSUER_ACCOUNT_ID,
  account_id: ISSUER_ACCOUNT_ID,
  home_domain: HOME_DOMAIN,
  sequence: "1"
};
