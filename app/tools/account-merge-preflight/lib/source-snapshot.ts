import { isRejectedSecret } from "@/app/tools/account-merge-preflight/schema";
import { decimalToStroops } from "@/app/tools/account-merge-preflight/lib/format";
import type { AccountMergePreflightErrorCode, SourceSnapshot } from "@/app/tools/account-merge-preflight/types";
import { horizonUrls, type StellarNetwork } from "@/lib/stellar/horizon";

export class SecretSeedRejectedError extends Error {
  readonly code = "invalid_account" as const;

  constructor() {
    super("invalid_account");
    this.name = "SecretSeedRejectedError";
  }
}

export class MergeFailure extends Error {
  readonly code: Exclude<AccountMergePreflightErrorCode, "invalid_account" | "same_account">;

  constructor(code: Exclude<AccountMergePreflightErrorCode, "invalid_account" | "same_account">) {
    super(code);
    this.name = "MergeFailure";
    this.code = code;
  }
}

export interface FetchOptions {
  network: StellarNetwork;
  fetchImpl?: typeof fetch;
}

export function horizonAccountUrl(network: StellarNetwork, accountId: string): string {
  const base = horizonUrls[network].replace(/\/$/, "");
  return `${base}/accounts/${encodeURIComponent(accountId)}`;
}

export function horizonOffersUrl(network: StellarNetwork, accountId: string): string {
  return `${horizonAccountUrl(network, accountId)}/offers`;
}

async function readJson(url: string, fetchImpl: typeof fetch, missingCode: "source_not_found" | "destination_not_found"): Promise<unknown> {
  let response: Response;

  try {
    response = await fetchImpl(url, { method: "GET", headers: { Accept: "application/json" } });
  } catch {
    throw new MergeFailure("request_failed");
  }

  if (response.status === 404) {
    throw new MergeFailure(missingCode);
  }

  if (response.status === 429) {
    throw new MergeFailure("rate_limited");
  }

  if (!response.ok) {
    throw new MergeFailure("request_failed");
  }

  try {
    return await response.json();
  } catch {
    throw new MergeFailure("request_failed");
  }
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

/** Read the source account and its offers. A 404 is source_not_found. */
export async function fetchSourceSnapshot(accountId: string, options: FetchOptions): Promise<SourceSnapshot> {
  if (isRejectedSecret(accountId)) {
    throw new SecretSeedRejectedError();
  }

  const fetchImpl = options.fetchImpl ?? fetch;
  const account = asRecord(await readJson(horizonAccountUrl(options.network, accountId), fetchImpl, "source_not_found"));
  const offersBody = asRecord(await readJson(horizonOffersUrl(options.network, accountId), fetchImpl, "source_not_found"));

  if (!account || account.account_id !== accountId || !offersBody) {
    throw new MergeFailure("request_failed");
  }

  const balances = Array.isArray(account.balances) ? account.balances : null;
  const native = balances?.find((entry) => asRecord(entry)?.asset_type === "native");
  const nativeBalance = asRecord(native)?.balance;

  if (typeof nativeBalance !== "string") {
    throw new MergeFailure("request_failed");
  }

  const nativeStroops = decimalToStroops(nativeBalance);

  if (nativeStroops === null) {
    throw new MergeFailure("request_failed");
  }

  const trustlineCount = balances.filter((entry) => asRecord(entry)?.asset_type !== "native").length;
  const data = asRecord(account.data);
  const signers = Array.isArray(account.signers) ? account.signers : null;
  const embedded = asRecord(offersBody._embedded);
  const records = embedded && Array.isArray(embedded.records) ? embedded.records : null;

  if (!data || !signers || !records) {
    throw new MergeFailure("request_failed");
  }

  const extraSignerCount = signers.filter((signer) => asRecord(signer)?.key !== accountId).length;
  const numSponsoring = account.num_sponsoring;
  const numSponsored = account.num_sponsored;
  const sponsoring =
    (typeof numSponsoring === "number" && numSponsoring > 0) ||
    (typeof numSponsored === "number" && numSponsored > 0) ||
    typeof account.sponsor === "string";

  return {
    accountId,
    nativeBalance,
    nativeStroops,
    trustlineCount,
    offerCount: records.length,
    dataEntryCount: Object.keys(data).length,
    extraSignerCount,
    sponsoring
  };
}
