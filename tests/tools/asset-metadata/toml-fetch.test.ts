import { describe, expect, it } from "vitest";
import { copy } from "@/app/tools/asset-metadata/copy";
import { fetchCurrencyEntries, normalizeHomeDomain, stellarTomlUrl } from "@/app/tools/asset-metadata/lib/toml-fetch";
import { parseCurrencyEntries, TomlParseError } from "@/app/tools/asset-metadata/lib/stellar-toml";
import type { FetchLike } from "@/app/tools/asset-metadata/types";
import {
  ASSET_CODE,
  FIXED_NUMBER,
  FULL_TOML,
  HOME_DOMAIN,
  ISSUER_ACCOUNT_ID,
  MAX_NUMBER
} from "@/tests/tools/asset-metadata/fixtures/full-currency.fixture";
import { HTML_BODY, MALFORMED_TOML } from "@/tests/tools/asset-metadata/fixtures/malformed-toml.fixture";

function textFetch(status: number, body: string): { fetchImpl: FetchLike; calls: string[] } {
  const calls: string[] = [];
  const fetchImpl: FetchLike = async (url) => {
    calls.push(url);
    return new Response(body, { status, headers: { "content-type": "text/plain" } });
  };
  return { fetchImpl, calls };
}

describe("stellar.toml parsing", () => {
  it("keeps only CURRENCIES and stores integers as decimal strings", () => {
    const entries = parseCurrencyEntries(FULL_TOML);
    expect(entries).toHaveLength(2);
    expect(entries[0].values.code).toBe("OTHER");
    expect(entries[1].values.code).toBe(ASSET_CODE);
    expect(entries[1].values.issuer).toBe(ISSUER_ACCOUNT_ID);
    expect(entries[1].values.fixed_number).toBe(FIXED_NUMBER);
    expect(entries[1].values.max_number).toBe(MAX_NUMBER);
    expect(typeof entries[1].values.fixed_number).toBe("string");
    expect(entries[1].values.display_decimals).toBe("2");
    expect(entries[1].values.is_unlimited).toBe(false);
    expect(entries[1].values.collateral_addresses).toEqual(["0xabc", "0xdef"]);
    expect(entries[1].values.desc).toBe("A published description\nof the asset.\n");
    expect(JSON.stringify(entries)).not.toContain("Example Anchor");
  });

  it("rejects an empty document and the malformed fixture", () => {
    expect(() => parseCurrencyEntries("   ")).toThrow(TomlParseError);
    expect(() => parseCurrencyEntries(MALFORMED_TOML)).toThrow(TomlParseError);
    expect(() => parseCurrencyEntries(HTML_BODY)).toThrow(TomlParseError);
  });
});

describe("fetchCurrencyEntries", () => {
  it("builds an https well-known URL and parses the fixture", async () => {
    expect(stellarTomlUrl(HOME_DOMAIN)).toBe("https://assets.example.com/.well-known/stellar.toml");
    expect(stellarTomlUrl("HTTPS://Assets.Example.com")).toBe("https://assets.example.com/.well-known/stellar.toml");
    expect(normalizeHomeDomain("javascript:alert(1)")).toBeNull();
    expect(stellarTomlUrl("assets.example.com/secret")).toBeNull();
    expect(stellarTomlUrl("user@assets.example.com")).toBeNull();

    const { fetchImpl, calls } = textFetch(200, FULL_TOML);
    const result = await fetchCurrencyEntries(HOME_DOMAIN, fetchImpl);
    expect(calls).toEqual(["https://assets.example.com/.well-known/stellar.toml"]);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.entries).toHaveLength(2);
      expect(result.homeDomain).toBe(HOME_DOMAIN);
    }
  });

  it("does not fetch when the published domain is not a hostname", async () => {
    const calls: string[] = [];
    const fetchImpl: FetchLike = async (url) => {
      calls.push(url);
      return new Response(FULL_TOML, { status: 200 });
    };
    const result = await fetchCurrencyEntries("not a domain", fetchImpl);
    expect(calls).toEqual([]);
    expect(result).toEqual({ ok: false, error: { code: "toml_unreachable", message: copy.errors.toml_unreachable } });
  });

  it("maps HTTP failures and network errors to toml_unreachable", async () => {
    const missing = await fetchCurrencyEntries(HOME_DOMAIN, textFetch(404, "missing").fetchImpl);
    const down = await fetchCurrencyEntries(HOME_DOMAIN, async () => {
      throw new Error("socket-reset");
    });
    expect(missing.ok).toBe(false);
    expect(down.ok).toBe(false);
    if (!missing.ok) expect(missing.error.code).toBe("toml_unreachable");
    if (!down.ok) {
      expect(down.error).toEqual({ code: "toml_unreachable", message: copy.errors.toml_unreachable });
      expect(down.error.message).not.toContain("socket-reset");
    }
  });

  it("maps a downloaded malformed body to malformed_toml", async () => {
    const malformed = await fetchCurrencyEntries(HOME_DOMAIN, textFetch(200, MALFORMED_TOML).fetchImpl);
    const html = await fetchCurrencyEntries(HOME_DOMAIN, textFetch(200, HTML_BODY).fetchImpl);
    expect(malformed.ok).toBe(false);
    expect(html.ok).toBe(false);
    if (!malformed.ok) expect(malformed.error).toEqual({ code: "malformed_toml", message: copy.errors.malformed_toml });
    if (!html.ok) expect(html.error.code).toBe("malformed_toml");
  });
});
