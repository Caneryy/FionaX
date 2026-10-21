import { copy } from "@/app/tools/asset-metadata/copy";
import { formatTomlValue, httpsUrl } from "@/app/tools/asset-metadata/lib/format";
import type { CurrencyEntry } from "@/app/tools/asset-metadata/lib/stellar-toml";
import { CURRENCY_FIELD_KEYS, type CurrencyFieldKey, type FieldKind, type MetadataField } from "@/app/tools/asset-metadata/types";

const URL_FIELDS = new Set<CurrencyFieldKey>(["image", "attestation_of_reserve", "approval_server"]);

export const FIELD_KINDS: Record<CurrencyFieldKey, FieldKind> = {
  code: "text",
  code_template: "text",
  issuer: "text",
  name: "text",
  desc: "text",
  conditions: "text",
  image: "url",
  status: "text",
  display_decimals: "integer",
  fixed_number: "amount",
  max_number: "amount",
  is_unlimited: "boolean",
  is_asset_anchored: "boolean",
  anchor_asset_type: "text",
  anchor_asset: "text",
  attestation_of_reserve: "url",
  redemption_instructions: "text",
  collateral_addresses: "list",
  collateral_address_signatures: "list",
  approval_server: "url",
  approval_criteria: "text",
  regulated: "boolean"
};

function isKnownKey(key: string): key is CurrencyFieldKey {
  return (CURRENCY_FIELD_KEYS as readonly string[]).includes(key);
}

// Every SEP-1 currency field is listed. Missing ones stay in the result so the UI can mark them.
export function buildMetadataFields(entry: CurrencyEntry): MetadataField[] {
  const fields: MetadataField[] = CURRENCY_FIELD_KEYS.map((key) => {
    const value = entry.values[key];
    const present = value !== undefined;
    const href = present && URL_FIELDS.has(key) ? httpsUrl(value) : null;
    return {
      key,
      label: copy.fieldLabels[key],
      present,
      display: present ? formatTomlValue(value, FIELD_KINDS[key]) : null,
      href,
      imageUrl: present && key === "image" ? href : null
    };
  });

  for (const [key, value] of Object.entries(entry.values)) {
    if (isKnownKey(key)) continue;
    if (!/^[A-Za-z0-9_-]{1,40}$/.test(key)) continue;
    fields.push({
      key,
      label: key,
      present: true,
      display: formatTomlValue(value, "text"),
      href: null,
      imageUrl: null
    });
  }

  return fields;
}
