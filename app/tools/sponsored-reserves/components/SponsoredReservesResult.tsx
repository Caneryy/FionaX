import { copy } from "../copy";
import type { SponsoredReservesResult as Result } from "../types";
import { NoSponsorshipState } from "./NoSponsorshipState";
import { ReliefSummary } from "./ReliefSummary";
import { SponsoredByMe } from "./SponsoredByMe";
import { SponsoredForMe } from "./SponsoredForMe";

export function SponsoredReservesResult({ result }: { result: Result }) {
  return (
    <div className="space-y-4 text-[#172033]">
      <h2 className="text-lg font-bold">{copy.overview}</h2>
      <p className="break-all text-sm">{copy.account}: {result.accountId}</p>
      <p className="text-sm">{copy.network}: {result.network}</p>
      {result.sponsoredByMeCount === BigInt("0") && result.sponsoredForMeCount === BigInt("0") ? <NoSponsorshipState /> : <>
        <ReliefSummary stroops={result.reliefStroops} />
        <SponsoredByMe count={result.sponsoredByMeCount} />
        <SponsoredForMe count={result.sponsoredForMeCount} entries={result.sponsoredForMe} unlisted={result.unlistedReserveCount} />
      </>}
    </div>
  );
}
