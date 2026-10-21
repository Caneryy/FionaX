import { describe, expect, it } from "vitest";
import { copy } from "@/app/tools/asset-metadata/copy";
import { horizonAccountUrl, resolveHomeDomain } from "@/app/tools/asset-metadata/lib/home-domain";
import type { FetchLike } from "@/app/tools/asset-metadata/types";
import {
  HOME_DOMAIN,
  HORIZON_ACCOUNT,
  ISSUER_ACCOUNT_ID
} from "@/tests/tools/asset-metadata/fixtures/full-currency.fixture";
import {
  HORIZON_ACCOUNT_BLANK_DOMAIN,
  HORIZON_ACCOUNT_WITHOUT_DOMAIN
} from "@/tests/tools/asset-metadata/fixtures/missing-domain.fixture";

function jsonFetch(status: number, body: unknown): { fetchImpl: FetchLike; calls: string[] } {
  const calls: string[] = [];
  const fetchImpl: FetchLike = async (url) => {
    calls.push(url);
    return new Response(JSON.stringify(body), {
      status,
      headers: { "content-type": "application/json" }
    });
  };
  return { fetchImpl, calls };
}

describe("resolveHomeDomain", () => {
  it("requests Horizon /accounts/{id} on the selected network", async () => {
    const testnet = jsonFetch(200, HORIZON_ACCOUNT);
    const mainnet = jsonFetch(200, HORIZON_ACCOUNT);
    const testnetResult = await resolveHomeDomain(ISSUER_ACCOUNT_ID, "testnet", testnet.fetchImpl);
    const mainnetResult = await resolveHomeDomain(ISSUER_ACCOUNT_ID, "mainnet", mainnet.fetchImpl);

    expect(testnet.calls).toEqual([horizonAccountUrl(ISSUER_ACCOUNT_ID, "testnet")]);
    expect(mainnet.calls).toEqual([horizonAccountUrl(ISSUER_ACCOUNT_ID, "mainnet")]);
    expect(testnet.calls[0]).toContain("horizon-testnet.stellar.org/accounts/");
    expect(mainnet.calls[0]).toContain("horizon.stellar.org/accounts/");
    expect(testnetResult).toEqual({ ok: true, homeDomain: HOME_DOMAIN });
    expect(mainnetResult.ok).toBe(true);
  });

  it("maps a 404 to account_not_found", async () => {
    const { fetchImpl } = jsonFetch(404, { status: 404 });
    const result = await resolveHomeDomain(ISSUER_ACCOUNT_ID, "testnet", fetchImpl);
    expect(result).toEqual({ ok: false, error: { code: "account_not_found", message: copy.errors.account_not_found } });
  });

  it("maps a missing or blank home_domain separately from transport failure", async () => {
    const missing = await resolveHomeDomain(ISSUER_ACCOUNT_ID, "testnet", jsonFetch(200, HORIZON_ACCOUNT_WITHOUT_DOMAIN).fetchImpl);
    const blank = await resolveHomeDomain(ISSUER_ACCOUNT_ID, "testnet", jsonFetch(200, HORIZON_ACCOUNT_BLANK_DOMAIN).fetchImpl);
    expect(missing).toEqual({ ok: false, error: { code: "missing_home_domain", message: copy.errors.missing_home_domain } });
    expect(blank.ok).toBe(false);
    if (!blank.ok) expect(blank.error.code).toBe("missing_home_domain");
  });

  it("maps Horizon 500, invalid JSON, and a thrown fetch to request_failed", async () => {
    const server = await resolveHomeDomain(ISSUER_ACCOUNT_ID, "testnet", jsonFetch(500, { title: "nope" }).fetchImpl);
    const invalid = await resolveHomeDomain(
      ISSUER_ACCOUNT_ID,
      "testnet",
      async () => new Response("not-json", { status: 200 })
    );
    const thrown = await resolveHomeDomain(ISSUER_ACCOUNT_ID, "testnet", async () => {
      throw new Error("network down");
    });
    expect(server.ok).toBe(false);
    expect(invalid.ok).toBe(false);
    expect(thrown.ok).toBe(false);
    if (!server.ok) expect(server.error.code).toBe("request_failed");
    if (!invalid.ok) expect(invalid.error.code).toBe("request_failed");
    if (!thrown.ok) {
      expect(thrown.error.code).toBe("request_failed");
      expect(thrown.error.message).not.toContain("network down");
    }
  });
});
