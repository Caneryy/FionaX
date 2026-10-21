import { describe, expect, it } from "vitest";
import { Keypair } from "@stellar/stellar-sdk";
import { copy } from "@/app/tools/asset-flags-inspector/copy";
import { isRejectedSecret, validateAssetFlagsInspectorInput } from "@/app/tools/asset-flags-inspector/schema";
import { fixtureAccountId } from "./fixtures/all-flags-set.fixture";

describe("validateAssetFlagsInspectorInput", () => {
  it("rejects empty input before any lookup", () => {
    const result = validateAssetFlagsInspectorInput("   ");

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.error.code).toBe("invalid_account");
      expect(result.error.message).toBe(copy.errors.invalid_account.empty);
    }
  });

  it("rejects a valid secret seed and does not echo it", () => {
    const secret = Keypair.random().secret();
    const result = validateAssetFlagsInspectorInput(`  ${secret}  `);

    expect(isRejectedSecret(secret)).toBe(true);
    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.error.code).toBe("invalid_account");
      expect(result.error.message).toBe(copy.errors.invalid_account.secret);
      expect(result.error.message.includes(secret)).toBe(false);
      expect(JSON.stringify(result).includes(secret)).toBe(false);
    }
  });

  it("rejects a seed-shaped string with a bad checksum", () => {
    const fakeSeed = `S${"A".repeat(55)}`;
    const result = validateAssetFlagsInspectorInput(fakeSeed);

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.error.code).toBe("invalid_account");
      expect(result.error.message).toBe(copy.errors.invalid_account.secret);
      expect(result.error.message.includes(fakeSeed)).toBe(false);
    }
  });

  it("rejects a malformed public key", () => {
    const result = validateAssetFlagsInspectorInput("GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.error.code).toBe("invalid_account");
      expect(result.error.message).toBe(copy.errors.invalid_account.malformed);
    }
  });

  it("rejects muxed and contract addresses", () => {
    for (const value of ["M".repeat(69), "C".repeat(56)]) {
      const result = validateAssetFlagsInspectorInput(value);

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.code).toBe("invalid_account");
        expect(result.error.message).toBe(copy.errors.invalid_account.malformed);
      }
    }
  });

  it("accepts a trimmed public issuer account id", () => {
    const result = validateAssetFlagsInspectorInput(`  ${fixtureAccountId}  `);

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.input.accountId).toBe(fixtureAccountId);
    }
  });
});
