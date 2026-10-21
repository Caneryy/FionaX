import { describe, expect, it } from "vitest";
import { Keypair } from "@stellar/stellar-sdk";
import { copy } from "@/app/tools/account-merge-preflight/copy";
import { validateAccountMergePreflightInput } from "@/app/tools/account-merge-preflight/schema";
import { destinationAccountId, sourceAccountId } from "./fixtures/eligible-source.fixture";

describe("validateAccountMergePreflightInput", () => {
  it("rejects an empty source", () => {
    const result = validateAccountMergePreflightInput("  ", destinationAccountId);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.message).toBe(copy.errors.invalid_account.empty);
  });

  it("rejects a secret seed without echoing it", () => {
    const secret = Keypair.random().secret();
    const result = validateAccountMergePreflightInput(secret, destinationAccountId);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("invalid_account");
      expect(JSON.stringify(result).includes(secret)).toBe(false);
    }
  });

  it("rejects the same account on both sides", () => {
    const result = validateAccountMergePreflightInput(sourceAccountId, ` ${sourceAccountId} `);
    expect(result).toEqual({ ok: false, error: { code: "same_account", message: copy.errors.same_account } });
  });

  it("accepts two different public ids", () => {
    const result = validateAccountMergePreflightInput(sourceAccountId, destinationAccountId);
    expect(result).toEqual({ ok: true, input: { sourceId: sourceAccountId, destinationId: destinationAccountId } });
  });
});
