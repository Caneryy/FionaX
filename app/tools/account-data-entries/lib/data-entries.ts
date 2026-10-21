import { decodeDataValue } from "@/app/tools/account-data-entries/lib/base64-decode";
import { entryNameBytes, isNearNameLimit } from "@/app/tools/account-data-entries/lib/entry-limits";
import { isRejectedSecret } from "@/app/tools/account-data-entries/schema";
import type { AccountDataEntriesErrorCode, DataEntryView } from "@/app/tools/account-data-entries/types";
import { horizonUrls, type StellarNetwork } from "@/lib/stellar/horizon";

export class SecretSeedRejectedError extends Error {
  readonly code = "invalid_account" as const;

  constructor() {
    super("invalid_account");
    this.name = "SecretSeedRejectedError";
  }
}

export class DataEntriesFailure extends Error {
  readonly code: Exclude<AccountDataEntriesErrorCode, "invalid_account">;

  constructor(code: Exclude<AccountDataEntriesErrorCode, "invalid_account">) {
    super(code);
    this.name = "DataEntriesFailure";
    this.code = code;
  }
}

export interface FetchDataEntriesOptions {
  network: StellarNetwork;
  fetchImpl?: typeof fetch;
}

export function horizonAccountUrl(network: StellarNetwork, accountId: string): string {
  const base = horizonUrls[network].replace(/\/$/, "");
  return `${base}/accounts/${encodeURIComponent(accountId)}`;
}

/** Pull the data map off a Horizon account body. An empty map is valid. */
export function parseDataEntries(body: unknown, expectedAccountId: string): DataEntryView[] {
  if (!body || typeof body !== "object") {
    throw new DataEntriesFailure("request_failed");
  }

  const record = body as Record<string, unknown>;

  if (record.account_id !== expectedAccountId) {
    throw new DataEntriesFailure("request_failed");
  }

  if (!record.data || typeof record.data !== "object" || Array.isArray(record.data)) {
    throw new DataEntriesFailure("request_failed");
  }

  const entries: DataEntryView[] = [];

  for (const [name, raw] of Object.entries(record.data as Record<string, unknown>)) {
    if (typeof raw !== "string") {
      throw new DataEntriesFailure("malformed_data_entry");
    }

    const decoded = decodeDataValue(raw);

    if (!decoded.ok) {
      throw new DataEntriesFailure("malformed_data_entry");
    }

    entries.push({
      name,
      nameBytes: entryNameBytes(name),
      nearLimit: isNearNameLimit(name),
      rawBase64: raw,
      encoding: decoded.encoding,
      text: decoded.text,
      hex: decoded.hex
    });
  }

  entries.sort((left, right) => left.name.localeCompare(right.name));
  return entries;
}

export async function fetchDataEntries(accountId: string, options: FetchDataEntriesOptions): Promise<DataEntryView[]> {
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
    throw new DataEntriesFailure("request_failed");
  }

  if (response.status === 404) {
    throw new DataEntriesFailure("account_not_found");
  }

  if (response.status === 429) {
    throw new DataEntriesFailure("rate_limited");
  }

  if (!response.ok) {
    throw new DataEntriesFailure("request_failed");
  }

  let body: unknown;

  try {
    body = await response.json();
  } catch {
    throw new DataEntriesFailure("request_failed");
  }

  return parseDataEntries(body, accountId);
}
