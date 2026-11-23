import { operationSummaries } from "../copy";
import { isUnknownOperation, unknownOperationLabel } from "./unknown-operation";
import type { BrowserOperation } from "../types";

export function summarizeOperation(operation: BrowserOperation): string {
  return isUnknownOperation(operation)
    ? unknownOperationLabel(operation)
    : operationSummaries[operation.type](operation);
}

export function knownOperationTypes(): string[] {
  return Object.keys(operationSummaries);
}
