import { describe, expect, it } from "vitest";
import { Keypair } from "@stellar/stellar-sdk";
import { fetchIssuerFlags, horizonAccountUrl, parseIssuerAccount, SecretSeedRejectedError } from "@/app/tools/asset-flags-inspector/lib/issuer-flags";
import { horizonUrls } from "@/lib/stellar/horizon";
import { accountNotFoundHorizonError } from "./fixtures/account-not-found.fixture";
import { allFlagsSetFlags, allFlagsSetHorizonAccount, allFlagsSetSequence, fixtureAccountId } from "./fixtures/all-flags-set.fixture";
import { immutableIssuerFlags, immutableIssuerHorizonAccount, immutableIssuerSequence } from "./fixtures/immutable-issuer.fixture";
import { noFlagsSetFlags, noFlagsSetHorizonAccount, noFlagsSetSequence } from "./fixtures/no-flags-set.fixture";
import { rateLimitedHorizonError } from "./fixtures/rate-limited.fixture";
import { requestFailedHorizonError } from "./fixtures/request-failed.fixture";

function jsonFetch(status: number, body: unknown, calls: string[]): typeof fetch {
  return (async (input: RequestInfo | URL) => {
    calls.push(String(input));
    const payload = typeof body === "string" ? body : JSON.stringify(body);

    return new Response(payload, {
      status,
      headers: { "Content-Type": "application/json" }
    });
  }) as typeof fetch;
}

describe("fetchIssuerFlags", () => {
  it("GETs the issuer account and reads every flag", async () => {
    const calls: string[] = [];
    const snapshot = await fetchIssuerFlags(fixtureAccountId, {
      network: "testnet",
      fetchImpl: jsonFetch(200, allFlagsSetHorizonAccount, calls)
    });

    expect(calls).toEqual([`${horizonUrls.testnet}/accounts/${fixtureAccountId}`]);
    expect(calls[0]).toBe(horizonAccountUrl("testnet", fixtureAccountId));
    expect(snapshot.flags).toEqual(allFlagsSetFlags);
    expect(snapshot.sequence).toBe(allFlagsSetSequence);
    expect(snapshot.accountId).toBe(fixtureAccountId);
  });

  it("reads an existing account whose flags are all unset", async () => {
    const calls: string[] = [];
    const snapshot = await fetchIssuerFlags(fixtureAccountId, {
      network: "mainnet",
      fetchImpl: jsonFetch(200, noFlagsSetHorizonAccount, calls)
    });

    expect(calls).toEqual([`${horizonUrls.mainnet}/accounts/${fixtureAccountId}`]);
    expect(snapshot.flags).toEqual(noFlagsSetFlags);
    expect(snapshot.sequence).toBe(noFlagsSetSequence);
  });

  it("reads an immutable issuer without collapsing the other flags", async () => {
    const snapshot = await fetchIssuerFlags(fixtureAccountId, {
      network: "testnet",
      fetchImpl: jsonFetch(200, immutableIssuerHorizonAccount, [])
    });

    expect(snapshot.flags).toEqual(immutableIssuerFlags);
    expect(snapshot.sequence).toBe(immutableIssuerSequence);
  });

  it("does not fetch a secret seed", async () => {
    const secret = Keypair.random().secret();
    const calls: string[] = [];

    await expect(
      fetchIssuerFlags(secret, {
        network: "testnet",
        fetchImpl: jsonFetch(200, allFlagsSetHorizonAccount, calls)
      })
    ).rejects.toBeInstanceOf(SecretSeedRejectedError);

    expect(calls).toEqual([]);
    expect(secret.startsWith("S")).toBe(true);
  });

  it("maps 404 to account_not_found even if the body contains unset flags", async () => {
    const calls: string[] = [];

    await expect(
      fetchIssuerFlags(fixtureAccountId, {
        network: "testnet",
        fetchImpl: jsonFetch(404, { ...accountNotFoundHorizonError, flags: noFlagsSetFlags }, calls)
      })
    ).rejects.toMatchObject({ code: "account_not_found" });

    expect(calls).toHaveLength(1);
  });

  it("maps 429 to rate_limited", async () => {
    await expect(
      fetchIssuerFlags(fixtureAccountId, {
        network: "testnet",
        fetchImpl: jsonFetch(429, rateLimitedHorizonError, [])
      })
    ).rejects.toMatchObject({ code: "rate_limited" });
  });

  it("maps a server error to request_failed", async () => {
    await expect(
      fetchIssuerFlags(fixtureAccountId, {
        network: "testnet",
        fetchImpl: jsonFetch(500, requestFailedHorizonError, [])
      })
    ).rejects.toMatchObject({ code: "request_failed" });
  });

  it("maps a thrown network error to request_failed", async () => {
    const fetchImpl = (async () => {
      throw new Error("socket closed");
    }) as typeof fetch;

    await expect(
      fetchIssuerFlags(fixtureAccountId, {
        network: "testnet",
        fetchImpl
      })
    ).rejects.toMatchObject({ code: "request_failed" });
  });

  it("maps invalid JSON to request_failed", async () => {
    await expect(
      fetchIssuerFlags(fixtureAccountId, {
        network: "testnet",
        fetchImpl: jsonFetch(200, "{", [])
      })
    ).rejects.toMatchObject({ code: "request_failed" });
  });
});

describe("parseIssuerAccount", () => {
  it("rejects a numeric flag instead of coercing it", () => {
    expect(() =>
      parseIssuerAccount(
        {
          ...allFlagsSetHorizonAccount,
          flags: { ...allFlagsSetFlags, auth_required: 1 }
        },
        fixtureAccountId
      )
    ).toThrowError(expect.objectContaining({ code: "request_failed" }));
  });

  it("rejects a sequence that is not a decimal string", () => {
    expect(() =>
      parseIssuerAccount(
        {
          ...noFlagsSetHorizonAccount,
          sequence: 12
        },
        fixtureAccountId
      )
    ).toThrowError(expect.objectContaining({ code: "request_failed" }));
  });

  it("rejects an account id that does not match the request", () => {
    expect(() => parseIssuerAccount(allFlagsSetHorizonAccount, `${fixtureAccountId.slice(0, -1)}X`)).toThrowError(
      expect.objectContaining({ code: "request_failed" })
    );
  });
});
