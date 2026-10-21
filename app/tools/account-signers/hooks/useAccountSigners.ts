"use client";

import { useState } from "react";
import { toToolError } from "@/app/tools/account-signers/lib/accountSigners.errors";
import { runAccountSigners } from "@/app/tools/account-signers/lib/accountSigners";
import { validateAccountSignersInput } from "@/app/tools/account-signers/schema";
import type { AccountSignersState } from "@/app/tools/account-signers/types";
import { useNetwork } from "@/components/stellar/NetworkProvider";

export function useAccountSigners() {
  const { network } = useNetwork();
  const [state, setState] = useState<AccountSignersState>({ status: "idle" });

  async function submit(raw: string) {
    const parsed = validateAccountSignersInput(raw);

    if (!parsed.ok) {
      setState({ status: "error", error: parsed.error });
      return;
    }

    setState({ status: "loading" });

    try {
      const outcome = await runAccountSigners(raw, { network, fetchImpl: fetch });
      setState(outcome.ok ? { status: "success", result: outcome.result } : { status: "error", error: outcome.error });
    } catch (error) {
      setState({ status: "error", error: toToolError(error) });
    }
  }

  return { state, submit, network };
}
