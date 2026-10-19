"use client";

import { useState } from "react";
import { runXdrInspector } from "../lib/xdrInspector";
import type { XdrInspectorState } from "../types";

export function useXdrInspector() {
  const [state, setState] = useState<XdrInspectorState>({ status: "idle" });

  function submit(raw: string) {
    setState({ status: "loading" });
    // Yield one frame so the loading state can be announced before local work.
    window.setTimeout(() => {
      const outcome = runXdrInspector(raw);
      setState(outcome.ok
        ? { status: "success", result: outcome.result }
        : { status: "error", error: outcome.error });
    }, 0);
  }

  return { state, submit };
}
