import { describe, expect, it } from "vitest";
import { formatCategory } from "@/app/tools/result-code-explainer/lib/format";

describe("formatCategory", () => {
  it("labels transaction and operation categories", () => {
    expect(formatCategory("transaction")).toBe("Transaction-level");
    expect(formatCategory("operation")).toBe("Operation-level");
  });
});
