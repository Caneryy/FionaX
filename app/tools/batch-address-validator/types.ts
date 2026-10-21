export interface ParsedBatchEntry {
  value: string;
  /** 1-based line number in the original paste. */
  line: number;
  /** 0-based order after blank tokens are dropped. */
  index: number;
}

export interface BatchAddressValidatorInput {
  entries: ParsedBatchEntry[];
}

export type EntryStatus = "valid" | "invalid" | "duplicate";

export type RowIssueCode = "invalid_address" | "duplicate_address";

export interface BatchAddressRow {
  value: string;
  line: number;
  index: number;
  status: EntryStatus;
  code: RowIssueCode | null;
}

export interface BatchAddressSummary {
  total: number;
  valid: number;
  invalid: number;
  duplicate: number;
}

export interface BatchAddressValidatorResult {
  rows: BatchAddressRow[];
  summary: BatchAddressSummary;
}

export type BatchAddressValidatorErrorCode =
  | "empty_batch"
  | "too_many_entries"
  | "contains_secret_seed"
  | "invalid_address"
  | "duplicate_address";

export interface BatchAddressValidatorError {
  code: BatchAddressValidatorErrorCode;
  message: string;
}
