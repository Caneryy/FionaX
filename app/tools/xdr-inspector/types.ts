export type XdrType = "transaction_envelope" | "transaction_result" | "ledger_entry";
export type XdrInspectorErrorCode = "empty_xdr" | "invalid_xdr" | "too_large" | "undetected_type";

export interface XdrInspectorInput {
  base64: string;
  byteLength: number;
}

export interface XdrInspectorResult {
  type: XdrType;
  json: string;
  byteLength: number;
}

export interface XdrInspectorError {
  code: XdrInspectorErrorCode;
}

export type XdrInspectorOutcome =
  | { ok: true; result: XdrInspectorResult }
  | { ok: false; error: XdrInspectorError };

export type XdrInspectorState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; result: XdrInspectorResult }
  | { status: "error"; error: XdrInspectorError };
