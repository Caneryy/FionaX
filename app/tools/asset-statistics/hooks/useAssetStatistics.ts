"use client";

import { useMemo, useState } from "react";
import { useNetwork } from "@/components/stellar/NetworkProvider";
import { beginLoading, toViewState } from "@/app/tools/asset-statistics/lib/asset-statistics-state";
import { runAssetStatistics } from "@/app/tools/asset-statistics/lib/assetStatistics";
import { createHorizonAssetLookup } from "@/app/tools/asset-statistics/lib/horizon-asset-client";
import { validateAssetStatisticsInput } from "@/app/tools/asset-statistics/schema";
import type { AssetStatisticsFormValues, AssetStatisticsViewState } from "@/app/tools/asset-statistics/types";

export function useAssetStatistics() {
  const { network } = useNetwork();
  const client = useMemo(() => createHorizonAssetLookup(network), [network]);
  const [state, setState] = useState<AssetStatisticsViewState>({ status: "idle" });

  async function submit(raw: AssetStatisticsFormValues) {
    const parsed = validateAssetStatisticsInput(raw);
    if (!parsed.ok) {
      setState({ status: "error", error: parsed.error });
      return;
    }

    setState(beginLoading());
    const outcome = await runAssetStatistics(raw, client);
    setState(toViewState(outcome));
  }

  return { state, submit, network };
}
