import { toToolError, MemoInspectorFailure } from "@/app/tools/memo-inspector/lib/memoInspector.errors";
import { decodeMemo, MalformedMemoError, normalizeMemoType } from "@/app/tools/memo-inspector/lib/memo-decode";
import { validateMemoInspectorInput } from "@/app/tools/memo-inspector/schema";
import type { MemoInspectorOutcome, MemoInspectorResult } from "@/app/tools/memo-inspector/types";
import { horizonUrls, type StellarNetwork } from "@/lib/stellar/horizon";

export interface FetchMemoOptions {
  network: StellarNetwork;
  fetchImpl?: typeof fetch;
}

export function horizonTransactionUrl(network: StellarNetwork, hash: string): string {
  const base = horizonUrls[network].replace(/\/$/, "");
  return `${base}/transactions/${encodeURIComponent(hash)}`;
}

export function parseTransactionMemo(body: unknown, expectedHash: string, network: StellarNetwork): MemoInspectorResult {
  if (!body || typeof body !== "object") {
    throw new MemoInspectorFailure("request_failed");
  }

  const record = body as Record<string, unknown>;
  const hash = typeof record.hash === "string" ? record.hash.toLowerCase() : "";

  if (hash !== expectedHash.toLowerCase()) {
    throw new MemoInspectorFailure("request_failed");
  }

  const memoType = normalizeMemoType(record.memo_type);
  if (!memoType) {
    throw new MalformedMemoError();
  }

  if (typeof record.source_account !== "string" || typeof record.created_at !== "string" || typeof record.successful !== "boolean") {
    throw new MemoInspectorFailure("request_failed");
  }

  try {
    const memo = decodeMemo(memoType, record.memo);

    return {
      hash,
      network,
      memoType,
      memo,
      sourceAccount: record.source_account,
      createdAt: record.created_at,
      successful: record.successful
    };
  } catch (error) {
    if (error instanceof MalformedMemoError) throw error;
    throw new MalformedMemoError();
  }
}

export async function fetchTransactionMemo(hash: string, options: FetchMemoOptions): Promise<MemoInspectorResult> {
  const fetchImpl = options.fetchImpl ?? fetch;
  let response: Response;

  try {
    response = await fetchImpl(horizonTransactionUrl(options.network, hash), {
      method: "GET",
      headers: { Accept: "application/json" }
    });
  } catch {
    throw new MemoInspectorFailure("request_failed");
  }

  if (response.status === 404) throw new MemoInspectorFailure("transaction_not_found");
  if (response.status === 429) throw new MemoInspectorFailure("rate_limited");
  if (!response.ok) throw new MemoInspectorFailure("request_failed");

  try {
    return parseTransactionMemo(await response.json(), hash, options.network);
  } catch (error) {
    if (error instanceof MalformedMemoError || error instanceof MemoInspectorFailure) throw error;
    throw new MemoInspectorFailure("request_failed");
  }
}

export async function runMemoInspector(raw: string, options: FetchMemoOptions): Promise<MemoInspectorOutcome> {
  const parsed = validateMemoInspectorInput(raw);

  if (!parsed.ok) return parsed;

  try {
    const result = await fetchTransactionMemo(parsed.input.hash, options);
    return { ok: true, result };
  } catch (error) {
    return { ok: false, error: toToolError(error) };
  }
}
