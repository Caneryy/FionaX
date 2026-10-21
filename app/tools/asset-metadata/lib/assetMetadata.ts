"use server";

import { validateAssetMetadataInput } from "@/app/tools/asset-metadata/schema";
import { buildMetadataFields } from "@/app/tools/asset-metadata/lib/currency-fields";
import { matchCurrency } from "@/app/tools/asset-metadata/lib/currency-match";
import { resolveHomeDomain } from "@/app/tools/asset-metadata/lib/home-domain";
import { fetchCurrencyEntries } from "@/app/tools/asset-metadata/lib/toml-fetch";
import { toToolError } from "@/app/tools/asset-metadata/lib/assetMetadata.errors";
import type { AssetMetadataInput, AssetMetadataOutcome, FetchLike } from "@/app/tools/asset-metadata/types";

// The browser calls this as a server action so issuer hosts are not blocked by CORS.
interface AssetMetadataDeps {
  fetchImpl?: FetchLike;
}

// Validate the account id and asset code before Horizon or stellar.toml is requested.
export async function runAssetMetadata(input: AssetMetadataInput, deps: AssetMetadataDeps = {}): Promise<AssetMetadataOutcome> {
  const validated = validateAssetMetadataInput(input);
  if (!validated.ok) return validated;

  const fetchImpl = deps.fetchImpl ?? ((url: string, init?: RequestInit) => globalThis.fetch(url, init));

  try {
    const domain = await resolveHomeDomain(validated.input.issuerAccountId, validated.input.network, fetchImpl);
    if (!domain.ok) return domain;

    const toml = await fetchCurrencyEntries(domain.homeDomain, fetchImpl);
    if (!toml.ok) return toml;

    const matched = matchCurrency(toml.entries, validated.input.assetCode, validated.input.issuerAccountId);
    if (!matched.ok) return matched;

    return {
      ok: true,
      result: {
        issuerAccountId: validated.input.issuerAccountId,
        assetCode: validated.input.assetCode,
        network: validated.input.network,
        homeDomain: toml.homeDomain,
        tomlUrl: toml.tomlUrl,
        fields: buildMetadataFields(matched.entry),
        selfPublished: true
      }
    };
  } catch (error) {
    return { ok: false, error: toToolError(error) };
  }
}
