import { ASSET_CODE, ISSUER_ACCOUNT_ID } from "@/tests/tools/asset-metadata/fixtures/full-currency.fixture";

export const PARTIAL_TOML = `[[CURRENCIES]]
code = "${ASSET_CODE}"
issuer = "${ISSUER_ACCOUNT_ID}"
name = "USD Coin"
`;

export const PARTIAL_PRESENT_KEYS = ["code", "issuer", "name"] as const;

export const PARTIAL_ABSENT_KEYS = ["desc", "image", "conditions"] as const;
