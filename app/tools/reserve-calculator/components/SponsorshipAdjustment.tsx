import { copy } from "@/app/tools/reserve-calculator/copy";
import { formatXlm } from "@/app/tools/reserve-calculator/lib/format";
import type { SponsorshipAdjustment as SponsorshipAdjustmentValue } from "@/app/tools/reserve-calculator/types";

export function SponsorshipAdjustment({ sponsorship }: { sponsorship: SponsorshipAdjustmentValue }) {
  if (sponsorship.numSponsoring === 0 && sponsorship.numSponsored === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-bold text-[#4e5c73]">{copy.sponsorshipTitle}</h3>
      <ul className="space-y-1 text-sm text-[#172033]">
        <li className="flex justify-between">
          <span>{copy.numSponsoringLabel}</span>
          <span className="font-mono">{sponsorship.numSponsoring}</span>
        </li>
        <li className="flex justify-between">
          <span>{copy.numSponsoredLabel}</span>
          <span className="font-mono">{sponsorship.numSponsored}</span>
        </li>
        <li className="flex justify-between font-extrabold">
          <span>Net reserve adjustment</span>
          <span className="font-mono">{formatXlm(sponsorship.netReserveStroops)}</span>
        </li>
      </ul>
    </div>
  );
}
