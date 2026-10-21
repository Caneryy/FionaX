"use client";

import { useState } from "react";
import { toToolError } from "@/app/tools/account-merge-preflight/lib/accountMergePreflight.errors";
import { runAccountMergePreflight } from "@/app/tools/account-merge-preflight/lib/accountMergePreflight";
import { validateAccountMergePreflightInput } from "@/app/tools/account-merge-preflight/schema";
import type { AccountMergePreflightState } from "@/app/tools/account-merge-preflight/types";
import { useNetwork } from "@/components/stellar/NetworkProvider";

export function useAccountMergePreflight() {
  const { network } = useNetwork();
  const [state, setState] = useState<AccountMergePreflightState>({ status: "idle" });

  async function submit(sourceRaw: string, destinationRaw: string) {
    const parsed = validateAccountMergePreflightInput(sourceRaw, destinationRaw);

    if (!parsed.ok) {
      setState({ status: "error", error: parsed.error });
      return;
    }

    setState({ status: "loading" });

    try {
      const outcome = await runAccountMergePreflight(sourceRaw, destinationRaw, { network, fetchImpl: fetch });

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
