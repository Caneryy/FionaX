import { StrKey } from "@stellar/stellar-sdk";

export const BALANCED_POOL_ID = "a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0";
export const issuer = StrKey.encodeEd25519PublicKey(Buffer.alloc(32, 7));

/** Equal reserves → 1:1 implied price after reduction. */
export const balancedPoolRecord = {
  id: BALANCED_POOL_ID,
  paging_token: BALANCED_POOL_ID,
  fee_bp: 30,
  type: "constant_product",
  total_trustlines: "42",
  total_shares: "1000.0000000",
  reserves: [
    { asset: "native", amount: "500.0000000" },
    { asset: `USD:${issuer}`, amount: "500.0000000" }
  ]
};

export function balancedPoolResponse(status = 200): Response {
  return new Response(JSON.stringify(balancedPoolRecord), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
