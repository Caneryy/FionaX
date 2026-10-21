import { describe, expect, it } from "vitest";
import { copy } from "@/app/tools/asset-statistics/copy";
import { beginLoading, toViewState } from "@/app/tools/asset-statistics/lib/asset-statistics-state";
import type { AssetStatisticsResult } from "@/app/tools/asset-statistics/types";

const capturedAt = "2026-03-01T15:04:00.000Z";

function result(total: number): AssetStatisticsResult {
  return {
    assetCode: "USDC",
    assetIssuer: "GDVEU3DD4KOFECV66VIHWEZOYX4ZKR3WV27L464SIIPOU2IUI3JCZA57",
    assetType: "credit_alphanum4",
    accountsHolding: total,
    claimableBalancesHolding: 0,
    trustlines: {
      authorized: total,
      authorizedToMaintainLiabilities: 0,
      unauthorized: 0,
      total
    },
    supply: {
      authorized: "1.0000000",
      authorizedToMaintainLiabilities: "0.0000000",
      unauthorized: "0.0000000",
      claimableBalances: "0.0000000",
      liquidityPools: "0.0000000",
      contracts: "0.0000000",
      circulating: "1.0000000"
    },
    capturedAt
  };
}

describe("asset statistics view state", () => {
  it("starts a lookup in the loading state", () => {
    expect(beginLoading()).toEqual({ status: "loading" });
  });

  it("shows success when at least one trustline exists", () => {
    const view = toViewState({ ok: true, result: result(3) });
    expect(view.status).toBe("success");
  });

  it("shows the empty state when the trustline total is zero", () => {
    const view = toViewState({ ok: true, result: result(0) });
    expect(view.status).toBe("empty");
    if (view.status === "empty") expect(view.result.accountsHolding).toBe(0);
  });

  it("shows an error without treating it as empty", () => {
    const view = toViewState({
      ok: false,
      error: { code: "asset_not_found", message: copy.errors.asset_not_found }
    });
    expect(view).toEqual({
      status: "error",
      error: { code: "asset_not_found", message: copy.errors.asset_not_found }
    });
  });
});
