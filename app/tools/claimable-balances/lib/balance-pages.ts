import type { ClaimableBalance } from "../types";
import { ToolFailure } from "./claimableBalances.errors";

export function mergeBalancePages(pages: ClaimableBalance[][]): ClaimableBalance[] {
  const seen = new Set<string>();
  const merged: ClaimableBalance[] = [];
  for (const page of pages) {
    for (const balance of page) {
      if (seen.has(balance.pagingToken)) continue;
      seen.add(balance.pagingToken);
      merged.push(balance);
    }
  }
  return merged;
}

export function nextPageCursor(page: ClaimableBalance[], pageSize: number, previous?: string): string | undefined {
  if (page.length < pageSize) return undefined;
  const cursor = page.at(-1)?.pagingToken;
  const position = (value: string) => value.length === 72 ? BigInt(`0x${value}`) : BigInt(value);
  if (!cursor || (previous && position(cursor) <= position(previous))) throw new ToolFailure("invalid_cursor");
  return cursor;
}
