/** Deterministic Horizon fee_stats payload with every charged-fee percentile present. */
export const fullFeeStatsBody = {
  last_ledger: "28444678",
  last_ledger_base_fee: "100",
  ledger_capacity_usage: "0.05",
  fee_charged: {
    max: "5500",
    min: "100",
    mode: "100",
    p10: "100",
    p20: "100",
    p30: "100",
    p40: "100",
    p50: "100",
    p60: "150",
    p70: "200",
    p80: "300",
    p90: "500",
    p95: "1000",
    p99: "5500"
  },
  max_fee: {
    max: "16000",
    min: "100",
    mode: "100",
    p10: "100",
    p20: "100",
    p30: "100",
    p40: "100",
    p50: "100",
    p60: "100",
    p70: "100",
    p80: "100",
    p90: "100",
    p95: "100",
    p99: "10000"
  }
} as const;

export function horizonFeeStatsResponse(body: unknown = fullFeeStatsBody, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
