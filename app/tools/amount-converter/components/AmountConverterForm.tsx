"use client";

import { DecimalInput } from "@/app/tools/amount-converter/components/DecimalInput";
import { StroopInput } from "@/app/tools/amount-converter/components/StroopInput";

export function AmountConverterForm({
  decimal,
  stroops,
  invalid,
  onDecimal,
  onStroops
}: {
  decimal: string;
  stroops: string;
  invalid: boolean;
  onDecimal: (value: string) => void;
  onStroops: (value: string) => void;
}) {
  return (
    <form className="grid grid-cols-1 gap-4 sm:grid-cols-2" onSubmit={(event) => event.preventDefault()}>
      <DecimalInput value={decimal} onChange={onDecimal} invalid={invalid} />
      <StroopInput value={stroops} onChange={onStroops} invalid={invalid} />
    </form>
  );
}
