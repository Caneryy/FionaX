"use client";

import { CharacterPanel } from "@/components/ui/CharacterPanel";
import { Card } from "@/components/ui/Card";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { AmountConverterEmptyState } from "@/app/tools/amount-converter/components/AmountConverterEmptyState";
import { AmountConverterForm } from "@/app/tools/amount-converter/components/AmountConverterForm";
import { AmountConverterResult } from "@/app/tools/amount-converter/components/AmountConverterResult";
import { ConversionNotice } from "@/app/tools/amount-converter/components/ConversionNotice";
import { RangeWarning } from "@/app/tools/amount-converter/components/RangeWarning";
import { copy } from "@/app/tools/amount-converter/copy";
import { useAmountConverter } from "@/app/tools/amount-converter/hooks/useAmountConverter";

export function AmountConverterPanel() {
  const { decimal, stroops, direction, state, changeDecimal, changeStroops } = useAmountConverter();

  return (
    <div className="mx-auto w-full min-w-0 max-w-3xl space-y-6">
      <CharacterPanel tone="detective" eyebrow={copy.eyebrow} title={copy.title} description={copy.idle} />
      <Card className="space-y-5">
        <AmountConverterForm
          decimal={decimal}
          stroops={stroops}
          invalid={state.status === "error"}
          onDecimal={changeDecimal}
          onStroops={changeStroops}
        />
        <div aria-live="polite" className="space-y-4">
          {state.status === "idle" ? <AmountConverterEmptyState /> : null}
          {state.status === "loading" ? (
            <div role="status">
              <StatusMessage type="info" title={copy.loadingTitle} description={copy.loading} />
            </div>
          ) : null}
          {state.status === "error" ? (
            <div role="alert">
              <StatusMessage type="error" title={copy.errorTitles[state.error.code]} description={state.error.message} />
            </div>
          ) : null}
          <RangeWarning visible={state.status === "error" && state.error.code === "out_of_range"} />
          {state.status === "success" ? <ConversionNotice direction={direction} /> : null}
          {state.status === "success" ? <AmountConverterResult result={state.result} /> : null}
        </div>
      </Card>
    </div>
  );
}
