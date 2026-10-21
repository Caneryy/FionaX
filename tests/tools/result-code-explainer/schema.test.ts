import { describe, expect, it } from "vitest";
import { validateResultCodeExplainerInput } from "@/app/tools/result-code-explainer/schema";

describe("validateResultCodeExplainerInput", () => {
  it("rejects empty input", () => {
    const result = validateResultCodeExplainerInput("   ");
    expect(result.ok).toBe(false);
    expect(!result.ok && result.error.code).toBe("empty_code");
  });

  it("accepts a trimmed code with no operation type", () => {
    const result = validateResultCodeExplainerInput("  tx_bad_seq  ");
    expect(result.ok).toBe(true);
    expect(result.ok && result.input).toEqual({ code: "tx_bad_seq", operationType: "" });
  });

  it("accepts a code with an operation type", () => {
    const result = validateResultCodeExplainerInput("malformed", " payment ");
    expect(result.ok && result.input.operationType).toBe("payment");
  });
});
