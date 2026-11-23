import { describe, expect, it } from "vitest";
import { knownOperationTypes, summarizeOperation } from "@/app/tools/operation-browser/lib/operation-summaries";
import type { BrowserOperation } from "@/app/tools/operation-browser/types";

const operation = (type: string, details: Record<string, unknown> = {}): BrowserOperation =>
  ({ pagingToken: "1", type, createdAt: null, transactionHash: "a".repeat(64), details });

describe("operation summaries", () => {
  it("covers all documented Horizon operation types with distinct summaries", () => {
    const types = knownOperationTypes();
    expect(types).toHaveLength(27);
    const summaries = types.map((type) => summarizeOperation(operation(type)));
    expect(new Set(summaries).size).toBe(types.length);
    expect(summaries.every((summary) => summary.length > 15)).toBe(true);
  });

  it("preserves exact decimal amount strings without floating point conversion", () => {
    expect(summarizeOperation(operation("payment", {
      amount: "0.0000001",
      asset_type: "native",
      destination: "GDQNY3PBOJOKYZSRMK2S7LHHGWZIUISD4QORETLMXEWXBI7KFZZMKTL3"
    }))).toBe("Sent 0.0000001 XLM to GDQN…KTL3.");
    expect(summarizeOperation(operation("payment", {
      amount: "9007199254740993.0000001",
      asset_code: "USD",
      destination: "GDQNY3PBOJOKYZSRMK2S7LHHGWZIUISD4QORETLMXEWXBI7KFZZMKTL3"
    }))).toBe("Sent 9007199254740993.0000001 USD to GDQN…KTL3.");
  });

  it("uses optional operation details when present", () => {
    expect(summarizeOperation(operation("create_account", {
      starting_balance: "2.5000000",
      destination: "GDQNY3PBOJOKYZSRMK2S7LHHGWZIUISD4QORETLMXEWXBI7KFZZMKTL3"
    }))).toBe("Created a new account with 2.5000000 XLM to GDQN…KTL3.");
    expect(summarizeOperation(operation("manage_data", { name: "config" })))
      .toBe("Managed account data entry “config”.");
  });
});
