import { describe, expect, it } from "vitest";
import { normalizePercentileRows, PERCENTILE_KEYS } from "@/app/tools/fee-stats/lib/percentile-rows";
import { fullFeeStatsBody } from "./fixtures/full-fee-stats.fixture";
import { incompleteFeeStatsBody } from "./fixtures/incomplete-response.fixture";

describe("normalizePercentileRows", () => {
  it("returns ordered p10–p99 rows for a complete fee_charged object", () => {
    const result = normalizePercentileRows({ ...fullFeeStatsBody.fee_charged });
    expect(result.complete).toBe(true);
    expect(result.incomplete).toBe(false);
    expect(result.rows.map((row) => row.key)).toEqual([...PERCENTILE_KEYS]);
    expect(result.rows.find((row) => row.key === "p99")?.feeStroops).toBe("5500");
  });

  it("marks incomplete payloads without inventing missing percentiles", () => {
    const result = normalizePercentileRows({ ...incompleteFeeStatsBody.fee_charged });
    expect(result.complete).toBe(false);
    expect(result.incomplete).toBe(true);
    expect(result.rows.map((row) => row.key)).toEqual(["p10", "p50", "p99"]);
  });

  it("treats null or empty fee_charged as incomplete", () => {
    expect(normalizePercentileRows(null)).toEqual({ rows: [], complete: false, incomplete: true });
    expect(normalizePercentileRows(undefined)).toEqual({ rows: [], complete: false, incomplete: true });
    expect(normalizePercentileRows({})).toMatchObject({ rows: [], incomplete: true });
  });

  it("skips non-integer percentile values", () => {
    const result = normalizePercentileRows({ p10: "100", p20: "1.5", p30: "200" });
    expect(result.rows.map((row) => row.key)).toEqual(["p10", "p30"]);
    expect(result.incomplete).toBe(true);
  });
});
