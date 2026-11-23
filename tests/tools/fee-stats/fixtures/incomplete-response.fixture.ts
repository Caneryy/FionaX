/**
 * Valid top-level fee_stats fields with several charged-fee percentiles missing.
 * The tool must keep a success/incomplete path rather than inventing zeros.
 */
export const incompleteFeeStatsBody = {
  last_ledger: "28444680",
  last_ledger_base_fee: "100",
  ledger_capacity_usage: "0.2",
  fee_charged: {
    max: "100",
    min: "100",
    mode: "100",
    p10: "100",
    p50: "100",
    p99: "100"
  }
} as const;

/** Missing required top-level fields — must surface as malformed_response. */
export const malformedFeeStatsBody = {
  last_ledger: "not-a-ledger",
  fee_charged: null
} as const;
