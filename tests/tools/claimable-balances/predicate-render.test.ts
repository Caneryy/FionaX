import { describe, expect, it } from "vitest";
import { decodePredicate, predicateLabel } from "@/app/tools/claimable-balances/lib/predicate-render";
import { ToolFailure } from "@/app/tools/claimable-balances/lib/claimableBalances.errors";
import { nestedPredicate } from "./fixtures/nested-predicate.fixture";

describe("predicate trees", () => {
  it("keeps all AND, OR and NOT branches", () => {
    const tree = decodePredicate(nestedPredicate);
    expect(tree.kind).toBe("and");
    if (tree.kind !== "and") throw new Error("Expected AND");
    expect(tree.children.map((child) => child.kind)).toEqual(["or", "not"]);
    expect(predicateLabel(tree.children[0])).toContain("Any");
  });
  it("rejects unknown, ambiguous and excessively deep predicates", () => {
    for (const raw of [{ unknown: true }, { unconditional: true, not: {} }, { and: [] }]) {
      expect(() => decodePredicate(raw)).toThrow(ToolFailure);
    }
    let deep: unknown = { unconditional: true };
    for (let i = 0; i < 34; i++) deep = { not: deep };
    expect(() => decodePredicate(deep)).toThrow(ToolFailure);
  });
  it("keeps dates outside JavaScript's date range readable", () => {
    const predicate = decodePredicate({ absBefore: "+39121901036-03-29T15:30:22Z", absBeforeEpoch: "1234567890123456789" });
    expect(predicateLabel(predicate)).toContain("+39121901036-03-29T15:30:22 UTC");
  });
});
