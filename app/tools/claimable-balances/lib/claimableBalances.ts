import type { ClaimableBalancesInput, ToolOutcome } from "../types";
import { mergeBalancePages, nextPageCursor } from "./balance-pages";
import { toToolError } from "./claimableBalances.errors";
import { fetchClaimantPage, MAX_PAGES, PAGE_SIZE } from "./claimant-fetch";
import { validateClaimableBalancesInput } from "../schema";

export async function runClaimableBalances(input: ClaimableBalancesInput, fetchImpl: typeof fetch = fetch): Promise<ToolOutcome> {
  // Keep this boundary safe even when callers bypass the form and hook.
  const parsed = validateClaimableBalancesInput(input.claimant, input.cursor, input.network);
  if (!parsed.ok) return { ok: false, error: parsed.error };
  try {
    const pages = [];
    let cursor = parsed.input.cursor;
    let nextCursor: string | undefined;
    for (let page = 0; page < MAX_PAGES; page++) {
      const balances = await fetchClaimantPage(parsed.input, cursor, fetchImpl);
      pages.push(balances);
      nextCursor = nextPageCursor(balances, PAGE_SIZE, cursor);
      if (!nextCursor) break;
      cursor = nextCursor;
    }
    return { ok: true, result: {
      balances: mergeBalancePages(pages), pagesFetched: pages.length, pageLimit: MAX_PAGES,
      nextCursor, network: input.network
    } };
  } catch (error) {
    return { ok: false, error: toToolError(error) };
  }
}
