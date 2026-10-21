import { describe, expect, it } from "vitest";
import { Keypair } from "@stellar/stellar-sdk";
import { copy } from "@/app/tools/asset-metadata/copy";
import { isSecretSeed, validateAssetMetadataInput } from "@/app/tools/asset-metadata/schema";
import { ISSUER_ACCOUNT_ID } from "@/tests/tools/asset-metadata/fixtures/full-currency.fixture";

describe("validateAssetMetadataInput", () => {
  it("rejects an empty issuer before any other check", () => {
    const result = validateAssetMetadataInput({
      issuerAccountId: "   ",
      assetCode: "USDC",
      network: "testnet"
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("invalid_account");
      expect(result.error.message).toBe(copy.errors.invalid_account);
    }
  });

  it("rejects a secret seed and does not echo it", () => {
    const seed = Keypair.random().secret();
    const result = validateAssetMetadataInput({
      issuerAccountId: `  ${seed}  `,
      assetCode: "USDC",
      network: "testnet"
    });
    expect(isSecretSeed(seed)).toBe(true);
    expect(result.ok).toBe(false);
    expect(JSON.stringify(result)).not.toContain(seed);
    if (!result.ok) {
      expect(result.error.code).toBe("invalid_account");
      expect(result.error.message).not.toContain(seed);
    }
  });

  it("rejects a seed pasted into the asset code field without echoing it", () => {
    const seed = Keypair.random().secret();
    const result = validateAssetMetadataInput({
      issuerAccountId: ISSUER_ACCOUNT_ID,
      assetCode: seed,
      network: "mainnet"
    });
    expect(JSON.stringify(result)).not.toContain(seed);
    if (!result.ok) expect(result.error.code).toBe("invalid_account");
  });

  it("rejects a public-key shaped string with a bad checksum", () => {
    const result = validateAssetMetadataInput({
      issuerAccountId: "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      assetCode: "USDC",
      network: "testnet"
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("invalid_account");
  });

  it("rejects a contract address", () => {
    const result = validateAssetMetadataInput({
      issuerAccountId: "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSC4",
      assetCode: "USDC",
      network: "testnet"
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("invalid_account");
  });

  it("rejects an empty, oversized, or symbolic asset code", () => {
    for (const assetCode of ["", "   ", "US DC", "TOOLONGCODE12", "USDC!"]) {
      const result = validateAssetMetadataInput({
        issuerAccountId: ISSUER_ACCOUNT_ID,
        assetCode,
        network: "testnet"
      });
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error.code).toBe("invalid_asset_code");
    }
  });

  it("accepts a trimmed public account id and a 1 or 12 character code", () => {
    const short = validateAssetMetadataInput({
      issuerAccountId: `  ${ISSUER_ACCOUNT_ID}  `,
      assetCode: " A ",
      network: "testnet"
    });
    const long = validateAssetMetadataInput({
      issuerAccountId: ISSUER_ACCOUNT_ID,
      assetCode: "ABCDEFGHIJKL",
      network: "mainnet"
    });
    expect(short.ok).toBe(true);
    expect(long.ok).toBe(true);
    if (short.ok) {
      expect(short.input.issuerAccountId).toBe(ISSUER_ACCOUNT_ID);
      expect(short.input.assetCode).toBe("A");
      expect(short.input.network).toBe("testnet");
    }
    if (long.ok) expect(long.input.assetCode).toBe("ABCDEFGHIJKL");
  });
});
