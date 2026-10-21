"use client";

import { useState } from "react";
import { validateResultCodeExplainerInput } from "@/app/tools/result-code-explainer/schema";
import { runResultCodeExplainer } from "@/app/tools/result-code-explainer/lib/resultCodeExplainer";
import type { ResultCodeExplainerError, ResultCodeExplainerResult } from "@/app/tools/result-code-explainer/types";

type State =
  | { status: "idle" }
  | { status: "success"; result: ResultCodeExplainerResult }
  | { status: "error"; error: ResultCodeExplainerError };

/** Lookup is synchronous and entirely local — this tool never makes a request. */
export function useResultCodeExplainer() {
  const [state, setState] = useState<State>({ status: "idle" });

  function submit(code: string, operationType: string) {
    const parsed = validateResultCodeExplainerInput(code, operationType);
    if (!parsed.ok) {
      setState({ status: "error", error: parsed.error });
      return;
    }
    const outcome = runResultCodeExplainer(parsed.input);
    setState(outcome.ok ? { status: "success", result: outcome.result } : { status: "error", error: outcome.error });
  }

  return { state, submit };
}
