import type { ReserveCalculatorResult as Result } from "@/app/tools/reserve-calculator/types";
import { ReserveBreakdown } from "@/app/tools/reserve-calculator/components/ReserveBreakdown";
import { SpendableBalance } from "@/app/tools/reserve-calculator/components/SpendableBalance";
import { SponsorshipAdjustment } from "@/app/tools/reserve-calculator/components/SponsorshipAdjustment";
import { SubentryRows } from "@/app/tools/reserve-calculator/components/SubentryRows";

export function ReserveCalculatorResult({ result }: { result: Result }) {
  return (
    <div className="space-y-4">
      <ReserveBreakdown result={result} />
      <SubentryRows subentries={result.subentries} />
      <SponsorshipAdjustment sponsorship={result.sponsorship} />
      <SpendableBalance result={result} />
    </div>
  );
}
