"use client";

import { useRef, useState } from "react";
import { runClaimableBalances } from "../lib/claimableBalances";
import { validateClaimableBalancesInput } from "../schema";
import type { ClaimableBalancesState } from "../types";
import type { StellarNetwork } from "@/lib/stellar/horizon";

export function useClaimableBalances(network: StellarNetwork) {
  const [state, setState] = useState<ClaimableBalancesState>({ status: "idle" });
  const requestId = useRef(0);

  async function submit(claimant: string, cursor: string) {
    const id = ++requestId.current;
    const parsed = validateClaimableBalancesInput(claimant, cursor, network);
    if (!parsed.ok) { setState({ status: "error", error: parsed.error }); return; }
    setState({ status: "loading" });
    const outcome = await runClaimableBalances(parsed.input);
    if (id !== requestId.current) return;
    setState(outcome.ok ? { status: "success", result: outcome.result } : { status: "error", error: outcome.error });
  }
  return { state, submit };
}
