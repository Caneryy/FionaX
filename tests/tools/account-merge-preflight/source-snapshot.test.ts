import { describe, expect, it } from "vitest";
import { fetchSourceSnapshot } from "@/app/tools/account-merge-preflight/lib/source-snapshot";
import { blockedOffers, blockedSourceAccount } from "./fixtures/blocked-source.fixture";
import { eligibleBalance, eligibleSourceAccount, eligibleStroops, emptyOffers, sourceAccountId } from "./fixtures/eligible-source.fixture";

function routeFetch(account: unknown, offers: unknown): typeof fetch {
  return (async (input: RequestInfo | URL) => {
    const url = String(input);
    const body = url.endsWith("/offers") ? offers : account;
    return new Response(JSON.stringify(body), { status: 200, headers: { "Content-Type": "application/json" } });
  }) as typeof fetch;
}

describe("fetchSourceSnapshot", () => {
  it("reads a clear source and its empty offer page", async () => {
    const snapshot = await fetchSourceSnapshot(sourceAccountId, {
      network: "testnet",
      fetchImpl: routeFetch(eligibleSourceAccount, emptyOffers)
    });

    expect(snapshot.nativeBalance).toBe(eligibleBalance);
    expect(snapshot.nativeStroops).toBe(eligibleStroops);
    expect(snapshot.trustlineCount).toBe(0);
    expect(snapshot.offerCount).toBe(0);
    expect(snapshot.extraSignerCount).toBe(0);
  });

  it("counts every blocker field on a blocked source", async () => {
    const snapshot = await fetchSourceSnapshot(sourceAccountId, {
      network: "testnet",
      fetchImpl: routeFetch(blockedSourceAccount, blockedOffers)
    });

    expect(snapshot.trustlineCount).toBe(1);
    expect(snapshot.offerCount).toBe(1);
    expect(snapshot.dataEntryCount).toBe(1);
    expect(snapshot.extraSignerCount).toBe(1);
    expect(snapshot.sponsoring).toBe(true);
    expect(snapshot.nativeStroops).toBe(25000000n);
  });
});
