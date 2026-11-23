"use client";

import { useRef, useState } from "react";
import type { StellarNetwork } from "@/lib/stellar/horizon";
import { runOperationBrowser } from "../lib/operationBrowser";
import type { OperationBrowserState } from "../types";

export function useOperationBrowser(network: StellarNetwork) {
  const [state, setState] = useState<OperationBrowserState>({ status: "idle" });
  const requestId = useRef(0);

  async function submit(rawAccount: string) {
    const id = ++requestId.current;
    setState({ status: "loading" });
    const outcome = await runOperationBrowser(rawAccount, network);
    if (id !== requestId.current) return;
    setState(outcome.ok
      ? { status: "success", result: outcome.result, loadingMore: false, pageError: null }
      : { status: "error", error: outcome.error });
  }

  async function loadMore() {
    if (state.status !== "success" || state.loadingMore || !state.result.nextCursor) return;
    const id = ++requestId.current;
    const previous = state.result;
    const cursor = previous.nextCursor;
    if (!cursor) return;
    setState({ status: "success", result: previous, loadingMore: true, pageError: null });
    const outcome = await runOperationBrowser(previous.accountId, previous.network, {
      operations: previous.operations,
      cursor
    });
    if (id !== requestId.current) return;
    setState(outcome.ok
      ? { status: "success", result: outcome.result, loadingMore: false, pageError: null }
      : { status: "success", result: previous, loadingMore: false, pageError: outcome.error });
  }

  return { state, submit, loadMore };
}
