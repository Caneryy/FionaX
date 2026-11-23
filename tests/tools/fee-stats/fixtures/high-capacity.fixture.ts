/** Near-full ledger capacity — exercises the gauge at the upper bound. */
export const highCapacityFeeStatsBody = {
  last_ledger: "30000001",
  last_ledger_base_fee: "100",
  ledger_capacity_usage: "0.97",
  fee_charged: {
    max: "20000",
    min: "100",
    mode: "500",
    p10: "100",
    p20: "150",
    p30: "200",
    p40: "300",
    p50: "500",
    p60: "800",
    p70: "1200",
    p80: "2500",
    p90: "5000",
    p95: "10000",
    p99: "20000"
  },
  max_fee: {
    max: "50000",
    min: "100",
    mode: "1000",
    p10: "100",
    p20: "200",
    p30: "400",
    p40: "600",
    p50: "1000",
    p60: "2000",
    p70: "4000",
    p80: "8000",
    p90: "15000",
    p95: "25000",
    p99: "50000"
  }
} as const;
