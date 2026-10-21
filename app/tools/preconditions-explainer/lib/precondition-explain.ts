import type { LedgerBoundsInfo, TimeBoundsInfo } from "@/app/tools/preconditions-explainer/types";

function formatUnixSeconds(seconds: string): string {
  if (seconds === "0") return "unbounded";
  const value = Number(seconds);
  if (!Number.isFinite(value)) return seconds;
  return new Date(value * 1000).toISOString().replace("T", " ").replace(/\.\d+Z$/, " UTC");
}

/** Translates each precondition into a plain-language sentence, not just a raw value dump. */
export function explainTimeBounds(bounds: TimeBoundsInfo): string {
  const min = formatUnixSeconds(bounds.minTime);
  const max = formatUnixSeconds(bounds.maxTime);
  if (bounds.minTime === "0" && bounds.maxTime === "0") {
    return "No time restriction — valid at any time.";
  }
  return `Valid from ${min} until ${max}.`;
}

export function explainLedgerBounds(bounds: LedgerBoundsInfo): string {
  const min = bounds.minLedger === 0 ? "any ledger" : `ledger ${bounds.minLedger}`;
  const max = bounds.maxLedger === 0 ? "no upper bound" : `ledger ${bounds.maxLedger}`;
  return `Valid from ${min} until ${max}.`;
}

export function explainMinSequenceNumber(value: string): string {
  return `The source account's sequence number must be at least ${value} for this transaction to apply.`;
}

export function explainMinSequenceAge(seconds: string): string {
  return `The source account's current sequence number must have been reached at least ${seconds} second(s) ago.`;
}

export function explainMinSequenceLedgerGap(gap: number): string {
  return `At least ${gap} ledger(s) must have closed since the source account's current sequence number was reached.`;
}
