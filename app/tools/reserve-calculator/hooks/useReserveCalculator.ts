"use client";

import { useState } from "react";
import { validateReserveCalculatorInput } from "@/app/tools/reserve-calculator/schema";
import { runReserveCalculator } from "@/app/tools/reserve-calculator/lib/reserveCalculator";
import { toToolError } from "@/app/tools/reserve-calculator/lib/reserveCalculator.errors";
import type { ReserveCalculatorError, ReserveCalculatorResult } from "@/app/tools/reserve-calculator/types";

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; result: ReserveCalculatorResult }
  | { status: "error"; error: ReserveCalculatorError };

export function useReserveCalculator() {
  const [state, setState] = useState<State>({ status: "idle" });

  async function submit(raw: string) {
    const parsed = validateReserveCalculatorInput(raw);
    if (!parsed.ok) {
      setState({ status: "error", error: parsed.error });
      return;
    }
    setState({ status: "loading" });
    try {
      const result = await runReserveCalculator(parsed.input);
      setState({ status: "success", result });
    } catch (error) {
      setState({ status: "error", error: toToolError(error) });
    }
  }

  return { state, submit };
}
