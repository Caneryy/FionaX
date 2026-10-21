import { describe, expect, it } from "vitest";
import { disambiguateByOperationType } from "@/app/tools/result-code-explainer/lib/operation-disambiguation";
import { lookupCode } from "@/app/tools/result-code-explainer/lib/code-lookup";
import { uniqueOperationCode, uniqueOperationCodeType } from "@/tests/tools/result-code-explainer/fixtures/operation-codes.fixture";
import { ambiguousCode, ambiguousCodeResolvedType } from "@/tests/tools/result-code-explainer/fixtures/ambiguous-codes.fixture";

describe("disambiguateByOperationType", () => {
  it("resolves a unique code without needing an operation type", () => {
    const outcome = disambiguateByOperationType(lookupCode(uniqueOperationCode), "");
    expect(outcome.kind).toBe("unique");
    expect(outcome.kind === "unique" && outcome.entry.operationType).toBe(uniqueOperationCodeType);
  });

  it("resolves an ambiguous code when the operation type is given", () => {
    const outcome = disambiguateByOperationType(lookupCode(ambiguousCode), ambiguousCodeResolvedType);
    expect(outcome.kind).toBe("unique");
    expect(outcome.kind === "unique" && outcome.entry.operationType).toBe(ambiguousCodeResolvedType);
  });

  it("reports ambiguous with every candidate operation type when none is given", () => {
    const outcome = disambiguateByOperationType(lookupCode(ambiguousCode), "");
    expect(outcome.kind).toBe("ambiguous");
    expect(outcome.kind === "ambiguous" && outcome.operationTypes.length).toBeGreaterThan(1);
  });

  it("reports not_found for an empty match list", () => {
    expect(disambiguateByOperationType([], "payment").kind).toBe("not_found");
  });
});
