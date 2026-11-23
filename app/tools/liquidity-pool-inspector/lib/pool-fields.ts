import { StrKey } from "@stellar/stellar-sdk";
import type { PoolReserve } from "../types";
import { ToolFailure } from "./liquidityPoolInspector.errors";

const AMOUNT = /^(0|[1-9][0-9]{0,19})(\.[0-9]{1,7})?$/;
const ASSET = /^(native|[A-Za-z0-9]{1,12}:G[A-Z2-7]{55})$/;
const STROOPS_PER_UNIT = 10_000_000n;
const MAX_STROOPS = 9223372036854775807n;

function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new ToolFailure("request_failed");
  }
  return value as Record<string, unknown>;
}

export function amountToStroops(amount: string): bigint {
  if (!AMOUNT.test(amount)) throw new ToolFailure("request_failed");
  const [whole, fraction = ""] = amount.split(".");
  const stroops = BigInt(whole) * STROOPS_PER_UNIT + BigInt(fraction.padEnd(7, "0"));
  if (stroops < 0n || stroops > MAX_STROOPS) throw new ToolFailure("request_failed");
  return stroops;
}

export function normalizeAsset(asset: string): string {
  if (!ASSET.test(asset)) throw new ToolFailure("request_failed");
  if (asset !== "native") {
    const issuer = asset.slice(asset.indexOf(":") + 1);
    if (!StrKey.isValidEd25519PublicKey(issuer)) throw new ToolFailure("request_failed");
  }
  return asset;
}

export function normalizeReserve(raw: unknown): PoolReserve {
  const item = object(raw);
  if (typeof item.asset !== "string" || typeof item.amount !== "string") {
    throw new ToolFailure("request_failed");
  }
  const asset = normalizeAsset(item.asset);
  const amount = item.amount;
  const amountStroops = amountToStroops(amount);
  return { asset, amount, amountStroops };
}

export interface NormalizedPoolFields {
  id: string;
  type: string;
  feeBp: number;
  totalShares: string;
  totalSharesStroops: bigint;
  totalTrustlines: string;
  reserves: [PoolReserve, PoolReserve];
}

/**
 * Normalize Horizon liquidity pool record fields into typed domain values.
 * Rejects malformed payloads with request_failed.
 */
export function normalizePoolFields(raw: unknown, expectedPoolId: string): NormalizedPoolFields {
  const body = object(raw);
  if (typeof body.id !== "string" || body.id.toLowerCase() !== expectedPoolId.toLowerCase()) {
    throw new ToolFailure("request_failed");
  }
  if (typeof body.type !== "string" || body.type.length === 0 || body.type.length > 64) {
    throw new ToolFailure("request_failed");
  }
  if (typeof body.fee_bp !== "number" || !Number.isInteger(body.fee_bp) || body.fee_bp < 0 || body.fee_bp > 10_000) {
    throw new ToolFailure("request_failed");
  }
  if (typeof body.total_shares !== "string") throw new ToolFailure("request_failed");
  if (typeof body.total_trustlines !== "string" || !/^[0-9]{1,20}$/.test(body.total_trustlines)) {
    throw new ToolFailure("request_failed");
  }
  if (!Array.isArray(body.reserves) || body.reserves.length !== 2) {
    throw new ToolFailure("request_failed");
  }
  const reserves: [PoolReserve, PoolReserve] = [
    normalizeReserve(body.reserves[0]),
    normalizeReserve(body.reserves[1])
  ];
  if (reserves[0].asset === reserves[1].asset) throw new ToolFailure("request_failed");

  return {
    id: body.id.toLowerCase(),
    type: body.type,
    feeBp: body.fee_bp,
    totalShares: body.total_shares,
    totalSharesStroops: amountToStroops(body.total_shares),
    totalTrustlines: body.total_trustlines,
    reserves
  };
}
