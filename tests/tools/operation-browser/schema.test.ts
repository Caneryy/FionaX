import { describe, expect, it } from "vitest";
import { Keypair } from "@stellar/stellar-sdk";
import { validateOperationBrowserInput } from "@/app/tools/operation-browser/schema";
import { accountId } from "./fixtures/known-operations.fixture";

describe("validateOperationBrowserInput", () => {
  it.each(["", " ", "GABC"])("rejects invalid public account %s", (value) => {
    expect(validateOperationBrowserInput(value, "testnet")).toEqual({ ok: false, error: { code: "invalid_account" } });
  });

  it("rejects a valid secret seed without exposing it in test output", () => {
    expect(validateOperationBrowserInput(Keypair.random().secret(), "testnet"))
      .toEqual({ ok: false, error: { code: "invalid_account" } });
  });

  it("accepts a trimmed public account and Horizon operation cursor", () => {
    expect(validateOperationBrowserInput(` ${accountId} `, "mainnet", "110694007436259330"))
      .toEqual({ ok: true, input: { accountId, network: "mainnet", cursor: "110694007436259330" } });
  });

  it.each(["", "abc", "1-2", "1&limit=200", `${"1".repeat(41)}`])("rejects invalid cursor %s", (cursor) => {
    expect(validateOperationBrowserInput(accountId, "testnet", cursor)).toEqual({ ok: false, error: { code: "invalid_cursor" } });
  });
});
