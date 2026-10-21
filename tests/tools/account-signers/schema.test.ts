import { describe, expect, it } from "vitest";
import { Keypair } from "@stellar/stellar-sdk";
import { copy } from "@/app/tools/account-signers/copy";
import { validateAccountSignersInput } from "@/app/tools/account-signers/schema";
import { fixtureAccountId } from "./fixtures/mixed-signers.fixture";

describe("validateAccountSignersInput", () => {
  it("rejects empty, secret, and malformed input", () => {
    expect(validateAccountSignersInput(" ").ok).toBe(false);
    const secret = Keypair.random().secret();
    const secretResult = validateAccountSignersInput(secret);
    expect(secretResult.ok).toBe(false);
    if (!secretResult.ok) expect(JSON.stringify(secretResult).includes(secret)).toBe(false);
    const malformed = validateAccountSignersInput("GAAAA");
    expect(malformed.ok).toBe(false);
    if (!malformed.ok) expect(malformed.error.message).toBe(copy.errors.invalid_account.malformed);
  });

  it("accepts a trimmed public id", () => {
    expect(validateAccountSignersInput(` ${fixtureAccountId} `)).toEqual({ ok: true, input: { accountId: fixtureAccountId } });
  });
});
