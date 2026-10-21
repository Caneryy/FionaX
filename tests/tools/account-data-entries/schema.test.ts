import { describe, expect, it } from "vitest";
import { Keypair } from "@stellar/stellar-sdk";
import { copy } from "@/app/tools/account-data-entries/copy";
import { isRejectedSecret, validateAccountDataEntriesInput } from "@/app/tools/account-data-entries/schema";
import { fixtureAccountId } from "./fixtures/text-entries.fixture";

describe("validateAccountDataEntriesInput", () => {
  it("rejects empty input", () => {
    const result = validateAccountDataEntriesInput("  ");

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.error).toEqual({ code: "invalid_account", message: copy.errors.invalid_account.empty });
    }
  });

  it("rejects a secret seed without echoing it", () => {
    const secret = Keypair.random().secret();
    const result = validateAccountDataEntriesInput(secret);

    expect(isRejectedSecret(secret)).toBe(true);
    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.error.message).toBe(copy.errors.invalid_account.secret);
      expect(JSON.stringify(result).includes(secret)).toBe(false);
    }
  });

  it("accepts a public account id and trims it", () => {
    const result = validateAccountDataEntriesInput(`  ${fixtureAccountId}  `);

    expect(result).toEqual({ ok: true, input: { accountId: fixtureAccountId } });
  });

  it("rejects a malformed public key", () => {
    const result = validateAccountDataEntriesInput("GAAAA");

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.error.message).toBe(copy.errors.invalid_account.malformed);
    }
  });
});
