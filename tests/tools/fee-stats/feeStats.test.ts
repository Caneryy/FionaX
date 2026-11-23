import { describe, expect, it, vi } from "vitest";
import { copy } from "@/app/tools/fee-stats/copy";
import { runFeeStats } from "@/app/tools/fee-stats/lib/feeStats";
import { fullFeeStatsBody, horizonFeeStatsResponse } from "./fixtures/full-fee-stats.fixture";
import { highCapacityFeeStatsBody } from "./fixtures/high-capacity.fixture";
import { incompleteFeeStatsBody, malformedFeeStatsBody } from "./fixtures/incomplete-response.fixture";

const fixedNow = () => new Date("2026-03-20T12:34:56.000Z");

describe("runFeeStats", () => {
  it("returns base fee, percentiles and capacity for a full payload", async () => {
    const fetcher = vi.fn(async () => horizonFeeStatsResponse(fullFeeStatsBody)) as unknown as typeof fetch;
    const outcome = await runFeeStats({ network: "testnet" }, { fetchImpl: fetcher, now: fixedNow });
    expect(outcome).toMatchObject({
      ok: true,
      result: {
        lastLedger: "28444678",
        lastLedgerBaseFee: "100",
        capacityUsageRatio: "0.05",
        capacityUsagePercent: "5.00",
        incomplete: false,
        fetchedAt: "2026-03-20T12:34:56.000Z",
        network: "testnet"
      }
    });
    if (outcome.ok) {
      expect(outcome.result.percentiles).toHaveLength(11);
      expect(outcome.result.percentiles[0]).toEqual({ key: "p10", label: "P10", feeStroops: "100" });
      expect(outcome.result.percentiles.at(-1)?.feeStroops).toBe("5500");
    }
  });

  it("marks incomplete percentile sets without failing the request", async () => {
    const fetcher = vi.fn(async () => horizonFeeStatsResponse(incompleteFeeStatsBody)) as unknown as typeof fetch;
    const outcome = await runFeeStats({ network: "testnet" }, { fetchImpl: fetcher, now: fixedNow });
    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      expect(outcome.result.incomplete).toBe(true);
      expect(outcome.result.percentiles.map((row) => row.key)).toEqual(["p10", "p50", "p99"]);
      expect(outcome.result.capacityUsagePercent).toBe("20.00");
    }
  });

  it("converts high capacity usage to a percent string", async () => {
    const fetcher = vi.fn(async () => horizonFeeStatsResponse(highCapacityFeeStatsBody)) as unknown as typeof fetch;
    const outcome = await runFeeStats({ network: "mainnet" }, { fetchImpl: fetcher, now: fixedNow });
    expect(outcome).toMatchObject({
      ok: true,
      result: { capacityUsagePercent: "97.00", network: "mainnet", incomplete: false }
    });
  });

  it("rejects invalid networks before fetching", async () => {
    const fetcher = vi.fn(async () => horizonFeeStatsResponse(fullFeeStatsBody)) as unknown as typeof fetch;
    expect(await runFeeStats({ network: "futurenet" as "testnet" }, { fetchImpl: fetcher })).toEqual({
      ok: false,
      error: { code: "invalid_network" }
    });
    expect(fetcher).not.toHaveBeenCalled();
  });

  it.each([
    [404, "history_unavailable"],
    [429, "rate_limited"],
    [503, "request_failed"]
  ] as const)("maps HTTP %s to %s with actionable copy", async (status, code) => {
    const fetcher = vi.fn(async () => horizonFeeStatsResponse({}, status)) as unknown as typeof fetch;
    expect(await runFeeStats({ network: "testnet" }, { fetchImpl: fetcher })).toEqual({
      ok: false,
      error: { code }
    });
    expect(copy.errors[code].length).toBeGreaterThan(20);
  });

  it("maps malformed payloads and transport failures", async () => {
    const malformed = vi.fn(async () => horizonFeeStatsResponse(malformedFeeStatsBody)) as unknown as typeof fetch;
    expect(await runFeeStats({ network: "testnet" }, { fetchImpl: malformed })).toEqual({
      ok: false,
      error: { code: "malformed_response" }
    });
    expect(copy.errors.malformed_response).toContain("malformed");

    const failed = vi.fn(async () => {
      throw new Error("network offline");
    }) as unknown as typeof fetch;
    expect(await runFeeStats({ network: "testnet" }, { fetchImpl: failed })).toEqual({
      ok: false,
      error: { code: "request_failed" }
    });
    expect(copy.errors.history_unavailable).toContain("fee stats");
  });
});
