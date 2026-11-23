import type { PercentileRow } from "../types";

/** Charged-fee percentiles required by the acceptance criteria (p10 through p99). */
export const PERCENTILE_KEYS = [
  "p10",
  "p20",
  "p30",
  "p40",
  "p50",
  "p60",
  "p70",
  "p80",
  "p90",
  "p95",
  "p99"
] as const;

export type PercentileKey = (typeof PERCENTILE_KEYS)[number];

const FEE_PATTERN = /^(0|[1-9][0-9]*)$/;

export interface PercentileNormalization {
  rows: PercentileRow[];
  /** True when every required percentile key is present and valid. */
  complete: boolean;
  /** True when at least one required percentile is missing or invalid. */
  incomplete: boolean;
}

function labelFor(key: PercentileKey): string {
  return key.toUpperCase();
}

/**
 * Normalize Horizon `fee_charged` into ordered percentile rows.
 * Missing or non-integer values are skipped and mark the set incomplete.
 */
export function normalizePercentileRows(
  feeCharged: Record<string, string> | null | undefined
): PercentileNormalization {
  if (!feeCharged || typeof feeCharged !== "object") {
    return { rows: [], complete: false, incomplete: true };
  }

  const rows: PercentileRow[] = [];
  let missing = 0;

  for (const key of PERCENTILE_KEYS) {
    const raw = feeCharged[key];
    if (typeof raw !== "string" || !FEE_PATTERN.test(raw.trim())) {
      missing += 1;
      continue;
    }
    rows.push({ key, label: labelFor(key), feeStroops: raw.trim() });
  }

  const complete = missing === 0 && rows.length === PERCENTILE_KEYS.length;
  return { rows, complete, incomplete: !complete };
}
