"use client";

import { useState } from "react";
import { toToolError } from "@/app/tools/asset-flags-inspector/lib/assetFlagsInspector.errors";
import { runAssetFlagsInspector } from "@/app/tools/asset-flags-inspector/lib/assetFlagsInspector";
import { validateAssetFlagsInspectorInput } from "@/app/tools/asset-flags-inspector/schema";
import type { AssetFlagsInspectorState } from "@/app/tools/asset-flags-inspector/types";
import { useNetwork } from "@/components/stellar/NetworkProvider";

/**
 * Idle until submit. Invalid input stays an error and never enters loading.
 * Loading covers the Horizon read. Success and error are the two terminal states.
 */
export function useAssetFlagsInspector() {
  const { network } = useNetwork();
  const [state, setState] = useState<AssetFlagsInspectorState>({ status: "idle" });

  async function submit(raw: string) {
    const parsed = validateAssetFlagsInspectorInput(raw);

    if (!parsed.ok) {
      setState({ status: "error", error: parsed.error });
      return;
    }

    setState({ status: "loading" });

    try {
      const outcome = await runAssetFlagsInspector(raw, { network, fetchImpl: fetch });

      if (outcome.ok) {
        setState({ status: "success", result: outcome.result });
        return;
      }

      setState({ status: "error", error: outcome.error });
    } catch (error) {
      setState({ status: "error", error: toToolError(error) });
    }
  }

  return { state, submit, network };
}
