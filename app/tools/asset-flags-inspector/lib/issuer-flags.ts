import { isRejectedSecret } from "@/app/tools/asset-flags-inspector/schema";
import {
  ISSUER_FLAG_KEYS,
  type AssetFlagsInspectorErrorCode,
  type IssuerAccountSnapshot,
  type IssuerFlags
} from "@/app/tools/asset-flags-inspector/types";
import { horizonUrls, type StellarNetwork } from "@/lib/stellar/horizon";

export class SecretSeedRejectedError extends Error {
  readonly code = "invalid_account" as const;

  constructor() {
    super("invalid_account");
    this.name = "SecretSeedRejectedError";
  }
}

export class IssuerFlagsFailure extends Error {
  readonly code: Exclude<AssetFlagsInspectorErrorCode, "invalid_account">;

  constructor(code: Exclude<AssetFlagsInspectorErrorCode, "invalid_account">) {
    super(code);
    this.name = "IssuerFlagsFailure";
    this.code = code;
  }
}

export interface FetchIssuerFlagsOptions {
  network: StellarNetwork;
  /** Tests pass a fixture-backed fetch. The browser uses the global fetch. */
  fetchImpl?: typeof fetch;
}

export function horizonAccountUrl(network: StellarNetwork, accountId: string): string {
  const base = horizonUrls[network].replace(/\/$/, "");
  return `${base}/accounts/${encodeURIComponent(accountId)}`;
}

/**
 * Read a Horizon account JSON body and keep only the issuer flag fields.
 * A 200 with every flag false is valid. Missing or non-boolean flags are not.
 */
export function parseIssuerAccount(body: unknown, expectedAccountId: string): IssuerAccountSnapshot {
  if (!body || typeof body !== "object") {
    throw new IssuerFlagsFailure("request_failed");
  }

  const record = body as Record<string, unknown>;

  if (record.account_id !== expectedAccountId) {
    throw new IssuerFlagsFailure("request_failed");
  }

  if (typeof record.sequence !== "string" || !/^[0-9]+$/.test(record.sequence)) {
    throw new IssuerFlagsFailure("request_failed");
  }

  if (!record.flags || typeof record.flags !== "object") {
    throw new IssuerFlagsFailure("request_failed");
  }

  const flagsRecord = record.flags as Record<string, unknown>;
  const flags = {} as IssuerFlags;

  for (const key of ISSUER_FLAG_KEYS) {
    const value = flagsRecord[key];

    if (typeof value !== "boolean") {
      throw new IssuerFlagsFailure("request_failed");
    }

    flags[key] = value;
  }

  return {
    accountId: expectedAccountId,
    sequence: record.sequence,
    flags
  };
}

/**
 * GET /accounts/{issuer}. The fetch implementation is injected so tests never hit the network.
 * Secret seeds are refused before that request is built.
 */
export async function fetchIssuerFlags(accountId: string, options: FetchIssuerFlagsOptions): Promise<IssuerAccountSnapshot> {
  if (isRejectedSecret(accountId)) {
    throw new SecretSeedRejectedError();
  }

  const fetchImpl = options.fetchImpl ?? fetch;
  let response: Response;

  try {
    response = await fetchImpl(horizonAccountUrl(options.network, accountId), {
      method: "GET",
      headers: { Accept: "application/json" }
    });
  } catch {
    throw new IssuerFlagsFailure("request_failed");
  }

  if (response.status === 404) {
    throw new IssuerFlagsFailure("account_not_found");
  }

  if (response.status === 429) {
    throw new IssuerFlagsFailure("rate_limited");
  }

  if (!response.ok) {
    throw new IssuerFlagsFailure("request_failed");
  }

  let body: unknown;

  try {
    body = await response.json();
  } catch {
    throw new IssuerFlagsFailure("request_failed");
  }

  return parseIssuerAccount(body, accountId);
}
