import { StrKey } from "@stellar/stellar-sdk";

export const claimant = StrKey.encodeEd25519PublicKey(Buffer.alloc(32, 1));
export const sponsor = StrKey.encodeEd25519PublicKey(Buffer.alloc(32, 2));
export const issuer = StrKey.encodeEd25519PublicKey(Buffer.alloc(32, 3));
export const unconditionalBalance = {
  id: "a".repeat(72), paging_token: "0".repeat(69) + "064", asset: "native", amount: "123456789.0000001", sponsor,
  claimants: [{ destination: claimant, predicate: { unconditional: true } }]
};
export function horizonPage(records: unknown[]) { return { _embedded: { records } }; }
export function horizonResponse(records: unknown[], status = 200) {
  return new Response(JSON.stringify(horizonPage(records)), { status });
}
