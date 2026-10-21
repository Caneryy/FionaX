import type { AmountConverterErrorCode } from "@/app/tools/amount-converter/types";

export const copy = {
  title: "Stroop & Decimal Amount Converter",
  eyebrow: "Amount clerk",
  idle: "Type a decimal amount or a stroop integer. The other field follows, using exact integer arithmetic.",
  loadingTitle: "Converting",
  loading: "Counting stroops locally. This page does not call Horizon.",
  emptyTitle: "Before the first conversion",
  empty:
    "One XLM is 10000000 stroops. At most 7 digits are allowed after the decimal point. Negative amounts and values outside the protocol range are rejected. Nothing is sent off this page.",
  form: {
    decimalLabel: "Decimal amount",
    stroopLabel: "Stroops",
    decimalHint: "Up to 7 fraction digits. Example: 1.5",
    stroopHint: "A non-negative integer. Example: 15000000",
    decimalPlaceholder: "0.0000000",
    stroopPlaceholder: "0"
  },
  notice: {
    title: "Active direction",
    fromDecimal: "The decimal field is the source. Stroops are the exact integer form.",
    fromStroop: "The stroop field is the source. The decimal form is derived from that integer."
  },
  range: {
    title: "Outside the protocol range",
    body: "A Stellar amount must fit in a signed 64-bit stroop count, from 0 through 9223372036854775807."
  },
  result: {
    title: "Exact conversion",
    decimalLabel: "Decimal",
    stroopLabel: "Stroops"
  },
  errors: {
    empty_amount: "Enter an amount. A decimal uses a point, and stroops are a whole number.",
    invalid_amount: "That amount is not a plain number. Do not use a sign, a space, or scientific notation.",
    too_many_decimals: "Stellar amounts allow at most 7 digits after the decimal point.",
    out_of_range: "That amount is outside the signed 64-bit stroop range.",
    negative_amount: "Negative amounts are rejected. Enter zero or a positive amount."
  },
  errorTitles: {
    empty_amount: "Amount is empty",
    invalid_amount: "Amount is not a number",
    too_many_decimals: "Too many decimal places",
    out_of_range: "Amount is out of range",
    negative_amount: "Amount is negative"
  } satisfies Record<AmountConverterErrorCode, string>
};
