import { StrKey } from "@stellar/stellar-sdk";
import { errorFor } from "@/app/tools/asset-metadata/lib/assetMetadata.errors";
import type { AssetMetadataError, AssetMetadataInput } from "@/app/tools/asset-metadata/types";

const ASSET_CODE = /^[A-Za-z0-9]{1,12}$/;
const SEED_SHAPE = /^S[A-Z2-7]{55}$/;

export type AssetMetadataValidation =
  | { ok: true; input: AssetMetadataInput }
  | { ok: false; error: AssetMetadataError };

// A secret seed is rejected before any network call and is never copied into the error text.
export function isSecretSeed(value: string): boolean {
  if (StrKey.isValidEd25519SecretSeed(value)) return true;
  return SEED_SHAPE.test(value);
}

export function validateAssetMetadataInput(raw: {
  issuerAccountId: string;
  assetCode: string;
  network: AssetMetadataInput["network"];
}): AssetMetadataValidation {
  const issuerAccountId = raw.issuerAccountId.trim();
  const assetCode = raw.assetCode.trim();

  if (isSecretSeed(issuerAccountId) || isSecretSeed(assetCode)) {
    return { ok: false, error: errorFor("invalid_account") };
  }

  if (!StrKey.isValidEd25519PublicKey(issuerAccountId)) {
    return { ok: false, error: errorFor("invalid_account") };
  }

  if (!ASSET_CODE.test(assetCode)) {
    return { ok: false, error: errorFor("invalid_asset_code") };
  }

  return {
    ok: true,
    input: {
      issuerAccountId,
      assetCode,
      network: raw.network
    }
  };
}
