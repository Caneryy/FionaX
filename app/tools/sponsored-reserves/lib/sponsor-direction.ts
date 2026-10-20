import type { SponsoredReservesResult } from "../types";
import type { SponsorshipFields } from "./sponsorship-fields";
import { reserveReliefStroops } from "./relief-calculation";
import type { StellarNetwork } from "@/lib/stellar/horizon";

export function splitSponsorDirections(fields: SponsorshipFields, network: StellarNetwork): SponsoredReservesResult {
  const listed = fields.entries.reduce((sum, entry) => sum + entry.reserveUnits, BigInt("0"));
  if (listed > fields.numSponsored) throw new TypeError("Sponsored entries exceed Horizon count");
  return {
    accountId: fields.accountId,
    network,
    sponsoredByMeCount: fields.numSponsoring,
    sponsoredForMeCount: fields.numSponsored,
    sponsoredForMe: fields.entries,
    unlistedReserveCount: fields.numSponsored - listed,
    reliefStroops: reserveReliefStroops(fields.numSponsored)
  };
}
