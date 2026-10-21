import { horizonUrls } from "@/lib/stellar/horizon";
import { validateSponsoredReservesInput } from "../schema";
import type { SponsoredReservesInput, ToolOutcome } from "../types";
import { extractSponsorshipFields } from "./sponsorship-fields";
import { splitSponsorDirections } from "./sponsor-direction";
import { toToolError } from "./sponsoredReserves.errors";

export async function runSponsoredReserves(input: SponsoredReservesInput, request: typeof fetch = fetch): Promise<ToolOutcome> {
  const parsed = validateSponsoredReservesInput(input.accountId, input.network);
  if (!parsed.ok) return parsed;
  try {
    const response = await request(`${horizonUrls[input.network]}/accounts/${parsed.input.accountId}`, { cache: "no-store" });
    if (!response.ok) return { ok: false, error: toToolError(response.status) };
    const fields = extractSponsorshipFields(await response.json(), parsed.input.accountId);
    return { ok: true, result: splitSponsorDirections(fields, input.network) };
  } catch {
    return { ok: false, error: toToolError() };
  }
}
