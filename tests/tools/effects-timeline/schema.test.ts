import { describe, expect, it } from "vitest";
import { Keypair } from "@stellar/stellar-sdk";
import { validateEffectsTimelineInput } from "@/app/tools/effects-timeline/schema";
import { accountId } from "./fixtures/known-effects.fixture";

describe("validateEffectsTimelineInput", () => {
  it.each(["", " ", "GABC"])("rejects invalid public account %s", (value) => {
    expect(validateEffectsTimelineInput(value, "testnet")).toEqual({ ok: false, error: { code: "invalid_account" } });
  });

  it("rejects a valid secret seed without exposing it in test output", () => {
    expect(validateEffectsTimelineInput(Keypair.random().secret(), "testnet"))
      .toEqual({ ok: false, error: { code: "invalid_account" } });
  });

  it("accepts a trimmed public account and Horizon effect cursor", () => {
    expect(validateEffectsTimelineInput(` ${accountId} `, "mainnet", "110694007436259330-2"))
      .toEqual({ ok: true, input: { accountId, network: "mainnet", cursor: "110694007436259330-2" } });
  });

  it.each(["", "1", "-2", "1-", "1-2&limit=200", "1-12345678901"])("rejects invalid cursor %s", (cursor) => {
    expect(validateEffectsTimelineInput(accountId, "testnet", cursor)).toEqual({ ok: false, error: { code: "invalid_cursor" } });
  });
});
