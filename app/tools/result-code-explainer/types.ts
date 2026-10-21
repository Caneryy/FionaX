export type ErrorCode = "empty_code" | "unknown_code" | "ambiguous_operation_type";

export interface ResultCodeExplainerError {
  code: ErrorCode;
  message: string;
}

export type CodeCategory = "transaction" | "operation";

export interface ResultCodeExplainerInput {
  code: string;
  operationType: string;
}

export interface CodeEntry {
  code: string;
  category: CodeCategory;
  /** Only present for operation-level codes whose meaning depends on the operation type. */
  operationType?: string;
  label: string;
  explanation: string;
  commonCauses: string[];
}

export interface ResultCodeExplainerResult {
  code: string;
  category: CodeCategory;
  operationType?: string;
  label: string;
  explanation: string;
  commonCauses: string[];
}
