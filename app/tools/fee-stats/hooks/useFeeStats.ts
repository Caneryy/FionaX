"use client";

import { useRef, useState } from "react";
import type { StellarNetwork } from "@/lib/stellar/horizon";
import { runFeeStats } from "../lib/feeStats";
import { validateFeeStatsInput } from "../schema";
import type { FeeStatsState } from "../types";

export function useFeeStats(network: StellarNetwork) {
  const [state, setState] = useState<FeeStatsState>({ status: "idle" });
  const requestId = useRef(0);

  async function refresh() {
    const id = ++requestId.current;
    const parsed = validateFeeStatsInput(network);
    if (!parsed.ok) {
      setState({ status: "error", error: parsed.error });
      return;
    }
    setState({ status: "loading" });
    const outcome = await runFeeStats(parsed.input);
    if (id !== requestId.current) return;
    setState(outcome.ok ? { status: "success", result: outcome.result } : { status: "error", error: outcome.error });
  }

  return { state, refresh };
}
