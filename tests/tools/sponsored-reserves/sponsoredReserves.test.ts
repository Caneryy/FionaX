import { describe, expect, it, vi } from "vitest";
import { runSponsoredReserves } from "@/app/tools/sponsored-reserves/lib/sponsoredReserves";
import { viewedAccount } from "./fixtures/sponsor-role.fixture";
import { sponsorRoleAccount } from "./fixtures/sponsor-role.fixture";
import { sponsoreeRoleAccount } from "./fixtures/sponsoree-role.fixture";
import { noSponsorshipAccount } from "./fixtures/no-sponsorship.fixture";
import { StrKey } from "@stellar/stellar-sdk";
import { copy } from "@/app/tools/sponsored-reserves/copy";

const response = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });
const input = { accountId: viewedAccount, network: "testnet" as const };

describe("runSponsoredReserves", () => {
  it.each([sponsorRoleAccount, sponsoreeRoleAccount, noSponsorshipAccount])("reads a deterministic Horizon account", async (account) => {
    const request = vi.fn(async () => response(account));
    const outcome = await runSponsoredReserves(input, request as typeof fetch);
    expect(request).toHaveBeenCalledWith(expect.stringMatching(/\/accounts\/G[A-Z2-7]+$/), { cache: "no-store" });
    expect(outcome.ok).toBe(true);
    if (outcome.ok && account === noSponsorshipAccount) {
      expect(outcome.result.sponsoredByMeCount).toBe(BigInt("0"));
      expect(outcome.result.sponsoredForMeCount).toBe(BigInt("0"));
    }
  });
  it("rejects a seed before a request", async () => {
    const request = vi.fn();
    const seed = StrKey.encodeEd25519SecretSeed(Buffer.alloc(32, 7));
    expect(await runSponsoredReserves({ ...input, accountId: seed }, request as typeof fetch)).toEqual({ ok: false, error: { code: "invalid_account" } });
    expect(request).not.toHaveBeenCalled();
  });
  it.each([[404, "account_not_found"], [429, "rate_limited"], [503, "request_failed"]] as const)("maps HTTP %i", async (status, code) => {
    expect(await runSponsoredReserves(input, vi.fn(async () => response({}, status)) as typeof fetch)).toEqual({ ok: false, error: { code } });
  });
  it("maps transport and decode failures", async () => {
    expect(await runSponsoredReserves(input, vi.fn(async () => { throw new Error("offline"); }) as typeof fetch)).toEqual({ ok: false, error: { code: "request_failed" } });
    expect(await runSponsoredReserves(input, vi.fn(async () => response({ ...sponsoreeRoleAccount, num_sponsored: 1 })) as typeof fetch)).toEqual({ ok: false, error: { code: "request_failed" } });
  });
  it("provides actionable copy for every error outcome", () => {
    for (const code of ["invalid_account", "account_not_found", "rate_limited", "request_failed"] as const) {
      expect(copy.errors[code].length).toBeGreaterThan(20);
    }
    expect(copy.errors.invalid_account).toContain("Secret seeds");
    expect(copy.errors.account_not_found).toContain("network");
    expect(copy.errors.rate_limited).toContain("try again");
    expect(copy.errors.request_failed).toContain("try again");
  });
});
