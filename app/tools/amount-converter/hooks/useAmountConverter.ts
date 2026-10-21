"use client";

import { useState } from "react";
import { runAmountConverter } from "@/app/tools/amount-converter/lib/amountConverter";
import type { AmountConverterState, AmountDirection } from "@/app/tools/amount-converter/types";

export function useAmountConverter() {
  const [decimal, setDecimal] = useState("");
  const [stroops, setStroops] = useState("");
  const [direction, setDirection] = useState<AmountDirection | null>(null);
  const [state, setState] = useState<AmountConverterState>({ status: "idle" });

  async function change(raw: string, next: AmountDirection) {
    setDirection(next);

    if (next === "decimal") setDecimal(raw);
    else setStroops(raw);

    if (!raw.trim()) {
      setDecimal("");
      setStroops("");
      setState({ status: "idle" });
      return;
    }

    setState({ status: "loading" });
    await Promise.resolve();
    const outcome = runAmountConverter(raw, next);

    if (!outcome.ok) {
      if (next === "decimal") setStroops("");
      else setDecimal("");
      setState({ status: "error", error: outcome.error });
      return;
    }

    setDecimal(next === "decimal" ? raw : outcome.result.decimal);
    setStroops(outcome.result.stroops);
    setState({ status: "success", result: outcome.result });
  }

  return {
    decimal,
    stroops,
    direction,
    state,
    changeDecimal: (value: string) => change(value, "decimal"),
    changeStroops: (value: string) => change(value, "stroop")
  };
}
