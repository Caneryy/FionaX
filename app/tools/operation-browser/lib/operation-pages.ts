import type { BrowserOperation } from "../types";

export const PAGE_SIZE = 20;
export const MAX_OPERATIONS = 200;

export function mergeOperationPages(previous: BrowserOperation[], incoming: BrowserOperation[]): BrowserOperation[] {
  const seen = new Set<string>();
  const merged: BrowserOperation[] = [];
  for (const operation of [...previous, ...incoming]) {
    if (seen.has(operation.pagingToken)) continue;
    seen.add(operation.pagingToken);
    if (merged.length < MAX_OPERATIONS) merged.push(operation);
  }
  return merged;
}

export function nextPageCursor(
  page: BrowserOperation[],
  requestedCursor: string | undefined,
  totalCount: number
): string | null {
  if (page.length < PAGE_SIZE || totalCount >= MAX_OPERATIONS) return null;
  const last = page.at(-1)?.pagingToken;
  return last && last !== requestedCursor ? last : null;
}
