"use client";

import { useRef, useState } from "react";
import type { StellarNetwork } from "@/lib/stellar/horizon";
import { runLiquidityPoolInspector } from "../lib/liquidityPoolInspector";
import { createHorizonPoolFetchClient } from "../lib/pool-fetch";
import { validateLiquidityPoolInspectorInput } from "../schema";
import type { LiquidityPoolInspectorState } from "../types";

export function useLiquidityPoolInspector(network: StellarNetwork) {
  const [state, setState] = useState<LiquidityPoolInspectorState>({ status: "idle" });
  const requestId = useRef(0);

  async function submit(rawPoolId: string) {
    const id = ++requestId.current;
    const parsed = validateLiquidityPoolInspectorInput(rawPoolId, network);
    if (!parsed.ok) {
      setState({ status: "error", error: parsed.error });
      return;
    }
    setState({ status: "loading" });
    const outcome = await runLiquidityPoolInspector(parsed.input, createHorizonPoolFetchClient());
    if (id !== requestId.current) return;
    setState(outcome.ok ? { status: "success", result: outcome.result } : { status: "error", error: outcome.error });
  }

  return { state, submit };
}
