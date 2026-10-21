import { copy } from "@/app/tools/amount-converter/copy";
import { decimalToStroops } from "@/app/tools/amount-converter/lib/decimal-to-stroop";
import { parseStroops, stroopsToDecimal } from "@/app/tools/amount-converter/lib/stroop-to-decimal";
import type { AmountConverterError, AmountConverterInput, AmountConverterOutcome } from "@/app/tools/amount-converter/types";

function failure(code: AmountConverterError["code"]): AmountConverterOutcome {
  return { ok: false, error: { code, message: copy.errors[code] } };
}

/** Validate one field locally. No network call. */
export function validateAmountConverterInput(input: AmountConverterInput): AmountConverterOutcome {
  const parsed = input.direction === "decimal" ? decimalToStroops(input.raw) : parseStroops(input.raw);

  if (!parsed.ok) return failure(parsed.code);

  return {
    ok: true,
    result: {
      direction: input.direction,
      decimal: stroopsToDecimal(parsed.stroops),
      stroops: parsed.stroops.toString(10),
      stroopValue: parsed.stroops
    }
  };
}
