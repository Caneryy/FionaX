import { horizonUrls } from "@/lib/stellar/horizon";
import { validateOperationBrowserInput } from "../schema";
import type { BrowserOperation, OperationBrowserOutcome } from "../types";
import { errorFromStatus, MalformedOperationError, toToolError } from "./operationBrowser.errors";
import { mergeOperationPages, nextPageCursor, PAGE_SIZE } from "./operation-pages";

type Fetcher = typeof fetch;

const DETAIL_KEYS = [
  "starting_balance",
  "amount",
  "source_amount",
  "asset_type",
  "asset_code",
  "source_asset_code",
  "destination",
  "into",
  "to",
  "name",
  "limit"
] as const;

function decodeOperation(value: unknown): BrowserOperation {
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw new MalformedOperationError();
  const record = value as Record<string, unknown>;
  if (
    typeof record.paging_token !== "string" ||
    !/^[0-9]{1,40}$/.test(record.paging_token) ||
    typeof record.type !== "string" ||
    !record.type ||
    typeof record.transaction_hash !== "string" ||
    !/^[0-9a-fA-F]{64}$/.test(record.transaction_hash) ||
    typeof record.created_at !== "string" ||
    Number.isNaN(Date.parse(record.created_at))
  ) {
    throw new MalformedOperationError();
  }
  // Retain only public fields used by summaries in UI state.
  const details: Record<string, unknown> = {};
  for (const key of DETAIL_KEYS) {
    if (typeof record[key] === "string") details[key] = record[key];
  }
  return {
    pagingToken: record.paging_token,
    type: record.type,
    createdAt: record.created_at,
    transactionHash: record.transaction_hash,
    details
  };
}

function decodePage(value: unknown): BrowserOperation[] {
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw new MalformedOperationError();
  const records = (value as { _embedded?: { records?: unknown } })._embedded?.records;
  if (!Array.isArray(records) || records.length > PAGE_SIZE) throw new MalformedOperationError();
  return records.map(decodeOperation);
}

export async function runOperationBrowser(
  rawAccount: string,
  network: "testnet" | "mainnet",
  previous?: { operations: BrowserOperation[]; cursor: string },
  fetcher: Fetcher = fetch
): Promise<OperationBrowserOutcome> {
  const parsed = validateOperationBrowserInput(rawAccount, network, previous?.cursor);
  if (!parsed.ok) return parsed;
  const { accountId, cursor } = parsed.input;
  const url = new URL(`${horizonUrls[network]}/accounts/${accountId}/operations`);
  url.searchParams.set("order", "desc");
  url.searchParams.set("limit", String(PAGE_SIZE));
  if (cursor) url.searchParams.set("cursor", cursor);

  try {
    const response = await fetcher(url.toString());
    if (!response.ok) return { ok: false, error: errorFromStatus(response.status) };
    let body: unknown;
    try {
      body = await response.json();
    } catch {
      throw new MalformedOperationError();
    }
    const page = decodePage(body);
    const operations = mergeOperationPages(previous?.operations ?? [], page);
    return {
      ok: true,
      result: { accountId, network, operations, nextCursor: nextPageCursor(page, cursor, operations.length) }
    };
  } catch (error) {
    return { ok: false, error: toToolError(error) };
  }
}
