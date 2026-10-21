import type { StellarNetwork } from "@/lib/stellar/horizon";

export const ASSET_METADATA_ERROR_CODES = [
  "invalid_account",
  "invalid_asset_code",
  "account_not_found",
  "missing_home_domain",
  "toml_unreachable",
  "currency_not_found",
  "malformed_toml",
  "request_failed"
] as const;

export type AssetMetadataErrorCode = (typeof ASSET_METADATA_ERROR_CODES)[number];

export const CURRENCY_FIELD_KEYS = [
  "code",
  "code_template",
  "issuer",
  "name",
  "desc",
  "conditions",
  "image",
  "status",
  "display_decimals",
  "fixed_number",
  "max_number",
  "is_unlimited",
  "is_asset_anchored",
  "anchor_asset_type",
  "anchor_asset",
  "attestation_of_reserve",
  "redemption_instructions",
  "collateral_addresses",
  "collateral_address_signatures",
  "approval_server",
  "approval_criteria",
  "regulated"
] as const;

export type CurrencyFieldKey = (typeof CURRENCY_FIELD_KEYS)[number];

export type FieldKind = "text" | "amount" | "integer" | "boolean" | "url" | "list";

export interface AssetMetadataInput {
  issuerAccountId: string;
  assetCode: string;
  network: StellarNetwork;
}

export interface AssetMetadataError {
  code: AssetMetadataErrorCode;
  message: string;
}

export interface MetadataField {
  key: string;
  label: string;
  present: boolean;
  display: string | null;
  href: string | null;
  imageUrl: string | null;
}

export interface AssetMetadataResult {
  issuerAccountId: string;
  assetCode: string;
  network: StellarNetwork;
  homeDomain: string;
  tomlUrl: string;
  fields: readonly MetadataField[];
  selfPublished: true;
}

export type AssetMetadataViewState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; result: AssetMetadataResult }
  | { status: "error"; error: AssetMetadataError };

export type FetchLike = (url: string, init?: RequestInit) => Promise<Response>;

export type AssetMetadataOutcome =
  | { ok: true; result: AssetMetadataResult }
  | { ok: false; error: AssetMetadataError };
