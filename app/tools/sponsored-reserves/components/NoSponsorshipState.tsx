import { copy } from "../copy";

export function NoSponsorshipState() {
  return (
    <div className="rounded-lg border border-[#cfe0ea] bg-white/60 p-4" role="status">
      <h2 className="font-bold text-[#172033]">{copy.noSponsorship}</h2>
      <p className="mt-1 text-sm text-[#68758a]">{copy.noSponsorshipDetail}</p>
    </div>
  );
}
