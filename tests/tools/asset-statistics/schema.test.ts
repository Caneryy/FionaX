import { describe, expect, it } from "vitest";
import { Keypair } from "@stellar/stellar-sdk";
import { copy } from "@/app/tools/asset-statistics/copy";
import { validateAssetStatisticsInput } from "@/app/tools/asset-statistics/schema";
import { activeAssetIssuer } from "@/tests/tools/asset-statistics/fixtures/active-asset.fixture";

describe("validateAssetStatisticsInput", () => {
  it("accepts a 4-character code and a public issuer", () => {
    const result = validateAssetStatisticsInput({
      assetCode: "  USDC  ",
      assetIssuer: `  ${activeAssetIssuer}  `
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.input).toEqual({ assetCode: "USDC", assetIssuer: activeAssetIssuer });
    }
  });

  it("accepts a 1-character code and a 12-character code", () => {
    expect(validateAssetStatisticsInput({ assetCode: "A", assetIssuer: activeAssetIssuer }).ok).toBe(true);
    expect(validateAssetStatisticsInput({ assetCode: "ABCDEFGHIJKL", assetIssuer: activeAssetIssuer }).ok).toBe(true);
  });

  it("keeps lowercase codes because Horizon matches casing", () => {
    const result = validateAssetStatisticsInput({ assetCode: "usdc", assetIssuer: activeAssetIssuer });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.input.assetCode).toBe("usdc");
  });

  it("maps an empty, oversized, or punctuated code to invalid_asset_code", () => {
    for (const assetCode of ["", "   ", "TOOLONGASSET1", "US DC", "USDC-1"]) {
      const result = validateAssetStatisticsInput({ assetCode, assetIssuer: activeAssetIssuer });
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.code).toBe("invalid_asset_code");
        expect(result.error.message).toBe(copy.errors.invalid_asset_code);
      }
    }
  });

  it("maps an empty or checksum-invalid issuer to invalid_issuer", () => {
    const result = validateAssetStatisticsInput({
      assetCode: "USDC",
      assetIssuer: "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("invalid_issuer");
      expect(result.error.message).toBe(copy.errors.invalid_issuer);
    }

    const empty = validateAssetStatisticsInput({ assetCode: "USDC", assetIssuer: "   " });
    expect(empty.ok).toBe(false);
    if (!empty.ok) expect(empty.error.code).toBe("invalid_issuer");
  });

  it("rejects a secret seed without copying it into the error", () => {
    const secret = Keypair.random().secret();
    const result = validateAssetStatisticsInput({ assetCode: "USDC", assetIssuer: secret });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("invalid_issuer");
      expect(result.error.message).toBe(copy.errors.invalid_issuer);
      expect(result.error.message.includes(secret)).toBe(false);
    }
  });

  it("rejects an S-prefix that is not a valid seed", () => {
    const result = validateAssetStatisticsInput({
      assetCode: "USDC",
      assetIssuer: "SAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("invalid_issuer");
  });
});
