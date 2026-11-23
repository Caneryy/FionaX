/** Keep Horizon fee amounts as exact decimal strings — never route through Number. */
export function formatFeeStroops(stroops: string): string {
  const trimmed = stroops.trim();
  if (!/^(0|[1-9][0-9]*)$/.test(trimmed)) {
    throw new RangeError("Fee must be a non-negative integer string");
  }
  return trimmed;
}

/** Format a 0–100 percentage with two fractional digits from a precomputed percent string. */
export function formatCapacityPercent(percent: string): string {
  const trimmed = percent.trim();
  if (!/^(0|[1-9][0-9]{0,2})(\.[0-9]{1,2})?$/.test(trimmed)) {
    throw new RangeError("Capacity percent out of range");
  }
  const [whole, fraction = ""] = trimmed.split(".");
  return `${whole}.${fraction.padEnd(2, "0").slice(0, 2)}`;
}

/** ISO timestamp → compact UTC label for the last-updated badge. */
export function formatFetchedAt(iso: string): string {
  const ms = Date.parse(iso);
  if (!Number.isFinite(ms)) {
    throw new RangeError("Invalid fetched-at timestamp");
  }
  return new Date(ms).toISOString().replace(/\.\d{3}Z$/, " UTC");
}

export function formatLedgerSequence(ledger: string): string {
  const trimmed = ledger.trim();
  if (!/^[1-9][0-9]*$/.test(trimmed)) {
    throw new RangeError("Ledger sequence must be a positive integer string");
  }
  return trimmed;
}
