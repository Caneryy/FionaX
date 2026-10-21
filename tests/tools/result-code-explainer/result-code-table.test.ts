import { describe, expect, it } from "vitest";
import { RESULT_CODE_TABLE } from "@/app/tools/result-code-explainer/lib/result-code-table";

describe("RESULT_CODE_TABLE", () => {
  it("gives every row a non-empty explanation", () => {
    for (const entry of RESULT_CODE_TABLE) {
      expect(entry.explanation.length).toBeGreaterThan(0);
    }
  });

  it("only operation-level rows ever declare an operationType", () => {
    for (const entry of RESULT_CODE_TABLE) {
      if (entry.operationType) expect(entry.category).toBe("operation");
    }
  });

  it("genuinely has multiple rows sharing a code across operation types (the case this tool exists for)", () => {
    const malformedRows = RESULT_CODE_TABLE.filter((entry) => entry.code === "malformed");
    expect(malformedRows.length).toBeGreaterThan(1);
    const operationTypes = new Set(malformedRows.map((entry) => entry.operationType));
    expect(operationTypes.size).toBe(malformedRows.length);
  });
});
