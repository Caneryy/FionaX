# Stroop & Decimal Amount Converter

Convert a Stellar amount between its decimal form and its stroop integer, in either direction.

## Behavior

The page is fully offline. Typing in the decimal field updates the stroop field, and typing in the stroop field updates the decimal field. The conversion uses `bigint`. It never uses a JavaScript float.

One XLM is `10000000` stroops. At most 7 digits are allowed after the decimal point. The largest value is the signed 64-bit maximum, `9223372036854775807` stroops.

The decimal result drops trailing fraction zeros, so `1.5000000` and `15000000` stroops both describe `1.5`. Converting that decimal back produces the same stroop integer.

## Errors

- `empty_amount`: the field is blank. Clearing a field clears the other one and returns to the idle state.
- `invalid_amount`: the text is not a plain number.
- `too_many_decimals`: more than 7 fraction digits.
- `negative_amount`: a leading minus.
- `out_of_range`: the integer does not fit in a signed 64-bit stroop count.

## Boundaries

No fiat conversion. No transaction building. No Horizon or RPC request.
