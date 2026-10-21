"use client";

import { useState } from "react";
import { toToolError } from "@/app/tools/account-data-entries/lib/accountDataEntries.errors";
import { runAccountDataEntries } from "@/app/tools/account-data-entries/lib/accountDataEntries";
import { validateAccountDataEntriesInput } from "@/app/tools/account-data-entries/schema";
import type { AccountDataEntriesState } from "@/app/tools/account-data-entries/types";
import { useNetwork } from "@/components/stellar/NetworkProvider";

export function useAccountDataEntries() {
  const { network } = useNetwork();
  const [state, setState] = useState<AccountDataEntriesState>({ status: "idle" });

  async function submit(raw: string) {
    const parsed = validateAccountDataEntriesInput(raw);

    if (!parsed.ok) {
      setState({ status: "error", error: parsed.error });
      return;
    }

    setState({ status: "loading" });

    try {
      const outcome = await runAccountDataEntries(raw, { network, fetchImpl: fetch });

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
