import { copy } from "@/app/tools/memo-inspector/copy";
import { MalformedMemoError } from "@/app/tools/memo-inspector/lib/memo-decode";
import type { MemoInspectorError, MemoInspectorErrorCode } from "@/app/tools/memo-inspector/types";

export class MemoInspectorFailure extends Error {
  readonly code: Exclude<MemoInspectorErrorCode, "invalid_hash">;

  constructor(code: Exclude<MemoInspectorErrorCode, "invalid_hash">) {
    super(code);
    this.name = "MemoInspectorFailure";
    this.code = code;
  }
}

function messageForCode(code: MemoInspectorErrorCode): string {
  if (code === "invalid_hash") return copy.errors.invalid_hash.malformed;
  return copy.errors[code];
}

export function toToolError(error: unknown): MemoInspectorError {
  if (error instanceof MalformedMemoError) {
    return { code: "malformed_memo", message: copy.errors.malformed_memo };
  }

  if (error instanceof MemoInspectorFailure) {
    return { code: error.code, message: messageForCode(error.code) };
  }

  return { code: "request_failed", message: copy.errors.request_failed };
}
