import { copy } from "@/app/tools/asset-flags-inspector/copy";

interface FlagExplanationProps {
  combination: string;
  allUnset: boolean;
}

export function FlagExplanation({ combination, allUnset }: FlagExplanationProps) {
  return (
    <section className="space-y-2" aria-labelledby="issuer-flag-explanation">
      <h2 id="issuer-flag-explanation" className="text-sm font-extrabold text-[#172033]">
        {copy.explanation.title}
      </h2>
      {allUnset ? <p className="text-sm font-bold text-[#17664b]">{copy.explanation.allUnset}</p> : null}
      <p className="text-sm leading-6 text-[#4e5c73]">{combination}</p>
    </section>
  );
}
