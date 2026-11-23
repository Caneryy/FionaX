import { StrKey } from "@stellar/stellar-sdk";

export const SKEWED_POOL_ID = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
export const issuer = StrKey.encodeEd25519PublicKey(Buffer.alloc(32, 9));

/** Skewed reserves → non-1 price that still reduces exactly. */
export const skewedPoolRecord = {
  id: SKEWED_POOL_ID,
  paging_token: SKEWED_POOL_ID,
  fee_bp: 10,
  type: "constant_product",
  total_trustlines: "7",
  total_shares: "250.5000000",
  reserves: [
    { asset: "native", amount: "100.0000000" },
    { asset: `EUR:${issuer}`, amount: "250.0000000" }
  ]
};

export function skewedPoolResponse(status = 200): Response {
  return new Response(JSON.stringify(skewedPoolRecord), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
