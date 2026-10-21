import type { TimelineEffect } from "../types";

export const PAGE_SIZE = 20;
export const MAX_EFFECTS = 200;

export function mergeEffectPages(previous: TimelineEffect[], incoming: TimelineEffect[]): TimelineEffect[] {
  const seen = new Set<string>();
  const merged: TimelineEffect[] = [];
  for (const effect of [...previous, ...incoming]) {
    if (seen.has(effect.pagingToken)) continue;
    seen.add(effect.pagingToken);
    if (merged.length < MAX_EFFECTS) merged.push(effect);
  }
  return merged;
}

export function nextPageCursor(
  page: TimelineEffect[],
  requestedCursor: string | undefined,
  totalCount: number
): string | null {
  if (page.length < PAGE_SIZE || totalCount >= MAX_EFFECTS) return null;
  const last = page.at(-1)?.pagingToken;
  return last && last !== requestedCursor ? last : null;
}
