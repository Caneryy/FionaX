import { copy } from "@/app/tools/amount-converter/copy";
import type { AmountDirection } from "@/app/tools/amount-converter/types";

export function formatDecimalAmount(value: string): string {
  return value;
}

export function formatStroopAmount(value: string): string {
  return `${value} stroops`;
}

export function formatDirection(direction: AmountDirection): string {
  return direction === "decimal" ? copy.notice.fromDecimal : copy.notice.fromStroop;
}
