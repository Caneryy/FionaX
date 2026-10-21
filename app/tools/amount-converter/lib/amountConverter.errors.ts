import { copy } from "@/app/tools/amount-converter/copy";
import type { AmountConverterError, AmountConverterErrorCode } from "@/app/tools/amount-converter/types";

export function messageForAmountError(code: AmountConverterErrorCode): string {
  return copy.errors[code];
}

export function toToolError(code: AmountConverterErrorCode): AmountConverterError {
  return { code, message: messageForAmountError(code) };
}
