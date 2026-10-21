import { horizonUrls } from "@/lib/stellar/horizon";
import { validateEffectsTimelineInput } from "../schema";
import type { EffectsTimelineOutcome, TimelineEffect } from "../types";
import { errorFromStatus, MalformedEffectError, toToolError } from "./effectsTimeline.errors";
import { mergeEffectPages, nextPageCursor, PAGE_SIZE } from "./effect-pages";

type Fetcher = typeof fetch;

function decodeEffect(value: unknown): TimelineEffect {
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw new MalformedEffectError();
  const record = value as Record<string, unknown>;
  if (typeof record.paging_token !== "string" || !/^[0-9]{1,40}-[0-9]{1,10}$/.test(record.paging_token) ||
      typeof record.type !== "string" || !record.type ||
      typeof record.created_at !== "string" || Number.isNaN(Date.parse(record.created_at))) {
    throw new MalformedEffectError();
  }
  // Retain only public fields used by descriptions in UI state.
  const details: Record<string, unknown> = {};
  for (const key of ["starting_balance", "amount", "asset_type", "asset_code", "home_domain", "name"]) {
    if (typeof record[key] === "string") details[key] = record[key];
  }
  return {
    pagingToken: record.paging_token,
    type: record.type,
    createdAt: record.created_at,
    details
  };
}

function decodePage(value: unknown): TimelineEffect[] {
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw new MalformedEffectError();
  const records = (value as { _embedded?: { records?: unknown } })._embedded?.records;
  if (!Array.isArray(records) || records.length > PAGE_SIZE) throw new MalformedEffectError();
  return records.map(decodeEffect);
}

export async function runEffectsTimeline(
  rawAccount: string,
  network: "testnet" | "mainnet",
  previous?: { effects: TimelineEffect[]; cursor: string },
  fetcher: Fetcher = fetch
): Promise<EffectsTimelineOutcome> {
  const parsed = validateEffectsTimelineInput(rawAccount, network, previous?.cursor);
  if (!parsed.ok) return parsed;
  const { accountId, cursor } = parsed.input;
  const url = new URL(`${horizonUrls[network]}/accounts/${accountId}/effects`);
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
      throw new MalformedEffectError();
    }
    const page = decodePage(body);
    const effects = mergeEffectPages(previous?.effects ?? [], page);
    return {
      ok: true,
      result: { accountId, network, effects, nextCursor: nextPageCursor(page, cursor, effects.length) }
    };
  } catch (error) {
    return { ok: false, error: toToolError(error) };
  }
}
