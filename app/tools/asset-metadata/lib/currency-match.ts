import { errorFor } from "@/app/tools/asset-metadata/lib/assetMetadata.errors";
import type { CurrencyEntry } from "@/app/tools/asset-metadata/lib/stellar-toml";
import type { AssetMetadataError } from "@/app/tools/asset-metadata/types";

export type CurrencyMatchResult =
  | { ok: true; entry: CurrencyEntry }
  | { ok: false; error: AssetMetadataError };

function stringField(entry: CurrencyEntry, key: string): string | null {
  const value = entry.values[key];
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

// Prefer an entry that names this issuer. An entry that omits issuer can still match the code.
export function matchCurrency(
  entries: readonly CurrencyEntry[],
  assetCode: string,
  issuerAccountId: string
): CurrencyMatchResult {
  const candidates = entries.filter((entry) => {
    const code = stringField(entry, "code");
    const template = stringField(entry, "code_template");
    const codeMatches = code === assetCode || (code === null && template === assetCode);
    if (!codeMatches) return false;
    const issuer = stringField(entry, "issuer");
    return issuer === null || issuer === issuerAccountId;
  });

  const explicit = candidates.find((entry) => stringField(entry, "issuer") === issuerAccountId);
  const open = candidates.find((entry) => stringField(entry, "issuer") === null);
  const chosen = explicit ?? open;
  if (!chosen) {
    return { ok: false, error: errorFor("currency_not_found") };
  }
  return { ok: true, entry: chosen };
}
