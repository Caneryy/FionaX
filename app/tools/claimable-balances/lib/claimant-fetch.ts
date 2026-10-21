import { StrKey } from "@stellar/stellar-sdk";
import { horizonUrls } from "@/lib/stellar/horizon";
import type { ClaimableBalance, ClaimableBalancesInput } from "../types";
import { ToolFailure } from "./claimableBalances.errors";
import { decodePredicate } from "./predicate-render";

export const PAGE_SIZE = 20;
export const MAX_PAGES = 3;

function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new ToolFailure("request_failed");
  return value as Record<string, unknown>;
}

function decodeBalance(raw: unknown, claimant: string): ClaimableBalance {
  const item = object(raw);
  if (typeof item.id !== "string" || !/^[0-9a-f]{72}$/i.test(item.id) ||
      typeof item.paging_token !== "string" || !(/^[0-9]{1,40}$/.test(item.paging_token) || /^[0-9a-f]{72}$/i.test(item.paging_token)) ||
      typeof item.asset !== "string" || !/^(native|[A-Za-z0-9]{1,12}:G[A-Z2-7]{55})$/.test(item.asset) ||
      (item.asset !== "native" && !StrKey.isValidEd25519PublicKey(item.asset.split(":")[1])) ||
      typeof item.amount !== "string" || !/^(0|[1-9][0-9]{0,19})(\.[0-9]{1,7})?$/.test(item.amount) ||
      (item.sponsor !== undefined && (typeof item.sponsor !== "string" || !StrKey.isValidEd25519PublicKey(item.sponsor)))) {
    throw new ToolFailure("request_failed");
  }
  // Parse into stroops without a floating-point conversion to check the amount boundary.
  const [whole, fraction = ""] = item.amount.split(".");
  const stroops = BigInt(whole) * BigInt(10000000) + BigInt(fraction.padEnd(7, "0"));
  if (stroops <= BigInt(0) || stroops > BigInt("9223372036854775807")) throw new ToolFailure("request_failed");
  if (!Array.isArray(item.claimants)) throw new ToolFailure("malformed_predicate");
  const matching = item.claimants.find((entry: unknown) =>
    !!entry && typeof entry === "object" && !Array.isArray(entry) &&
    (entry as Record<string, unknown>).destination === claimant
  );
  if (!matching) throw new ToolFailure("malformed_predicate");
  const predicate = decodePredicate(object(matching).predicate);
  return {
    id: item.id,
    pagingToken: item.paging_token,
    asset: item.asset,
    amount: item.amount,
    ...(item.sponsor ? { sponsor: item.sponsor as string } : {}),
    predicate
  };
}

export async function fetchClaimantPage(input: ClaimableBalancesInput, cursor?: string, fetchImpl: typeof fetch = fetch): Promise<ClaimableBalance[]> {
  const url = new URL("/claimable_balances", horizonUrls[input.network]);
  url.searchParams.set("claimant", input.claimant);
  url.searchParams.set("limit", String(PAGE_SIZE));
  url.searchParams.set("order", "asc");
  if (cursor) url.searchParams.set("cursor", cursor);
  let response: Response;
  try { response = await fetchImpl(url.toString()); }
  catch { throw new ToolFailure("request_failed"); }
  if (response.status === 429) throw new ToolFailure("rate_limited");
  if (response.status === 400 && cursor) throw new ToolFailure("invalid_cursor");
  if (!response.ok) throw new ToolFailure("request_failed");
  try {
    const body = object(await response.json());
    const embedded = object(body._embedded);
    if (!Array.isArray(embedded.records) || embedded.records.length > PAGE_SIZE) throw new ToolFailure("request_failed");
    return embedded.records.map((item: unknown) => decodeBalance(item, input.claimant));
  } catch (error) {
    if (error instanceof ToolFailure) throw error;
    throw new ToolFailure("request_failed");
  }
}
