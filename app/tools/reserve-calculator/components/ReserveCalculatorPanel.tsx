"use client";

import { CharacterPanel } from "@/components/ui/CharacterPanel";
import { Card } from "@/components/ui/Card";
import { useReserveCalculator } from "@/app/tools/reserve-calculator/hooks/useReserveCalculator";
import { copy } from "@/app/tools/reserve-calculator/copy";
import { ReserveCalculatorForm } from "@/app/tools/reserve-calculator/components/ReserveCalculatorForm";
import { ReserveCalculatorResult } from "@/app/tools/reserve-calculator/components/ReserveCalculatorResult";
import { ReserveCalculatorEmptyState } from "@/app/tools/reserve-calculator/components/ReserveCalculatorEmptyState";
import { StatusMessage } from "@/components/ui/StatusMessage";

export function ReserveCalculatorPanel() {
  const { state, submit } = useReserveCalculator();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <CharacterPanel tone="wallet" eyebrow="Accounts" title={copy.title} description={copy.idle} />
      <Card className="space-y-5">
        <ReserveCalculatorForm onSubmit={submit} loading={state.status === "loading"} />
        {state.status === "idle" ? <ReserveCalculatorEmptyState /> : null}
        {state.status === "error" ? (
          <StatusMessage type="error" title="Could not read that account" description={copy.errors[state.error.code]} />
        ) : null}
        {state.status === "success" ? <ReserveCalculatorResult result={state.result} /> : null}
      </Card>
    </div>
  );
}
