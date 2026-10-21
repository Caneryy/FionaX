import { copy } from "../copy";
import { formatXlm } from "../lib/format";

export function ReliefSummary({ stroops }: { stroops: bigint }) {
  return (
    <section aria-labelledby="reserve-relief" className="rounded-lg border border-[#82cbe3] bg-[#e0f6ff] p-4">
      <h3 id="reserve-relief" className="font-bold">{copy.relief}</h3>
      <p className="mt-1 text-xl font-extrabold">{formatXlm(stroops)}</p>
      <p className="mt-1 text-sm text-[#4e5c73]">{copy.reliefDetail}</p>
    </section>
  );
}
