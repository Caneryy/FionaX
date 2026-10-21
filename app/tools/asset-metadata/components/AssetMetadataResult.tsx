import { copy } from "@/app/tools/asset-metadata/copy";
import { MetadataFields } from "@/app/tools/asset-metadata/components/MetadataFields";
import { UnverifiedBadge } from "@/app/tools/asset-metadata/components/UnverifiedBadge";
import type { AssetMetadataResult as Result } from "@/app/tools/asset-metadata/types";

export function AssetMetadataResult({ result }: { result: Result }) {
  return (
    <section className="min-w-0 space-y-4" aria-live="polite">
      <UnverifiedBadge />
      <p className="text-sm leading-6 text-[#5d6b82]">{copy.resultIntro}</p>
      <dl className="grid grid-cols-1 gap-3 text-sm">
        <div className="min-w-0">
          <dt className="font-extrabold text-[#172033]">{copy.resultHomeDomain}</dt>
          <dd className="break-all text-[#29364d]">{result.homeDomain}</dd>
        </div>
        <div className="min-w-0">
          <dt className="font-extrabold text-[#172033]">{copy.resultTomlUrl}</dt>
          <dd className="break-all text-[#29364d]">{result.tomlUrl}</dd>
        </div>
        <div className="min-w-0">
          <dt className="font-extrabold text-[#172033]">{copy.resultNetwork}</dt>
          <dd className="text-[#29364d]">{copy.networkLabels[result.network]}</dd>
        </div>
      </dl>
      <MetadataFields fields={result.fields} />
    </section>
  );
}
