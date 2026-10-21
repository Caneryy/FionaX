import { validateAmountConverterInput } from "@/app/tools/amount-converter/schema";
import type { AmountConverterOutcome, AmountDirection } from "@/app/tools/amount-converter/types";

/** Convert locally. This tool never calls Horizon or RPC. */
export function runAmountConverter(raw: string, direction: AmountDirection): AmountConverterOutcome {
  return validateAmountConverterInput({ raw, direction });
}
