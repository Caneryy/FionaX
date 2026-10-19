import { describe, expect, it } from "vitest";
import { mergeBalancePages, nextPageCursor } from "@/app/tools/claimable-balances/lib/balance-pages";
import type { ClaimableBalance } from "@/app/tools/claimable-balances/types";

const balance = (pagingToken: string): ClaimableBalance => ({ id: pagingToken, pagingToken, asset: "native", amount: "1", predicate: { kind: "unconditional" } });
describe("bounded pages", () => {
  it("merges repeated paging tokens once", () => expect(mergeBalancePages([[balance("1"), balance("2")], [balance("2"), balance("3")]]).map((b) => b.pagingToken)).toEqual(["1", "2", "3"]));
  it("continues only after a full page", () => {
    expect(nextPageCursor([balance("2")], 2)).toBeUndefined();
    expect(nextPageCursor([balance("1"), balance("2")], 2)).toBe("2");
  });
  it("rejects a non-advancing cursor", () => expect(() => nextPageCursor([balance("1")], 1, "1")).toThrow());
  it("compares Horizon hex tokens without rounding", () => {
    const first = "0".repeat(71) + "9";
    const second = "0".repeat(71) + "a";
    expect(nextPageCursor([balance(second)], 1, first)).toBe(second);
    expect(() => nextPageCursor([balance(first)], 1, second)).toThrow();
  });
});
