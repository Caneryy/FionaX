import { errorFor } from "@/app/tools/asset-metadata/lib/assetMetadata.errors";
import { parseCurrencyEntries, TomlParseError, type CurrencyEntry } from "@/app/tools/asset-metadata/lib/stellar-toml";
import type { AssetMetadataError, FetchLike } from "@/app/tools/asset-metadata/types";

const MAX_TOML_CHARS = 512 * 1024;
const HOSTNAME =
  /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)*[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

export type TomlFetchResult =
  | { ok: true; homeDomain: string; tomlUrl: string; entries: readonly CurrencyEntry[] }
  | { ok: false; error: AssetMetadataError };

export function normalizeHomeDomain(raw: string): string | null {
  let value = raw.trim().toLowerCase();
  if (!value) return null;
  if (value.endsWith(".")) value = value.slice(0, -1);

  const scheme = value.match(/^([a-z][a-z0-9+.-]*):\/\//);
  if (scheme) {
    if (scheme[1] !== "https" && scheme[1] !== "http") return null;
    value = value.slice(scheme[0].length);
  }

  if (/[/?#\\@:\s]/.test(value) || value.includes("..")) return null;
  if (!HOSTNAME.test(value)) return null;
  return value;
}

export function stellarTomlUrl(homeDomain: string): string | null {
  const host = normalizeHomeDomain(homeDomain);
  if (!host) return null;
  return `https://${host}/.well-known/stellar.toml`;
}

export async function fetchCurrencyEntries(homeDomain: string, fetchImpl: FetchLike): Promise<TomlFetchResult> {
  const tomlUrl = stellarTomlUrl(homeDomain);
  if (!tomlUrl) {
    return { ok: false, error: errorFor("toml_unreachable") };
  }

  let response: Response;
  try {
    response = await fetchImpl(tomlUrl, {
      method: "GET",
      cache: "no-store",
      redirect: "follow",
      headers: { Accept: "application/toml, text/plain;q=0.9, */*;q=0.8" }
    });
  } catch {
    return { ok: false, error: errorFor("toml_unreachable") };
  }

  if (!response.ok) {
    return { ok: false, error: errorFor("toml_unreachable") };
  }

  let body: string;
  try {
    body = await response.text();
  } catch {
    return { ok: false, error: errorFor("toml_unreachable") };
  }

  if (body.length > MAX_TOML_CHARS) {
    return { ok: false, error: errorFor("malformed_toml") };
  }

  try {
    const entries = parseCurrencyEntries(body);
    return {
      ok: true,
      homeDomain: new URL(tomlUrl).host,
      tomlUrl,
      entries
    };
  } catch (error) {
    if (error instanceof TomlParseError) {
      return { ok: false, error: errorFor("malformed_toml") };
    }
    return { ok: false, error: errorFor("request_failed") };
  }
}
