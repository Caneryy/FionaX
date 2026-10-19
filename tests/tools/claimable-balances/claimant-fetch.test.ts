import { describe, expect, it, vi } from "vitest";
import { fetchClaimantPage } from "@/app/tools/claimable-balances/lib/claimant-fetch";
import { claimant, horizonResponse, unconditionalBalance } from "./fixtures/unconditional-balance.fixture";
import { nestedBalance } from "./fixtures/nested-predicate.fixture";
import { timeBalance } from "./fixtures/time-predicate.fixture";

const input = { claimant, network: "testnet" as const };
describe("Horizon claimant page", () => {
  it("sends claimant, limit and cursor and decodes each record", async () => {
    const fetcher = vi.fn(async () => horizonResponse([unconditionalBalance, timeBalance, nestedBalance])) as unknown as typeof fetch;
    const records = await fetchClaimantPage(input, "42", fetcher);
    expect(fetcher).toHaveBeenCalledOnce();
    const url = new URL(vi.mocked(fetcher).mock.calls[0][0] as string);
    expect(url.searchParams.get("claimant")).toBe(claimant);
    expect(url.searchParams.get("limit")).toBe("20");
    expect(url.searchParams.get("order")).toBe("asc");
    expect(url.searchParams.get("cursor")).toBe("42");
    expect(records.map((b) => b.predicate.kind)).toEqual(["unconditional", "abs_before", "and"]);
    expect(records[0].amount).toBe("123456789.0000001");
  });
  it("rejects missing matching claimant predicate", async () => {
    const fetcher = vi.fn(async () => horizonResponse([{ ...unconditionalBalance, claimants: [] }])) as unknown as typeof fetch;
    await expect(fetchClaimantPage(input, undefined, fetcher)).rejects.toMatchObject({ code: "malformed_predicate" });
  });
  it("rejects malformed amount data", async () => {
    const fetcher = vi.fn(async () => horizonResponse([{ ...unconditionalBalance, amount: "1.00000001" }])) as unknown as typeof fetch;
    await expect(fetchClaimantPage(input, undefined, fetcher)).rejects.toMatchObject({ code: "request_failed" });
    const overflow = vi.fn(async () => horizonResponse([{ ...unconditionalBalance, amount: "922337203686" }])) as unknown as typeof fetch;
    await expect(fetchClaimantPage(input, undefined, overflow)).rejects.toMatchObject({ code: "request_failed" });
  });
});
