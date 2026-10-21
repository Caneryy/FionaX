import type { AssetStatisticsOutcome, AssetStatisticsViewState } from "@/app/tools/asset-statistics/types";

export function beginLoading(): AssetStatisticsViewState {
  return { status: "loading" };
}

/** Maps a finished lookup onto success, the zero-trustline empty state, or error. */
export function toViewState(outcome: AssetStatisticsOutcome): Exclude<AssetStatisticsViewState, { status: "idle" } | { status: "loading" }> {
  if (!outcome.ok) {
    return { status: "error", error: outcome.error };
  }

  if (outcome.result.trustlines.total === 0) {
    return { status: "empty", result: outcome.result };
  }

  return { status: "success", result: outcome.result };
}
