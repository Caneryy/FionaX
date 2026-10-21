"use client";

import { useRef, useState } from "react";
import type { StellarNetwork } from "@/lib/stellar/horizon";
import { runEffectsTimeline } from "../lib/effectsTimeline";
import type { EffectsTimelineState } from "../types";

export function useEffectsTimeline(network: StellarNetwork) {
  const [state, setState] = useState<EffectsTimelineState>({ status: "idle" });
  const requestId = useRef(0);

  async function submit(rawAccount: string) {
    const id = ++requestId.current;
    setState({ status: "loading" });
    const outcome = await runEffectsTimeline(rawAccount, network);
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
    const outcome = await runEffectsTimeline(previous.accountId, previous.network, {
      effects: previous.effects,
      cursor
    });
    if (id !== requestId.current) return;
    setState(outcome.ok
      ? { status: "success", result: outcome.result, loadingMore: false, pageError: null }
      : { status: "success", result: previous, loadingMore: false, pageError: outcome.error });
  }

  return { state, submit, loadMore };
}
