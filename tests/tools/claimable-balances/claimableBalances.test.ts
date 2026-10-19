import { describe, expect, it, vi } from "vitest";
import { runClaimableBalances } from "@/app/tools/claimable-balances/lib/claimableBalances";
import { copy } from "@/app/tools/claimable-balances/copy";
import { claimant, horizonResponse, unconditionalBalance } from "./fixtures/unconditional-balance.fixture";

const input = { claimant, network: "testnet" as const };
describe("claimable balance lookup", () => {
  it("returns an explicit zero-balance result with one fetched page", async () => {
    const fetcher = vi.fn(async () => horizonResponse([])) as unknown as typeof fetch;
    expect(await runClaimableBalances(input, fetcher)).toMatchObject({ ok: true, result: { balances: [], pagesFetched: 1, pageLimit: 3 } });
  });
  it("never fetches an invalid claimant or cursor, even when called directly", async () => {
    const fetcher = vi.fn(async () => horizonResponse([])) as unknown as typeof fetch;
    expect(await runClaimableBalances({ ...input, claimant: "S" + "A".repeat(55) }, fetcher)).toEqual({ ok: false, error: { code: "invalid_claimant" } });
    expect(await runClaimableBalances({ ...input, cursor: "bad" }, fetcher)).toEqual({ ok: false, error: { code: "invalid_cursor" } });
    expect(fetcher).not.toHaveBeenCalled();
  });
  it("stops after three full pages and provides a continuation token", async () => {
    let token = 0;
    const fetcher = vi.fn(async () => horizonResponse(Array.from({ length: 20 }, () => {
      token++;
      return { ...unconditionalBalance, id: token.toString(16).padStart(72, "0"), paging_token: token.toString(16).padStart(72, "0") };
    }))) as unknown as typeof fetch;
    const outcome = await runClaimableBalances(input, fetcher);
    expect(outcome).toMatchObject({ ok: true, result: { pagesFetched: 3, nextCursor: (60).toString(16).padStart(72, "0") } });
    expect(fetcher).toHaveBeenCalledTimes(3);
    if (outcome.ok) expect(outcome.result.balances).toHaveLength(60);
  });
  it.each([
    [429, "rate_limited"], [503, "request_failed"], [400, "invalid_cursor"]
  ] as const)("maps HTTP %s to %s with actionable copy", async (status, code) => {
    const fetcher = vi.fn(async () => new Response("{}", { status })) as unknown as typeof fetch;
    expect(await runClaimableBalances({ ...input, cursor: "10" }, fetcher)).toEqual({ ok: false, error: { code } });
    expect(copy.errors[code].length).toBeGreaterThan(20);
  });
  it("maps malformed predicate and thrown transport failures", async () => {
    const malformed = vi.fn(async () => horizonResponse([{ ...unconditionalBalance, claimants: [{ destination: claimant, predicate: { nope: true } }] }])) as unknown as typeof fetch;
    expect(await runClaimableBalances(input, malformed)).toEqual({ ok: false, error: { code: "malformed_predicate" } });
    const failed = vi.fn(async () => { throw new Error("network offline"); }) as unknown as typeof fetch;
    expect(await runClaimableBalances(input, failed)).toEqual({ ok: false, error: { code: "request_failed" } });
    expect(copy.errors.malformed_predicate).toContain("predicate");
    expect(copy.errors.invalid_claimant).toContain("public G address");
  });
});
