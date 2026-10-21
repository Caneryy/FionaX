"use client";

import { useRef, useState } from "react";
import { useNetwork } from "@/components/stellar/NetworkProvider";
import { copy } from "@/app/tools/asset-metadata/copy";
import { runAssetMetadata } from "@/app/tools/asset-metadata/lib/assetMetadata";
import { toToolError } from "@/app/tools/asset-metadata/lib/assetMetadata.errors";
import { reduceAssetMetadataState } from "@/app/tools/asset-metadata/lib/state";
import { validateAssetMetadataInput } from "@/app/tools/asset-metadata/schema";
import type { AssetMetadataViewState } from "@/app/tools/asset-metadata/types";

export function useAssetMetadata() {
  const { network } = useNetwork();
  const [state, setState] = useState<AssetMetadataViewState>({ status: "idle" });
  const requestId = useRef(0);

  async function submit(issuerAccountId: string, assetCode: string) {
    const parsed = validateAssetMetadataInput({ issuerAccountId, assetCode, network });
    if (!parsed.ok) {
      setState(reduceAssetMetadataState(state, { type: "fail", error: parsed.error }));
      return;
    }

    const id = requestId.current + 1;
    requestId.current = id;
    setState(reduceAssetMetadataState({ status: "idle" }, { type: "submit" }));

    try {
      const outcome = await runAssetMetadata(parsed.input);
      if (requestId.current !== id) return;
      setState(
        reduceAssetMetadataState(
          { status: "loading" },
          outcome.ok ? { type: "succeed", result: outcome.result } : { type: "fail", error: outcome.error }
        )
      );
    } catch (error) {
      if (requestId.current !== id) return;
      setState(reduceAssetMetadataState({ status: "loading" }, { type: "fail", error: toToolError(error) }));
    }
  }

  return {
    state,
    submit,
    network,
    networkLabel: copy.networkLabels[network]
  };
}
