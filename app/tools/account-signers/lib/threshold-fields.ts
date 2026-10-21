import type { Thresholds } from "@/app/tools/account-signers/types";

/** Read low, medium, and high thresholds. Horizon names the middle one med_threshold. */
export function readThresholds(value: unknown): Thresholds | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;
  const low = record.low_threshold;
  const medium = record.med_threshold;
  const high = record.high_threshold;

  if (!isThreshold(low) || !isThreshold(medium) || !isThreshold(high)) {
    return null;
  }

  return { low, medium, high };
}

function isThreshold(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 255;
}
