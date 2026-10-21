import { describe, expect, it } from "vitest";
import { MAX_EFFECTS, PAGE_SIZE, mergeEffectPages, nextPageCursor } from "@/app/tools/effects-timeline/lib/effect-pages";
import type { TimelineEffect } from "@/app/tools/effects-timeline/types";

const effect = (token: string): TimelineEffect => ({ pagingToken: token, type: "account_credited", createdAt: null, details: {} });

describe("effect page merging", () => {
  it("keeps first occurrence and page order", () => {
    expect(mergeEffectPages([effect("3-1"), effect("2-1")], [effect("2-1"), effect("1-1")]).map((item) => item.pagingToken))
      .toEqual(["3-1", "2-1", "1-1"]);
  });

  it("bounds the feed and stops paging when the cap is reached", () => {
    const many = Array.from({ length: MAX_EFFECTS + 1 }, (_, index) => effect(`${index}-1`));
    expect(mergeEffectPages([], many)).toHaveLength(MAX_EFFECTS);
    expect(nextPageCursor(many.slice(0, PAGE_SIZE), undefined, MAX_EFFECTS)).toBeNull();
  });

  it("continues only after a full advancing page", () => {
    const full = Array.from({ length: PAGE_SIZE }, (_, index) => effect(`${index}-1`));
    expect(nextPageCursor(full, undefined, PAGE_SIZE)).toBe("19-1");
    expect(nextPageCursor(full, "19-1", PAGE_SIZE)).toBeNull();
    expect(nextPageCursor(full.slice(0, -1), undefined, PAGE_SIZE - 1)).toBeNull();
  });
});
