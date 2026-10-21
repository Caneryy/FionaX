import { describe, expect, it } from "vitest";
import { runResultCodeExplainer } from "@/app/tools/result-code-explainer/lib/resultCodeExplainer";
import { knownTransactionCode, unknownTransactionLikeCode } from "@/tests/tools/result-code-explainer/fixtures/transaction-codes.fixture";
import { sharedOperationCode } from "@/tests/tools/result-code-explainer/fixtures/operation-codes.fixture";
import { ambiguousCode, ambiguousCodeOtherType, ambiguousCodeResolvedType } from "@/tests/tools/result-code-explainer/fixtures/ambiguous-codes.fixture";

describe("runResultCodeExplainer", () => {
  it("explains a known transaction-level code", () => {
    const outcome = runResultCodeExplainer({ code: knownTransactionCode, operationType: "" });
    expect(outcome.ok).toBe(true);
    expect(outcome.ok && outcome.result.category).toBe("transaction");
  });

  it("explains a shared operation-level envelope code with no operation type needed", () => {
    const outcome = runResultCodeExplainer({ code: sharedOperationCode, operationType: "" });
    expect(outcome.ok).toBe(true);
  });

  it("returns unknown_code for an unrecognized code, distinct from an invalid lookup", () => {
    const outcome = runResultCodeExplainer({ code: unknownTransactionLikeCode, operationType: "" });
    expect(outcome.ok).toBe(false);
    expect(!outcome.ok && outcome.error.code).toBe("unknown_code");
  });

  it("returns ambiguous_operation_type when an ambiguous code has no operation type", () => {
    const outcome = runResultCodeExplainer({ code: ambiguousCode, operationType: "" });
    expect(outcome.ok).toBe(false);
    expect(!outcome.ok && outcome.error.code).toBe("ambiguous_operation_type");
  });

  it("resolves an ambiguous code once the operation type disambiguates it, and a different type gives a different explanation", () => {
    const resolved = runResultCodeExplainer({ code: ambiguousCode, operationType: ambiguousCodeResolvedType });
    const other = runResultCodeExplainer({ code: ambiguousCode, operationType: ambiguousCodeOtherType });
    if (!resolved.ok || !other.ok) throw new Error("expected both lookups to resolve");
    expect(resolved.result.explanation).not.toBe(other.result.explanation);
  });
});
