import { describe, expect, it } from "vitest";
import { copy } from "@/app/tools/asset-metadata/copy";
import { errorFor } from "@/app/tools/asset-metadata/lib/assetMetadata.errors";
import { panelSection, reduceAssetMetadataState } from "@/app/tools/asset-metadata/lib/state";
import { ASSET_METADATA_ERROR_CODES, type AssetMetadataResult } from "@/app/tools/asset-metadata/types";

const REQUIRED_CODES = [
  "invalid_account",
  "account_not_found",
  "missing_home_domain",
  "toml_unreachable",
  "currency_not_found",
  "malformed_toml"
] as const;

describe("copy", () => {
  it("gives every error code its own actionable message", () => {
    const messages = ASSET_METADATA_ERROR_CODES.map((code) => copy.errors[code]);
    expect(new Set(messages).size).toBe(messages.length);
    for (const code of REQUIRED_CODES) {
      expect(copy.errors[code].length).toBeGreaterThan(40);
      expect(errorFor(code)).toEqual({ code, message: copy.errors[code] });
    }
    expect(copy.errors.invalid_account).not.toMatch(/S[A-Z2-7]{55}/);
    expect(copy.unverifiedDetail.toLowerCase()).toContain("not independently verified");
    expect(copy.errors.missing_home_domain).not.toBe(copy.errors.toml_unreachable);
  });
});

describe("asset metadata state", () => {
  const result: AssetMetadataResult = {
    issuerAccountId: "G",
    assetCode: "USDC",
    network: "testnet",
    homeDomain: "assets.example.com",
    tomlUrl: "https://assets.example.com/.well-known/stellar.toml",
    fields: [],
    selfPublished: true
  };

  it("moves through idle, loading, success, and error", () => {
    const idle = { status: "idle" } as const;
    const loading = reduceAssetMetadataState(idle, { type: "submit" });
    const success = reduceAssetMetadataState(loading, { type: "succeed", result });
    const failure = reduceAssetMetadataState(loading, { type: "fail", error: errorFor("account_not_found") });
    const reset = reduceAssetMetadataState(success, { type: "reset" });

    expect(panelSection(idle)).toBe("idle");
    expect(panelSection(loading)).toBe("loading");
    expect(panelSection(success)).toBe("success");
    expect(success.status).toBe("success");
    expect(panelSection(failure)).toBe("error");
    expect(reset.status).toBe("idle");
  });

  it("keeps a missing home domain off the toml error view", () => {
    const missing = reduceAssetMetadataState(
      { status: "loading" },
      { type: "fail", error: errorFor("missing_home_domain") }
    );
    const unreachable = reduceAssetMetadataState(
      { status: "loading" },
      { type: "fail", error: errorFor("toml_unreachable") }
    );
    const malformed = reduceAssetMetadataState(
      { status: "loading" },
      { type: "fail", error: errorFor("malformed_toml") }
    );
    expect(panelSection(missing)).toBe("error");
    expect(panelSection(unreachable)).toBe("toml-error");
    expect(panelSection(malformed)).toBe("toml-error");
  });
});
