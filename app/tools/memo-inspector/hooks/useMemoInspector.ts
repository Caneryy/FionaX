"use client";

import { useState } from "react";
import { toToolError } from "@/app/tools/memo-inspector/lib/memoInspector.errors";
import { runMemoInspector } from "@/app/tools/memo-inspector/lib/memoInspector";
import { validateMemoInspectorInput } from "@/app/tools/memo-inspector/schema";
import type { MemoInspectorState } from "@/app/tools/memo-inspector/types";
import { useNetwork } from "@/components/stellar/NetworkProvider";

export function useMemoInspector() {
  const { network } = useNetwork();
  const [state, setState] = useState<MemoInspectorState>({ status: "idle" });

  async function submit(raw: string) {
    const parsed = validateMemoInspectorInput(raw);

    if (!parsed.ok) {
      setState({ status: "error", error: parsed.error });
      return;
    }

    setState({ status: "loading" });

    try {
      const outcome = await runMemoInspector(raw, { network, fetchImpl: fetch });
      setState(outcome.ok ? { status: "success", result: outcome.result } : { status: "error", error: outcome.error });
    } catch (error) {
      setState({ status: "error", error: toToolError(error) });
    }
  }

  return { state, submit, network };
}
