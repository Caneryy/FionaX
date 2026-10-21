"use client";

import { useState } from "react";
import { validatePreconditionsExplainerInput } from "@/app/tools/preconditions-explainer/schema";
import { runPreconditionsExplainer } from "@/app/tools/preconditions-explainer/lib/preconditionsExplainer";
import type { PreconditionsExplainerError, PreconditionsExplainerResult } from "@/app/tools/preconditions-explainer/types";

type State =
  | { status: "idle" }
  | { status: "success"; result: PreconditionsExplainerResult }
  | { status: "error"; error: PreconditionsExplainerError };

/** Decoding is synchronous and entirely local — this tool never makes a request. */
export function usePreconditionsExplainer() {
  const [state, setState] = useState<State>({ status: "idle" });

  function submit(raw: string) {
    const parsed = validatePreconditionsExplainerInput(raw);
    if (!parsed.ok) {
      setState({ status: "error", error: parsed.error });
      return;
    }
    const outcome = runPreconditionsExplainer(parsed.input);
    setState(outcome.ok ? { status: "success", result: outcome.result } : { status: "error", error: outcome.error });
  }

  return { state, submit };
}
