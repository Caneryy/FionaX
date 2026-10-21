import { StrKey } from "@stellar/stellar-sdk";
import { copy } from "@/app/tools/asset-statistics/copy";
import type { AssetStatisticsError, AssetStatisticsErrorCode, AssetStatisticsInput } from "@/app/tools/asset-statistics/types";

const ASSET_CODE = /^[A-Za-z0-9]{1,12}$/;

function failure(code: AssetStatisticsErrorCode): { ok: false; error: AssetStatisticsError } {
  return { ok: false, error: { code, message: copy.errors[code] } };
}

/**
 * Validates raw form input before any Horizon request.
 * An issuer that starts with S is treated as a secret seed and is rejected even when the checksum is wrong.
 */
export function validateAssetStatisticsInput(raw: {
  assetCode: string;
  assetIssuer: string;
}): { ok: true; input: AssetStatisticsInput } | { ok: false; error: AssetStatisticsError } {
  const assetCode = raw.assetCode.trim();
  const assetIssuer = raw.assetIssuer.replace(/\s+/g, "");

  if (!ASSET_CODE.test(assetCode)) {
    return failure("invalid_asset_code");
  }

  if (!assetIssuer || assetIssuer.startsWith("S") || !StrKey.isValidEd25519PublicKey(assetIssuer)) {
    return failure("invalid_issuer");
  }

  return { ok: true, input: { assetCode, assetIssuer } };
}
