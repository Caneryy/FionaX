import { describe, expect, it } from "vitest";
import { Keypair } from "@stellar/stellar-sdk";
import { copy } from "@/app/tools/account-data-entries/copy";
import { runAccountDataEntries } from "@/app/tools/account-data-entries/lib/accountDataEntries";
import { toToolError } from "@/app/tools/account-data-entries/lib/accountDataEntries.errors";
import { DataEntriesFailure, SecretSeedRejectedError } from "@/app/tools/account-data-entries/lib/data-entries";
import { binaryEntryHorizonAccount, binaryEntryHex } from "./fixtures/binary-entry.fixture";
import { accountNotFoundBody, emptyEntriesHorizonAccount } from "./fixtures/empty-entries.fixture";
import { fixtureAccountId, textEntriesHorizonAccount, textEntryValue } from "./fixtures/text-entries.fixture";

function jsonFetch(status: number, body: unknown, calls: string[] = []): typeof fetch {
  return (async (input: RequestInfo | URL) => {
    calls.push(String(input));
    return new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" }
    });
  }) as typeof fetch;
}

describe("runAccountDataEntries", () => {
  it("decodes text entries and shows the raw base64 beside them", async () => {
    const outcome = await runAccountDataEntries(fixtureAccountId, {
      network: "testnet",
      fetchImpl: jsonFetch(200, textEntriesHorizonAccount)
    });

    expect(outcome.ok).toBe(true);

    if (outcome.ok) {
      const config = outcome.result.entries.find((entry) => entry.name === "config");
      expect(config?.text).toBe(textEntryValue);
      expect(config?.rawBase64).toBe("aGVsbG8=");
      expect(outcome.result.network).toBe("testnet");
    }
  });

  it("treats an empty data map as success, not account_not_found", async () => {
    const outcome = await runAccountDataEntries(fixtureAccountId, {
      network: "testnet",
      fetchImpl: jsonFetch(200, emptyEntriesHorizonAccount)
    });

    expect(outcome.ok).toBe(true);

    if (outcome.ok) {
      expect(outcome.result.entries).toEqual([]);
    }

    expect(copy.zeroEntries.body).not.toBe(copy.errors.account_not_found);
  });

  it("keeps a binary value successful and does not invent text", async () => {
    const outcome = await runAccountDataEntries(fixtureAccountId, {
      network: "mainnet",
      fetchImpl: jsonFetch(200, binaryEntryHorizonAccount)
    });

    expect(outcome.ok).toBe(true);

    if (outcome.ok) {
      expect(outcome.result.entries[0]?.encoding).toBe("binary");
      expect(outcome.result.entries[0]?.text).toBeNull();
      expect(outcome.result.entries[0]?.hex).toBe(binaryEntryHex);
    }
  });

  it("rejects a secret seed and does not fetch", async () => {
    const secret = Keypair.random().secret();
    const calls: string[] = [];
    const outcome = await runAccountDataEntries(secret, {
      network: "testnet",
      fetchImpl: jsonFetch(200, textEntriesHorizonAccount, calls)
    });

    expect(calls).toEqual([]);
    expect(outcome).toEqual({
      ok: false,
      error: { code: "invalid_account", message: copy.errors.invalid_account.secret }
    });
  });

  it("returns account_not_found on Horizon 404", async () => {
    const outcome = await runAccountDataEntries(fixtureAccountId, {
      network: "testnet",
      fetchImpl: jsonFetch(404, accountNotFoundBody)
    });

    expect(outcome).toEqual({
      ok: false,
      error: { code: "account_not_found", message: copy.errors.account_not_found }
    });
  });

  it("returns malformed_data_entry when a value is not base64", async () => {
    const outcome = await runAccountDataEntries(fixtureAccountId, {
      network: "testnet",
      fetchImpl: jsonFetch(200, { account_id: fixtureAccountId, data: { broken: "%%%" } })
    });

    expect(outcome).toEqual({
      ok: false,
      error: { code: "malformed_data_entry", message: copy.errors.malformed_data_entry }
    });
  });

  it("returns rate_limited on Horizon 429", async () => {
    const outcome = await runAccountDataEntries(fixtureAccountId, {
      network: "testnet",
      fetchImpl: jsonFetch(429, { title: "Rate limit" })
    });

    expect(outcome).toEqual({
      ok: false,
      error: { code: "rate_limited", message: copy.errors.rate_limited }
    });
  });

  it("returns request_failed when fetch throws", async () => {
    const fetchImpl = (async () => {
      throw new Error("offline");
    }) as typeof fetch;
    const outcome = await runAccountDataEntries(fixtureAccountId, { network: "testnet", fetchImpl });

    expect(outcome).toEqual({
      ok: false,
      error: { code: "request_failed", message: copy.errors.request_failed }
    });
  });

  it("maps known failures through toToolError", () => {
    expect(toToolError(new SecretSeedRejectedError()).code).toBe("invalid_account");
    expect(toToolError(new DataEntriesFailure("malformed_data_entry")).message).toBe(copy.errors.malformed_data_entry);
    expect(toToolError(new Error("boom")).code).toBe("request_failed");
  });
});
