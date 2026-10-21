import { ISSUER_FLAG_KEYS, type IssuerFlagKey, type IssuerFlags } from "@/app/tools/asset-flags-inspector/types";

/** Stellar AccountFlags bits. These match the protocol, not a Horizon-specific encoding. */
export const AUTH_REQUIRED_BIT = 1n;
export const AUTH_REVOCABLE_BIT = 2n;
export const AUTH_IMMUTABLE_BIT = 4n;
export const AUTH_CLAWBACK_ENABLED_BIT = 8n;

const FLAG_BITS: Record<IssuerFlagKey, bigint> = {
  auth_required: AUTH_REQUIRED_BIT,
  auth_revocable: AUTH_REVOCABLE_BIT,
  auth_immutable: AUTH_IMMUTABLE_BIT,
  auth_clawback_enabled: AUTH_CLAWBACK_ENABLED_BIT
};

export function flagBit(key: IssuerFlagKey): bigint {
  return FLAG_BITS[key];
}

/** OR the set flags into the raw AccountFlags bitmask. Unset flags contribute nothing. */
export function computeFlagBitmask(flags: IssuerFlags): bigint {
  let bitmask = 0n;

  for (const key of ISSUER_FLAG_KEYS) {
    if (flags[key]) {
      bitmask |= FLAG_BITS[key];
    }
  }

  return bitmask;
}
