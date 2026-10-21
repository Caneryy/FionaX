import { describe, expect, it } from "vitest";
import { Keypair } from "@stellar/stellar-sdk";
import { copy } from "@/app/tools/asset-flags-inspector/copy";
import { runAssetFlagsInspector } from "@/app/tools/asset-flags-inspector/lib/assetFlagsInspector";
import { toToolError } from "@/app/tools/asset-flags-inspector/lib/assetFlagsInspector.errors";
import { IssuerFlagsFailure, SecretSeedRejectedError } from "@/app/tools/asset-flags-inspector/lib/issuer-flags";
import { ISSUER_FLAG_KEYS } from "@/app/tools/asset-flags-inspector/types";
import { accountNotFoundHorizonError } from "./fixtures/account-not-found.fixture";
import { allFlagsSetFlags, allFlagsSetHorizonAccount, allFlagsSetSequence, fixtureAccountId } from "./fixtures/all-flags-set.fixture";
import { immutableIssuerFlags, immutableIssuerHorizonAccount, immutableIssuerSequence } from "./fixtures/immutable-issuer.fixture";
import { noFlagsSetFlags, noFlagsSetHorizonAccount, noFlagsSetSequence } from "./fixtures/no-flags-set.fixture";
import { rateLimitedHorizonError } from "./fixtures/rate-limited.fixture";
import { requestFailedHorizonError } from "./fixtures/request-failed.fixture";

function jsonFetch(status: number, body: unknown, calls: string[] = []): typeof fetch {
  return (async (input: RequestInfo | URL) => {
    calls.push(String(input));
    return new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" }
    });
  }) as typeof fetch;
}

describe("runAssetFlagsInspector", () => {
  it("returns decoded flags and the raw bitmask for an issuer with every flag set", async () => {
    const outcome = await runAssetFlagsInspector(fixtureAccountId, {
      network: "testnet",
      fetchImpl: jsonFetch(200, allFlagsSetHorizonAccount)
    });

    expect(outcome.ok).toBe(true);

    if (outcome.ok) {
      expect(outcome.result.flags).toEqual(allFlagsSetFlags);
      expect(outcome.result.sequence).toBe(allFlagsSetSequence);
      expect(outcome.result.bitmask).toBe(15n);
      expect(outcome.result.network).toBe("testnet");
      expect(outcome.result.explanation.rows.map((row) => row.key)).toEqual([...ISSUER_FLAG_KEYS]);
      expect(outcome.result.explanation.immutableNotice).toBe(copy.immutable.body);
    }
  });

  it("treats an existing account with no flags as success, not a missing account", async () => {
    const outcome = await runAssetFlagsInspector(fixtureAccountId, {
      network: "testnet",
      fetchImpl: jsonFetch(200, noFlagsSetHorizonAccount)
    });

    expect(outcome.ok).toBe(true);

    if (outcome.ok) {
      expect(outcome.result.flags).toEqual(noFlagsSetFlags);
      expect(outcome.result.sequence).toBe(noFlagsSetSequence);
      expect(outcome.result.bitmask).toBe(0n);
      expect(outcome.result.explanation.allUnset).toBe(true);
      expect(outcome.result.explanation.combination.includes(copy.errors.account_not_found)).toBe(false);
      expect(copy.explanation.allUnset).not.toBe(copy.errors.account_not_found);
    }
  });

  it("keeps an immutable issuer distinct from the other three flags", async () => {
    const outcome = await runAssetFlagsInspector(`  ${fixtureAccountId}  `, {
      network: "mainnet",
      fetchImpl: jsonFetch(200, immutableIssuerHorizonAccount)
    });

    expect(outcome.ok).toBe(true);

    if (outcome.ok) {
      expect(outcome.result.flags).toEqual(immutableIssuerFlags);
      expect(outcome.result.sequence).toBe(immutableIssuerSequence);
      expect(outcome.result.bitmask).toBe(5n);
      expect(outcome.result.network).toBe("mainnet");
      expect(outcome.result.explanation.immutableNotice).toMatch(/never/);
      expect(outcome.result.explanation.adjustableNotice).toBeNull();
    }
  });

  it("rejects a secret seed with invalid_account and does not fetch", async () => {
    const secret = Keypair.random().secret();
    const calls: string[] = [];
    const outcome = await runAssetFlagsInspector(secret, {
      network: "testnet",
      fetchImpl: jsonFetch(200, allFlagsSetHorizonAccount, calls)
    });

    expect(calls).toEqual([]);
    expect(outcome).toEqual({
      ok: false,
      error: {
        code: "invalid_account",
        message: copy.errors.invalid_account.secret
      }
    });
    expect(JSON.stringify(outcome).includes(secret)).toBe(false);
  });

  it("returns account_not_found when Horizon has no such account", async () => {
    const outcome = await runAssetFlagsInspector(fixtureAccountId, {
      network: "testnet",
      fetchImpl: jsonFetch(404, accountNotFoundHorizonError)
    });

    expect(outcome).toEqual({
      ok: false,
      error: {
        code: "account_not_found",
        message: copy.errors.account_not_found
      }
    });
  });

  it("returns rate_limited when Horizon responds 429", async () => {
    const outcome = await runAssetFlagsInspector(fixtureAccountId, {
      network: "testnet",
      fetchImpl: jsonFetch(429, rateLimitedHorizonError)
    });

    expect(outcome).toEqual({
      ok: false,
      error: {
        code: "rate_limited",
        message: copy.errors.rate_limited
      }
    });
  });

  it("returns request_failed when Horizon responds 500", async () => {
    const outcome = await runAssetFlagsInspector(fixtureAccountId, {
      network: "testnet",
      fetchImpl: jsonFetch(500, requestFailedHorizonError)
    });

    expect(outcome).toEqual({
      ok: false,
      error: {
        code: "request_failed",
        message: copy.errors.request_failed
      }
    });
  });
});

describe("toToolError", () => {
  it("maps each transport code onto its copy", () => {
    expect(toToolError(new IssuerFlagsFailure("account_not_found"))).toEqual({
      code: "account_not_found",
      message: copy.errors.account_not_found
    });
    expect(toToolError(new IssuerFlagsFailure("rate_limited"))).toEqual({
      code: "rate_limited",
      message: copy.errors.rate_limited
    });
    expect(toToolError(new IssuerFlagsFailure("request_failed"))).toEqual({
      code: "request_failed",
      message: copy.errors.request_failed
    });
  });

  it("maps a rejected seed without using the thrown message", () => {
    expect(toToolError(new SecretSeedRejectedError())).toEqual({
      code: "invalid_account",
      message: copy.errors.invalid_account.secret
    });
  });

  it("hides unexpected error text, including a seed that leaked into a message", () => {
    const secret = Keypair.random().secret();
    const mapped = toToolError(new Error(`lookup failed for ${secret}`));

    expect(mapped).toEqual({
      code: "request_failed",
      message: copy.errors.request_failed
    });
    expect(mapped.message.includes(secret)).toBe(false);
  });
});

describe("error copy", () => {
  it("keeps invalid_account, account_not_found, rate_limited, and request_failed distinct", () => {
    const messages = [
      copy.errors.invalid_account.empty,
      copy.errors.invalid_account.secret,
      copy.errors.invalid_account.malformed,
      copy.errors.account_not_found,
      copy.errors.rate_limited,
      copy.errors.request_failed
    ];

    expect(new Set(messages).size).toBe(messages.length);

    for (const code of ["invalid_account", "account_not_found", "rate_limited", "request_failed"] as const) {
      expect(copy.errorTitles[code].length).toBeGreaterThan(0);
    }
  });
});
