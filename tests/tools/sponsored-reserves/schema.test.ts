import { describe, expect, it } from "vitest";
import { StrKey } from "@stellar/stellar-sdk";
import { validateSponsoredReservesInput } from "@/app/tools/sponsored-reserves/schema";
import { viewedAccount } from "./fixtures/sponsor-role.fixture";

describe("validateSponsoredReservesInput", () => {
  it("trims and accepts a public account ID", () => {
    expect(validateSponsoredReservesInput(`  ${viewedAccount}  `, "testnet")).toEqual({ ok: true, input: { accountId: viewedAccount, network: "testnet" } });
  });
  it.each(["", "G", `S${viewedAccount.slice(1)}`, viewedAccount.slice(0, -1) + "A", "https://example.org"])("rejects malformed or private input", (value) => {
    expect(validateSponsoredReservesInput(value, "mainnet")).toEqual({ ok: false, error: { code: "invalid_account" } });
  });
  it("rejects a valid secret seed", () => {
    const seed = StrKey.encodeEd25519SecretSeed(Buffer.alloc(32, 7));
    expect(validateSponsoredReservesInput(seed, "testnet")).toEqual({ ok: false, error: { code: "invalid_account" } });
  });
});
