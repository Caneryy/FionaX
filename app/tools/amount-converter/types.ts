export const STROOP_SCALE = 10000000n;
export const MAX_STROOPS = 9223372036854775807n;
export const MAX_FRACTION_DIGITS = 7;

export type AmountDirection = "decimal" | "stroop";

export interface AmountConverterInput {
  raw: string;
  direction: AmountDirection;
}

export type AmountConverterErrorCode =
  | "empty_amount"
  | "invalid_amount"
  | "too_many_decimals"
  | "out_of_range"
  | "negative_amount";

export interface AmountConverterError {
  code: AmountConverterErrorCode;
  message: string;
}

export interface AmountConverterResult {
  direction: AmountDirection;
  decimal: string;
  stroops: string;
  stroopValue: bigint;
}

export type AmountConverterOutcome =
  | { ok: true; result: AmountConverterResult }
  | { ok: false; error: AmountConverterError };

export type AmountConverterState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; result: AmountConverterResult }
  | { status: "error"; error: AmountConverterError };
