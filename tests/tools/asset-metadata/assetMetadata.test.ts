import { describe, expect, it } from "vitest";
import { Keypair } from "@stellar/stellar-sdk";
import { copy } from "@/app/tools/asset-metadata/copy";
import { runAssetMetadata } from "@/app/tools/asset-metadata/lib/assetMetadata";
import { horizonAccountUrl } from "@/app/tools/asset-metadata/lib/home-domain";
import { stellarTomlUrl } from "@/app/tools/asset-metadata/lib/toml-fetch";
import type { FetchLike } from "@/app/tools/asset-metadata/types";
import {
  ASSET_CODE,
  FULL_TOML,
  HOME_DOMAIN,
  HORIZON_ACCOUNT,
  ISSUER_ACCOUNT_ID
} from "@/tests/tools/asset-metadata/fixtures/full-currency.fixture";
import { MALFORMED_TOML } from "@/tests/tools/asset-metadata/fixtures/malformed-toml.fixture";
import { HORIZON_ACCOUNT_WITHOUT_DOMAIN } from "@/tests/tools/asset-metadata/fixtures/missing-domain.fixture";
import { PARTIAL_ABSENT_KEYS, PARTIAL_TOML } from "@/tests/tools/asset-metadata/fixtures/partial-currency.fixture";

function routedFetch(routes: Record<string, Response | "throw">): { fetchImpl: FetchLike; calls: string[] } {
  const calls: string[] = [];
  const fetchImpl: FetchLike = async (url) => {
    calls.push(url);
    const route = routes[url];
    if (!route || route === "throw") throw new Error("fixture transport failure");
    return route;
  };
  return { fetchImpl, calls };
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" }
  });
}

function text(body: string, status = 200): Response {
  return new Response(body, { status, headers: { "content-type": "text/plain" } });
}

describe("runAssetMetadata", () => {
  it("does not fetch when the issuer or asset code is invalid", async () => {
    const seed = Keypair.random().secret();
    const { fetchImpl, calls } = routedFetch({});
    const secret = await runAssetMetadata(
      { issuerAccountId: seed, assetCode: ASSET_CODE, network: "testnet" },
      { fetchImpl }
    );
    const badCode = await runAssetMetadata(
      { issuerAccountId: ISSUER_ACCOUNT_ID, assetCode: "TOO LONG CODE", network: "testnet" },
      { fetchImpl }
    );
    expect(calls).toEqual([]);
    expect(JSON.stringify(secret)).not.toContain(seed);
    expect(secret.ok).toBe(false);
    expect(badCode.ok).toBe(false);
    if (!secret.ok) expect(secret.error.code).toBe("invalid_account");
    if (!badCode.ok) expect(badCode.error.code).toBe("invalid_asset_code");
  });

  it("loads the matching self-published entry from fixtures", async () => {
    const accountUrl = horizonAccountUrl(ISSUER_ACCOUNT_ID, "testnet");
    const tomlUrl = stellarTomlUrl(HOME_DOMAIN);
    const { fetchImpl, calls } = routedFetch({
      [accountUrl]: json(HORIZON_ACCOUNT),
      [tomlUrl ?? ""]: text(FULL_TOML)
    });
    const outcome = await runAssetMetadata(
      { issuerAccountId: ` ${ISSUER_ACCOUNT_ID} `, assetCode: ASSET_CODE, network: "testnet" },
      { fetchImpl }
    );

    expect(calls).toEqual([accountUrl, tomlUrl]);
    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      expect(outcome.result.selfPublished).toBe(true);
      expect(outcome.result.homeDomain).toBe(HOME_DOMAIN);
      expect(outcome.result.tomlUrl).toBe(tomlUrl);
      expect(outcome.result.fields.find((field) => field.key === "name")?.display).toBe("USD Coin");
      expect(outcome.result.fields.find((field) => field.key === "desc")?.present).toBe(true);
      expect(outcome.result.fields.find((field) => field.key === "image")?.present).toBe(true);
      expect(outcome.result.fields.find((field) => field.key === "conditions")?.present).toBe(true);
      expect(outcome.result.fields.find((field) => field.key === "code_template")?.present).toBe(false);
      expect(JSON.stringify(outcome.result)).not.toContain("This entry must not be selected.");
    }
  });

  it("keeps absent fields on a partial currency", async () => {
    const accountUrl = horizonAccountUrl(ISSUER_ACCOUNT_ID, "mainnet");
    const tomlUrl = stellarTomlUrl(HOME_DOMAIN) ?? "";
    const { fetchImpl } = routedFetch({
      [accountUrl]: json(HORIZON_ACCOUNT),
      [tomlUrl]: text(PARTIAL_TOML)
    });
    const outcome = await runAssetMetadata(
      { issuerAccountId: ISSUER_ACCOUNT_ID, assetCode: ASSET_CODE, network: "mainnet" },
      { fetchImpl }
    );
    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      for (const key of PARTIAL_ABSENT_KEYS) {
        expect(outcome.result.fields.find((field) => field.key === key)?.present).toBe(false);
      }
    }
  });

  it("does not request toml when the account has no home domain", async () => {
    const accountUrl = horizonAccountUrl(ISSUER_ACCOUNT_ID, "testnet");
    const { fetchImpl, calls } = routedFetch({
      [accountUrl]: json(HORIZON_ACCOUNT_WITHOUT_DOMAIN)
    });
    const outcome = await runAssetMetadata(
      { issuerAccountId: ISSUER_ACCOUNT_ID, assetCode: ASSET_CODE, network: "testnet" },
      { fetchImpl }
    );
    expect(calls).toEqual([accountUrl]);
    expect(outcome).toEqual({ ok: false, error: { code: "missing_home_domain", message: copy.errors.missing_home_domain } });
  });

  it("maps account 404, unreachable toml, malformed toml, and a missing currency", async () => {
    const accountUrl = horizonAccountUrl(ISSUER_ACCOUNT_ID, "testnet");
    const tomlUrl = stellarTomlUrl(HOME_DOMAIN) ?? "";

    const missingAccount = await runAssetMetadata(
      { issuerAccountId: ISSUER_ACCOUNT_ID, assetCode: ASSET_CODE, network: "testnet" },
      { fetchImpl: routedFetch({ [accountUrl]: json({ status: 404 }, 404) }).fetchImpl }
    );
    const unreachable = await runAssetMetadata(
      { issuerAccountId: ISSUER_ACCOUNT_ID, assetCode: ASSET_CODE, network: "testnet" },
      { fetchImpl: routedFetch({ [accountUrl]: json(HORIZON_ACCOUNT), [tomlUrl]: text("nope", 502) }).fetchImpl }
    );
    const malformed = await runAssetMetadata(
      { issuerAccountId: ISSUER_ACCOUNT_ID, assetCode: ASSET_CODE, network: "testnet" },
      { fetchImpl: routedFetch({ [accountUrl]: json(HORIZON_ACCOUNT), [tomlUrl]: text(MALFORMED_TOML) }).fetchImpl }
    );
    const notFound = await runAssetMetadata(
      { issuerAccountId: ISSUER_ACCOUNT_ID, assetCode: "NOTHERE", network: "testnet" },
      { fetchImpl: routedFetch({ [accountUrl]: json(HORIZON_ACCOUNT), [tomlUrl]: text(FULL_TOML) }).fetchImpl }
    );
    const badHost = await runAssetMetadata(
      { issuerAccountId: ISSUER_ACCOUNT_ID, assetCode: ASSET_CODE, network: "testnet" },
      {
        fetchImpl: routedFetch({
          [accountUrl]: json({ ...HORIZON_ACCOUNT, home_domain: "not a host" })
        }).fetchImpl
      }
    );

    expect(missingAccount.ok).toBe(false);
    expect(unreachable.ok).toBe(false);
    expect(malformed.ok).toBe(false);
    expect(notFound.ok).toBe(false);
    expect(badHost.ok).toBe(false);
    if (!missingAccount.ok) expect(missingAccount.error.code).toBe("account_not_found");
    if (!unreachable.ok) expect(unreachable.error.code).toBe("toml_unreachable");
    if (!malformed.ok) expect(malformed.error.code).toBe("malformed_toml");
    if (!notFound.ok) expect(notFound.error.code).toBe("currency_not_found");
    if (!badHost.ok) expect(badHost.error.code).toBe("toml_unreachable");
    expect(copy.errors.missing_home_domain).not.toBe(copy.errors.toml_unreachable);
  });
});
