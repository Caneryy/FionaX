import { describe, expect, it } from "vitest";
import { summarizeOperation } from "@/app/tools/operation-browser/lib/operation-summaries";
import { isUnknownOperation, unknownOperationLabel } from "@/app/tools/operation-browser/lib/unknown-operation";
import type { BrowserOperation } from "@/app/tools/operation-browser/types";
import { unknownOperation } from "./fixtures/unknown-operation.fixture";

describe("unknown operations", () => {
  it("shows the raw type for an unrecognized future operation", () => {
    const operation: BrowserOperation = {
      pagingToken: unknownOperation.paging_token,
      type: unknownOperation.type,
      createdAt: unknownOperation.created_at,
      transactionHash: unknownOperation.transaction_hash,
      details: {}
    };
    expect(isUnknownOperation(operation)).toBe(true);
    expect(unknownOperationLabel(operation)).toBe("future_operation");
    expect(summarizeOperation(operation)).toBe("future_operation");
  });

  it("recognizes a known type without depending on the prototype chain", () => {
    const operation: BrowserOperation = {
      pagingToken: "1",
      type: "create_account",
      createdAt: null,
      transactionHash: "a".repeat(64),
      details: {}
    };
    expect(isUnknownOperation(operation)).toBe(false);
  });
});
