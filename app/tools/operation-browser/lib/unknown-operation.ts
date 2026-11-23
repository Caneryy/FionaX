import { operationSummaries } from "../copy";
import type { BrowserOperation } from "../types";

export function isUnknownOperation(operation: BrowserOperation): boolean {
  return !Object.hasOwn(operationSummaries, operation.type);
}

export function unknownOperationLabel(operation: BrowserOperation): string {
  return operation.type;
}
