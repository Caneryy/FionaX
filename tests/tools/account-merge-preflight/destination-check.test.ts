import { describe, expect, it } from "vitest";
import { destinationExists } from "@/app/tools/account-merge-preflight/lib/destination-check";
import { MergeFailure } from "@/app/tools/account-merge-preflight/lib/source-snapshot";
import { destinationAccount, destinationAccountId } from "./fixtures/eligible-source.fixture";
import { missingDestinationBody } from "./fixtures/missing-destination.fixture";

function statusFetch(status: number, body: unknown): typeof fetch {
  return (async () =>
    new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } })) as typeof fetch;
}

describe("destinationExists", () => {
  it("returns true when Horizon has the destination", async () => {
    await expect(
      destinationExists(destinationAccountId, { network: "testnet", fetchImpl: statusFetch(200, destinationAccount) })
    ).resolves.toBe(true);
  });

  it("throws destination_not_found when the destination is missing", async () => {
    await expect(
      destinationExists(destinationAccountId, { network: "testnet", fetchImpl: statusFetch(404, missingDestinationBody) })
    ).rejects.toMatchObject({ code: "destination_not_found" });
  });

  it("throws rate_limited on Horizon 429", async () => {
    await expect(
      destinationExists(destinationAccountId, { network: "testnet", fetchImpl: statusFetch(429, { title: "Rate limit" }) })
    ).rejects.toBeInstanceOf(MergeFailure);
  });
});
