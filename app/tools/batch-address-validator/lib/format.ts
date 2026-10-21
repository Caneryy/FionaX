import { copy } from "@/app/tools/batch-address-validator/copy";
import type {
  BatchAddressSummary,
  EntryStatus,
  RowIssueCode
} from "@/app/tools/batch-address-validator/types";

export function formatRowLocation(row: { line: number; index: number }): string {
  return `Line ${row.line}, entry ${row.index + 1}`;
}

export function formatStatusLabel(status: EntryStatus): string {
  return copy.status[status];
}

export function formatCount(count: number, label: "valid" | "invalid" | "duplicate" | "total"): string {
  return `${count} ${label}`;
}

export function formatSummaryLine(summary: BatchAddressSummary): string {
  return `${summary.valid} valid, ${summary.invalid} invalid, ${summary.duplicate} duplicate`;
}

export function formatRowIssue(code: RowIssueCode | null): string {
  if (!code) return "";
  return copy.errors[code];
}
