import { describe, expect, it } from "vitest";
import { MAX_OPERATIONS, PAGE_SIZE, mergeOperationPages, nextPageCursor } from "@/app/tools/operation-browser/lib/operation-pages";
import type { BrowserOperation } from "@/app/tools/operation-browser/types";

const operation = (token: string): BrowserOperation => ({
  pagingToken: token,
  type: "payment",
  createdAt: null,
  transactionHash: "a".repeat(64),
  details: {}
});

describe("operation page merging", () => {
  it("keeps first occurrence and page order", () => {
    expect(mergeOperationPages([operation("3"), operation("2")], [operation("2"), operation("1")]).map((item) => item.pagingToken))
      .toEqual(["3", "2", "1"]);
  });

  it("bounds the feed and stops paging when the cap is reached", () => {
    const many = Array.from({ length: MAX_OPERATIONS + 1 }, (_, index) => operation(String(index)));
    expect(mergeOperationPages([], many)).toHaveLength(MAX_OPERATIONS);
    expect(nextPageCursor(many.slice(0, PAGE_SIZE), undefined, MAX_OPERATIONS)).toBeNull();
  });

  it("continues only after a full advancing page", () => {
    const full = Array.from({ length: PAGE_SIZE }, (_, index) => operation(String(index)));
    expect(nextPageCursor(full, undefined, PAGE_SIZE)).toBe("19");
    expect(nextPageCursor(full, "19", PAGE_SIZE)).toBeNull();
    expect(nextPageCursor(full.slice(0, -1), undefined, PAGE_SIZE - 1)).toBeNull();
  });
});
