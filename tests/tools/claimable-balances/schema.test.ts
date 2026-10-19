import { describe, expect, it } from "vitest";
import { validateClaimableBalancesInput } from "@/app/tools/claimable-balances/schema";
import { claimant } from "./fixtures/unconditional-balance.fixture";

describe("claimant input", () => {
  it("rejects empty, malformed and secret seed values before a request", () => {
    for (const value of ["", "not an address", "S" + "A".repeat(55)]) {
      expect(validateClaimableBalancesInput(value)).toEqual({ ok: false, error: { code: "invalid_claimant" } });
    }
  });
  it("accepts a public address and trims it", () => {
    expect(validateClaimableBalancesInput(` ${claimant} `)).toEqual({ ok: true, input: { claimant, network: "testnet" } });
  });
  it("rejects invalid paging tokens and accepts decimal tokens", () => {
    for (const cursor of ["-1", "abc", "1 2", "9".repeat(41)]) {
      expect(validateClaimableBalancesInput(claimant, cursor)).toEqual({ ok: false, error: { code: "invalid_cursor" } });
    }
    expect(validateClaimableBalancesInput(claimant, ` ${"a".repeat(72)} `, "mainnet")).toEqual({ ok: true, input: { claimant, cursor: "a".repeat(72), network: "mainnet" } });
  });
});
