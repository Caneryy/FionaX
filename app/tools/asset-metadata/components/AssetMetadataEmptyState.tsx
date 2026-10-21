import { copy } from "@/app/tools/asset-metadata/copy";

export function AssetMetadataEmptyState() {
  return (
    <div className="space-y-2 text-sm leading-6 text-[#5d6b82]">
      <p>{copy.empty}</p>
      <p>{copy.emptyBoundary}</p>
    </div>
  );
}
