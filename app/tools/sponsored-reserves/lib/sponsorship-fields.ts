import { StrKey } from "@stellar/stellar-sdk";
import type { SponsoredEntry } from "../types";

export interface SponsorshipFields {
  accountId: string;
  numSponsoring: bigint;
  numSponsored: bigint;
  entries: SponsoredEntry[];
}

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new TypeError("Malformed Horizon account");
  return value as Record<string, unknown>;
}

function count(value: unknown): bigint {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) throw new TypeError("Malformed reserve count");
  return BigInt(value);
}

function sponsor(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "string" || !StrKey.isValidEd25519PublicKey(value)) throw new TypeError("Malformed sponsor");
  return value;
}

export function extractSponsorshipFields(raw: unknown, expectedId: string): SponsorshipFields {
  const account = record(raw);
  if (account.account_id !== expectedId || !Array.isArray(account.balances) || !Array.isArray(account.signers)) {
    throw new TypeError("Malformed Horizon account");
  }
  const entries: SponsoredEntry[] = [];
  const accountSponsor = sponsor(account.sponsor);
  if (accountSponsor) entries.push({ kind: "account", label: expectedId, sponsor: accountSponsor, reserveUnits: BigInt("2") });
  for (const rawBalance of account.balances) {
    const balance = record(rawBalance);
    const payer = sponsor(balance.sponsor);
    if (!payer) continue;
    if (balance.asset_type === "native") throw new TypeError("Native balance cannot have a sponsor");
    let label: string;
    if (balance.asset_type === "liquidity_pool_shares" && typeof balance.liquidity_pool_id === "string" && /^[0-9a-f]{64}$/i.test(balance.liquidity_pool_id)) {
      label = balance.liquidity_pool_id;
    } else if (
      (balance.asset_type === "credit_alphanum4" || balance.asset_type === "credit_alphanum12") &&
      typeof balance.asset_code === "string" &&
      balance.asset_code.length >= 1 &&
      balance.asset_code.length <= (balance.asset_type === "credit_alphanum4" ? 4 : 12) &&
      typeof balance.asset_issuer === "string" &&
      StrKey.isValidEd25519PublicKey(balance.asset_issuer)
    ) {
      label = `${balance.asset_code}:${balance.asset_issuer}`;
    } else throw new TypeError("Malformed sponsored trustline");
    entries.push({ kind: "trustline", label, sponsor: payer, reserveUnits: balance.asset_type === "liquidity_pool_shares" ? BigInt("2") : BigInt("1") });
  }
  for (const rawSigner of account.signers) {
    const signer = record(rawSigner);
    const payer = sponsor(signer.sponsor);
    if (!payer) continue;
    if (typeof signer.key !== "string" || !signer.key) throw new TypeError("Malformed sponsored signer");
    entries.push({ kind: "signer", label: signer.key, sponsor: payer, reserveUnits: BigInt("1") });
  }
  return {
    accountId: expectedId,
    numSponsoring: count(account.num_sponsoring),
    numSponsored: count(account.num_sponsored),
    entries
  };
}
