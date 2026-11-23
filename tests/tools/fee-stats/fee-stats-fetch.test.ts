import { describe, expect, it, vi } from "vitest";
import { decodeFeeStatsResponse, fetchFeeStats } from "@/app/tools/fee-stats/lib/fee-stats-fetch";
import { fullFeeStatsBody, horizonFeeStatsResponse } from "./fixtures/full-fee-stats.fixture";
import { highCapacityFeeStatsBody } from "./fixtures/high-capacity.fixture";
import { incompleteFeeStatsBody, malformedFeeStatsBody } from "./fixtures/incomplete-response.fixture";

const input = { network: "testnet" as const };

describe("fetchFeeStats", () => {
  it("requests /fee_stats and decodes a full payload", async () => {
    const fetcher = vi.fn(async () => horizonFeeStatsResponse(fullFeeStatsBody)) as unknown as typeof fetch;
    const raw = await fetchFeeStats(input, fetcher);
    expect(fetcher).toHaveBeenCalledOnce();
    const url = new URL(vi.mocked(fetcher).mock.calls[0][0] as string);
    expect(url.pathname).toBe("/fee_stats");
    expect(raw.last_ledger).toBe("28444678");
    expect(raw.last_ledger_base_fee).toBe("100");
    expect(raw.ledger_capacity_usage).toBe("0.05");
    expect(raw.fee_charged.p99).toBe("5500");
  });

  it("decodes high-capacity fixtures", async () => {
    const fetcher = vi.fn(async () => horizonFeeStatsResponse(highCapacityFeeStatsBody)) as unknown as typeof fetch;
    const raw = await fetchFeeStats({ network: "mainnet" }, fetcher);
    expect(raw.ledger_capacity_usage).toBe("0.97");
    expect(raw.fee_charged.p50).toBe("500");
  });

  it("keeps incomplete fee_charged objects decodeable", async () => {
    const fetcher = vi.fn(async () => horizonFeeStatsResponse(incompleteFeeStatsBody)) as unknown as typeof fetch;
    const raw = await fetchFeeStats(input, fetcher);
    expect(raw.fee_charged).toEqual({
      max: "100",
      min: "100",
      mode: "100",
      p10: "100",
      p50: "100",
      p99: "100"
    });
  });

  it.each([
    [404, "history_unavailable"],
    [429, "rate_limited"],
    [503, "request_failed"]
  ] as const)("maps HTTP %s to %s", async (status, code) => {
    const fetcher = vi.fn(async () => horizonFeeStatsResponse({}, status)) as unknown as typeof fetch;
    await expect(fetchFeeStats(input, fetcher)).rejects.toMatchObject({ code });
  });

  it("maps transport failures to request_failed", async () => {
    const fetcher = vi.fn(async () => {
      throw new Error("offline");
    }) as unknown as typeof fetch;
    await expect(fetchFeeStats(input, fetcher)).rejects.toMatchObject({ code: "request_failed" });
  });

  it("maps malformed JSON bodies to malformed_response", async () => {
    const fetcher = vi.fn(async () => horizonFeeStatsResponse(malformedFeeStatsBody)) as unknown as typeof fetch;
    await expect(fetchFeeStats(input, fetcher)).rejects.toMatchObject({ code: "malformed_response" });
  });
});

describe("decodeFeeStatsResponse", () => {
  it("rejects missing fee_charged objects", () => {
    expect(() => decodeFeeStatsResponse({ last_ledger: "1", last_ledger_base_fee: "100", ledger_capacity_usage: "0" })).toThrow(
      expect.objectContaining({ code: "malformed_response" })
    );
  });
});
