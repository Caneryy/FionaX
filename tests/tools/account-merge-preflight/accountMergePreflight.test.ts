import { describe, expect, it } from "vitest";
import { Keypair } from "@stellar/stellar-sdk";
import { copy } from "@/app/tools/account-merge-preflight/copy";
import { runAccountMergePreflight } from "@/app/tools/account-merge-preflight/lib/accountMergePreflight";
import { toToolError } from "@/app/tools/account-merge-preflight/lib/accountMergePreflight.errors";
import { MergeFailure } from "@/app/tools/account-merge-preflight/lib/source-snapshot";
import { blockedOffers, blockedSourceAccount } from "./fixtures/blocked-source.fixture";
import {
  destinationAccount,
  destinationAccountId,
  eligibleSourceAccount,
  eligibleStroops,
  emptyOffers,
  sourceAccountId
} from "./fixtures/eligible-source.fixture";
import { missingDestinationBody } from "./fixtures/missing-destination.fixture";

function routed(statusForDestination: number, account: unknown, offers: unknown): typeof fetch {
  return (async (input: RequestInfo | URL) => {
    const url = String(input);
    if (url.endsWith("/offers")) {
      return new Response(JSON.stringify(offers), { status: 200, headers: { "Content-Type": "application/json" } });
    }
    if (url.includes(destinationAccountId)) {
      const body = statusForDestination === 200 ? destinationAccount : missingDestinationBody;
      return new Response(JSON.stringify(body), { status: statusForDestination, headers: { "Content-Type": "application/json" } });
    }
    return new Response(JSON.stringify(account), { status: 200, headers: { "Content-Type": "application/json" } });
  }) as typeof fetch;
}

describe("runAccountMergePreflight", () => {
  it("reports an eligible source and the transferable balance", async () => {
    const outcome = await runAccountMergePreflight(sourceAccountId, destinationAccountId, {
      network: "testnet",
      fetchImpl: routed(200, eligibleSourceAccount, emptyOffers)
    });

    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      expect(outcome.result.mergeable).toBe(true);
      expect(outcome.result.blockers).toEqual([]);
      expect(outcome.result.nativeStroops).toBe(eligibleStroops);
      expect(outcome.result.destinationExists).toBe(true);
    }
  });

  it("lists every blocker on a blocked source", async () => {
    const outcome = await runAccountMergePreflight(sourceAccountId, destinationAccountId, {
      network: "testnet",
      fetchImpl: routed(200, blockedSourceAccount, blockedOffers)
    });

    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      expect(outcome.result.mergeable).toBe(false);
      expect(outcome.result.blockers.map((blocker) => blocker.code)).toEqual([
        "trustlines",
        "offers",
        "data_entries",
        "extra_signers",
        "sponsorship"
      ]);
    }
  });

  it("keeps a missing destination as a blocker and still shows the balance", async () => {
    const outcome = await runAccountMergePreflight(sourceAccountId, destinationAccountId, {
      network: "mainnet",
      fetchImpl: routed(404, eligibleSourceAccount, emptyOffers)
    });

    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      expect(outcome.result.destinationExists).toBe(false);
      expect(outcome.result.blockers.map((blocker) => blocker.code)).toEqual(["destination_missing"]);
      expect(outcome.result.nativeStroops).toBe(eligibleStroops);
    }
  });

  it("returns source_not_found when the source account is missing", async () => {
    const fetchImpl = (async () =>
      new Response(JSON.stringify(missingDestinationBody), { status: 404, headers: { "Content-Type": "application/json" } })) as typeof fetch;
    const outcome = await runAccountMergePreflight(sourceAccountId, destinationAccountId, { network: "testnet", fetchImpl });

    expect(outcome).toEqual({ ok: false, error: { code: "source_not_found", message: copy.errors.source_not_found } });
  });

  it("returns same_account without fetching", async () => {
    const calls: string[] = [];
    const fetchImpl = (async (input: RequestInfo | URL) => {
      calls.push(String(input));
      return new Response("{}", { status: 200 });
    }) as typeof fetch;
    const outcome = await runAccountMergePreflight(sourceAccountId, sourceAccountId, { network: "testnet", fetchImpl });

    expect(calls).toEqual([]);
    expect(outcome).toEqual({ ok: false, error: { code: "same_account", message: copy.errors.same_account } });
  });

  it("rejects a secret seed", async () => {
    const secret = Keypair.random().secret();
    const outcome = await runAccountMergePreflight(secret, destinationAccountId, {
      network: "testnet",
      fetchImpl: routed(200, eligibleSourceAccount, emptyOffers)
    });

    expect(outcome.ok).toBe(false);
    if (!outcome.ok) {
      expect(outcome.error.code).toBe("invalid_account");
      expect(JSON.stringify(outcome).includes(secret)).toBe(false);
    }
  });

  it("returns rate_limited and request_failed from the error mapper", () => {
    expect(toToolError(new MergeFailure("rate_limited")).message).toBe(copy.errors.rate_limited);
    expect(toToolError(new MergeFailure("destination_not_found")).message).toBe(copy.errors.destination_not_found);
    expect(toToolError(new Error("offline")).code).toBe("request_failed");
  });
});
