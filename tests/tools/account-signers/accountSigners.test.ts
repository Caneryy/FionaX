import { describe, expect, it } from "vitest";
import { Keypair } from "@stellar/stellar-sdk";
import { copy } from "@/app/tools/account-signers/copy";
import { runAccountSigners } from "@/app/tools/account-signers/lib/accountSigners";
import { toToolError } from "@/app/tools/account-signers/lib/accountSigners.errors";
import { SignersFailure } from "@/app/tools/account-signers/lib/signer-list";
import { fixtureAccountId, hashSigner, mixedSignersAccount, preauthSigner } from "./fixtures/mixed-signers.fixture";
import { singleSignerAccount } from "./fixtures/single-signer.fixture";
import { zeroWeightMasterAccount } from "./fixtures/zero-weight-master.fixture";

function jsonFetch(status: number, body: unknown): typeof fetch {
  return (async () => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } })) as typeof fetch;
}

describe("runAccountSigners", () => {
  it("lists mixed signer types and the three thresholds", async () => {
    const outcome = await runAccountSigners(fixtureAccountId, { network: "testnet", fetchImpl: jsonFetch(200, mixedSignersAccount) });
    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      expect(outcome.result.thresholds).toEqual({ low: 1, medium: 2, high: 3 });
      expect(outcome.result.signers.map((signer) => signer.key)).toEqual([fixtureAccountId, hashSigner, preauthSigner]);
      expect(outcome.result.masterWeightZero).toBe(false);
    }
  });

  it("flags a zero-weight master key as success", async () => {
    const outcome = await runAccountSigners(fixtureAccountId, { network: "testnet", fetchImpl: jsonFetch(200, zeroWeightMasterAccount) });
    expect(outcome.ok).toBe(true);
    if (outcome.ok) expect(outcome.result.masterWeightZero).toBe(true);
  });

  it("returns a single master signer", async () => {
    const outcome = await runAccountSigners(fixtureAccountId, { network: "mainnet", fetchImpl: jsonFetch(200, singleSignerAccount) });
    expect(outcome.ok).toBe(true);
    if (outcome.ok) expect(outcome.result.signers).toHaveLength(1);
  });

  it("covers the error codes", async () => {
    const secret = Keypair.random().secret();
    const secretOutcome = await runAccountSigners(secret, { network: "testnet", fetchImpl: jsonFetch(200, singleSignerAccount) });
    expect(secretOutcome.ok).toBe(false);
    if (!secretOutcome.ok) expect(JSON.stringify(secretOutcome).includes(secret)).toBe(false);

    const missing = await runAccountSigners(fixtureAccountId, { network: "testnet", fetchImpl: jsonFetch(404, { title: "missing" }) });
    expect(missing).toEqual({ ok: false, error: { code: "account_not_found", message: copy.errors.account_not_found } });

    const limited = await runAccountSigners(fixtureAccountId, { network: "testnet", fetchImpl: jsonFetch(429, { title: "limit" }) });
    expect(limited).toEqual({ ok: false, error: { code: "rate_limited", message: copy.errors.rate_limited } });

    const malformed = await runAccountSigners(fixtureAccountId, {
      network: "testnet",
      fetchImpl: jsonFetch(200, {
        account_id: fixtureAccountId,
        thresholds: { low_threshold: 0, med_threshold: 0, high_threshold: 0 },
        signers: [{ key: "x", weight: 1, type: "nope" }]
      })
    });
    expect(malformed).toEqual({ ok: false, error: { code: "malformed_signer", message: copy.errors.malformed_signer } });

    const offline = (async () => {
      throw new Error("offline");
    }) as typeof fetch;
    const failed = await runAccountSigners(fixtureAccountId, { network: "testnet", fetchImpl: offline });
    expect(failed).toEqual({ ok: false, error: { code: "request_failed", message: copy.errors.request_failed } });
    expect(toToolError(new SignersFailure("malformed_signer")).code).toBe("malformed_signer");
  });
});
