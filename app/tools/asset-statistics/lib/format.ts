import { normalizeAmount } from "@/app/tools/asset-statistics/lib/amount";

function groupDigits(whole: string): string {
  return whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/** Formats a canonical amount string for display without converting it through Number. */
export function formatExactAmount(value: string): string {
  const normalized = normalizeAmount(value);
  if (!normalized) return value;
  const [whole, fraction] = normalized.split(".");
  return `${groupDigits(whole)}.${fraction}`;
}

export function formatCount(value: number): string {
  return groupDigits(String(value));
}

export function formatSnapshotTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const formatted = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC"
  }).format(date);
  return `${formatted} UTC`;
}
