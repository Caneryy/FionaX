"use client";

import { useState } from "react";
import type { StellarNetwork } from "@/lib/stellar/horizon";
import { runSponsoredReserves } from "../lib/sponsoredReserves";
import { validateSponsoredReservesInput } from "../schema";
import type { SponsoredReservesState } from "../types";

export function useSponsoredReserves(network: StellarNetwork) {
  const [state, setState] = useState<SponsoredReservesState>({ status: "idle" });

  async function submit(raw: string) {
    const parsed = validateSponsoredReservesInput(raw, network);
    if (!parsed.ok) {
      setState({ status: "error", error: parsed.error });
      return;
    }
    setState({ status: "loading" });
    const outcome = await runSponsoredReserves(parsed.input);
    setState(outcome.ok ? { status: "success", result: outcome.result } : { status: "error", error: outcome.error });
  }

  return { state, submit };
}
