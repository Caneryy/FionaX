import { horizonUrls } from "@/lib/stellar/horizon";
import { errorFor } from "@/app/tools/asset-metadata/lib/assetMetadata.errors";
import type { AssetMetadataError, FetchLike } from "@/app/tools/asset-metadata/types";
import type { StellarNetwork } from "@/lib/stellar/horizon";

export type HomeDomainResult =
  | { ok: true; homeDomain: string }
  | { ok: false; error: AssetMetadataError };

export function horizonAccountUrl(issuerAccountId: string, network: StellarNetwork): string {
  const base = horizonUrls[network].replace(/\/$/, "");
  return `${base}/accounts/${encodeURIComponent(issuerAccountId)}`;
}

function readHomeDomain(payload: unknown): string | null {
  if (!payload || typeof payload !== "object" || !("home_domain" in payload)) return null;
  const homeDomain = (payload as { home_domain?: unknown }).home_domain;
  if (typeof homeDomain !== "string") return null;
  const trimmed = homeDomain.trim();
  return trimmed === "" ? null : trimmed;
}

// A blank or missing home_domain is reported here. Download failures belong to toml-fetch.
export async function resolveHomeDomain(
  issuerAccountId: string,
  network: StellarNetwork,
  fetchImpl: FetchLike
): Promise<HomeDomainResult> {
  const url = horizonAccountUrl(issuerAccountId, network);
  let response: Response;
  try {
    response = await fetchImpl(url, {
      method: "GET",
      cache: "no-store",
      headers: { Accept: "application/json" }
    });
  } catch {
    return { ok: false, error: errorFor("request_failed") };
  }

  if (response.status === 404) {
    return { ok: false, error: errorFor("account_not_found") };
  }
  if (!response.ok) {
    return { ok: false, error: errorFor("request_failed") };
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    return { ok: false, error: errorFor("request_failed") };
  }

  const homeDomain = readHomeDomain(payload);
  if (!homeDomain) {
    return { ok: false, error: errorFor("missing_home_domain") };
  }

  return { ok: true, homeDomain };
}
